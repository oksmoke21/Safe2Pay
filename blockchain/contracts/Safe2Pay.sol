// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// All monetary values are in USD for representing USDC. USDC has 6 decimals, not 18

// Logic flow:
// 1. A project is created by either client or service with the other party invited to the project. Both mutually decide upon the terms of the project
// 2. Before the project can be started, both must deposit 10% of the total project cost as staked capital
// 3. PROJECT STARTS
// 4. The client deposits funds for each stage before service starts work on it
// 5. Once both agree upon status of stage completion, funds are transferred from escrow to service
// 6. In case at any stage one of the parties raises a dispute, the mediator decides the outcome.
// 7. Whichever party is found at fault gets their stake slashed for that stage and transferred to the other party

// Practical issues faced during development:
// Creating such a large struct causes stack overflow issues if any more variables are added.
// Hence I have commented the address of the 3rd party mediator from the project schema that would ideally exist.
// For this project the msg.sender i.e the Safe2Pay platform is assumed to be the fair and impartial 3rd party mediator.

contract Safe2Pay is Ownable, ReentrancyGuard {
    address public USDC_Address;
    IERC20 public USDC;
    uint8 public constant USDC_DECIMALS = 6;

    constructor (address _USDCAddress) Ownable(msg.sender) {
        USDC_Address = _USDCAddress;
        USDC = IERC20(_USDCAddress);
    }

    struct projectSchema {
        address client;
        address service;
        // address mediator;
        
        uint16 currentStage;
        uint16 totalStages;
        
        uint256 value; // total cost of project
        uint256 clientStake; // incentive stake for client
        uint256 serviceStake; // incentive stake for service

        uint256 clientNetPayout; // amount paid by client in total over all stages
        uint256 clientPayStakePerStage; // amount to be staked by client for each stage when it begins
        uint256 serviceClaimedFunds; // amount paid out to service till date

        bool isStarted;
        bool isCurrentStageCompleted;

        // Variables above can be packed but reduces code clarity
    }

    // Mapping projectId to project
    mapping (uint256 => projectSchema) public projects;

    mapping(uint256 => uint256) private clientRefundAmountPerStage;
    mapping(uint256 => uint256) private serviceRefundAmountPerStage;


    event ProjectCreated(uint256 projectId);
    event ClientStakeDeposited(uint256 projectId, uint256 amount);
    event ServiceStakeDeposited(uint256 projectId, uint256 amount);
    event ProjectStarted(uint256 projectId);
    event StageStarted(uint256 projectId, uint16 stage);
    event StageCompleted(uint256 projectId, uint16 stage, uint256 amountPaidOut);
    event DisputeResolved(uint256 projectId, address winner, uint256 amount);
    event ProjectCompleted(uint256 projectId);

    // 1. Creating project
    function createProject(uint256 _projectId, address _client, address _service, uint16 _totalStages, uint256 _value) external onlyOwner {
        require(_projectId != 0, "Invalid projectId");
        require(projects[_projectId].value == 0, "Project with given projectId already exists");
        require(_client != address(0), "Invalid client address");
        require(_service != address(0), "Invalid service address");
        // require(_mediator != address(0), "Invalid mediator address");
        require(_totalStages > 0, "Invalid task count");
        require(_value > 0, "Invalid input for project value");

        // value is in USD without considering ERC20 decimals. hence we convert it to token's representative value
        uint256 __value = _value * 10**6; // 10**USDC.decimals() but OpenZeppelin's IERC20 doesn't have a decimals function

        projectSchema memory project = projectSchema(
            _client,                            // client
            _service,                           // service
            // _mediator,                          // mediator
            0,                                  // currentStage
            _totalStages,                       // totalStages
            __value,                            // value
            0,                                  // clientStake
            0,                                  // serviceStake
            0,                                  // clientNetPayout
            __value/_totalStages,               // clientPayStakePerStage
            0,                                  // serviceClaimedFunds
            false,                              // isStarted
            false                               // isCurrentStageCompleted
        );
        projects[_projectId] = project;

        emit ProjectCreated(_projectId);
    }

    // 2a. Deposit margin staking on client end
    function stakeClient(uint256 _projectId) external payable nonReentrant {
        projectSchema storage project = projects[_projectId];
        
        require(msg.sender == project.client, "Only project client can call this function");
        require(project.clientStake == 0, "Client has already staked margin deposit");

        // Calculating amount that client must stake as margin deposit
        // In this MVP project we fix it to 10% of the total project cost
        uint256 amountClientStake = project.value / 10;

        clientRefundAmountPerStage[_projectId] = amountClientStake / project.totalStages;

        emit ClientStakeDeposited(_projectId, amountClientStake);
        
        require(USDC.transferFrom(msg.sender, address(this), amountClientStake), "Client margin deposit failed");
    }

    // 2b. Deposit margin staking on service end
    function stakeService(uint256 _projectId) external payable nonReentrant {
        projectSchema storage project = projects[_projectId];
        
        require(msg.sender == project.service, "Only project service can call this function");
        require(project.serviceStake == 0, "Service has already staked margin deposit");

        // Calculating amount that service must stake as margin deposit
        // In this MVP project we fix it to 10% of the total project cost
        uint256 amountServiceStake = project.value / 10;

        serviceRefundAmountPerStage[_projectId] = amountServiceStake / project.totalStages;

        emit ServiceStakeDeposited(_projectId, amountServiceStake);

        require(USDC.transferFrom(msg.sender, address(this), amountServiceStake), "Service margin deposit failed");
    }

    // 3. Start project
    function startProject(uint256 _projectId) external {
        projectSchema storage project = projects[_projectId];
        
        require(project.clientStake != 0, "Project cannot start till client has staked security deposit");
        require(project.serviceStake != 0, "Project cannot start till service has staked security deposit");
        
        require(msg.sender == project.client, "Only client can start stage");
        
        project.isStarted = true;
        project.currentStage = 1;

        emit ProjectStarted(_projectId);
        emit StageStarted(_projectId, project.currentStage);

        // Get client to put in first round's cost deposit
        clientStake(_projectId);
    }

    // 4. Client stakes funds for each stage of the project
    function clientStake(uint256 _projectId) internal nonReentrant {
        projectSchema storage project = projects[_projectId];

        require(msg.sender == project.client, "Function caller must be project client");

        uint256 amountToStake;
        
        if(project.currentStage == project.totalStages) { // last stage logic to include residual amount because of remainders
            amountToStake = project.value - project.clientNetPayout;
        } else {
            amountToStake = project.value / project.totalStages;
        }
        
        project.clientNetPayout += amountToStake;

        require(USDC.transferFrom(msg.sender, address(this), amountToStake), "Client payout deposit failed");
    }

    // 5. Stage is marked as complete once both client and service mark it in backend, and service is paid the stage payout
    function markStageAsCompleted(uint256 _projectId) external onlyOwner nonReentrant {
        projectSchema storage project = projects[_projectId];

        require(msg.sender == project.client, "Only client can start stage");
        require(!project.isCurrentStageCompleted, "Stage is already marked as complete");

        uint256 amountServicePayout;
        project.isCurrentStageCompleted = true;

        if (project.currentStage == project.totalStages) {
            amountServicePayout = project.value - project.serviceClaimedFunds;
            emit ProjectCompleted(_projectId);
        } else {
            amountServicePayout = project.clientPayStakePerStage;
        }

        emit StageCompleted(_projectId, project.currentStage, amountServicePayout);

        refundStakeClient(_projectId);
        refundStakeService(_projectId);

        require(USDC.transferFrom(address(this), msg.sender, amountServicePayout), "Service margin deposit failed");
    }

    function startNextStage(uint256 _projectId) external {
        projectSchema storage project = projects[_projectId];
        require(project.isStarted, "Project has not started yet");
        require(msg.sender == project.client, "Only client can start stage");        

        project.currentStage += 1;
        require(project.currentStage <= project.totalStages, "Current stage cannot exceed total stages");
        project.isCurrentStageCompleted = false;

        emit StageStarted(_projectId, project.currentStage);

        clientStake(_projectId);
    }

    function disputeManager(uint256 _projectId, address winner) external onlyOwner nonReentrant {
        projectSchema storage project = projects[_projectId];

        require(project.isStarted, "Project has not started");
        require(winner == project.client || winner == project.service, "Winner must be client or service");
        require(project.currentStage <= project.totalStages, "Invalid project stage");

        uint256 refundAmount = winner == project.client ? serviceRefundAmountPerStage[_projectId] : clientRefundAmountPerStage[_projectId];

        if (winner == project.client) {
            project.clientStake += refundAmount;
            require(project.serviceStake >= refundAmount, "Insufficient service stake");
            project.serviceStake -= refundAmount;

            require(USDC.transfer(project.client, refundAmount), "Transfer to client failed");
        } else {
            project.serviceStake += refundAmount;
            require(project.clientStake >= refundAmount, "Insufficient client stake");
            project.clientStake -= refundAmount;

            require(USDC.transfer(project.service, refundAmount), "Transfer to service failed");
        }

        emit DisputeResolved(_projectId, winner, refundAmount);
    }


    function refundStakeClient(uint256 _projectId) internal onlyOwner {
        projectSchema storage project = projects[_projectId];
        uint256 refundAmount = clientRefundAmountPerStage[_projectId];
        require(project.clientStake >= refundAmount, "Insufficient client stake remaining");

        project.clientStake -= refundAmount;
        require(USDC.transfer(project.client, refundAmount), "Refund to client failed");
    }

    function refundStakeService(uint256 _projectId) internal onlyOwner {
        projectSchema storage project = projects[_projectId];
        uint256 refundAmount = serviceRefundAmountPerStage[_projectId];
        require(project.serviceStake >= refundAmount, "Insufficient service stake remaining");

        project.serviceStake -= refundAmount;
        require(USDC.transfer(project.service, refundAmount), "Refund to service failed");
    }
}
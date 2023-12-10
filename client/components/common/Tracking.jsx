"use client";
import React, { useState } from 'react';
import SignContract from './SignContract';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const Tracking = ({id}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsApproved, setStepsApproved] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });



  const handleStepApproval = (step) => {
    setStepsApproved((prevStepsApproved) => ({
      ...prevStepsApproved,
      [step]: true,
    }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const getStepColor = (step) => {
    if (stepsApproved[step]) {
      return 'text-green-500';
    } else if (currentStep === step) {
      return 'text-[#FF8C33]'; // or any other color for the current step
    } else {
      return 'text-gray-600';
    }
  };
  const router = useRouter()
  const onClickHandler = ()=>{
    router.push(`/dashboard/${id}`)
  }

  return (
    <div>
      <SignContract id={id} />
       <div>
       <p className='text-gray-600 font-inter font-semibold text-base leading-7 mt-4' > Track Contract</p>
   </div>
      <div>
        <p className={`${getStepColor(1)} font-inter font-semibold text-base leading-7 mt-2`}>
          1. Project Signed by party (client/ freelancer)
        </p>
      </div>
      <div>
        <p className={`${getStepColor(2)} font-inter font-semibold text-base leading-7 mt-4`}>
          2. Project reviewed and signed by other party
        </p>
      </div>
      <div>
        <p className={`${getStepColor(3)} font-inter font-semibold text-base leading-7 mt-4`}>
          3. Initiate project
        </p>
        <Button
          className={`bg-[#FF8C33] mr-6 p-2 rounded-md ${currentStep === 3 && !stepsApproved[3] ? 'disabled' : ''}`}
          onClick={() => handleStepApproval(3)}
          disabled={currentStep !== 3 || stepsApproved[3]}
        >
          Start Project
        </Button>
      </div>
      <div>
        <p className={`${getStepColor(4)} font-inter font-semibold text-base leading-7 mt-4`}>
          4. Project Signed by party (client/ freelancer)
        </p>
        <Button
          className={`mr-6 rounded-md bg-[#FF8C33] ${currentStep === 4 && !stepsApproved[4] ? 'disabled' : ''}`}
          onClick={() => handleStepApproval(4)}
          disabled={currentStep !== 4 || stepsApproved[4]}
        >
          Pay
        </Button>
      </div> 
      <Button className="bg-[#FF8C33] w-full mt-6" onClick={onClickHandler}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default Tracking;


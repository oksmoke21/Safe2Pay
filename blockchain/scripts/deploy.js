const hre = require('hardhat')
const USDC_ADDRESS_GOERLI = "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557";

async function main() {
  const Safe2Pay = await hre.ethers.getContractFactory("Safe2Pay");
  const safe2pay = await Safe2Pay.deploy(USDC_ADDRESS_GOERLI);

  await safe2pay.deployed();

  console.log(`Safe2Pay contract deployed to ${safe2pay.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

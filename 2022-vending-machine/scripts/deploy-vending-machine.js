const { ethers } = require("hardhat");

async function main() {
  const VendingMachineContract = await ethers.getContractFactory("VendingMachine");
  const VendingMachine = await VendingMachineContract.deploy();
  await VendingMachine.deployed();
  console.log("VendingMachine deployed to:", VendingMachine.address);
}

main();
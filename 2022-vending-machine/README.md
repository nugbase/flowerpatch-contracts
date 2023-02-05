# New Version of the Nugbase VendingMachine contract

- Removed Seed Breed functionality
- Fixed Vending machine item Delete functionality.
- Updated support for SEED and MATIC purchases
- Logic to prevent purchases for items with 0 price.
- Added more advanced event logging support and Error messages
- wrote more complete testing for all functionality in hardhat and chai 
- Added Specific item type codes to support in game item purchases.

Based on the original nugbase VendingMachine smart contract Over 100 commits from Nugbase Develoeprs


## Compile contracts
npx hardhat compile

## Deploy contract
npx hardhat run --network matic scripts/deploy-seed.js

## Verify contract
npx hardhat verify --contract contracts/VendingMachine.sol:VendingMachine --network matic SMARTCONTRACTADDRESS
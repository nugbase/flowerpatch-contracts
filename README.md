# Nugbase / Flowerpatch Core Contracts

## Setup

This project uses the Truffle suite. Truffle is installed automatically by npm.
Ganache is a local-only blockchain app that you can install. It lets you run
tests and experiments on your own computer.

## Configuring Migrations Private Key

In order to start a migration or use the Ethereum network, you must supply
an Ethereum account and Ethereum node. It's easiest to use Infura for this.
In order to configure these things, you must export some env variables, like:

    export CONTRACTS_MNEMONIC_SEED="cat dog ... bat" # 12-word seed
    export ETH_NODE_URL="https://mainnet.infura.io/v3/<secret code>"

### Ganache Setup (Local Eth Blockchain)

Go to https://truffleframework.com/ganache and download the desktop app. This
is really by far the simplest way, and it has a beautiful UI that shows you
blockchain operations in real time. Configuration:

 * Port: 7545
 * Network ID: 5777

### Fast Sync To Rinkeby Testnet (Geth - Optional)

You can also do `npm run geth-rinkeby` to do a fast sync to Rinkeby Testnet.
You will need to install `geth` before doing this. I used `brew`.

Honestly, you probably shouldn't bother, since we can use Infura automatically.

## How Do I Compile, Migrate Contracts to Networks, And Run Tests?

Just use the scripts provided via `npm run` / `package.json` ... ya dummy

## Random commands that may be helpful

I tried running truffle with `node v19.2.0` and it failed badly. I recommend using `v14.17.3`.
```nvm use v11.6.0```
Make sure you have the `/secrets` folder and you `source` them before running anything with this script:
```source ./scripts/source-me.sh```
Keep in mind `truffle migrate` is the same as `truffle deploy`. To run a specific deployment script (in `/migrations/`), use the `--f <number>` (from) and `--to <number>` tags. Example:
```npx truffle migrate --network polygon --f 4 --to 4```
This repo contains many contracts using many different versions of the Solidity compiler. By default, truffle tries to compile ALL the contracts in the `/contracts/` folder before deploying anything. This results in a `Source file requires different compiler version` error when running truffle. Thus, if you're writing a new contract with a newer compiler version and want to deploy it, you may want to isolate the `contracts_directory` variable in the `/truffle.js` file:
```contracts_directory: './contracts/sacrifice'```
To run a specific test:
```npx truffle test ./test/sacrifice/FlowerSacrifice.test.js```
If you want to verify the contract on etherscan/polygonscan, use truffle-flattener:
```npx truffle-flattener contracts/sacrifice/FlowerSacrifice.sol > flattened/FlowerSacrifice.sol```
Make sure all the files have the **same license identifier**:
```I had to recompile both contracts because they had SPDX license identifier: Unlicense  instead of MIT at the top. Also had to check the Optimized option in polygonscan for the compiler, and use the solc version specified in the generated JSON abis (0.8.17), instead of the one at the top of my .sol file```
If you want to run a test:
```npx truffle test ./test/sacrifice/FlowerSacrifice.test.js```
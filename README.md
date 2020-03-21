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

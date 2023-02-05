require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim();
const myApiKey = fs.readFileSync(".apiKey").toString().trim();

const config = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {
    },
    matic: {
      url: "https://polygon-rpc.com/",
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1_000_000,
      },
      metadata: {
        bytecodeHash: 'none',
      },
    },
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: true,
    runOnCompile: false,
  },
  etherscan: {
    apiKey: myApiKey
  }
};

module.exports = config;
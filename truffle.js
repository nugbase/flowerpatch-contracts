var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");
var HDWalletProvider = require("@truffle/hdwallet-provider");

var mnemonic = process.env.CONTRACTS_MNEMONIC_SEED;
var node_url = process.env.ETH_NODE_URL;
var infura_key = process.env.INFURA_KEY;
var alchemy_key = process.env.ALCHEMY_KEY;

if (!mnemonic || !node_url) {
  console.log('WARN: mnemonic or eth_node env variables not set, see README.md');
}

module.exports = {
  contracts_directory: './contracts',
  contracts_build_directory: './build/contracts',
  compilers: {
      solc: {
          version: '^0.8.3',
          settings: {
              optimizer: {
                  enabled: true,
                  runs: 200,
              },
          },
      },
  },
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "5777",
      gas: 4000000,
      gasPrice: 1000000000
    },
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, node_url);
      },
      network_id: "4", // Rinkeby ID 4
      gas: 4000000,
      gasPrice: 1000000000
    },
    mainnet: {
      provider: function() { 
        // Mainnet migrations fail because of unstable nonce when used
        // with the Infura loadbalancer. This is MetaMask's solution
        var wallet = new HDWalletProvider(mnemonic, node_url);
        var nonceTracker = new NonceTrackerSubprovider()
        wallet.engine._providers.unshift(nonceTracker)
        nonceTracker.setEngine(wallet.engine)
        return wallet
      },
      network_id: "1",
      gas: 4000000, // 21,000 normal; 1,685,639 used by v1 Flower Contract
      gasPrice: 20000000000 // really helps to have a 4x safelow fee
    },
    polygon: {
      provider: () => {
          return new HDWalletProvider({
              mnemonic: {
                  phrase: mnemonic,
              },
              providerOrUrl:
                  'https://polygon-mainnet.infura.io/v3/' + infura_key,
              // providerOrUrl:
              //     'wss://polygon-mainnet.g.alchemy.com/v2/' + alchemy_key,
              numberOfAddresses: 1,
              shareNonce: true,
          });
      },
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 137,
      gas: 6600000,
      gasPrice: 600000000000,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
    }
  }
};

/* vim: set ts=2 sw=2: */

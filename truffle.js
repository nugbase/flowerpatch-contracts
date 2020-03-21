var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.CONTRACTS_MNEMONIC_SEED
var node_url = process.env.ETH_NODE_URL

if (!mnemonic || !node_url) {
  console.log('WARN: mnemonic or eth_node env variables not set, see README.md');
}

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
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
    }
  }
};

/* vim: set ts=2 sw=2: */

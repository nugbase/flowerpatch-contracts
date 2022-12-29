var FlowerSacrifice = artifacts.require('FlowerSacrifice.sol');

module.exports = function(deployer) {
    deployer.deploy(FlowerSacrifice, '0xa115DFbb5aB7aDfFad2f7F25FA7A5c227616C2C3');
};

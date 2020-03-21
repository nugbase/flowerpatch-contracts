var Flower = artifacts.require("Flower.sol");
var Seed = artifacts.require("SeedToken.sol");
var VendingMachine = artifacts.require("VendingMachine.sol");

module.exports = function(deployer) {
    deployer.deploy(Flower);

    deployer.deploy(Seed).then(function() {
        return deployer.deploy(VendingMachine, Seed.address);
    });
};

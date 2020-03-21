var VendingMachine = artifacts.require("VendingMachine.sol");
var BreedFee = artifacts.require("BreedFee.sol");

module.exports = function(deployer) {
    return deployer.deploy(BreedFee, VendingMachine.address);
};

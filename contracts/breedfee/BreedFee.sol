pragma solidity ^0.4.24;

import "../vendingmachine/VendingMachine.sol";

contract BreedFee is Privileged {
    event Breed(address indexed breeder, address indexed breedee, uint256 indexed value);

    // Privileges
    uint8 constant PRIV_ROOT = 1;
    uint8 constant PRIV_MANAGE = 2;
    uint8 constant PRIV_WITHDRAW = 4;

    // Internal Variables
    VendingMachine internal vmContract;

    // Public Variables (getters only created automatically)
    uint256 public breedeeFee;

    constructor(address _vendingMachineAddress) public Privileged(PRIV_ROOT) {
        breedeeFee = 0.002 ether;
        vmContract = VendingMachine(_vendingMachineAddress);
        // Grant other privileges to the contract creator
        grantPrivileges(msg.sender, PRIV_MANAGE|PRIV_WITHDRAW);
    }

    // Wrapper around VM's etherPurchase to implement splitting
    function breed(address _breedee, uint256 _itemId, bytes _varData) external payable {
        // Validity of _breedee address is checked later by Minter
        // Validity of the _itemId is checked later by Minter
        uint256 ethPrice;
        uint32 quantity;
        (, , ethPrice, quantity, ) = vmContract.inventoryEntries(_itemId);
        require(quantity != 0);
        require(ethPrice != 0);
        require(msg.value == ethPrice + breedeeFee);
        // Could limit this further with a .gas() modifier, but we trust VM
        vmContract.etherPurchase.value(ethPrice)(_itemId, _varData);
        // Send to unknown address/contract must come last, since it comes
        // with code execution and could fail. Transfer throws an exception
        _breedee.transfer(breedeeFee);
        emit Breed(msg.sender, _breedee, msg.value);
    }

    function setBreedeeFee(uint256 _fee) external requirePrivileges(PRIV_MANAGE) {
        breedeeFee = _fee;
    }

    function withdraw() external requirePrivileges(PRIV_WITHDRAW) {
        msg.sender.transfer(address(this).balance);
    }
}

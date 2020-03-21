pragma solidity ^0.4.24;

import "../privileged/Privileged.sol";
import "../tokenretriever/TokenRetriever.sol";

/**
 * fb8919a77a3d4b42bc5181d649378a2d1dc7641698f99e8d412d38409586b226
 */

contract PaymentReceiver is Privileged, TokenRetriever {
    event SeedPayment(address from, uint256 indexed paymentId, uint256 indexed value);
    event EtherPayment(address from, uint256 indexed paymentId, uint256 indexed value);

    // Privileges
    uint8 constant PRIV_ROOT = 1;

    ERC20TokenInterface internal seedContract;

    constructor(address _seedContractAddress) public Privileged(PRIV_ROOT) TokenRetriever(PRIV_ROOT) {
        seedContract = ERC20TokenInterface(_seedContractAddress);
    }

    function seedPayment(uint256 _paymentId, uint256 _value) external {
        require(seedContract.transferFrom(msg.sender, address(this), _value));
        emit SeedPayment(msg.sender, _paymentId, _value);
    }

    function etherPayment(uint256 _paymentId) external payable {
        emit EtherPayment(msg.sender, _paymentId, msg.value);
    }

    function withdrawSeed(uint256 _amount) external requirePrivileges(PRIV_ROOT) {
        seedContract.transfer(msg.sender, _amount);
    }

    function withdrawEther(uint256 _amount) external requirePrivileges(PRIV_ROOT) {
        msg.sender.transfer(_amount);
    }
}

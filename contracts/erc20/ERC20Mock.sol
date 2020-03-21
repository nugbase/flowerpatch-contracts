pragma solidity ^0.4.24;

import "./ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor() public ERC20("MockToken", "MOCK", 18) {
    }

    function mintForMe(uint256 _value) public {
        super._mint(msg.sender, _value);
    }
}

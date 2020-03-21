pragma solidity ^0.4.24;

import "./ERC20.sol";

contract ERC20Multisend is ERC20 {
    function multisend(address[] _to, uint256[] _values) external {
        for (uint256 i = 0; i < _to.length; i++) {
            super.transfer(_to[i], _values[i]);
        }
    }
}

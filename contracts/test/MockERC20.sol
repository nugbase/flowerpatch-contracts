// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "YOLO") {}

    function mintForMe(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}

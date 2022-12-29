// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract MockERC721Burnable is ERC721, ERC721Burnable {
    constructor() ERC721("MockERC721Burnable", "MOCK") {}

    function mintForMe(uint256 tokenId) external {
        _mint(msg.sender, tokenId);
    }
}

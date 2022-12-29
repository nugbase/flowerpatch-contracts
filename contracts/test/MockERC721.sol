// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721
{
	constructor() ERC721("MockERC721", "MOCK")
	{
	}

    function mintForMe(uint256 tokenId) external
    {
    	_mint(msg.sender, tokenId);
    }
}

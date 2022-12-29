// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../RedeemableNFT.sol";

contract NotERC721 is ERC165
{
    function run(address redeemableAddress, bytes calldata encodedRedeemerAddress) external
    {
    	RedeemableNFT(redeemableAddress).onERC721Received(address(0), address(0), 123, encodedRedeemerAddress);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        // No ERC721
        return super.supportsInterface(interfaceId);
    }
}

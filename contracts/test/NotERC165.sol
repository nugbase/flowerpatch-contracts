// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "../RedeemableNFT.sol";

contract NotERC165
{
    function run(address redeemableAddress, bytes calldata encodedRedeemerAddress) external
    {
    	RedeemableNFT(redeemableAddress).onERC721Received(address(0), address(0), 123, encodedRedeemerAddress);
    }
}

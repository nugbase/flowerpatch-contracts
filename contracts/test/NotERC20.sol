// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../RedeemableERC20.sol";

contract NotERC20 is ERC165 {
    function run(
        address redeemableAddress,
        bytes calldata encodedRedeemerAddress
    ) external {
        RedeemableERC20(redeemableAddress).depositERC20(
            address(0),
            123,
            encodedRedeemerAddress
        );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165)
        returns (bool)
    {
        // No ERC20
        return super.supportsInterface(interfaceId);
    }
}

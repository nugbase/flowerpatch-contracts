// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract FlowerSacrifice {
    event Burnt(address indexed from, uint256[3] indexed flowers);
    IERC721 internal flowerContract;

    constructor(address _flowerContractAddress) {
        flowerContract = IERC721(_flowerContractAddress);
    }

    function burn(
        uint256 flower1,
        uint256 flower2,
        uint256 flower3
    ) external {
        // Validate sender ownership
        require(
            msg.sender == flowerContract.ownerOf(flower1),
            "FlowerSacrifice: You must own this FLOWER in order to sacrifice it."
        );
        require(
            msg.sender == flowerContract.ownerOf(flower2),
            "FlowerSacrifice: You must own this FLOWER in order to sacrifice it."
        );
        require(
            msg.sender == flowerContract.ownerOf(flower3),
            "FlowerSacrifice: You must own this FLOWER in order to sacrifice it."
        );

        // Make sure this contract has approval to transfer all the FLOWERs
        require(
            address(this) == flowerContract.getApproved(flower1),
            "FlowerSacrifice: You must approve FLOWERs before sacrificing them."
        );
        require(
            address(this) == flowerContract.getApproved(flower2),
            "FlowerSacrifice: You must approve FLOWERs before sacrificing them."
        );
        require(
            address(this) == flowerContract.getApproved(flower3),
            "FlowerSacrifice: You must approve FLOWERs before sacrificing them."
        );

        flowerContract.transferFrom(msg.sender, address(0), flower1);
        flowerContract.transferFrom(msg.sender, address(0), flower2);
        flowerContract.transferFrom(msg.sender, address(0), flower3);

        uint256[3] memory flowers = [flower1, flower2, flower3];

        emit Burnt(msg.sender, flowers);
    }
}

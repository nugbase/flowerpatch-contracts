// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract FlowerSacrifice {
    event Burnt(address indexed from, uint256[3] indexed flowers);
    ERC721Burnable internal flowerContract;
    address internal burnAddress = 0x000000000000000000000000000000000000dEaD;

    constructor(address _flowerContractAddress) {
        flowerContract = ERC721Burnable(_flowerContractAddress);
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
            flowerContract.isApprovedForAll(msg.sender, address(this)),
            "FlowerSacrifice: You must approve FLOWERs before sacrificing them."
        );

        flowerContract.burn(flower1);
        flowerContract.burn(flower2);
        flowerContract.burn(flower3);

        uint256[3] memory flowers = [flower1, flower2, flower3];

        emit Burnt(msg.sender, flowers);
    }
}

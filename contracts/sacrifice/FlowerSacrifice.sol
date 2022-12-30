// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract FlowerSacrifice {
    event BurnedOne(address indexed from, bytes eventId, uint256 flower1);
    event BurnedTwo(
        address indexed from,
        bytes eventId,
        uint256 flower1,
        uint256 flower2
    );
    event BurnedThree(
        address indexed from,
        bytes eventId,
        uint256 flower1,
        uint256 flower2,
        uint256 flower3
    );
    event BurnedFour(
        address indexed from,
        bytes eventId,
        uint256 flower1,
        uint256 flower2,
        uint256 flower3,
        uint256 flower4
    );
    event BurnedFive(
        address indexed from,
        bytes eventId,
        uint256 flower1,
        uint256 flower2,
        uint256 flower3,
        uint256 flower4,
        uint256 flower5
    );
    ERC721Burnable internal flowerContract;

    constructor(address _flowerContractAddress) {
        flowerContract = ERC721Burnable(_flowerContractAddress);
    }

    function burnOne(bytes calldata eventId, uint256 flower1) external {
        // Validate sender ownership
        require(
            msg.sender == flowerContract.ownerOf(flower1),
            "FlowerSacrifice: You must own this FLOWER in order to sacrifice it."
        );

        // Make sure this contract has approval to transfer all the FLOWERs
        require(
            flowerContract.isApprovedForAll(msg.sender, address(this)),
            "FlowerSacrifice: You must approve FLOWERs before sacrificing them."
        );

        flowerContract.burn(flower1);

        emit BurnedOne(msg.sender, eventId, flower1);
    }

    function burnTwo(
        bytes calldata eventId,
        uint256 flower1,
        uint256 flower2
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

        // Make sure this contract has approval to transfer all the FLOWERs
        require(
            flowerContract.isApprovedForAll(msg.sender, address(this)),
            "FlowerSacrifice: You must approve FLOWERs before sacrificing them."
        );

        flowerContract.burn(flower1);
        flowerContract.burn(flower2);

        emit BurnedTwo(msg.sender, eventId, flower1, flower2);
    }

    function burnThree(
        bytes calldata eventId,
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

        emit BurnedThree(msg.sender, eventId, flower1, flower2, flower3);
    }

    function burnFour(
        bytes calldata eventId,
        uint256 flower1,
        uint256 flower2,
        uint256 flower3,
        uint256 flower4
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
        require(
            msg.sender == flowerContract.ownerOf(flower4),
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
        flowerContract.burn(flower4);

        emit BurnedFour(
            msg.sender,
            eventId,
            flower1,
            flower2,
            flower3,
            flower4
        );
    }

    function burnFive(
        bytes calldata eventId,
        uint256 flower1,
        uint256 flower2,
        uint256 flower3,
        uint256 flower4,
        uint256 flower5
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
        require(
            msg.sender == flowerContract.ownerOf(flower4),
            "FlowerSacrifice: You must own this FLOWER in order to sacrifice it."
        );
        require(
            msg.sender == flowerContract.ownerOf(flower5),
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
        flowerContract.burn(flower4);
        flowerContract.burn(flower5);

        emit BurnedFive(
            msg.sender,
            eventId,
            flower1,
            flower2,
            flower3,
            flower4,
            flower5
        );
    }
}

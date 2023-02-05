// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./libraries/EIP712MetaTransaction.sol";
import "./libraries/ERC20.sol";

contract VendingMachine is
    AccessControl,
    EIP712MetaTransaction("VendingMachine", "1")
{
    event SeedPurchase(
        address indexed from,
        uint256 indexed itemId,
        uint256 indexed value,
        uint32 itemType,
        bytes varData
    );

    event EtherPurchase(
        address indexed from,
        uint256 indexed itemId,
        uint256 indexed value,
        uint32 itemType,
        bytes varData
    );

    event BreedSeed(
        address indexed breeder,
        address indexed breedee,
        uint256 indexed price,
        bytes varData
    );

    event BreedEth(
        address indexed breeder,
        address indexed breedee,
        uint256 indexed price,
        bytes varData
    );


    struct InventoryEntry {
        uint256 index;
        uint256 seedPrice;
        uint256 ethPrice;
        uint32 quantity;
        uint32 itemType;
    }

    // Constants
    uint32 public constant UINT32_MAX = ~uint32(0);
    // item types 

    uint32 public constant ITEMTYPE_FLOWER = 0;
    uint32 public constant ITEMTYPE_ITEM = 1;
    // Privileges
    bytes32 public constant PRIV_MANAGE = keccak256("PRIV_MANAGE");
    bytes32 public constant PRIV_WITHDRAW = keccak256("PRIV_WITHDRAW");

    mapping(uint256 => InventoryEntry) public inventoryEntries;
    uint256[] public itemIds;

    uint256 public nugbaseFeeEth = 5.5 ether; 
    uint256 public breedeeFeeEth = 1.5 ether;

    ERC20 internal seedContract =
        ERC20(0xA3c342c1630BE4a779d0896925787EFFad0569cB);

    constructor() {
        // Grant other privileges to the contract creator
        _setupRole(DEFAULT_ADMIN_ROLE, msgSender());
        _setupRole(PRIV_MANAGE, msgSender());
        _setupRole(PRIV_WITHDRAW, msgSender());
    }

    function seedPurchase(
        uint256 _itemId,
        uint256 _value,
        bytes calldata _varData
    ) external {
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];
        require(_inventoryEntryExists(inventoryEntry),"Inventory item does not exist");
        require(inventoryEntry.seedPrice != 0, "Item cannot have zero price");
        require(_value == inventoryEntry.seedPrice, "Incorrect payment amount");
        require(seedContract.transferFrom(msgSender(), address(this), _value), "Seed contract must approve Vending machine as spender");
        uint32 _itemType = inventoryEntry.itemType; // value saved before entry is deleted
        _deductInventoryItem(inventoryEntry, _itemId);

        emit SeedPurchase(msgSender(), _itemId, _value, _itemType, _varData);
    }

    function etherPurchase(uint256 _itemId, bytes calldata _varData)
        external
        payable
    {
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];
        require(_inventoryEntryExists(inventoryEntry),"Inventory item does not exist");
        require(inventoryEntry.ethPrice != 0, "Item cannot have zero price");
        require(msg.value == inventoryEntry.ethPrice, "Incorrect payment amount");
        uint32 _itemType = inventoryEntry.itemType; // value saved before entry is deleted
        _deductInventoryItem(inventoryEntry, _itemId);
        emit EtherPurchase(
            msgSender(),
            _itemId,
            msg.value,
            _itemType,
            _varData
        );
    }

    function upsertInventoryItem(
        uint256 _itemId,
        uint256 seedPrice,
        uint256 ethPrice,
        uint32 quantity,
        uint32 itemType
    ) external onlyRole(PRIV_MANAGE) {
        require(quantity > 0, "Quantity must be greater than zero");
        require(itemType == ITEMTYPE_FLOWER || itemType == ITEMTYPE_ITEM, "Must be defined item type: 0 is FLOWER, 1 is ITEM");
        require(seedPrice > 0 || ethPrice > 0, "Eth price or Seed price must be greater than zero");
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];
        if (!_inventoryEntryExists(inventoryEntry)) {
            // New item
            inventoryEntry.index = itemIds.length;
            itemIds.push(_itemId);
        }
        inventoryEntry.seedPrice = seedPrice;
        inventoryEntry.ethPrice = ethPrice;
        inventoryEntry.quantity = quantity;
        inventoryEntry.itemType = itemType;
    }

    function deleteInventoryItem(uint256 _itemId)
        external
        onlyRole(PRIV_MANAGE)
    {
        _deleteInventoryItem(_itemId);
    }

    function withdrawSeed(uint256 _amount) external onlyRole(PRIV_WITHDRAW) {
        seedContract.transfer(msgSender(), _amount);
    }

    function withdrawEther(uint256 _amount) external onlyRole(PRIV_WITHDRAW) {
        payable(msgSender()).transfer(_amount);
    }

    function totalItems() public view returns (uint256) {
        return itemIds.length;
    }

    function _deductInventoryItem(
        InventoryEntry storage inventoryEntry,
        uint256 _itemId
    ) internal {
        if (inventoryEntry.quantity == UINT32_MAX) {
            return;
        } else if (inventoryEntry.quantity > 1) {
            inventoryEntry.quantity--;
        } else {
            _deleteInventoryItem(_itemId);
        }
    }

    function _deleteInventoryItem(uint256 _itemId) internal {
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];

        require(_inventoryEntryExists(inventoryEntry), "Inventory entry does not exist");
        uint256 lastItemIndex = itemIds.length - 1; // Safe because at least one item must exist (asserted above)
        uint256 lastItemId = itemIds[lastItemIndex]; // get the item ID for the last item.

        itemIds[inventoryEntry.index] = itemIds[lastItemIndex]; // move the last array item into the index we are trying to remove and overwrite it.

        inventoryEntries[lastItemId].index = inventoryEntry.index; // set the index of the lastItemID to the index of the item we are deleting since we just coppied the itemID to that position in the itemIds array
        // now delete the inventoryEntry and remove the last item in the array to reduce its length
        delete inventoryEntries[_itemId];
        itemIds.pop();
    }

    function _inventoryEntryExists(InventoryEntry storage inventoryEntry)
        internal
        view
        returns (bool)
    {
        if (inventoryEntry.quantity != 0) return true;
        if (inventoryEntry.seedPrice != 0) return true;
        if (inventoryEntry.ethPrice != 0) return true;
        return false;
    }

    function breedEth(address payable _breedee, bytes calldata _varData)
        external
        payable
    {
        require(msg.value == (nugbaseFeeEth + breedeeFeeEth), "Not enough ETH");
        _breedee.transfer(breedeeFeeEth);
        emit BreedEth(
            msg.sender,
            _breedee,
            (nugbaseFeeEth + breedeeFeeEth),
            _varData
        );
    }

    function setBreedeeFeeEth(uint256 _fee) external onlyRole(PRIV_MANAGE) {
        breedeeFeeEth = _fee;
    }

    function setNugbaseFeeEth(uint256 _fee) external onlyRole(PRIV_MANAGE) {
        nugbaseFeeEth = _fee;
    }

    function setSeedToken(address _seed) external onlyRole(PRIV_MANAGE) {
        seedContract = ERC20(_seed);
    }
}

pragma solidity ^0.4.24;

import "../privileged/Privileged.sol";
import "../tokenretriever/TokenRetriever.sol";

/**
 * fb8919a77a3d4b42bc5181d649378a2d1dc7641698f99e8d412d38409586b226
 */

contract VendingMachine is Privileged, TokenRetriever {
    event SeedPurchase(address indexed from, uint256 indexed itemId, uint256 indexed value, uint32 itemType, bytes varData);
    event EtherPurchase(address indexed from, uint256 indexed itemId, uint256 indexed value, uint32 itemType, bytes varData);

    uint32 constant UINT32_MAX = ~uint32(0);

    struct InventoryEntry {
        uint256 index;
        uint256 seedPrice;
        uint256 ethPrice;
        uint32 quantity;
        uint32 itemType;
    }

    mapping(uint256 => InventoryEntry) public inventoryEntries;
    uint256[] public itemIds;

    // Privileges
    uint8 constant PRIV_ROOT = 1;
    uint8 constant PRIV_MANAGE = 2;
    uint8 constant PRIV_WITHDRAW = 4;

    ERC20TokenInterface internal seedContract;

    constructor(address _seedContractAddress) public Privileged(PRIV_ROOT) TokenRetriever(PRIV_ROOT) {
        seedContract = ERC20TokenInterface(_seedContractAddress);
        // Grant other privileges to the contract creator
        grantPrivileges(msg.sender, PRIV_MANAGE|PRIV_WITHDRAW);
    }

    function seedPurchase(uint256 _itemId, uint256 _value, bytes _varData) external {
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];
        require(_inventoryEntryExists(inventoryEntry));
        require(inventoryEntry.seedPrice != 0);
        require(_value == inventoryEntry.seedPrice);
        require(seedContract.transferFrom(msg.sender, address(this), _value));
        uint32 _itemType = inventoryEntry.itemType; // value saved before entry is deleted
        _deductInventoryItem(inventoryEntry, _itemId);
        emit SeedPurchase(msg.sender, _itemId, _value, _itemType, _varData);
    }

    function etherPurchase(uint256 _itemId, bytes _varData) external payable {
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];
        require(_inventoryEntryExists(inventoryEntry));
        require(inventoryEntry.ethPrice != 0);
        require(msg.value == inventoryEntry.ethPrice);
        uint32 _itemType = inventoryEntry.itemType; // value saved before entry is deleted
        _deductInventoryItem(inventoryEntry, _itemId);
        emit EtherPurchase(msg.sender, _itemId, msg.value, _itemType, _varData);
    }

    function upsertInventoryItem(uint256 _itemId, uint256 seedPrice, uint256 ethPrice, uint32 quantity, uint32 itemType) external requirePrivileges(PRIV_MANAGE) {
        require(quantity > 0);
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

    function deleteInventoryItem(uint256 _itemId) external requirePrivileges(PRIV_MANAGE) {
        _deleteInventoryItem(_itemId);
    }

    function withdrawSeed(uint256 _amount) external requirePrivileges(PRIV_WITHDRAW) {
        seedContract.transfer(msg.sender, _amount);
    }

    function withdrawEther(uint256 _amount) external requirePrivileges(PRIV_WITHDRAW) {
        msg.sender.transfer(_amount);
    }

    function totalItems() public view returns (uint256) {
        return itemIds.length;
    }

    function _deductInventoryItem(InventoryEntry storage inventoryEntry, uint256 _itemId) internal {
        if (inventoryEntry.quantity == UINT32_MAX) {
            // Do nothing, this means infinite quantity available
        } else if (inventoryEntry.quantity > 1) {
            inventoryEntry.quantity--;
        } else {
            _deleteInventoryItem(_itemId);
        }
    }

    function _deleteInventoryItem(uint256 _itemId) internal {
        InventoryEntry storage inventoryEntry = inventoryEntries[_itemId];
        if (!_inventoryEntryExists(inventoryEntry)) {
            return;
        }
        uint256 lastItemIndex = itemIds.length - 1; // Safe because at least one item must exist (asserted above)
        uint256 lastItemId = itemIds[lastItemIndex];
        itemIds[inventoryEntry.index] = itemIds[lastItemIndex];
        inventoryEntries[lastItemId].index = inventoryEntry.index;
        itemIds.length--;
        delete inventoryEntries[_itemId];
    }

    function _inventoryEntryExists(InventoryEntry storage inventoryEntry) internal view returns (bool) {
        return inventoryEntry.quantity != 0;
    }
}

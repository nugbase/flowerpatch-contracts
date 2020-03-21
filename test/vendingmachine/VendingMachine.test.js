const BigNumber = web3.BigNumber;
const ERC20Mock = artifacts.require('ERC20Mock.sol');
const VendingMachine = artifacts.require('VendingMachine.sol');
const { assertRevert } = require('../helpers/assertRevert');
const { measureWeiDelta } = require('../helpers/measureWeiDelta');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('VendingMachine', function(accounts) {
  const ROOT_ACCOUNT = accounts[0];
  const RANDOM_ACCOUNT = accounts[1];

  const UINT32_MAX = Math.pow(2, 32) - 1;

  const ITEM1_ID = 1001;
  const ITEM1_SEED_PRICE = 100;
  const ITEM1_ETHER_PRICE = 10000000000000000;

  const ITEM2_ID = 1002;
  const ITEM2_SEED_PRICE = 20;
  const ITEM2_ETHER_PRICE = 0;

  const ITEMTYPE_FLOWER_PURCHASE = 0;
  const ITEMTYPE_BREED_PURCHASE = 1;
  const VARDATA_NONE = '';
  const VARDATA_BREED = 'FLOWERPATCH TEST YO';

  let seed;
  let vendingMachine;

  const toHex = function(string) {
      const hexResult = web3.toHex(string);
      if (hexResult === '0x0') return '0x'; // thats how it do
      else return hexResult;
  }

  beforeEach(async function() {
    seed = await ERC20Mock.new();
    vendingMachine = await VendingMachine.new(seed.address);
  });

  describe('seedPurchase', function() {
    beforeEach(async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
      await seed.mintForMe(1000);
    });

    it('basic', async function() {
      await seed.approve(vendingMachine.address, 1000);
      const purchaseResult = await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      const event1 = purchaseResult.logs[0];
      event1.event.should.equal('SeedPurchase');
      event1.args.from.should.equal(ROOT_ACCOUNT);
      event1.args.itemId.should.bignumber.equal(ITEM1_ID);
      event1.args.value.should.bignumber.equal(ITEM1_SEED_PRICE);
      event1.args.itemType.should.bignumber.equal(ITEMTYPE_FLOWER_PURCHASE);
      event1.args.varData.should.equal(toHex(VARDATA_NONE));
      (await seed.balanceOf(vendingMachine.address)).should.be.bignumber.equal(ITEM1_SEED_PRICE);
    });

    it('quantity running out', async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
      await seed.approve(vendingMachine.address, 1000);
      // Store has 2 available
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      // Store has 1 available
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      // Store has 0 available
      await assertRevert(vendingMachine.seedPurchase(ITEM1_ID, 100, VARDATA_NONE));
    });

    it('quantity decrementing', async function() {
      const startInventory = 30;
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, startInventory, ITEMTYPE_FLOWER_PURCHASE);
      await seed.approve(vendingMachine.address, 1000);
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);

      const inventoryEntry = (await vendingMachine.inventoryEntries.call(ITEM1_ID));
      const quantity = inventoryEntry[3]; // fourth struct item is quantity
      quantity.should.be.bignumber.equal(startInventory - 3);
    });

    it('quantity infinite', async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, UINT32_MAX, ITEMTYPE_FLOWER_PURCHASE);
      await seed.approve(vendingMachine.address, 1000);
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);
      await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE);

      const inventoryEntry = (await vendingMachine.inventoryEntries.call(ITEM1_ID));
      const quantity = inventoryEntry[3]; // fourth struct item is quantity
      quantity.should.be.bignumber.equal(UINT32_MAX);
    });

    it('wrong price', async function() {
      await seed.approve(vendingMachine.address, 1000);
      await assertRevert(vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE - 1, VARDATA_NONE));
    });

    it('seedPrice is 0', async function() {
      await vendingMachine.upsertInventoryItem(ITEM2_ID, 0, 10, 2, ITEMTYPE_FLOWER_PURCHASE);
      await assertRevert(vendingMachine.seedPurchase(ITEM1_ID, 0, VARDATA_NONE));
    });

    it('insufficient approval', async function() {
      await seed.approve(vendingMachine.address, ITEM1_SEED_PRICE - 1);
      await assertRevert(vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_NONE));
    });

    it('item type and var data set', async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_BREED_PURCHASE);
      await seed.approve(vendingMachine.address, 1000);
      const purchaseResult = await vendingMachine.seedPurchase(ITEM1_ID, ITEM1_SEED_PRICE, VARDATA_BREED);
      const event1 = purchaseResult.logs[0];
      event1.event.should.equal('SeedPurchase');
      event1.args.from.should.equal(ROOT_ACCOUNT);
      event1.args.itemId.should.bignumber.equal(ITEM1_ID);
      event1.args.value.should.bignumber.equal(ITEM1_SEED_PRICE);
      event1.args.itemType.should.bignumber.equal(ITEMTYPE_BREED_PURCHASE);
      event1.args.varData.should.equal(toHex(VARDATA_BREED));
      (await seed.balanceOf(vendingMachine.address)).should.be.bignumber.equal(ITEM1_SEED_PRICE);
    });
  });

  describe('etherPurchase', function() {
    beforeEach(async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    });

    it('basic', async function() {
      const purchaseResult = await vendingMachine.etherPurchase(ITEM1_ID, VARDATA_NONE, { value: ITEM1_ETHER_PRICE });
      const event1 = purchaseResult.logs[0];
      event1.event.should.equal('EtherPurchase');
      event1.args.from.should.equal(ROOT_ACCOUNT);
      event1.args.itemId.should.bignumber.equal(ITEM1_ID);
      event1.args.value.should.bignumber.equal(ITEM1_ETHER_PRICE);
      event1.args.itemType.should.bignumber.equal(ITEMTYPE_FLOWER_PURCHASE);
      event1.args.varData.should.equal(toHex(VARDATA_NONE));
      (await web3.eth.getBalance(vendingMachine.address)).should.be.bignumber.equal(ITEM1_ETHER_PRICE);
    });

    it('ethPrice is 0', async function() {
      await vendingMachine.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
      await assertRevert(vendingMachine.etherPurchase(ITEM2_ID, VARDATA_NONE, { value: ITEM2_ETHER_PRICE }));
    });

    it('item type and var data set', async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_BREED_PURCHASE);
      const purchaseResult = await vendingMachine.etherPurchase(ITEM1_ID, VARDATA_BREED, { value: ITEM1_ETHER_PRICE });
      const event1 = purchaseResult.logs[0];
      event1.event.should.equal('EtherPurchase');
      event1.args.from.should.equal(ROOT_ACCOUNT);
      event1.args.itemId.should.bignumber.equal(ITEM1_ID);
      event1.args.value.should.bignumber.equal(ITEM1_ETHER_PRICE);
      event1.args.itemType.should.bignumber.equal(ITEMTYPE_BREED_PURCHASE);
      event1.args.varData.should.equal(toHex(VARDATA_BREED));
      (await web3.eth.getBalance(vendingMachine.address)).should.be.bignumber.equal(ITEM1_ETHER_PRICE);
    });
  });

  describe('upsertInventoryItem', function() {
    it('basic', async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
      await vendingMachine.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
      (await vendingMachine.itemIds.call(0)).should.be.bignumber.equal(ITEM1_ID);
      (await vendingMachine.itemIds.call(1)).should.be.bignumber.equal(ITEM2_ID);
    });
  });

  describe('deleteInventoryItem', function() {
    it('basic', async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
      await vendingMachine.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
      await vendingMachine.deleteInventoryItem(ITEM1_ID);
      (await vendingMachine.itemIds.call(0)).should.be.bignumber.equal(ITEM2_ID);
    });
  });

  describe('withdrawSeed', function() {
    beforeEach(async function() {
      await seed.mintForMe(1000);
      await seed.transfer(vendingMachine.address, 1000);
      (await seed.balanceOf(vendingMachine.address)).should.be.bignumber.equal(1000);
    });

    it('basic', async function() {
      await vendingMachine.withdrawSeed(1000);
      (await seed.balanceOf(ROOT_ACCOUNT)).should.be.bignumber.equal(1000);
    });

    it('no privileges', async function() {
      await assertRevert(vendingMachine.withdrawSeed(1000, { from: RANDOM_ACCOUNT }));
    });
  });

  describe('withdrawEther', function() {
    beforeEach(async function() {
      await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
      await vendingMachine.etherPurchase(ITEM1_ID, VARDATA_NONE, { value: ITEM1_ETHER_PRICE });
      (await web3.eth.getBalance(vendingMachine.address)).should.be.bignumber.equal(ITEM1_ETHER_PRICE);
    });

    it('basic', async function() {
      const weiDelta = await measureWeiDelta(ROOT_ACCOUNT, async function() {
        await vendingMachine.withdrawEther(ITEM1_ETHER_PRICE, { gasPrice: 0 });
      });
      weiDelta.should.be.bignumber.equal(ITEM1_ETHER_PRICE);
    });

    it('no privileges', async function() {
      await assertRevert(vendingMachine.withdrawEther(ITEM1_ETHER_PRICE, { from: RANDOM_ACCOUNT }));
    });
  });
});

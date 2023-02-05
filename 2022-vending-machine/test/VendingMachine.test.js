const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const BigNumber = ethers.BigNumber;

const UINT32_MAX = Math.pow(2, 32) - 1;

const ITEM1_ID = 1001;
const ITEM1_ETHER_PRICE = 1000000000;
const ITEM1_SEED_PRICE = 10000;

const ITEM2_ID = 1002;
const ITEM2_ETHER_PRICE = 1500000000;
const ITEM2_SEED_PRICE = 20000;

const ITEM0_ETHER_PRICE = 0;
const ITEM0_SEED_PRICE = 0;


const BREED_ETH_PRICE   = "7000000000000000000";
const BREED_ETH_NUGBASE = "5500000000000000000";
const BREED_ETH_BREEDEE = "1500000000000000000";

const ITEMTYPE_FLOWER_PURCHASE = 0;
const ITEMTYPE_ITEM_PURCHASE = 1;

const VARDATA_NONE = '0x';
const VARDATA_BREED = '0x6d6168616d000000000000000000000000000000000000000000000000000000';


async function deployTokenFixture() {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const provider = waffle.provider;
  // deploy contract
  const VM = await ethers.getContractFactory("VendingMachine");
  const vm = await VM.deploy();
  await vm.deployed();

  // Fixtures can return anything you consider useful for your tests
  return { VM, vm, provider, ROOT_ACCOUNT: owner, addr1, addr2 };
}


describe('deploy', function() {
  it('basic deploy', async function() {
    const VM = await ethers.getContractFactory("VendingMachine");
    const vm = await VM.deploy();
    await vm.deployed();

    // test privilages here
    // 
  });
});


describe('etherPurchase', function() {

  it('basic purchase', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    await tx1.wait();

    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_NONE, { value: ITEM1_ETHER_PRICE });

    expect(purchaseResult)
    .to
    .emit(vm, 'EtherPurchase')
    .withArgs("from", ROOT_ACCOUNT)
    .withArgs("itemId", "" + ITEM1_ID)
    .withArgs("value", "" + ITEM1_ETHER_PRICE)
    .withArgs("itemType", "" + "" + ITEMTYPE_FLOWER_PURCHASE)

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);
  });

  it('ethPrice is 0', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
    await tx1.wait();

    // should revert with a string reason if you try and purchase a 0 value item in the store.
      await expect(
        vm.etherPurchase(ITEM2_ID, VARDATA_NONE, { value: ITEM0_ETHER_PRICE })).to.be.reverted;
  });

  it('item type and var data set', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM2_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_ITEM_PURCHASE);
    await tx1.wait();
    // 
    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_BREED, { value: ITEM1_ETHER_PRICE });

    expect(purchaseResult)
    .to
    .emit(vm, 'EtherPurchase')
    .withArgs("from", ROOT_ACCOUNT)
    .withArgs("itemId", "" + ITEM1_ID)
    .withArgs("value", "" + ITEM1_ETHER_PRICE)
    .withArgs("itemType", "" +  ITEMTYPE_ITEM_PURCHASE)
    .withArgs("varData", VARDATA_BREED)

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);

  });
});

describe('Seed Purchase', function() {
  return;
  it('basic purchase', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    await tx1.wait();

    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_NONE, { value: ITEM1_ETHER_PRICE });

    expect(purchaseResult)
    .to
    .emit(vm, 'EtherPurchase')
    .withArgs("from", ROOT_ACCOUNT)
    .withArgs("itemId", "" + ITEM1_ID)
    .withArgs("value", "" + ITEM1_ETHER_PRICE)
    .withArgs("itemType", "" + "" + ITEMTYPE_FLOWER_PURCHASE)

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);
  });

  it('Seed price is 0', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
    await tx1.wait();

    // should revert with a string reason if you try and purchase a 0 value item in the store.
      await expect(
        vm.etherPurchase(ITEM2_ID, VARDATA_NONE, { value: ITEM2_ETHER_PRICE })).to.be.reverted;
  });

  it('item type and var data set', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM2_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_BREED_PURCHASE);
    await tx1.wait();
    // 
    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_BREED, { value: ITEM1_ETHER_PRICE });

    expect(purchaseResult)
    .to
    .emit(vm, 'EtherPurchase')
    .withArgs("from", ROOT_ACCOUNT)
    .withArgs("itemId", "" + ITEM1_ID)
    .withArgs("value", "" + ITEM1_ETHER_PRICE)
    .withArgs("itemType", "" +  ITEMTYPE_BREED_PURCHASE)
    .withArgs("varData", VARDATA_BREED)

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);

  });

  it('incorrect value', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM2_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_BREED_PURCHASE);
    await tx1.wait();
    // 
    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_BREED, { value: ITEM1_ETHER_PRICE });

    expect(purchaseResult)
    .to
    .emit(vm, 'EtherPurchase')
    .withArgs("from", ROOT_ACCOUNT)
    .withArgs("itemId", "" + ITEM1_ID)
    .withArgs("value", "" + ITEM1_ETHER_PRICE)
    .withArgs("itemType", "" +  ITEMTYPE_BREED_PURCHASE)
    .withArgs("varData", VARDATA_BREED)

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);

  });


});

describe("upsertInventoryItem",  function () {

  it("basic addItem", async function () {
    const { vm } = await loadFixture(deployTokenFixture);

    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    const tx2 = await vm.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);

    // wait until the transaction is mined
    await tx1.wait();
    await tx2.wait();

    const readtx = await vm.itemIds.call("0", 0); // weird bug where this takes 1 argument but for some reason i need to put to in order for it to think it has one
    const readtx2 = await vm.itemIds.call("0", 1);
    expect(readtx).to.equal("" + ITEM1_ID);
    expect(readtx2).to.equal("" + ITEM2_ID);
  })

  it("totalItems", async function () {
    const { vm } = await loadFixture(deployTokenFixture);

    const tx1 = await vm.upsertInventoryItem(ITEM1_ID+2, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    const tx2 = await vm.upsertInventoryItem(ITEM2_ID+2, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);

    // wait until the transaction is mined
    await tx1.wait();
    await tx2.wait();

    expect(await vm.totalItems.call()).to.equal(2);


  });

  it("add item with 0 ETH price and 0 SEED price", async function () {
    const { vm } = await loadFixture(deployTokenFixture);

    await expect(
      vm.upsertInventoryItem(ITEM1_ID, ITEM0_SEED_PRICE, ITEM0_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE)).to.be.revertedWith("Eth price or Seed price must be greater than zero");


  });

  it("adding with 0 quanitity", async function () {
    const { vm } = await loadFixture(deployTokenFixture);

    await expect(
      vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 0, ITEMTYPE_FLOWER_PURCHASE)).to.be.revertedWith("Quantity must be greater than zero");

  });

  it("adding with wrong item type", async function () {
    const { vm } = await loadFixture(deployTokenFixture);

    await expect(
      vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, 25)).to.be.revertedWith("Must be defined item type: 0 is FLOWER, 1 is ITEM");

  });
});


describe('deleteInventoryItem', function() {
  it('basic delete', async function() {
    const { vm } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    const tx2 = await vm.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
    const tx3 = await vm.upsertInventoryItem(ITEM2_ID+1, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
    // wait until the transaction is mined
    await tx1.wait();
    await tx2.wait();
    await tx3.wait()
    const readtx = await vm.itemIds.call("0", 0); // weird bug where this takes 1 argument but for some reason i need to put to in order for it to think it has one
    
    const result = await vm.deleteInventoryItem(ITEM1_ID); // this either says there is 0 arg or 2 args regardless of the number of arguments
    const readtx3 = await vm.itemIds.call("0", 0);
    const readtx4 = await vm.itemIds.call("0", 1);

    expect(readtx3).to.equal(ITEM2_ID+1);
    expect(readtx4).to.equal(ITEM2_ID)
  });

  it('delete with only one item in the VM', async function() {
    const { vm } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    // wait until the transaction is mined
    await tx1.wait();

    const readtx = await vm.itemIds.call("0", 0); // weird bug where this takes 1 argument but for some reason i need to put to in order for it to think it has one
    

    const result = await vm.deleteInventoryItem(ITEM1_ID); // this either says there is 0 arg or 2 args regardless of the number of arguments
    const readtx3 = await vm.totalItems.call();



    expect(readtx3).to.equal(0);

  });

  it('delete with only 2 items', async function() {
    const { vm } = await loadFixture(deployTokenFixture);
    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    const tx2 = await vm.upsertInventoryItem(ITEM2_ID, ITEM2_SEED_PRICE, ITEM2_ETHER_PRICE, 2, ITEMTYPE_FLOWER_PURCHASE);
    // wait until the transaction is mined
    await tx1.wait();
    await tx2.wait();
    const readtx = await vm.itemIds.call("0", 0); // weird bug where this takes 1 argument but for some reason i need to put to in order for it to think it has one

    const result = await vm.deleteInventoryItem(ITEM1_ID); // this either says there is 0 arg or 2 args regardless of the number of arguments
    const readtx3 = await vm.itemIds.call("0", 0);
    const readtx4 = await vm.totalItems.call();

    expect(readtx3).to.equal(ITEM2_ID);
    expect(readtx4).to.equal(1)
  });

  it('delete item that does not exist or when no items exist', async function() {
    const { vm } = await loadFixture(deployTokenFixture);

    await expect(
      vm.deleteInventoryItem(ITEM1_ID)).to.be.revertedWith("Inventory entry does not exist");


    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    // wait until the transaction is mined
    await tx1.wait();

    const readtx = await vm.itemIds.call("0", 0); // weird bug where this takes 1 argument but for some reason i need to put to in order for it to think it has one
    

    await expect(
      vm.deleteInventoryItem(ITEM2_ID)).to.be.revertedWith("Inventory entry does not exist");


  });

});


describe('withdrawEther', function() {

  it('basic', async function() {
    const { vm, ROOT_ACCOUNT, provider } = await loadFixture(deployTokenFixture);

    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    await tx1.wait();

    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_NONE, { value: ITEM1_ETHER_PRICE });
    await purchaseResult.wait();

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);


    const balanceBefore = await provider.getBalance(vm.address)

    const widrawResult = await vm.withdrawEther(ITEM1_ETHER_PRICE);

    const balanceAfter = await provider.getBalance(vm.address)

    expect(""+ (-1 * balanceAfter.sub(balanceBefore)))
    .to
    .equal("" + ITEM1_ETHER_PRICE);

  });

  it('no privileges', async function() {
    const { vm, ROOT_ACCOUNT, provider, addr1 } = await loadFixture(deployTokenFixture);

    const tx1 = await vm.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE, ITEM1_ETHER_PRICE, 1, ITEMTYPE_FLOWER_PURCHASE);
    await tx1.wait();

    const purchaseResult = await vm.etherPurchase(ITEM1_ID, VARDATA_NONE, { value: ITEM1_ETHER_PRICE });
    await purchaseResult.wait();

    expect(await provider.getBalance(vm.address)).to.equal("" + ITEM1_ETHER_PRICE);
    // should revert with a string reason if you try and purchase a 0 value item in the store.
      await expect(
        vm.withdrawEther(ITEM1_ETHER_PRICE, { from: addr1 })).to.be.reverted;

  });
});


describe('Breed ETH', function() {

  it('Basic Natic Breed', async function() {
    const { vm, ROOT_ACCOUNT, addr1, provider } = await loadFixture(deployTokenFixture);

    const bredeeBalance = await provider.getBalance(addr1.address)
    const purchaseResult = await vm.breedEth(addr1.address, VARDATA_BREED, { value: BREED_ETH_PRICE });

    expect(purchaseResult)
    .to
    .emit(vm, 'BreedEth')
    .withArgs("breeder", ROOT_ACCOUNT)
    .withArgs("breedee", addr1.address)
    .withArgs("value",  BREED_ETH_PRICE)
    .withArgs("varData", VARDATA_BREED)

    expect(await provider.getBalance(vm.address)).to.equal( BREED_ETH_NUGBASE); 

    expect(await provider.getBalance(addr1.address)).to.equal( BigNumber.from(BREED_ETH_BREEDEE).add(bredeeBalance));


  });

  it('Not Enough ETH', async function() {
    const { vm, ROOT_ACCOUNT, addr1, provider } = await loadFixture(deployTokenFixture);

    await expect(
      vm.breedEth(addr1.address, VARDATA_BREED, { value: BREED_ETH_NUGBASE })).to.be.revertedWith("Not enough ETH");

  });
});
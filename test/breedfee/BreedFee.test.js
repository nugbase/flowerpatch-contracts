const BigNumber = web3.BigNumber;
const BreedFee = artifacts.require('BreedFee.sol');
const ERC20Mock = artifacts.require('ERC20Mock.sol');
const VendingMachine = artifacts.require('VendingMachine.sol');
const { assertRevert } = require('../helpers/assertRevert');
const { measureWeiDelta } = require('../helpers/measureWeiDelta');

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('BreedFee', function(accounts) {
    const CREATOR_ACCOUNT = accounts[0];
    const OTHER_ACCOUNT = accounts[1];

    const INITIAL_BREEDEE_FEE = 2000000000000000;

    const ITEM1_ID = 33;
    const ITEM1_SEED_PRICE = 100;
    const ITEM1_ETHER_PRICE = 10000000000000000;
    const ITEMTYPE_FLOWER_PURCHASE = 0;
    const ITEMTYPE_BREED_PURCHASE = 1;
    const VARDATA_NONE = '';
    const VARDATA_BREED = 'FLOWERPATCH TEST YO';

    let breedFee;
    let vendingMachine;
    let seed;

    beforeEach(async function() {
        seed = await ERC20Mock.new();
        vendingMachine = await VendingMachine.new(seed.address);
        breedFee = await BreedFee.new(vendingMachine.address);

        await vendingMachine.upsertInventoryItem(ITEM1_ID, ITEM1_SEED_PRICE,
            ITEM1_ETHER_PRICE, 1, ITEMTYPE_BREED_PURCHASE);
    });

    describe('breedeeFee', function() {
        it('get fee', async function() {
            const fee = await breedFee.breedeeFee();
            fee.should.be.bignumber.equal(INITIAL_BREEDEE_FEE);
        });

        it('set fee', async function() {
            await breedFee.setBreedeeFee(15000000000000000);
            const fee = await breedFee.breedeeFee();
            fee.should.be.bignumber.equal(15000000000000000);
        });

        it('set fee - no permissions', async function() {
            await assertRevert(breedFee.setBreedeeFee(15000000000000000, {
                from: OTHER_ACCOUNT
            }));
            const fee = await breedFee.breedeeFee();
            fee.should.be.bignumber.equal(INITIAL_BREEDEE_FEE);
        });
    });

    describe('breed', function() {
        it('basic', async function() {
            const weiDelta = await measureWeiDelta(OTHER_ACCOUNT, async function() {
                await breedFee.breed(OTHER_ACCOUNT, ITEM1_ID, VARDATA_BREED, {
                    from: CREATOR_ACCOUNT,
                    value: ITEM1_ETHER_PRICE + INITIAL_BREEDEE_FEE,
                });
            });
            weiDelta.should.be.bignumber.equal(INITIAL_BREEDEE_FEE);
        });

        it('basic - no permissions', async function() {
            const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
                await breedFee.breed(CREATOR_ACCOUNT, ITEM1_ID, VARDATA_BREED, {
                    from: OTHER_ACCOUNT,
                    value: ITEM1_ETHER_PRICE + INITIAL_BREEDEE_FEE,
                });
            });
            weiDelta.should.be.bignumber.equal(INITIAL_BREEDEE_FEE);
        });

        it('wrong payment amount', async function() {
            await assertRevert(breedFee.breed(OTHER_ACCOUNT, ITEM1_ID, VARDATA_BREED, {
                from: CREATOR_ACCOUNT,
                value: ITEM1_ETHER_PRICE,
            }));

            await assertRevert(breedFee.breed(OTHER_ACCOUNT, ITEM1_ID, VARDATA_BREED, {
                from: CREATOR_ACCOUNT,
                value: 100000000,
            }));

            await assertRevert(breedFee.breed(OTHER_ACCOUNT, ITEM1_ID, VARDATA_BREED, {
                from: CREATOR_ACCOUNT,
                value: 0,
            }));
        });

        it('invalid item id', async function() {
            await assertRevert(breedFee.breed(OTHER_ACCOUNT, 666, VARDATA_BREED, {
                from: CREATOR_ACCOUNT,
                value: ITEM1_ETHER_PRICE + INITIAL_BREEDEE_FEE,
            }));

            await assertRevert(breedFee.breed(OTHER_ACCOUNT, 0, VARDATA_BREED, {
                from: CREATOR_ACCOUNT,
                value: ITEM1_ETHER_PRICE + INITIAL_BREEDEE_FEE,
            }));

            await assertRevert(breedFee.breed(OTHER_ACCOUNT, -1, VARDATA_BREED, {
                from: CREATOR_ACCOUNT,
                value: ITEM1_ETHER_PRICE + INITIAL_BREEDEE_FEE,
            }));
        });
    });

    describe('withdraw', function() {
        it('basic permissions', async function() {
            await assertRevert(breedFee.withdraw({ from: OTHER_ACCOUNT }));
            await breedFee.withdraw({ from: CREATOR_ACCOUNT });
        });
    });
});

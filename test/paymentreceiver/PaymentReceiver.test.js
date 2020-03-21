const BigNumber = web3.BigNumber;
const ERC20Mock = artifacts.require('ERC20Mock.sol');
const PaymentReceiver = artifacts.require('PaymentReceiver.sol');
const { assertRevert } = require('../helpers/assertRevert');
const { measureWeiDelta } = require('../helpers/measureWeiDelta');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('PaymentReceiver', function(accounts) {
  const ROOT_ACCOUNT = accounts[0];
  const RANDOM_ACCOUNT = accounts[1];

  const PAYMENT_ID1 = 1001;

  let seed;
  let receiver;

  beforeEach(async function() {
    seed = await ERC20Mock.new();
    receiver = await PaymentReceiver.new(seed.address);
  });

  describe('seedPayment', function() {
    beforeEach(async function() {
      await seed.mintForMe(1000);
    });

    it('basic', async function() {
      await seed.approve(receiver.address, 1000);
      const paymentResult = await receiver.seedPayment(PAYMENT_ID1, 1000);
      const event1 = paymentResult.logs[0];
      event1.event.should.equal('SeedPayment');
      event1.args.from.should.equal(ROOT_ACCOUNT);
      event1.args.paymentId.should.bignumber.equal(PAYMENT_ID1);
      event1.args.value.should.bignumber.equal(1000);
      (await seed.balanceOf(receiver.address)).should.be.bignumber.equal(1000);
    });

    it('no approval', async function() {
      await assertRevert(receiver.seedPayment(PAYMENT_ID1, 1000));
    });

    it('insufficient approval', async function() {
      await seed.approve(receiver.address, 999);
      await assertRevert(receiver.seedPayment(PAYMENT_ID1, 1000));
    });
  });

  describe('etherPayment', function() {
    it('basic', async function() {
      const paymentResult = await receiver.etherPayment(PAYMENT_ID1, { value: 1000 });
      const event1 = paymentResult.logs[0];
      event1.event.should.equal('EtherPayment');
      event1.args.from.should.equal(ROOT_ACCOUNT);
      event1.args.paymentId.should.bignumber.equal(PAYMENT_ID1);
      event1.args.value.should.bignumber.equal(1000);
      (await web3.eth.getBalance(receiver.address)).should.be.bignumber.equal(1000);
    });
  });

  describe('withdrawSeed', function() {
    beforeEach(async function() {
      await seed.mintForMe(1000);
      await seed.transfer(receiver.address, 1000);
      (await seed.balanceOf(receiver.address)).should.be.bignumber.equal(1000);
    });

    it('basic', async function() {
      await receiver.withdrawSeed(1000);
      (await seed.balanceOf(ROOT_ACCOUNT)).should.be.bignumber.equal(1000);
    });

    it('no privileges', async function() {
      await assertRevert(receiver.withdrawSeed(1000, { from: RANDOM_ACCOUNT }));
    });
  });

  describe('withdrawEther', function() {
    beforeEach(async function() {
      await receiver.etherPayment(PAYMENT_ID1, { value: 1000 });
      (await web3.eth.getBalance(receiver.address)).should.be.bignumber.equal(1000);
    });

    it('basic', async function() {
      const weiDelta = await measureWeiDelta(ROOT_ACCOUNT, async function() {
        await receiver.withdrawEther(1000, { gasPrice: 0 });
      });
      weiDelta.should.be.bignumber.equal(1000);
    });

    it('no privileges', async function() {
      await assertRevert(receiver.withdrawEther(1000, { from: RANDOM_ACCOUNT }));
    });
  });
});

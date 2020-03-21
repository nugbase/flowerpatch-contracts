const BigNumber = web3.BigNumber;
const SeedToken = artifacts.require('SeedToken.sol');
const { assertRevert } = require('../helpers/assertRevert');
const { measureWeiDelta } = require('../helpers/measureWeiDelta');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('SeedToken', function(accounts) {
  const CREATOR_ACCOUNT = accounts[0];
  const OTHER_ACCOUNT = accounts[1];

  // Privileges
  const PRIV_ROOT = 1;

  let seed;

  beforeEach(async function() {
    seed = await SeedToken.new();
  });

  describe('deposit', function() {
    it('1 eth', async function() {
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await seed.deposit({ value: web3.toWei(1, 'ether'), gasPrice: 0 });
      });
      weiDelta.should.be.bignumber.equal(web3.toWei(-1, 'ether'));
      const balance = await seed.balanceOf(CREATOR_ACCOUNT);
      balance.should.be.bignumber.equal(9700);
    });

    it('1/1000 (or 0.001) eth with round-down', async function() {
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await seed.deposit({ value: web3.toWei(1, 'milli'), gasPrice: 0 });
      });
      weiDelta.should.be.bignumber.equal(web3.toWei(-0.001, 'ether'));
      const balance = await seed.balanceOf(CREATOR_ACCOUNT);
      // 1/1000th of an Ether should yield 9.7 SEED, or 9 since we round down
      balance.should.be.bignumber.equal(9);
    });
  });

  describe('withdraw', function() {
    it('full balance', async function() {
      await seed.deposit({ value: web3.toWei(1, 'ether') });
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await seed.withdraw(9700, { gasPrice: 0 });
      });
      weiDelta.should.be.bignumber.equal(web3.toWei(0.97, 'ether'));
    });

    it('no overdraw', async function() {
      await seed.deposit({ value: web3.toWei(1, 'ether') });
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await assertRevert(seed.withdraw(9701, { gasPrice: 0 }));
      });
      weiDelta.should.be.bignumber.equal(0);
    });
  });

  describe('withdrawWei', function() {
    it('full balance', async function() {
      await seed.deposit({ value: web3.toWei(1, 'ether') });
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await seed.withdrawWei(web3.toWei(0.03, 'ether'), { gasPrice: 0 });
      });
      // No more left to withdraw
      (await seed.availableWeiToWithdraw()).should.be.bignumber.equal(0);
    });

    it('no overdraw', async function() {
      await seed.deposit({ value: web3.toWei(1, 'ether') });
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await assertRevert(seed.withdrawWei(web3.toWei(0.03000001, 'ether'), { gasPrice: 0 }));
      });
      weiDelta.should.be.bignumber.equal(0);
    });

    it('requires privilege', async function() {
      await seed.deposit({ value: web3.toWei(1, 'ether') });
      await assertRevert(seed.withdrawWei(web3.toWei(0.0001, 'ether'), { from: accounts[1], gasPrice: 0 }));
    });
  });

  describe('availableWeiToWithdraw', function() {
    it('1 ether deposit', async function() {
      await seed.deposit({ value: web3.toWei(1, 'ether') });
      (await seed.availableWeiToWithdraw()).should.be.bignumber.equal(web3.toWei(0.03, 'ether'));
    });
  });

  describe('setSeedPerEther', function() {
    it('1 eth', async function() {
      await seed.setSeedPerEther(9500);
      const weiDelta = await measureWeiDelta(CREATOR_ACCOUNT, async function() {
        await seed.deposit({ value: web3.toWei(1, 'ether'), gasPrice: 0 });
      });
      weiDelta.should.be.bignumber.equal(web3.toWei(-1, 'ether'));
      const balance = await seed.balanceOf(CREATOR_ACCOUNT);
      balance.should.be.bignumber.equal(9500);
    });

    it('no exceeding 10k SEED per Ether', async function() {
      await assertRevert(seed.setSeedPerEther(10001));
    });

    it('requires privilege', async function() {
      await assertRevert(seed.setSeedPerEther(9500, { from: OTHER_ACCOUNT }));
    });
  });
});

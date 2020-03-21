const BigNumber = web3.BigNumber;
const ERC20MultisendMock = artifacts.require('ERC20MultisendMock.sol');
const { assertRevert } = require('../helpers/assertRevert')

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('ERC20MultisendMock', function(accounts) {
  const rootAccount = accounts[0];

  let multisendMock;

  beforeEach(async function() {
    multisendMock = await ERC20MultisendMock.new();
    await multisendMock.mintForMe(1000);
  });

  describe('basic', function() {
    it('send to two', async function() {
      await multisendMock.multisend([accounts[1], accounts[2]], [100, 150]);
      (await multisendMock.balanceOf(accounts[0])).should.be.bignumber.equal(1000-100-150);
      (await multisendMock.balanceOf(accounts[1])).should.be.bignumber.equal(100);
      (await multisendMock.balanceOf(accounts[2])).should.be.bignumber.equal(150);
    });

    it('not enough funds', async function() {
      await assertRevert(multisendMock.multisend([accounts[1], accounts[2]], [800, 700]));
    });
  });
});

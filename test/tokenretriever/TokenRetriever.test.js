const BigNumber = web3.BigNumber;
const ERC20Mock = artifacts.require('ERC20Mock.sol');
const TokenRetrieverMock = artifacts.require('TokenRetrieverMock.sol');
const { assertRevert } = require('../helpers/assertRevert');

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('TokenRetriever', function(accounts) {
  const CREATOR_ACCOUNT = accounts[0];
  const RANDOM_ACCOUNT = accounts[1];

  let token;
  let retriever;

  beforeEach(async function() {
    token = await ERC20Mock.new();
    await token.mintForMe(1000);
    retriever = await TokenRetrieverMock.new();
    await token.transfer(retriever.address, 1000);
    (await token.balanceOf(retriever.address)).should.be.bignumber.equal(1000);
  });

  describe('invokeErc20Transfer', function() {
    it('basic', async function() {
      await retriever.invokeErc20Transfer(token.address, RANDOM_ACCOUNT, 1000);
      (await token.balanceOf(RANDOM_ACCOUNT)).should.be.bignumber.equal(1000);
    });

    it('no privileges', async function() {
      await assertRevert(retriever.invokeErc20Transfer(token.address, RANDOM_ACCOUNT, 1000, { from: RANDOM_ACCOUNT }));
    });
  });
});

const BigNumber = web3.BigNumber;
const Flower = artifacts.require('Flower.sol');
const RemoteTokenURIProviderMock = artifacts.require('RemoteTokenURIProviderMock.sol');
const { assertRevert } = require('../helpers/assertRevert')

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Flower', function(accounts) {
  const TOKEN_DATA_1 = '0x8BADF00D'.toLowerCase();
  const TOKEN_DATA_2 = '0xB16B00B5BABECAFE'.toLowerCase();
  const TOKEN_ID_NONEXISTENT = 999999999999;
  const CREATOR_ACCOUNT = accounts[0];

  // Privileges
  const PRIV_ROOT = 1;
  const PRIV_MINT = 2;

  describe('Mint permissions', function() {
    const ROOT_ACCOUNT = accounts[1];

    let flower;

    beforeEach(async function() {
      flower = await Flower.new();
      await flower.grantPrivileges(ROOT_ACCOUNT, PRIV_ROOT);
    });

    it('ROOT_ACCOUNT has only PRIV_ROOT and cannot mint', async function() {
      await assertRevert(flower.mint(CREATOR_ACCOUNT, TOKEN_DATA_1, { from: ROOT_ACCOUNT }));
    });

    it('CREATOR_ACCOUNT has PRIV_MINT and can mint', async function() {
      await flower.mint(CREATOR_ACCOUNT, TOKEN_DATA_1);
    });
  });

  describe('Public token info', function() {
    const NORMAL_ACCOUNT = accounts[1];

    let flower;
    let tokenId1;
    let tokenId2;

    before(async function() {
      flower = await Flower.new();
      tokenId1 = tokenIdFromMintTx(await flower.mint(CREATOR_ACCOUNT, TOKEN_DATA_1));
      tokenId2 = tokenIdFromMintTx(await flower.mint(NORMAL_ACCOUNT, TOKEN_DATA_2));
    });

    describe('tokenData', function() {
      it('token 2 data', async function() {
        const actualData = await flower.tokenData(tokenId2);
        actualData.should.equal(TOKEN_DATA_2);
      });

      it('nonexistent token data', async function() {
        await assertRevert(flower.tokenData(TOKEN_ID_NONEXISTENT));
      });
    });

    describe('ownerOf', function() {
      it('token 1', async function() {
        const actualOwner = await flower.ownerOf(tokenId1);
        actualOwner.should.equal(CREATOR_ACCOUNT);
      });

      it('token 2', async function() {
        const actualOwner = await flower.ownerOf(tokenId2);
        actualOwner.should.equal(NORMAL_ACCOUNT);
      });
    });
  });

  describe('Remote metadata / tokenURI', function() {
    let flower;
    let tokenId1;
    let tokenId2;

    beforeEach(async function() {
      flower = await Flower.new();
      tokenId1 = tokenIdFromMintTx(await flower.mint(CREATOR_ACCOUNT, TOKEN_DATA_1));
    });

    describe('no remote metadata contract set', function() {
      it('valid token should have empty tokenURI', async function() {
        const actualUri = await flower.tokenURI(tokenId1);
        actualUri.should.equal("");
      });

      it('nonexistent token should revert', async function() {
        await assertRevert(flower.tokenURI(TOKEN_ID_NONEXISTENT));
      });
    });

    describe('with remote metadata contract', function() {
      beforeEach(async function() {
        const remoteTokenUriContract = await RemoteTokenURIProviderMock.new();
        await flower.setRemoteTokenUriAddress(remoteTokenUriContract.address);
      });

      it('valid token should have a non-empty tokenURI', async function() {
        const actualUri = await flower.tokenURI(tokenId1);
        actualUri.should.equal("mock_uri");
      });

      it('nonexistent token should revert', async function() {
        await assertRevert(flower.tokenURI(TOKEN_ID_NONEXISTENT));
      });
    });

    describe('PRIV_ROOT required to set the metadata contract address', function() {
      const NORMAL_ACCOUNT = accounts[1];
      const SOME_ADDRESS = accounts[2];

      it('with root', async function() {
        await flower.setRemoteTokenUriAddress(SOME_ADDRESS);
      });

      it('without root', async function() {
        await assertRevert(flower.setRemoteTokenUriAddress(SOME_ADDRESS, { from: NORMAL_ACCOUNT }));
      });
    });
  });
});

function tokenIdFromMintTx(tx) {
  tx.logs.should.have.length(1);
  const log = tx.logs[0];
  log.event.should.equal('Transfer');
  log.args.should.have.any.keys('_tokenId');
  return log.args['_tokenId'];
}
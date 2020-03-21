const BigNumber = web3.BigNumber;
const PrivilegedMock = artifacts.require('PrivilegedMock.sol');
const { assertRevert } = require('../helpers/assertRevert')

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Privileged', function(accounts) {
  const rootAccount = accounts[0];
  const otherAccount = accounts[1];
  const bothAccount = accounts[2];

  // Privileges
  const PRIV_ROOT = 1;
  const PRIV_OTHER = 2;

  let privilegedMock;

  beforeEach(async function() {
    privilegedMock = await PrivilegedMock.new({ from: rootAccount });
    await privilegedMock.grantPrivileges(otherAccount, PRIV_OTHER);
    await privilegedMock.grantPrivileges(bothAccount, PRIV_ROOT|PRIV_OTHER);
  });

  describe('Mock method checks', function() {
    context('Has privileges', function() {
      it('needsRoot by rootAccount', async function() {
        await privilegedMock.needsRoot({ from: rootAccount });
      });
      it('needsRoot by bothAccount', async function() {
        await privilegedMock.needsRoot({ from: bothAccount });
      });
      it('needsOther by otherAccount', async function() {
        await privilegedMock.needsOther({ from: otherAccount });
      });
      it('needsOther by bothAccount', async function() {
        await privilegedMock.needsOther({ from: bothAccount });
      });
      it('needsBoth by bothAccount', async function() {
        await privilegedMock.needsBoth({ from: bothAccount });
      });
    });
    context('Lacks privileges', function() {
      it('needsRoot by otherAccount', async function() {
        await assertRevert(privilegedMock.needsRoot({ from: otherAccount }));
      });
      it('needsOther by rootAccount', async function() {
        await assertRevert(privilegedMock.needsOther({ from: rootAccount }));
      });
      it('needsBoth by rootAccount', async function() {
        await assertRevert(privilegedMock.needsBoth({ from: rootAccount }));
      });
      it('needsBoth by otherAccount', async function() {
        await assertRevert(privilegedMock.needsBoth({ from: otherAccount }));
      });
    });
  });

  describe('removePrivileges', function() {
    it('Cannot remove privileges from self', async function() {
      await assertRevert(privilegedMock.removePrivileges(rootAccount, PRIV_ROOT, { from: rootAccount }));
    });
    it('rootAccount removes all privileges from bothAccount', async function() {
      await privilegedMock.removePrivileges(bothAccount, PRIV_ROOT|PRIV_OTHER, { from: rootAccount });
      await assertRevert(privilegedMock.needsRoot({ from: bothAccount }));
      await assertRevert(privilegedMock.needsOther({ from: bothAccount }));
    });
  });
});

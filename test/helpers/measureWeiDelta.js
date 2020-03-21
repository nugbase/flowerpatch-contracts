async function measureWeiDelta(account, f) {
  const balanceBefore = await web3.eth.getBalance(account);
  await f()
  const balanceAfter = await web3.eth.getBalance(account);
  return balanceAfter.minus(balanceBefore);
}

module.exports = {
  measureWeiDelta,
};

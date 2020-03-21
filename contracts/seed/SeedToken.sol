pragma solidity ^0.4.24;

import "../erc20/ERC20.sol";
import "../erc20/ERC20Multisend.sol";
import "../privileged/Privileged.sol";
import "../tokenretriever/TokenRetriever.sol";

/**
 * 84cd5d54a21df1c1fe5129e6989381be057d26a4994f1bfc26593c1f8dd19f4b
 */

contract SeedToken is ERC20, ERC20Multisend, Privileged, TokenRetriever {
    // Privileges
    uint8 constant PRIV_ROOT = 1;

    uint256 seedPerEther;

    constructor() public ERC20("SeedToken", "SEED", 0) Privileged(PRIV_ROOT) TokenRetriever(PRIV_ROOT) {
        seedPerEther = 9700;
    }

    function deposit() external payable {
        _mint(msg.sender, _weiToSeed(msg.value));
    }

    function withdraw(uint256 _numSeed) external {
        _burn(msg.sender, _numSeed); // Ensures sufficient balance
        msg.sender.transfer(_seedToWei(_numSeed));
    }

    function withdrawWei(uint256 _amount) external requirePrivileges(PRIV_ROOT) {
        // Ensure that there is always enough in reserve for all possible withdrawals.
        require(_amount <= availableWeiToWithdraw());
        msg.sender.transfer(_amount);
    }

    function availableWeiToWithdraw() public view returns (uint256) {
        return address(this).balance - _weiInReserve();
    }

    function setSeedPerEther(uint256 _amount) external requirePrivileges(PRIV_ROOT) {
        require(_amount <= 10000);
        seedPerEther = _amount;
    }

    function _weiInReserve() internal view returns (uint256) {
        return _seedToWei(totalSupply);
    }

    function _weiToSeed(uint256 _numWei) internal view returns (uint256) {
        return _numWei * seedPerEther / 1 ether;
    }

    // No fee for withdrawals
    function _seedToWei(uint256 _numSeed) internal pure returns (uint256) {
        return _numSeed * 1 ether / 10000;
    }
}

pragma solidity ^0.4.24;

import "../erc20/ERC20TokenInterface.sol";
import "../privileged/Privileged.sol";

/**
 * Used to retrieve ERC20 tokens that were accidentally sent to our contracts.
 */
contract TokenRetriever is Privileged {
  uint8 internal retrieveTokensFromContractPrivilege;

  constructor(uint8 _retrieveTokensFromContractPrivilege) internal {
    retrieveTokensFromContractPrivilege = _retrieveTokensFromContractPrivilege;
  }

  function invokeErc20Transfer(address _tokenContract, address _destination, uint256 _amount) external requirePrivileges(retrieveTokensFromContractPrivilege) {
      ERC20TokenInterface(_tokenContract).transfer(_destination, _amount);
  }
}

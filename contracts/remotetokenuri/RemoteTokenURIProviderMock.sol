pragma solidity ^0.4.24;

import "./RemoteTokenURIProvider.sol";

/**
 * Test mock for RemoteTokenURIProvider.
 */
contract RemoteTokenURIProviderMock is RemoteTokenURIProvider {
  function tokenURI(uint256) public view returns (string) {
    return "mock_uri";
  }
}

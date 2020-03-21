pragma solidity ^0.4.24;

import "./TokenRetriever.sol";
import "../privileged/PrivilegedMock.sol";

contract TokenRetrieverMock is TokenRetriever, PrivilegedMock {
  constructor() public TokenRetriever(PRIV_ROOT) {
  }
}

pragma solidity ^0.4.24;

import "../privileged/Privileged.sol";

contract PrivilegedMock is Privileged {
  uint8 constant PRIV_ROOT = 1;
  uint8 constant PRIV_OTHER = 2;

  // This is just here to cause the functions to do state changes (to not have to mark them as "view")
  string lastCall;

  constructor() public Privileged(PRIV_ROOT) {
  }

  function needsRoot() public requirePrivileges(PRIV_ROOT) {
    lastCall = "root";
  }

  function needsOther() public requirePrivileges(PRIV_OTHER) {
    lastCall = "other";
  }

  function needsBoth() public requirePrivileges(PRIV_ROOT|PRIV_OTHER) {
    lastCall = "both";
  }
}

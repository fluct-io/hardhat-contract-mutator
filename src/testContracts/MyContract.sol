pragma solidity ^0.8.0;

contract MyContract {
    uint256 constant myConstant = 42;

    function getMyConstant() public view returns (uint256) {
        return myConstant;
    }
}

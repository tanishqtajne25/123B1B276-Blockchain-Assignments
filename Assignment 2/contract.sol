// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {

    uint256 private data;

    // Store value
    function set(uint256 _data) public {
        data = _data;
    }

    // Retrieve value
    function get() public view returns (uint256) {
        return data;
    }
}
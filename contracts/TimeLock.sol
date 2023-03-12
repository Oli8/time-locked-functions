// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract TimeLock {
    uint256 private _timeLockDuration;

    mapping(address => uint256) private _timestamps;

    constructor(uint256 timeLockDuration) {
        _timeLockDuration = timeLockDuration;
    }

    modifier timeLocked() {
        address caller = msg.sender;
        require(
            block.timestamp > _timestamps[caller],
            "TimeLock: Account under timelock"
        );
        _timestamps[caller] = block.timestamp + _timeLockDuration;
        _;
    }
}

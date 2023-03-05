// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Vault {
    uint256 constant private _WITHDRAW_AMOUNT = 0.1 ether;

    function deposit() external payable { }

    function withdraw() external {
        require(
            address(this).balance >= _WITHDRAW_AMOUNT,
            "Insufficient funds"
        );

        _transferEth(msg.sender, _WITHDRAW_AMOUNT);
    }

    function _transferEth(address to, uint256 amount) private {
        (bool sent,) = to.call{value: amount}("");
        require(sent, "Transfer failed");
    }
}

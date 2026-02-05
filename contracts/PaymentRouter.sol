// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract PaymentRouter {

    address public owner;
    address public feeWallet;
    uint256 public feePercent = 1; // 1%

    IERC20 public aspToken;

    constructor(address _tokenAddress, address _feeWallet) {
        owner = msg.sender;
        aspToken = IERC20(_tokenAddress);
        feeWallet = _feeWallet;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setFeePercent(uint256 _fee) external onlyOwner {
        require(_fee <= 5, "Max 5%");
        feePercent = _fee;
    }

    function setFeeWallet(address _wallet) external onlyOwner {
        feeWallet = _wallet;
    }

    function pay(address recipient, uint256 amount) external {
        require(amount > 0, "Invalid amount");

        uint256 fee = (amount * feePercent) / 100;
        uint256 remaining = amount - fee;

        // Pull tokens from sender to this contract
        require(
            aspToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Send fee to FinTroop wallet
        require(
            aspToken.transfer(feeWallet, fee),
            "Fee transfer failed"
        );

        // Send remaining to recipient
        require(
            aspToken.transfer(recipient, remaining),
            "Payment failed"
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract AchinToken is ERC20, ERC20Burnable, Ownable, Pausable {

    uint256 public maxTxAmount; // max transfer limit

    constructor()
        ERC20("Achin", "AcP")        // Token Name + Symbol
        Ownable(msg.sender)          // Required for OZ 5.x
    {
        // Mint initial supply to owner
        _mint(msg.sender, 1_000_000 * 10 ** decimals());

        // Set default max transaction limit (10,000 tokens)
        maxTxAmount = 10_000 * 10 ** decimals();
    }

    // Pause all transfers
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause transfers
    function unpause() external onlyOwner {
        _unpause();
    }

    // Owner can mint new tokens
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Set max allowed transfer amount
    function setMaxTxAmount(uint256 amount) external onlyOwner {
        maxTxAmount = amount;
    }

    // --- INTERNAL OVERRIDE ---
    function _update(address from, address to, uint256 amount)
        internal
        override
        whenNotPaused
    {
        // Apply max transaction rule (skip mint/burn)
        if (from != address(0) && to != address(0)) {
            require(amount <= maxTxAmount, "Transfer exceeds max limit");
        }

        super._update(from, to, amount);
    }
}

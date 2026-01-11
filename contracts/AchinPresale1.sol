// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title AchinPresale — Simple ETH -> AcP presale contract
/// @notice Owner must deposit tokens to this contract before starting sale.
/// @dev pricePerToken is expressed in wei per token unit (1 token = 10**decimals).
contract AchinPresale is Ownable {

    IERC20 public token;                // AcP token
    address public fundsRecipient;      // where collected ETH will be withdrawn to (owner can change)

    uint256 public pricePerTokenWei;    // how many wei for 1 token unit (1 token = 10**decimals)
    uint256 public capTokens;           // sale cap (in token smallest units, i.e., includes decimals)
    uint256 public soldTokens;          // amount sold so far (in token smallest units)

    bool public started = false;
    uint256 public minPurchaseWei = 0;  // optional min buy in wei
    uint256 public maxPurchaseWei = type(uint256).max; // optional max buy in wei

    event SaleStarted();
    event SaleStopped();
    event TokenBought(address indexed buyer, uint256 weiPaid, uint256 tokensBought);
    event WithdrawETH(address indexed to, uint256 amount);
    event WithdrawUnsoldTokens(address indexed to, uint256 amount);
    event PriceUpdated(uint256 newPriceWei);
    event CapUpdated(uint256 newCapTokens);
    event FundsRecipientUpdated(address newRecipient);
    event PurchaseLimitsUpdated(uint256 minWei, uint256 maxWei);

    /// @param _tokenAddress address of Achin token (ERC20)
    /// @param _pricePerTokenWei price in wei for 1 token (1 token = 10**decimals)
    /// @param _fundsRecipient address to receive collected ETH
    /// @param _capWholeTokens cap in whole tokens (will be multiplied by token decimals)
    constructor(
        address _tokenAddress,
        uint256 _pricePerTokenWei,
        address _fundsRecipient,
        uint256 _capWholeTokens
    ) Ownable(msg.sender) {
        require(_tokenAddress != address(0), "Zero token");
        require(_fundsRecipient != address(0), "Zero recipient");
        require(_pricePerTokenWei > 0, "Price must be > 0");
        token = IERC20(_tokenAddress);
        pricePerTokenWei = _pricePerTokenWei;
        fundsRecipient = _fundsRecipient;

        // compute cap in smallest units using token decimals if possible (safe with 18)
        // We assume standard ERC20 with 18 decimals. If token has different decimals, pass cap adjusted accordingly.
        capTokens = _capWholeTokens * (10 ** 18);
    }

    /// @notice Buy tokens by sending ETH. Tokens are sent from this contract's balance.
    /// @dev tokensBought = (msg.value * (10**decimals)) / pricePerTokenWei
    function buyTokens() external payable {
        require(started, "Sale not active");
        require(msg.value >= minPurchaseWei, "Below min purchase");
        require(msg.value <= maxPurchaseWei, "Above max purchase");
        require(msg.value > 0, "Send ETH to buy");

        // calculate tokens to send (assumes token has 18 decimals)
        uint256 tokensToBuy = (msg.value * (10 ** 18)) / pricePerTokenWei;
        require(tokensToBuy > 0, "Value too small for 1 token at current price");

        // cap check
        require(soldTokens + tokensToBuy <= capTokens, "Purchase exceeds cap");

        // ensure contract has enough tokens
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= tokensToBuy, "Not enough tokens in contract");

        // update sold
        soldTokens += tokensToBuy;

        // transfer tokens to buyer
        bool ok = token.transfer(msg.sender, tokensToBuy);
        require(ok, "Token transfer failed");

        emit TokenBought(msg.sender, msg.value, tokensToBuy);
    }

    // ------------------------
    // Owner controls
    // ------------------------

    /// @notice Start the sale
    function startSale() external onlyOwner {
        started = true;
        emit SaleStarted();
    }

    /// @notice Stop the sale
    function stopSale() external onlyOwner {
        started = false;
        emit SaleStopped();
    }

    /// @notice Withdraw collected ETH to fundsRecipient
    function withdrawETH() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No ETH");
        (bool sent, ) = payable(fundsRecipient).call{value: bal}("");
        require(sent, "ETH transfer failed");
        emit WithdrawETH(fundsRecipient, bal);
    }

    /// @notice Withdraw unsold tokens to owner
    function withdrawUnsoldTokens(address to) external onlyOwner {
        require(to != address(0), "Zero address");
        uint256 bal = token.balanceOf(address(this));
        require(bal > 0, "No tokens");
        bool ok = token.transfer(to, bal);
        require(ok, "Token transfer failed");
        emit WithdrawUnsoldTokens(to, bal);
    }

    /// @notice Update price (wei per token). New price applies immediately.
    function setPrice(uint256 newPriceWei) external onlyOwner {
        require(newPriceWei > 0, "Price must be > 0");
        pricePerTokenWei = newPriceWei;
        emit PriceUpdated(newPriceWei);
    }

    /// @notice Set cap (in whole tokens). Replace existing cap.
    function setCap(uint256 capWholeTokens) external onlyOwner {
        capTokens = capWholeTokens * (10 ** 18);
        emit CapUpdated(capTokens);
    }

    /// @notice Change where ETH funds are withdrawn to
    function setFundsRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Zero address");
        fundsRecipient = newRecipient;
        emit FundsRecipientUpdated(newRecipient);
    }

    /// @notice Set min/max purchase in wei
    function setPurchaseLimits(uint256 minWei, uint256 maxWei) external onlyOwner {
        require(minWei <= maxWei, "min > max");
        minPurchaseWei = minWei;
        maxPurchaseWei = maxWei;
        emit PurchaseLimitsUpdated(minWei, maxWei);
    }

    /// @notice Returns how many tokens (smallest units) a given wei amount will buy
    function tokensForWei(uint256 weiAmount) external view returns (uint256) {
        if (weiAmount == 0) return 0;
        return (weiAmount * (10 ** 18)) / pricePerTokenWei;
    }

    /// @notice Fallback to accept ETH sent directly
    receive() external payable {
        // accept ETH but do not auto-buy to avoid mistakes. Buyers should call buyTokens().
    }
}

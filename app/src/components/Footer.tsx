import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AsP - Achin Smart Payment</h3>
          <p>A blockchain-based payment project demonstrating real-world usage of smart contracts and decentralized payments.</p>
        </div>

        <div className="footer-section">
          <h4>Technology</h4>
          <ul>
            <li>Solidity Smart Contracts</li>
            <li>OpenZeppelin Standards</li>
            <li>ERC-20 Token</li>
            <li>MetaMask Integration</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Networks</h4>
          <ul>
            <li>Ethereum Sepolia (Testnet)</li>
            <li>BNB Chain (Planned)</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Developer</h4>
          <p>
            <strong>Achin Sahu Pranami</strong><br />
            BTech CSE (AI)<br />
            Blockchain & Software Developer
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Built for learning and demonstration purposes. Not financial advice.</p>
      </div>
    </footer>
  )
}

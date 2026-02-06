import './WalletConnect.css'

interface WalletConnectProps {
  onConnect: () => void
  isConnecting: boolean
  error: string | null
}

export default function WalletConnect({ onConnect, isConnecting, error }: WalletConnectProps) {
  return (
    <div className="wallet-connect">
      <div className="connect-card">
        <h2>Connect Your Wallet</h2>
        <p className="description">
          Connect with MetaMask to access your AsP tokens and start making payments
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className="connect-button"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>

        <div className="info-box">
          <h3>About AsP</h3>
          <ul>
            <li>ERC-20 utility token for blockchain payments</li>
            <li>Fixed supply with transparent smart contracts</li>
            <li>Secure wallet-based transactions</li>
            <li>Testnet deployed for demonstration</li>
          </ul>
        </div>

        <p className="disclaimer">
          This is a utility-based blockchain project built for learning and demonstration purposes.
        </p>
      </div>
    </div>
  )
}

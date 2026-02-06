import './Dashboard.css'

interface DashboardProps {
  address: string
  balance: string
  tokenBalance: string
  onDisconnect: () => void
}

export default function Dashboard({ address, balance, tokenBalance, onDisconnect }: DashboardProps) {
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Wallet</h2>
        <button className="disconnect-button" onClick={onDisconnect}>
          Disconnect
        </button>
      </div>

      <div className="wallet-info">
        <div className="address-card">
          <span className="label">Connected Address</span>
          <div className="address-display">
            <span className="address">{formatAddress(address)}</span>
            <button className="copy-button" onClick={copyAddress}>
              Copy
            </button>
          </div>
        </div>

        <div className="balance-grid">
          <div className="balance-card">
            <span className="label">ETH Balance</span>
            <span className="amount">{parseFloat(balance).toFixed(4)} ETH</span>
          </div>

          <div className="balance-card primary">
            <span className="label">AsP Balance</span>
            <span className="amount">{parseFloat(tokenBalance).toFixed(2)} AsP</span>
          </div>
        </div>

        <div className="price-info">
          <div className="info-card">
            <span className="label">Network</span>
            <span className="value">Ethereum Sepolia Testnet</span>
          </div>
          <div className="info-card">
            <span className="label">Token Type</span>
            <span className="value">ERC-20</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <a
          href="https://pancakeswap.finance"
          target="_blank"
          rel="noopener noreferrer"
          className="action-button"
        >
          Trade on PancakeSwap
        </a>
        <a
          href="https://uniswap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="action-button"
        >
          Trade on Uniswap
        </a>
      </div>
    </div>
  )
}

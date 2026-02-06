import { useState } from 'react'
import { ethers } from 'ethers'
import './TransferForm.css'

interface TransferFormProps {
  tokenAddress: string
}

export default function TransferForm({ tokenAddress }: TransferFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (tokenAddress === '0x...') {
      setMessage({ type: 'error', text: 'Token contract address not configured' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const tokenABI = [
        'function transfer(address to, uint256 amount) returns (bool)',
        'function decimals() view returns (uint8)'
      ]

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer)
      const decimals = await tokenContract.decimals()
      const amountInWei = ethers.parseUnits(amount, decimals)

      const tx = await tokenContract.transfer(recipient, amountInWei)

      setMessage({ type: 'success', text: 'Transaction submitted. Waiting for confirmation...' })

      await tx.wait()

      setMessage({ type: 'success', text: 'Transfer successful!' })
      setRecipient('')
      setAmount('')
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Transfer failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="transfer-form">
      <h2>Send AsP Tokens</h2>

      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (AsP)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            required
            disabled={isLoading}
          />
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !recipient || !amount}
        >
          {isLoading ? 'Sending...' : 'Send Tokens'}
        </button>
      </form>

      <div className="transfer-info">
        <h3>Transfer Information</h3>
        <ul>
          <li>Transfers are processed on the blockchain and may take a few seconds</li>
          <li>Make sure the recipient address is correct before sending</li>
          <li>A small gas fee will be required for the transaction</li>
          <li>Transactions are irreversible once confirmed</li>
        </ul>
      </div>
    </div>
  )
}

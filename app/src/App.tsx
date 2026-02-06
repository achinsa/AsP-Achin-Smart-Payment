import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Header from './components/Header'
import WalletConnect from './components/WalletConnect'
import Dashboard from './components/Dashboard'
import TransferForm from './components/TransferForm'
import Footer from './components/Footer'
import { WalletState } from './types'
import './App.css'

const ASP_TOKEN_ADDRESS = '0x...' // Replace with actual deployed contract address

function App() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: '0',
    tokenBalance: '0',
    isConnecting: false,
    error: null
  })

  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]
      const balance = await provider.getBalance(address)

      setWalletState({
        address,
        balance: ethers.formatEther(balance),
        tokenBalance: '0',
        isConnecting: false,
        error: null
      })

      // Load token balance if contract address is set
      if (ASP_TOKEN_ADDRESS !== '0x...') {
        await loadTokenBalance(address, provider)
      }
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message
      }))
    }
  }

  const loadTokenBalance = async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const tokenABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ]
      const tokenContract = new ethers.Contract(ASP_TOKEN_ADDRESS, tokenABI, provider)
      const balance = await tokenContract.balanceOf(address)
      const decimals = await tokenContract.decimals()
      const formattedBalance = ethers.formatUnits(balance, decimals)

      setWalletState(prev => ({ ...prev, tokenBalance: formattedBalance }))
    } catch (error) {
      console.error('Error loading token balance:', error)
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      balance: '0',
      tokenBalance: '0',
      isConnecting: false,
      error: null
    })
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          connectWallet()
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {!walletState.address ? (
          <WalletConnect
            onConnect={connectWallet}
            isConnecting={walletState.isConnecting}
            error={walletState.error}
          />
        ) : (
          <>
            <Dashboard
              address={walletState.address}
              balance={walletState.balance}
              tokenBalance={walletState.tokenBalance}
              onDisconnect={disconnectWallet}
            />
            <TransferForm tokenAddress={ASP_TOKEN_ADDRESS} />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App

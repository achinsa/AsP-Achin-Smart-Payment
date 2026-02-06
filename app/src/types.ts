export interface WalletState {
  address: string | null
  balance: string
  tokenBalance: string
  isConnecting: boolean
  error: string | null
}

export interface Transaction {
  hash: string
  from: string
  to: string
  amount: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
}

declare global {
  interface Window {
    ethereum?: any
  }
}

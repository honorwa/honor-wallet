
import { Asset, Transaction, ChartDataPoint, CryptoOption, User, SupportTicket, P2POffer } from './types';

export const MOCK_ASSETS: Asset[] = []; // Assets are now dynamically generated via authService

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', type: 'receive', asset: 'BTC', amount: 0.05, date: '2023-10-25T10:30:00', status: 'completed', counterparty: '0x3f...8a91' },
  { id: 'tx2', type: 'send', asset: 'ETH', amount: 1.2, date: '2023-10-24T14:15:00', status: 'completed', counterparty: 'Coinbase' },
  { id: 'tx3', type: 'swap', asset: 'SOL', amount: 50, date: '2023-10-23T09:00:00', status: 'pending', counterparty: 'Uniswap' },
];

export const PORTFOLIO_HISTORY: ChartDataPoint[] = [
  { name: 'Mon', value: 62000 },
  { name: 'Tue', value: 63500 },
  { name: 'Wed', value: 61800 },
  { name: 'Thu', value: 64200 },
  { name: 'Fri', value: 65100 },
  { name: 'Sat', value: 66800 },
  { name: 'Sun', value: 67309 },
];

export const AVAILABLE_CRYPTOS: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#f59e0b', price: 64230.50 },
  { symbol: 'ETH', name: 'Ethereum', color: '#6366f1', price: 3450.20 },
  { symbol: 'USDT', name: 'Tether', color: '#22c55e', price: 1.00 },
  { symbol: 'BNB', name: 'Binance Coin', color: '#F0B90B', price: 580.10 },
  { symbol: 'SOL', name: 'Solana', color: '#10b981', price: 148.90 },
  { symbol: 'XRP', name: 'Ripple', color: '#000000', price: 0.60 },
  { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', price: 1.00 },
  { symbol: 'ADA', name: 'Cardano', color: '#3b82f6', price: 0.45 },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#fbbf24', price: 0.12 },
  { symbol: 'SHIB', name: 'Shiba Inu', color: '#ff0000', price: 0.00002 },
  { symbol: 'AVAX', name: 'Avalanche', color: '#e84142', price: 35.20 },
  { symbol: 'DOT', name: 'Polkadot', color: '#e6007a', price: 6.50 },
  { symbol: 'TRX', name: 'Tron', color: '#FF0013', price: 0.11 },
  { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', price: 14.20 },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5', price: 0.70 },
  { symbol: 'LTC', name: 'Litecoin', color: '#345D9D', price: 85.50 },
  { symbol: 'BCH', name: 'Bitcoin Cash', color: '#0AC18E', price: 450.00 },
  { symbol: 'NEAR', name: 'NEAR Protocol', color: '#000000', price: 6.80 },
  { symbol: 'UNI', name: 'Uniswap', color: '#FF007A', price: 7.50 },
  { symbol: 'XMR', name: 'Monero', color: '#FF6600', price: 120.00 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', full_name: 'Alex Trader', email: 'alex@veritas.com', role: 'admin', join_date: '2023-01-15', status: 'active', verified: true, email_verified: true, fee_percentage: 0 },
  { id: 'u2', full_name: 'Sarah Investor', email: 'sarah@example.com', role: 'user', join_date: '2023-03-22', status: 'active', verified: true, email_verified: true, fee_percentage: 1.5 },
  { id: 'u3', full_name: 'Mike Hodler', email: 'mike@example.com', role: 'user', join_date: '2023-05-10', status: 'suspended', verified: false, email_verified: false, fee_percentage: 1.5 },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 't1', user_email: 'sarah@example.com', subject: 'Deposit issue', message: 'My deposit of 0.5 ETH is not showing up.', status: 'open', priority: 'high', created_at: '2023-10-26T09:00:00' },
  { id: 't2', user_email: 'mike@example.com', subject: 'Account locked', message: 'I cannot access my account.', status: 'in_progress', priority: 'high', created_at: '2023-10-25T14:30:00', admin_response: 'We are investigating this issue.' },
  { id: 't3', user_email: 'sarah@example.com', subject: 'How to swap?', message: 'How do I swap BTC for SOL?', status: 'resolved', priority: 'low', created_at: '2023-10-24T11:20:00', admin_response: 'You can use the Convert page.' },
];

export const MOCK_P2P_OFFERS: P2POffer[] = [
  { id: 'p2p1', seller_name: 'CryptoKing99', asset: 'BTC', amount: 0.1, price_per_unit: 63000, total_price: 6300, type: 'buy', completed: false, trust_score: 98 },
  { id: 'p2p2', seller_name: 'AliceWonder', asset: 'ETH', amount: 2.0, price_per_unit: 3400, total_price: 6800, type: 'buy', completed: false, trust_score: 95 },
  { id: 'p2p3', seller_name: 'FastTraderX', asset: 'SOL', amount: 50, price_per_unit: 145, total_price: 7250, type: 'buy', completed: false, trust_score: 88 },
];

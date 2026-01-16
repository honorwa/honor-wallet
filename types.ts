
export enum Page {
  DASHBOARD = 'DASHBOARD',
  PORTFOLIO = 'PORTFOLIO',
  TRANSACTIONS = 'TRANSACTIONS',
  AI_ADVISOR = 'AI_ADVISOR',
  SETTINGS = 'SETTINGS',
  CONVERT = 'CONVERT',
  BUY = 'BUY',
  SEND = 'SEND',
  ANALYTICS = 'ANALYTICS',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE',
  P2P_MARKET = 'P2P_MARKET',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_USERS = 'ADMIN_USERS',
  ADMIN_SUPPORT = 'ADMIN_SUPPORT'
}

export type SortOption = 'name' | 'balance' | 'value' | 'change';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  change24h: number;
  value: number;
  color: string;
  wallet_address?: string;
  is_enabled?: boolean;
}

export interface Transaction {
  id: string;
  type: 'receive' | 'send' | 'swap' | 'buy' | 'admin_adjustment' | 'convert' | 'p2p_buy' | 'p2p_sell' | 'wire_deposit' | 'fee_collection';
  asset: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty?: string;
  description?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CryptoOption {
  symbol: string;
  name: string;
  color: string;
  price: number;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  join_date: string;
  status: 'active' | 'suspended' | 'on_hold';
  verified: boolean;
  email_verified: boolean;
  phone?: string;
  password?: string;
  fee_percentage?: number;
  kyc_status?: 'none' | 'pending' | 'verified' | 'rejected';
  buy_access?: boolean;
}

export interface SupportTicket {
  id: string;
  user_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  admin_response?: string;
}

export interface P2POffer {
  id: string;
  seller_name: string;
  asset: string;
  amount: number;
  price_per_unit: number;
  total_price: number;
  type: 'buy' | 'sell';
  completed: boolean;
  trust_score: number;
}

export interface KYCRequest {
    id: string;
    userId: string;
    userEmail: string;
    idDocumentName: string;
    proofDocumentName: string;
    // Storing Base64 strings to simulate file upload without backend S3
    idDocumentData?: string; 
    proofDocumentData?: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

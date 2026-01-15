
import React, { useState } from 'react';
import { Asset, SortOption } from '../types';
import { WalletsList } from './WalletsList';
import { PortfolioChart } from './PortfolioChart';
import { ArrowUpDown } from 'lucide-react';

interface PortfolioProps {
  assets: Asset[];
  marketPrices?: Record<string, number>;
  language?: "en" | "fr" | "es" | "it";
}

export const Portfolio: React.FC<PortfolioProps> = ({ assets, marketPrices, language = "en" }) => {
  const [sortOption, setSortOption] = useState<SortOption>('value');

  const sortedAssets = [...assets].sort((a, b) => {
    switch (sortOption) {
      case 'balance': return b.balance - a.balance;
      case 'name': return a.name.localeCompare(b.name);
      case 'change': return b.change24h - a.change24h;
      case 'value': default: return b.value - a.value;
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Assets</h2>
        <div className="flex items-center gap-2 bg-[#151A25] rounded-lg p-1 border border-white/5">
            <span className="text-xs text-slate-500 pl-2 pr-1 font-medium uppercase">Sort By</span>
            <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-sm text-white focus:outline-none p-1 cursor-pointer"
            >
                <option value="value">Value (High-Low)</option>
                <option value="balance">Balance</option>
                <option value="name">Name</option>
                <option value="change">24h Change</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
        <div className="lg:col-span-1">
          <PortfolioChart assets={assets} language={language} />
        </div>

        {/* Detailed Wallets List */}
        <div className="lg:col-span-2">
          <WalletsList wallets={sortedAssets} marketPrices={marketPrices} language={language} />
        </div>
      </div>
    </div>
  );
};

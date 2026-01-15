import React, { useState } from 'react';
import { P2POffer, Asset, Transaction } from '../types';
import { User, CheckCircle, Shield, AlertTriangle, Search, Filter } from 'lucide-react';

interface P2PMarketProps {
  offers: P2POffer[];
  assets: Asset[];
  onAcceptOffer: (offer: P2POffer) => void;
}

export const P2PMarket: React.FC<P2PMarketProps> = ({ offers, assets, onAcceptOffer }) => {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredOffers = offers.filter(o => {
    if (o.completed) return false;
    if (filter !== 'all' && o.type !== filter) return false;
    if (searchTerm && !o.asset.includes(searchTerm.toUpperCase()) && !o.seller_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAccept = (offer: P2POffer) => {
    setProcessingId(offer.id);
    setTimeout(() => {
        onAcceptOffer(offer);
        setProcessingId(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">P2P Marketplace</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Trade directly with other verified users.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-white/10">
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilter('buy')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'buy' ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
                Buy
            </button>
            <button 
                onClick={() => setFilter('sell')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'sell' ? 'bg-red-500 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
                Sell
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by asset or user..."
                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
            </div>

            {/* Listings */}
            <div className="space-y-3">
                {filteredOffers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No active offers found.</div>
                ) : (
                    filteredOffers.map(offer => (
                        <div key={offer.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-indigo-500/30 group">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-white/5 relative">
                                    {offer.seller_name[0]}
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white ${offer.trust_score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                        {offer.trust_score}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{offer.seller_name}</h3>
                                        {offer.trust_score > 95 && <Shield className="w-3 h-3 text-emerald-500" />}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{offer.type === 'buy' ? 'Selling' : 'Buying'} <span className="font-bold text-slate-900 dark:text-white">{offer.asset}</span></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-start">
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Price/Unit</p>
                                    <p className="font-mono text-slate-900 dark:text-white">${offer.price_per_unit.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Amount</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{offer.amount} {offer.asset}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total</p>
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400">${offer.total_price.toLocaleString()}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleAccept(offer)}
                                disabled={!!processingId}
                                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    offer.type === 'buy' 
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                                    : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                                }`}
                            >
                                {processingId === offer.id ? 'Processing...' : (offer.type === 'buy' ? 'Buy' : 'Sell')}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full -mr-6 -mt-6"></div>
                <h3 className="text-lg font-bold mb-2">How it works</h3>
                <ul className="space-y-3 text-sm text-indigo-100">
                    <li className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                        <p>Browse offers from other users in the list.</p>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                        <p>Check the "Trust Score" to ensure a safe trade.</p>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                        <p>Click Buy/Sell. Funds are held in escrow until confirmed.</p>
                    </li>
                </ul>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Trading Rules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Veritas Wallet acts as an escrow service. Do not release funds until you have confirmed receipt of payment. 
                    Disputes are handled by our admin team within 24 hours.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                    <button className="w-full py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5">
                        Create My Own Offer
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
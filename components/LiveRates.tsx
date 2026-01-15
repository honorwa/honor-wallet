
import React, { useState } from "react";
import { TrendingUp, ChevronDown, Plus, ExternalLink } from "lucide-react";
import { AVAILABLE_CRYPTOS } from "../constants";

interface LiveRatesProps {
    marketPrices: Record<string, number>;
    language?: "en" | "fr" | "es" | "it";
}

const translations = {
    en: { title: "Live Market", lastSync: "Real-time Feed", sources: "Sources" },
    fr: { title: "Marché en Direct", lastSync: "Flux temps réel", sources: "Sources" },
    es: { title: "Mercado en Vivo", lastSync: "Transmisión en vivo", sources: "Fuentes" },
    it: { title: "Mercato Live", lastSync: "Feed in tempo reale", sources: "Fonti" }
};

export const LiveRates: React.FC<LiveRatesProps> = ({ marketPrices, language = "en" }) => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [displayedAssets, setDisplayedAssets] = useState(['BTC', 'ETH', 'SOL']);
  
  const t = translations[language] || translations.en;

  const formatPrice = (price: number | undefined) => {
    if (!price) return "...";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: baseCurrency
    }).format(price);
  };

  const toggleAsset = (symbol: string) => {
      if (displayedAssets.includes(symbol)) {
          if (displayedAssets.length > 1) setDisplayedAssets(prev => prev.filter(s => s !== symbol));
      } else {
          if (displayedAssets.length < 5) setDisplayedAssets(prev => [...prev, symbol]);
      }
  };

  return (
    <div className="bg-zinc-950 border border-[#D4AF37]/20 rounded-[2rem] flex flex-col h-full shadow-2xl relative overflow-hidden min-h-[380px]">
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-full blur-xl"></div>
      
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#D4AF37]/10">
        <h3 className="text-[#D4AF37] font-black uppercase tracking-widest flex items-center gap-2 text-xs">
          <TrendingUp className="w-4 h-4" />
          {t.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-1 bg-black border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-[#D4AF37]/10 transition-colors">
              {baseCurrency} <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-20 bg-black border border-[#D4AF37]/20 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-10">
                {["USD"].map(c => (
                    <button 
                        key={c} 
                        onClick={() => setBaseCurrency(c)}
                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-zinc-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                    >
                        {c}
                    </button>
                ))}
            </div>
          </div>
          
          {/* Add Coin Selector */}
          <div className="relative group">
            <button className="p-1.5 hover:bg-[#D4AF37]/10 rounded-lg transition-colors text-[#D4AF37]">
                <Plus className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-black border border-[#D4AF37]/20 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-10 max-h-48 overflow-y-auto custom-scrollbar">
                {AVAILABLE_CRYPTOS.map(c => (
                    <button 
                        key={c.symbol} 
                        onClick={() => toggleAsset(c.symbol)}
                        className="w-full text-left px-3 py-2 text-[10px] font-bold flex justify-between hover:bg-[#D4AF37]/10"
                    >
                        <span className="text-white">{c.symbol}</span>
                        {displayedAssets.includes(c.symbol) && <span className="text-[#D4AF37]">✓</span>}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {displayedAssets.map((symbol) => {
            const coinInfo = AVAILABLE_CRYPTOS.find(c => c.symbol === symbol);
            // Use props instead of internal state for price
            const price = marketPrices[symbol] || coinInfo?.price;
            
            return (
                <div key={symbol} className="p-4 bg-gradient-to-r from-black to-zinc-900 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-all group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-1 relative z-10">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white/10 text-white font-bold text-[10px]"
                                style={{ backgroundColor: coinInfo?.color || '#333' }}
                            >
                                {symbol[0]}
                            </div>
                            <div>
                                <p className="font-black text-white uppercase tracking-wider text-xs">{coinInfo?.name || symbol}</p>
                            </div>
                        </div>
                        <p className="text-sm font-black text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">
                            {formatPrice(price)}
                        </p>
                    </div>
                </div>
            )
        })}

        <p className="text-[9px] text-zinc-600 text-center mt-4 font-black uppercase tracking-widest">
            {t.lastSync}
        </p>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { TrendingUp, ChevronDown, Plus } from "lucide-react";
import { AVAILABLE_CRYPTOS } from "../constants";
import { authService } from "../services/authServiceCompat";
import { User } from "../types";

interface LiveRatesProps {
  marketPrices: Record<string, number>;
  language: "en" | "fr" | "es" | "it";
}

const translations = {
    en: { title: "Live Market", lastSync: "Real-time Feed", sources: "Sources" },
    fr: { title: "Marché en Direct", lastSync: "Flux temps réel", sources: "Sources" },
    es: { title: "Mercado en Vivo", lastSync: "Transmisión en vivo", sources: "Fuentes" },
    it: { title: "Mercato Live", lastSync: "Feed in tempo reale", sources: "Fonti" }
};

// Mock conversion rate - In production fetch this from API
const USD_TO_EUR = 0.92;

export const LiveRates: React.FC<LiveRatesProps> = ({ marketPrices, language = "en" }) => {
  const [user, setUser] = useState<User | null>(null);
  const [baseCurrency, setBaseCurrency] = useState<"USD" | "EUR">("USD");
  const [displayedAssets, setDisplayedAssets] = useState(['BTC', 'ETH', 'SOL']);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showAssetMenu, setShowAssetMenu] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
        if (currentUser.preferred_currency) setBaseCurrency(currentUser.preferred_currency);
        if (currentUser.market_watchlist && currentUser.market_watchlist.length > 0) {
            setDisplayedAssets(currentUser.market_watchlist);
        }
    }
  }, []);

  const updatePreferences = (currency: "USD" | "EUR", assets: string[]) => {
      if (user) {
          const updates = { preferred_currency: currency, market_watchlist: assets };
          authService.updateUser(user.id, updates);
      }
  };

  const handleCurrencyChange = (currency: "USD" | "EUR") => {
      setBaseCurrency(currency);
      setShowCurrencyMenu(false);
      updatePreferences(currency, displayedAssets);
  };

  const t = translations[language] || translations.en;

  const formatPrice = (priceUSD: number | undefined) => {
    if (!priceUSD) return "...";
    
    let displayPrice = priceUSD;
    if (baseCurrency === 'EUR') {
        displayPrice = priceUSD * USD_TO_EUR;
    }

    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: baseCurrency
    }).format(displayPrice);
  };

  const toggleAsset = (symbol: string) => {
      let newAssets = [...displayedAssets];
      if (displayedAssets.includes(symbol)) {
          if (displayedAssets.length > 1) newAssets = displayedAssets.filter(s => s !== symbol);
      } else {
          if (displayedAssets.length < 5) newAssets = [...displayedAssets, symbol];
      }
      setDisplayedAssets(newAssets);
      updatePreferences(baseCurrency, newAssets);
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
          <div className="relative">
            <button
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1 bg-black border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
            >
              {baseCurrency} <ChevronDown className="w-3 h-3" />
            </button>
            {showCurrencyMenu && (
              <div className="absolute right-0 top-full mt-1 w-20 bg-black border border-[#D4AF37]/20 rounded-lg shadow-xl overflow-hidden z-20">
                {["USD", "EUR"].map(c => (
                  <button
                    key={c}
                    onClick={() => handleCurrencyChange(c as "USD" | "EUR")}
                    className="w-full text-left px-3 py-2 text-[10px] font-bold text-zinc-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Coin Selector */}
          <div className="relative">
            <button
              onClick={() => setShowAssetMenu(!showAssetMenu)}
              className="p-1.5 hover:bg-[#D4AF37]/10 rounded-lg transition-colors text-[#D4AF37]"
            >
              <Plus className="w-3 h-3" />
            </button>
            {showAssetMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-[#D4AF37]/20 rounded-lg shadow-xl overflow-hidden z-20 max-h-48 overflow-y-auto custom-scrollbar">
                {AVAILABLE_CRYPTOS.map(c => (
                  <button
                    key={c.symbol}
                    onClick={() => {
                      toggleAsset(c.symbol);
                    }}
                    className="w-full text-left px-3 py-2 text-[10px] font-bold flex justify-between hover:bg-[#D4AF37]/10"
                  >
                    <span className="text-white">{c.symbol}</span>
                    {displayedAssets.includes(c.symbol) && <span className="text-[#D4AF37]">✓</span>}
                  </button>
                ))}
              </div>
            )}
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
                                <h4 className="text-white font-bold text-xs">{coinInfo?.name}</h4>
                                <span className="text-[10px] text-zinc-500 font-bold">{symbol}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-black text-sm tracking-tight">{formatPrice(price)}</p>
                        </div>
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

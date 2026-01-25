
import React, { useState } from 'react';
import { Asset } from '../types';
import { ArrowDown, Info } from 'lucide-react';
import { AVAILABLE_CRYPTOS } from '../constants';

interface ConvertProps {
  assets: Asset[];
  marketPrices: Record<string, number>;
  onConvert: (fromAsset: string, toAsset: string, fromAmount: number, toAmount: number, fee: number) => void;
  language?: "en" | "fr" | "es" | "it";
  feePercentage?: number;
}

const translations = {
    en: {
        // ... existing translations
        title: "Convert Assets",
        from: "From",
        to: "To (Estimated)",
        balance: "Balance",
        rate: "Exchange Rate",
        livePrice: "Live Price",
        fee: "Network Fee",
        preview: "Preview Conversion",
        confirmTitle: "Confirm Transaction",
        confirmMsg: "You are converting",
        into: "into approximately",
        cancel: "Cancel",
        confirm: "Confirm Swap",
        insufficient: "Insufficient Balance",
        max: "MAX"
    },
    // ... add 'max' to other languages if needed or default to EN
    fr: {
        title: "Convertir des Actifs",
        from: "De",
        to: "Vers (Estimé)",
        balance: "Solde",
        rate: "Taux de change",
        livePrice: "Prix en direct",
        fee: "Frais réseau",
        preview: "Aperçu de la conversion",
        confirmTitle: "Confirmer la Transaction",
        confirmMsg: "Vous convertissez",
        into: "en environ",
        cancel: "Annuler",
        confirm: "Confirmer l'échange",
        insufficient: "Solde Insuffisant",
        max: "MAX"
    },
    es: {
        title: "Convertir Activos",
        from: "De",
        to: "A (Estimado)",
        balance: "Saldo",
        rate: "Tipo de cambio",
        livePrice: "Precio en vivo",
        fee: "Tarifa de red",
        preview: "Vista previa",
        confirmTitle: "Confirmar Transacción",
        confirmMsg: "Estás convirtiendo",
        into: "en aproximadamente",
        cancel: "Cancelar",
        confirm: "Confirmar Canje",
        insufficient: "Saldo Insuficiente",
        max: "MAX"
    },
    it: {
        title: "Converti Asset",
        from: "Da",
        to: "A (Stimato)",
        balance: "Saldo",
        rate: "Tasso di cambio",
        livePrice: "Prezzo Live",
        fee: "Commissione rete",
        preview: "Anteprima Conversione",
        confirmTitle: "Conferma Transazione",
        confirmMsg: "Stai convertendo",
        into: "in circa",
        cancel: "Annulla",
        confirm: "Conferma Scambio",
        insufficient: "Saldo Insufficiente",
        max: "MAX"
    }
};

export const Convert: React.FC<ConvertProps> = ({ assets, marketPrices, onConvert, language = "en", feePercentage = 0.5 }) => {
  const [fromAssetSymbol, setFromAssetSymbol] = useState(assets[0]?.symbol || 'BTC');
  const [toAssetSymbol, setToAssetSymbol] = useState(AVAILABLE_CRYPTOS[1].symbol);
  const [amount, setAmount] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  
  const t = translations[language] || translations.en;

  // Get current prices directly from props to ensure live updates
  const fromPrice = marketPrices[fromAssetSymbol] || AVAILABLE_CRYPTOS.find(c => c.symbol === fromAssetSymbol)?.price || 0;
  const toPrice = marketPrices[toAssetSymbol] || AVAILABLE_CRYPTOS.find(c => c.symbol === toAssetSymbol)?.price || 0;

  const fromAsset = assets.find(a => a.symbol === fromAssetSymbol) || { 
    symbol: fromAssetSymbol, 
    balance: 0, 
    price: fromPrice
  };
  
  // Exchange Rate Calculation
  const exchangeRate = toPrice > 0 ? fromPrice / toPrice : 0;
  const estimatedOutput = parseFloat(amount) ? parseFloat(amount) * exchangeRate : 0;
  
  // Use admin defined fee or default 0.5%
  const feeRate = feePercentage / 100;
  const fee = parseFloat(amount) ? parseFloat(amount) * feeRate : 0; 
  const feeInUsd = fee * fromPrice;
  const finalOutput = estimatedOutput * (1 - feeRate);

  const handleSwap = () => {
    if (parseFloat(amount) > fromAsset.balance) {
      alert(t.insufficient);
      return;
    }
    // Ensure finalOutput is valid
    if (finalOutput < 0) return;

    onConvert(fromAssetSymbol, toAssetSymbol, parseFloat(amount), finalOutput, feeInUsd);
    setAmount('');
    setIsConfirming(false);
  };

  const handleSetMax = () => {
      setAmount(fromAsset.balance.toString());
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{t.title}</h2>

      <div className="bg-zinc-950 border border-[#D4AF37]/20 rounded-[2rem] p-8 shadow-2xl relative">
        {/* From Section */}
        <div className="bg-black p-4 rounded-xl border border-white/5 mb-2">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{t.from}</span>
            <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest">{t.balance}: {fromAsset.balance.toFixed(6)}</span>
                <button 
                    onClick={handleSetMax}
                    className="text-[#D4AF37] text-[9px] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded font-black hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                    {t.max}
                </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-white text-2xl font-bold w-full focus:outline-none placeholder-zinc-700"
              placeholder="0.00"
            />
            <select 
              value={fromAssetSymbol}
              onChange={(e) => setFromAssetSymbol(e.target.value)}
              className="bg-zinc-900 text-white px-3 py-2 rounded-lg border border-white/10 font-bold focus:outline-none"
            >
              {assets.map(a => (
                <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-zinc-950 p-2 rounded-full border border-white/10">
            <div className="bg-zinc-800 p-2 rounded-full text-white hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* To Section */}
        <div className="bg-black p-4 rounded-xl border border-white/5 mt-2">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{t.to}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              disabled
              value={finalOutput > 0 ? finalOutput.toFixed(6) : '0.00'}
              className="bg-transparent text-zinc-300 text-2xl font-bold w-full focus:outline-none"
            />
            <select 
              value={toAssetSymbol}
              onChange={(e) => setToAssetSymbol(e.target.value)}
              className="bg-zinc-900 text-white px-3 py-2 rounded-lg border border-white/10 font-bold focus:outline-none"
            >
              {AVAILABLE_CRYPTOS.map(c => (
                <option key={c.symbol} value={c.symbol}>{c.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span className="uppercase tracking-wide">{t.rate}</span>
            <span className="font-mono">1 {fromAssetSymbol} = {exchangeRate.toFixed(4)} {toAssetSymbol}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
             <span className="uppercase tracking-wide">{t.livePrice} {fromAssetSymbol}</span>
             <span className="font-mono text-[#D4AF37]">${fromPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span className="flex items-center gap-1 uppercase tracking-wide">{t.fee} <Info className="w-3 h-3"/></span>
            <span className="font-mono">{fee.toFixed(6)} {fromAssetSymbol} ({feePercentage}%)</span>
          </div>
        </div>

        <button
          onClick={() => setIsConfirming(true)}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromAsset.balance}
          className="w-full mt-6 bg-[#D4AF37] hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#D4AF37]/20"
        >
          {parseFloat(amount) > fromAsset.balance ? t.insufficient : t.preview}
        </button>

        {isConfirming && (
           <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-sm z-20 rounded-[2rem] flex flex-col items-center justify-center p-6">
              <h3 className="text-white text-xl font-black uppercase tracking-wide mb-4">{t.confirmTitle}</h3>
              <p className="text-zinc-400 text-center mb-6">
                {t.confirmMsg} <span className="text-white font-bold">{amount} {fromAssetSymbol}</span> {t.into} <span className="text-white font-bold">{finalOutput.toFixed(6)} {toAssetSymbol}</span>.
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 uppercase tracking-wide font-bold text-xs"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleSwap}
                  className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black font-black hover:bg-[#FFD700] uppercase tracking-wide text-xs"
                >
                  {t.confirm}
                </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

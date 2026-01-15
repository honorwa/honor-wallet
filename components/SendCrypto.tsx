import React, { useState } from 'react';
import { Asset } from '../types';
import { Send, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';

interface SendCryptoProps {
  assets: Asset[];
  onSend: (assetSymbol: string, amount: number, address: string) => void;
  language?: "en" | "fr" | "es" | "it";
}

const translations = {
  en: { title: "Send Assets", select: "Select Asset", amount: "Amount", address: "Recipient Address", send: "Send Now", balance: "Available:" },
  fr: { title: "Envoyer des Actifs", select: "Sélectionner l'actif", amount: "Montant", address: "Adresse du destinataire", send: "Envoyer", balance: "Disponible:" },
  es: { title: "Enviar Activos", select: "Seleccionar Activo", amount: "Cantidad", address: "Dirección del destinatario", send: "Enviar Ahora", balance: "Disponible:" },
  it: { title: "Invia Asset", select: "Seleziona Asset", amount: "Importo", address: "Indirizzo Destinatario", send: "Invia Ora", balance: "Disponibile:" }
};

export const SendCrypto: React.FC<SendCryptoProps> = ({ assets, onSend, language = "en" }) => {
  const [selectedAsset, setSelectedAsset] = useState<string>(assets[0]?.symbol || '');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [step, setStep] = useState<'input' | 'success'>('input');

  const t = translations[language] || translations.en;
  const currentAsset = assets.find(a => a.symbol === selectedAsset);

  const handleSend = () => {
    if (amount && address && currentAsset) {
      onSend(selectedAsset, parseFloat(amount), address);
      setStep('success');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        {step === 'input' ? (
          <div className="space-y-6 relative z-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Send className="w-6 h-6 text-indigo-400" />
              {t.title}
            </h2>

            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">{t.select}</label>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                    <select
                        value={selectedAsset}
                        onChange={(e) => setSelectedAsset(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                        {assets.map(a => (
                        <option key={a.symbol} value={a.symbol}>
                            {a.name} ({a.symbol})
                        </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Wallet className="w-4 h-4 text-slate-500" />
                    </div>
                </div>
                {currentAsset && (
                    <div className="text-right text-xs text-indigo-300">
                        {t.balance} {currentAsset.balance.toFixed(6)} {currentAsset.symbol}
                    </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">{t.amount}</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-lg"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    {selectedAsset}
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">{t.address}</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                placeholder="0x..."
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!amount || !address || parseFloat(amount) > (currentAsset?.balance || 0)}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {t.send} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-10 animate-in fade-in zoom-in-95 relative z-10">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Transaction Sent!</h3>
            <p className="text-slate-400 mb-8">
              You have sent {amount} {selectedAsset} to <br/>
              <span className="font-mono text-indigo-300 text-xs bg-indigo-500/10 px-2 py-1 rounded mt-1 inline-block">{address}</span>
            </p>
            <button
              onClick={() => {
                setAmount('');
                setAddress('');
                setStep('input');
              }}
              className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              Send Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
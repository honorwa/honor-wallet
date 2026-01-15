import React, { useState } from "react";
import { CryptoOption } from "../types";
import { X } from "lucide-react";

const translations = {
  en: {
    title: "Add New Wallet",
    select: "Select a cryptocurrency to create a new wallet.",
    add: "Add Wallet",
    success: "Wallet added successfully!"
  },
  fr: {
    title: "Ajouter un Nouveau Portefeuille",
    select: "Sélectionnez une cryptomonnaie pour créer un nouveau portefeuille.",
    add: "Ajouter Portefeuille",
    success: "Portefeuille ajouté avec succès!"
  },
  es: {
    title: "Agregar Nueva Billetera",
    select: "Seleccione una criptomoneda para crear una nueva billetera.",
    add: "Agregar Billetera",
    success: "¡Billetera agregada con éxito!"
  },
  it: {
    title: "Aggiungi Nuovo Portafoglio",
    select: "Seleziona una criptovaluta per creare un nuovo portafoglio.",
    add: "Aggiungi Portafoglio",
    success: "Portafoglio aggiunto con successo!"
  }
};

interface AddWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableCryptos: CryptoOption[];
  onAddWallet: (crypto: CryptoOption) => void;
  language?: "en" | "fr" | "es" | "it";
}

export const AddWalletDialog: React.FC<AddWalletDialogProps> = ({ 
  isOpen, 
  onClose, 
  availableCryptos, 
  onAddWallet,
  language = "en"
}) => {
  const [selected, setSelected] = useState<CryptoOption | null>(null);
  const t = translations[language] || translations.en;

  if (!isOpen) return null;

  const handleAdd = () => {
    if (selected) {
      onAddWallet(selected);
      setSelected(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-400 text-sm">{t.select}</p>
          
          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {availableCryptos.map((crypto) => (
              <button
                key={crypto.symbol}
                onClick={() => setSelected(crypto)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  selected?.symbol === crypto.symbol
                    ? 'bg-indigo-500/20 border-indigo-500'
                    : 'bg-slate-800/50 border-white/10 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: crypto.color }}
                  >
                    {crypto.symbol[0]}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">{crypto.symbol}</p>
                    <p className="text-xs text-slate-400">{crypto.name}</p>
                  </div>
                </div>
                {selected?.symbol === crypto.symbol && (
                  <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            disabled={!selected}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            {t.add}
          </button>
        </div>
      </div>
    </div>
  );
};
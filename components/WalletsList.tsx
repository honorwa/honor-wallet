
import React from "react";
import { Asset } from "../types";
import { ShieldCheck, Zap } from "lucide-react";

interface WalletsListProps {
  wallets: Asset[];
  marketPrices?: Record<string, number>;
  language?: "en" | "fr" | "es" | "it";
}

const translations = {
    en: {
        noWallets: "No Active Wallets Detected",
        pending: "Pending Initialization...",
        statusLabel: "Status",
        active: "Active Wallet",
        marketRate: "Market Rate",
        available: "Available Balance",
        nav: "Net Asset Value"
    },
    fr: {
        noWallets: "Aucun portefeuille actif détecté",
        pending: "Initialisation en cours...",
        statusLabel: "Statut",
        active: "Portefeuille Actif",
        marketRate: "Taux du marché",
        available: "Solde Disponible",
        nav: "Valeur Nette"
    },
    es: {
        noWallets: "No se detectaron billeteras activas",
        pending: "Inicialización pendiente...",
        statusLabel: "Estado",
        active: "Billetera Activa",
        marketRate: "Tasa de mercado",
        available: "Saldo Disponible",
        nav: "Valor Neto"
    },
    it: {
        noWallets: "Nessun portafoglio attivo rilevato",
        pending: "Inizializzazione in corso...",
        statusLabel: "Stato",
        active: "Portafoglio Attivo",
        marketRate: "Tasso di mercato",
        available: "Saldo Disponibile",
        nav: "Valore Netto"
    }
};

export const WalletsList: React.FC<WalletsListProps> = ({ wallets, marketPrices = {}, language = "en" }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="space-y-5">
      {wallets.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950 rounded-[2.5rem] border border-white/5">
            <p className="text-[#D4AF37]/40 text-xs font-black uppercase tracking-widest">{t.noWallets}</p>
        </div>
      ) : (
        wallets.map((wallet) => {
          const currentPrice = marketPrices[wallet.symbol] || wallet.price;
          const currentValue = wallet.balance * currentPrice;

          return (
            <div
                key={wallet.id}
                className="p-8 bg-black border border-white/10 rounded-[2.5rem] hover:border-[#D4AF37]/40 transition-all group relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#D4AF37]/10 transition-colors"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 gap-6">
                <div className="flex items-center gap-6">
                    <div 
                    className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-black font-black text-xl shadow-xl border border-white/10"
                    style={{ background: `linear-gradient(135deg, ${wallet.color}, #000000)` }}
                    >
                    {wallet.symbol[0]}
                    </div>
                    <div>
                    <div className="flex items-center gap-3">
                        <h3 className="font-black text-white group-hover:text-[#D4AF37] transition-colors text-2xl uppercase tracking-tighter">{wallet.name}</h3>
                        <span className="text-[10px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full text-[#D4AF37] tracking-[0.2em] font-black uppercase">{wallet.symbol}</span>
                    </div>
                    <p className="text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2 font-mono">
                        <ShieldCheck className="w-3 h-3" />
                        {wallet.wallet_address ? wallet.wallet_address.substring(0, 12) + '...' + wallet.wallet_address.substring(wallet.wallet_address.length - 8) : t.pending}
                    </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[9px] text-[#D4AF37]/40 uppercase tracking-widest font-black mb-1">{t.statusLabel}</p>
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t.active}</span>
                    </div>
                </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5 relative z-10">
                <div className="space-y-1">
                    <p className="text-[9px] text-[#D4AF37]/40 uppercase tracking-widest font-black flex items-center gap-2">
                        <Zap className="w-3 h-3 text-emerald-400" /> {t.marketRate}
                    </p>
                    <p className="text-xl font-black text-white tracking-tight">
                        ${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] text-[#D4AF37]/40 uppercase tracking-widest font-black">{t.available}</p>
                    <p className="text-xl font-black text-white tracking-tight">{wallet.balance.toFixed(6)} <span className="text-xs text-zinc-600 font-bold">{wallet.symbol}</span></p>
                </div>
                <div className="sm:text-right space-y-1">
                    <p className="text-[9px] text-[#D4AF37]/40 uppercase tracking-widest font-black">{t.nav}</p>
                    <p className="text-3xl font-black text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-[#D4AF37]">${currentValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                </div>
            </div>
            );
        })
      )}
    </div>
  );
};

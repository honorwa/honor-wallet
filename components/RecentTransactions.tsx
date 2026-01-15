
import React from "react";
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, ShoppingCart, Settings, Clock } from "lucide-react";
import { Transaction } from "../types";

const translations = {
  en: { 
    title: "Recent Transactions",
    buy: "Buy",
    convert: "Convert",
    send: "Send",
    receive: "Receive",
    admin_adjustment: "Admin Adjustment",
    noTransactions: "No transactions yet",
    swap: "Swap"
  },
  fr: { 
    title: "Transactions Récentes",
    buy: "Achat",
    convert: "Convertir",
    send: "Envoyer",
    receive: "Recevoir",
    admin_adjustment: "Ajustement Admin",
    noTransactions: "Aucune transaction",
    swap: "Échange"
  }
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "buy": return ShoppingCart;
    case "convert": case "swap": return ArrowLeftRight;
    case "send": return ArrowUpRight;
    case "receive": return ArrowDownRight;
    case "admin_adjustment": return Settings;
    default: return ArrowLeftRight;
  }
};

interface RecentTransactionsProps {
  transactions: Transaction[];
  language?: "en" | "fr" | "es" | "it";
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, language = "en" }) => {
  const t = translations[language === 'fr' ? 'fr' : 'en'];

  // Filter out admin adjustments for regular users
  const visibleTransactions = transactions.filter(tx => tx.type !== 'admin_adjustment');
  
  // Logic: Check if any transaction occurred in the last 24 hours
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = new Date();
  const recentActivity = visibleTransactions.filter(tx => {
    const txDate = new Date(tx.date);
    return (now.getTime() - txDate.getTime()) < ONE_DAY_MS;
  });

  return (
    <div className="p-8 rounded-[2rem] bg-zinc-950 border border-[#D4AF37]/20 backdrop-blur-sm shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      
      <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-3">
        {t.title}
        <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent"></div>
      </h3>

      <div className="space-y-4">
        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border border-dashed border-[#D4AF37]/20 rounded-2xl bg-black/20">
             <Clock className="w-10 h-10 text-[#D4AF37]/50 animate-pulse" />
             <p className="text-[#D4AF37] font-black text-sm uppercase tracking-widest max-w-xs leading-relaxed">
               Nothing new, waiting for some movement
             </p>
             <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">
               Remember the market is always moving
             </p>
          </div>
        ) : (
          visibleTransactions.slice(0, 5).map((tx) => {
            const Icon = getTransactionIcon(tx.type);
            const isPositive = tx.type === 'receive' || tx.type === 'buy';
            
            return (
              <div
                key={tx.id}
                className="p-4 bg-black rounded-xl border border-white/5 hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 ${
                    isPositive ? 'bg-emerald-950/30 text-emerald-500' : 
                    'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                      {t[tx.type as keyof typeof t] || tx.type}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">
                      {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black tracking-tight ${isPositive ? 'text-emerald-500' : 'text-white'}`}>
                      {isPositive ? '+' : ''}{tx.amount.toFixed(4)} {tx.asset}
                    </p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{tx.status}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

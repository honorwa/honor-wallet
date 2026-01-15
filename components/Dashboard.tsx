
import React from 'react';
import { Asset, Transaction, Page, User } from '../types';
import { Send, Wallet, RefreshCw, TrendingUp, ShieldCheck } from 'lucide-react';
import { RecentTransactions } from './RecentTransactions';
import { LiveRates } from './LiveRates';

interface DashboardProps {
  assets: Asset[];
  transactions: Transaction[];
  language?: "en" | "fr" | "es" | "it";
  onNavigate: (page: Page) => void;
  user: User;
  marketPrices?: Record<string, number>;
}

export const Dashboard: React.FC<DashboardProps> = ({ assets, transactions, language = "en", onNavigate, user, marketPrices = {} }) => {
  const totalBalance = assets.reduce((acc, curr) => acc + curr.value, 0);
  
  const translations = {
    en: { total: "Consolidated Portfolio Value", send: "Direct Transfer", wallets: "Wallets Access", swap: "Convert Asset", welcome: "Greetings, Honor Member" },
    fr: { total: "Valeur du Portefeuille", send: "Transfert", wallets: "Accès Portefeuille", swap: "Convertir", welcome: "Bienvenue" },
    es: { total: "Valor del Portafolio", send: "Transferir", wallets: "Acceso Billetera", swap: "Convertir", welcome: "Bienvenido" },
    it: { total: "Valore Portafoglio", send: "Trasferimento", wallets: "Accesso Portafoglio", swap: "Converti", welcome: "Bentornato" }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="lg:hidden bg-zinc-950 border border-[#D4AF37]/20 rounded-3xl p-6 flex items-center gap-4 mb-2 shadow-2xl">
        <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#D4AF37]/20">
           {user.full_name.charAt(0)}
        </div>
        <div>
           <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">{t.welcome}</p>
           <h2 className="text-white text-xl font-black uppercase tracking-widest">{user.full_name.split(' ')[0]}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-black border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.05)] relative overflow-hidden group flex flex-col justify-between min-h-[380px]">
          {/* Subtle gold flare background */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#D4AF37]/15 transition-colors duration-700" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] opacity-60" />
                <h2 className="text-[#D4AF37]/60 text-[10px] font-black tracking-[0.3em] uppercase">{t.total}</h2>
            </div>
            
            <div className="flex items-end gap-6 mb-12">
              <span className="text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                <TrendingUp className="w-3 h-3" />
                <span>+2.45%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
              <button 
                onClick={() => onNavigate(Page.SEND)}
                className="bg-[#D4AF37] text-black hover:bg-[#FFD700] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/20 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                {t.send}
              </button>
              <button 
                onClick={() => onNavigate(Page.PORTFOLIO)}
                className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-[#D4AF37]/20 backdrop-blur-md active:scale-[0.98]"
              >
                <Wallet className="w-4 h-4 text-[#D4AF37]" /> {t.wallets}
              </button>
              <button 
                onClick={() => onNavigate(Page.CONVERT)}
                className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-[#D4AF37]/20 backdrop-blur-md active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" /> {t.swap}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 h-full">
          <LiveRates marketPrices={marketPrices} language={language} />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <RecentTransactions transactions={transactions} language={language} />
      </div>
    </div>
  );
};


import React from 'react';
import { Page } from '../types';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Headphones, 
  User as UserIcon,
  Shield, 
  Users, 
  LogOut, 
  Globe,
  Bot,
  Send
} from 'lucide-react';

const translations = {
  en: {
    dashboard: "Dashboard",
    wallets: "Wallets",
    convert: "Exchange",
    send: "Transfer",
    ai_advisor: "Honor Analyst",
    support: "Support",
    profile: "Security",
    admin: "Admin Console",
    users: "Member List",
    logout: "Secure Exit"
  },
  fr: {
    dashboard: "Tableau de bord",
    wallets: "Portefeuilles",
    convert: "Échange",
    send: "Transfert",
    ai_advisor: "Analyste IA",
    support: "Support",
    profile: "Sécurité",
    admin: "Console Admin",
    users: "Membres",
    logout: "Déconnexion"
  },
  es: {
    dashboard: "Tablero",
    wallets: "Billeteras",
    convert: "Intercambio",
    send: "Transferir",
    ai_advisor: "Analista IA",
    support: "Soporte",
    profile: "Seguridad",
    admin: "Consola Admin",
    users: "Miembros",
    logout: "Salida Segura"
  },
  it: {
    dashboard: "Dashboard",
    wallets: "Portafogli",
    convert: "Scambio",
    send: "Trasferimento",
    ai_advisor: "Analista IA",
    support: "Supporto",
    profile: "Sicurezza",
    admin: "Console Admin",
    users: "Membri",
    logout: "Uscita Sicura"
  }
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentPage: Page;
  setPage: (page: Page) => void;
  language: "en" | "fr" | "es" | "it";
  setLanguage: (lang: "en" | "fr" | "es" | "it") => void;
  user?: { full_name: string; email: string; role: string };
  onLogout?: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  currentPage, 
  setPage, 
  language,
  setLanguage,
  user = { full_name: "Honor Member", email: "alex@honor.com", role: "admin" },
  onLogout
}) => {
  const t = translations[language] || translations.en;
  const isAdmin = user?.role === 'admin';

  const userNavItems = [
    { page: Page.DASHBOARD, label: t.dashboard, icon: LayoutDashboard },
    { page: Page.PORTFOLIO, label: t.wallets, icon: Wallet },
    { page: Page.SEND, label: t.send, icon: Send },
    { page: Page.CONVERT, label: t.convert, icon: ArrowLeftRight },
    { page: Page.AI_ADVISOR, label: t.ai_advisor, icon: Bot },
    { page: Page.SUPPORT, label: t.support, icon: Headphones },
    { page: Page.PROFILE, label: t.profile, icon: UserIcon },
  ];

  const adminNavItems = [
    { page: Page.ADMIN_DASHBOARD, label: t.admin, icon: Shield },
    { page: Page.ADMIN_USERS, label: t.users, icon: Users },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/98 backdrop-blur-xl z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-black border-r border-[#D4AF37]/20
        transform transition-transform duration-500 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-[#D4AF37]/10 flex flex-col items-center">
            <Logo className="w-16 h-16 mb-4" />
            <div className="text-center">
                <h2 className="font-black text-white text-lg tracking-[0.4em] bg-clip-text text-transparent bg-gradient-to-b from-[#FFD700] to-[#B8860B]">HONOR</h2>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>
                    <p className="text-[8px] text-[#D4AF37] uppercase tracking-[0.3em] font-black opacity-60">Verified Secure</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-10 custom-scrollbar">
          <nav className="space-y-1.5">
            {userNavItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setPage(item.page);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                  ${currentPage === item.page 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] shadow-inner border border-[#D4AF37]/10' 
                    : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-[#D4AF37]/80'
                  }
                `}
              >
                {currentPage === item.page && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#D4AF37] rounded-r-full shadow-[0_0_15px_#D4AF37]"></div>
                )}
                <item.icon className={`w-5 h-5 transition-colors ${currentPage === item.page ? 'text-[#D4AF37]' : 'text-zinc-600 group-hover:text-[#D4AF37]'}`} />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </nav>

          {isAdmin && (
            <div className="pt-6 border-t border-[#D4AF37]/5">
              <div className="px-4 py-2 text-[8px] font-black text-[#D4AF37]/30 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Administrative
              </div>
              <nav className="space-y-1.5">
                {adminNavItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      setPage(item.page);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                      ${currentPage === item.page 
                        ? 'bg-[#B8860B]/20 text-[#FFD700]' 
                        : 'text-zinc-600 hover:bg-zinc-900/50 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 transition-colors ${currentPage === item.page ? 'text-[#FFD700]' : 'text-zinc-700 group-hover:text-white'}`} />
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className="border-t border-[#D4AF37]/10 p-6 space-y-6 bg-[#030303]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-600 hover:text-[#D4AF37] transition-colors cursor-pointer group">
                <Globe className="w-4 h-4" />
                <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-zinc-900 text-zinc-300 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none cursor-pointer px-2 py-1 rounded border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors"
                >
                <option value="en" className="bg-zinc-900 text-white">English</option>
                <option value="fr" className="bg-zinc-900 text-white">Français</option>
                <option value="es" className="bg-zinc-900 text-white">Español</option>
                <option value="it" className="bg-zinc-900 text-white">Italiano</option>
                </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-950 border border-white/5 transition-all cursor-pointer group hover:border-[#D4AF37]/30">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#8B4513] rounded-full flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
              <span className="text-black font-black text-xs">
                {user?.full_name?.charAt(0) || "H"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-[9px] uppercase tracking-[0.2em] truncate">{user?.full_name}</p>
              <p className="text-[8px] text-[#D4AF37] font-black truncate opacity-40 uppercase tracking-widest">Honor Identity</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-xl transition-all group"
            >
              <LogOut className="w-4 h-4 text-zinc-600 group-hover:text-red-500" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

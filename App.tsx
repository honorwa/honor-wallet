
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';
import { AIAssistant } from './components/AIAssistant';
import { EditWalletDialog } from './components/EditWalletDialog';
import { AddWalletDialog } from './components/AddWalletDialog';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminUsers } from './components/AdminUsers';
import { AdminSupport } from './components/AdminSupport';
import { Support } from './components/Support';
import { Profile } from './components/Profile';
import { BuyCrypto } from './components/BuyCrypto';
import { Convert } from './components/Convert';
import { SendCrypto } from './components/SendCrypto';
import { AuthPage } from './components/AuthPageFirebase';
import { Page, Asset, Transaction, CryptoOption, User, SupportTicket, KYCRequest } from './types';
import { MOCK_TRANSACTIONS, AVAILABLE_CRYPTOS, MOCK_TICKETS } from './constants';
import { Logo } from './components/Logo';
import { fetchLivePrices } from './services/geminiService';
import { authService } from './services/authServiceCompat';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [language, setLanguage] = useState<"en" | "fr" | "es" | "it">("en");
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([]);
  
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isAddWalletDialogOpen, setIsAddWalletDialogOpen] = useState(false);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    authService.init();
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
        setCurrentUser(existingUser);
        setAssets(authService.getUserAssets(existingUser.id));
    }
    // Load mock KYC requests
    const storedKYC = localStorage.getItem('honor_kyc_requests');
    if (storedKYC) setKycRequests(JSON.parse(storedKYC));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAssets(authService.getUserAssets(user.id));
    if(user.role === 'admin') {
        setUsers(authService.getAllUsers());
        const storedKYC = localStorage.getItem('honor_kyc_requests');
        if (storedKYC) setKycRequests(JSON.parse(storedKYC));
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAssets([]);
  };

  const handleKycSubmit = (req: KYCRequest) => {
      const newRequests = [...kycRequests, req];
      setKycRequests(newRequests);
      localStorage.setItem('honor_kyc_requests', JSON.stringify(newRequests));
      
      // Update local user status to pending
      if (currentUser) {
          const updated = { ...currentUser, kyc_status: 'pending' as const };
          setCurrentUser(updated);
          localStorage.setItem('honor_current_user', JSON.stringify(updated));
          
          // Update in users list
          const allUsers = authService.getAllUsers();
          const idx = allUsers.findIndex(u => u.id === currentUser.id);
          if (idx !== -1) {
              allUsers[idx].kyc_status = 'pending';
              localStorage.setItem('honor_users', JSON.stringify(allUsers));
          }
      }
  };

  // Prevent restricted actions if user is On Hold
  const checkRestriction = (): boolean => {
      if (currentUser?.status === 'on_hold') {
          alert("Action Restricted: Your account is currently ON HOLD. Please contact support.");
          return false;
      }
      return true;
  };

  useEffect(() => {
    if (!currentUser) return;
    const updatePrices = async () => {
        const symbols = AVAILABLE_CRYPTOS.map(c => c.symbol);
        const newPrices = await fetchLivePrices();
        if (Object.keys(newPrices).length > 0) {
            setMarketPrices(newPrices);
            setAssets(prev => {
                const next = prev.map(asset => {
                    const price = newPrices[asset.symbol] || asset.price;
                    return { ...asset, price, value: price * asset.balance };
                });
                authService.updateUserAssets(currentUser.id, next);
                return next;
            });
        }
    };
    updatePrices();
    const intervalId = setInterval(updatePrices, 30000); // 30s sync for "actual to date"
    return () => clearInterval(intervalId);
  }, [currentUser]);

  const handleUpdateAsset = (assetId: string, newBalance: number, newAddress?: string) => {
    if (!currentUser) return;
    setAssets(prev => {
        const next = prev.map(a => a.id === assetId ? { 
            ...a, 
            balance: newBalance, 
            value: newBalance * a.price,
            wallet_address: newAddress ?? a.wallet_address 
        } : a);
        authService.updateUserAssets(currentUser.id, next);
        return next;
    });
  };

  const handleAddWallet = (crypto: CryptoOption) => {
      if (!currentUser || !checkRestriction()) return;
      const newAssets = authService.enableWallet(currentUser.id, crypto.symbol);
      setAssets(newAssets);
      setIsAddWalletDialogOpen(false);
  };

  const handleTransaction = (tx: Transaction) => {
      setTransactions(prev => [tx, ...prev]);
      
      // Calculate Fee based on User Profile
      if (currentUser?.status === 'active' && currentUser.fee_percentage && currentUser.fee_percentage > 0 && tx.type !== 'receive') {
          const feeAmount = tx.amount * (currentUser.fee_percentage / 100);
          const feeTx: Transaction = {
              id: `fee_${Date.now()}`,
              type: 'fee_collection',
              asset: tx.asset,
              amount: feeAmount,
              date: new Date().toISOString(),
              status: 'completed',
              description: 'Service Fee'
          };
          setTransactions(prev => [feeTx, ...prev]);
      }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD: return <Dashboard assets={assets} transactions={transactions} language={language} onNavigate={setCurrentPage} user={currentUser!} marketPrices={marketPrices} />;
      case Page.PORTFOLIO: return <Portfolio assets={assets} language={language} marketPrices={marketPrices} />;
      case Page.AI_ADVISOR: return <AIAssistant assets={assets} />;
      case Page.ADMIN_DASHBOARD: return <AdminDashboard users={users} assets={assets} tickets={tickets} transactions={transactions} kycRequests={kycRequests} onProcessKYC={(id, approved) => {
          // Process KYC
          const req = kycRequests.find(r => r.id === id);
          if (!req) return;
          const updatedRequests = kycRequests.map(r => r.id === id ? { ...r, status: approved ? 'approved' : 'rejected' } : r);
          setKycRequests(updatedRequests as KYCRequest[]); // Cast to avoid strict literal type issues
          localStorage.setItem('honor_kyc_requests', JSON.stringify(updatedRequests));

          // Update user verified status
          const allUsers = authService.getAllUsers();
          const uIdx = allUsers.findIndex(u => u.id === req.userId);
          if (uIdx !== -1) {
              allUsers[uIdx].kyc_status = approved ? 'verified' : 'rejected';
              allUsers[uIdx].verified = approved;
              setUsers(allUsers);
              localStorage.setItem('honor_users', JSON.stringify(allUsers));
          }
      }} />;
      case Page.ADMIN_USERS: return <AdminUsers users={users} onUpdateUser={(id, updates) => {
          const updatedUsers = users.map(u => u.id === id ? { ...u, ...updates } : u);
          setUsers(updatedUsers);
          localStorage.setItem("honor_users", JSON.stringify(updatedUsers));
          if (id === currentUser?.id && updates.role) {
              setCurrentUser({ ...currentUser, ...updates });
          }
      }} assets={assets} onUpdateUserAsset={(uid, aid, amt) => {
          const userAssets = authService.getUserAssets(uid);
          const updated = userAssets.map(a => a.id === aid ? { ...a, balance: amt, value: amt * a.price } : a);
          authService.updateUserAssets(uid, updated);
      }} currentUserRole={currentUser?.role} />;
      case Page.PROFILE: return <Profile user={currentUser!} onSubmitKYC={handleKycSubmit} />;
      
      case Page.SEND: return <SendCrypto assets={assets} onSend={(sym, amt, addr) => {
          if (!checkRestriction()) return;
          const asset = assets.find(a => a.symbol === sym);
          if (asset && asset.balance >= amt) {
              handleUpdateAsset(asset.id, asset.balance - amt);
              handleTransaction({ 
                  id: `tx_${Date.now()}`, 
                  type: 'send', 
                  asset: sym, 
                  amount: amt, 
                  date: new Date().toISOString(), 
                  status: 'completed', 
                  counterparty: addr 
              });
          }
      }} language={language} />;
      
      case Page.CONVERT: return <Convert assets={assets} marketPrices={marketPrices} feePercentage={currentUser?.fee_percentage || 0.5} onConvert={(from, to, amt, out, fee) => {
           if (!checkRestriction()) return;
           const fromAsset = assets.find(a => a.symbol === from);
           const toAsset = assets.find(a => a.symbol === to);
           if (fromAsset) handleUpdateAsset(fromAsset.id, fromAsset.balance - amt);
           // Update target asset balance logic would go here
           if (toAsset) handleUpdateAsset(toAsset.id, toAsset.balance + out);
           else {
               // Enable wallet if not enabled
               authService.enableWallet(currentUser!.id, to);
               // Then update (fetching new assets first)
               const newAssets = authService.getUserAssets(currentUser!.id);
               const newToAsset = newAssets.find(a => a.symbol === to);
               if (newToAsset) {
                   newToAsset.balance = out;
                   newToAsset.value = out * newToAsset.price;
                   authService.updateUserAssets(currentUser!.id, newAssets);
                   setAssets(newAssets);
               }
           }
           handleTransaction({ 
              id: `tx_${Date.now()}`, 
              type: 'convert', 
              asset: from, 
              amount: amt, 
              date: new Date().toISOString(), 
              status: 'completed', 
              description: `Converted to ${out} ${to}` 
           });
      }} />;

      case Page.BUY: return <BuyCrypto marketPrices={marketPrices} onBuy={(amount, crypto, fee, method, provider) => {
          if (!checkRestriction()) return;
          // Use the price from the crypto object (which now includes live price if updated in BuyCrypto)
          // Or we can recount value based on marketPrices[crypto.symbol] here if needed. 
          // The crypto object passed back from BuyCrypto should have the price used for calculation.
          
          const asset = assets.find(a => a.symbol === crypto.symbol);
          if (asset) {
              handleUpdateAsset(asset.id, asset.balance + amount);
              handleTransaction({
                  id: `tx_${Date.now()}`,
                  type: 'buy',
                  asset: crypto.symbol,
                  amount: amount,
                  date: new Date().toISOString(),
                  status: 'completed',
                  description: `Bought ${amount} ${crypto.symbol} via ${provider || method}`
              });
          } else {
             // Handle case if asset doesn't exist (e.g. enable it)
             const newAssets = authService.enableWallet(currentUser!.id, crypto.symbol);
             setAssets(newAssets);
             // Then update balance (fetch fresh to be sure)
             const freshAssets = authService.getUserAssets(currentUser!.id);
             const targetAsset = freshAssets.find(a => a.symbol === crypto.symbol);
             if (targetAsset) {
                 targetAsset.balance = amount;
                 targetAsset.value = amount * (marketPrices[crypto.symbol] || crypto.price);
                 authService.updateUserAssets(currentUser!.id, freshAssets);
                 setAssets(freshAssets);
             }
             
             handleTransaction({
                  id: `tx_${Date.now()}`,
                  type: 'buy',
                  asset: crypto.symbol,
                  amount: amount,
                  date: new Date().toISOString(),
                  status: 'completed',
                  description: `Bought ${amount} ${crypto.symbol} via ${provider || method}`
              });
          }
      }} onNavigate={setCurrentPage} />;

      case Page.SUPPORT: return <Support
        tickets={tickets.filter(t => t.user_email === currentUser?.email)}
        userEmail={currentUser!.email}
        onCreateTicket={(t) => setTickets(prev => [...prev, { ...t, id: `t_${Date.now()}`, created_at: new Date().toISOString() }])}
      />;

      case Page.ADMIN_SUPPORT: return <AdminSupport tickets={tickets} onUpdateTicket={(id, updates) => setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))} />;

      default: return <Dashboard assets={assets} transactions={transactions} onNavigate={setCurrentPage} user={currentUser!} marketPrices={marketPrices} />;
    }
  };

  if (!currentUser) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className={`dark min-h-screen bg-black`}>
        <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
            <EditWalletDialog isOpen={isWalletDialogOpen} onClose={() => setIsWalletDialogOpen(false)} assets={assets} onUpdateAsset={handleUpdateAsset} userEmail={currentUser.email} />
            <AddWalletDialog isOpen={isAddWalletDialogOpen} onClose={() => setIsAddWalletDialogOpen(false)} availableCryptos={AVAILABLE_CRYPTOS.filter(c => !assets.some(a => a.symbol === c.symbol))} onAddWallet={handleAddWallet} />
            
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage={currentPage} setPage={setCurrentPage} language={language} setLanguage={setLanguage} user={currentUser} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
            <div className="flex-1 flex flex-col min-h-screen z-10 relative">
                <header className="lg:hidden bg-black/60 backdrop-blur-xl border-b border-[#D4AF37]/20 px-4 py-4 sticky top-0 z-30 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu className="w-6 h-6 text-[#D4AF37]" /></button>
                    <Logo className="w-8 h-8" />
                    <h1 className="text-lg font-black text-[#D4AF37] tracking-[0.2em]">HONOR</h1>
                </header>
                <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                    <div className="hidden lg:flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-5xl font-black text-white uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#B8860B]">
                                {currentPage.replace('_', ' ')}
                            </h1>
                            <p className="text-[#D4AF37]/50 text-xs mt-3 font-black uppercase tracking-[0.3em]">Honor Secure Gateway | {currentUser.full_name}</p>
                        </div>
                        {currentPage === Page.DASHBOARD && (
                            <div className="flex gap-4">
                                <button onClick={() => setIsAddWalletDialogOpen(true)} className="px-8 py-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-[#D4AF37]/20">Acquire Asset</button>
                            </div>
                        )}
                    </div>
                    {renderPage()}
                </main>
            </div>
        </div>
    </div>
  );
}
export default App;

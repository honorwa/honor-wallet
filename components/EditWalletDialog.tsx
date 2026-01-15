
import React, { useState, useEffect } from "react";
import { Asset } from "../types";
import { X, User, Key, Database } from "lucide-react";

interface EditWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onUpdateAsset: (id: string, newBalance: number, newAddress?: string) => void;
  userEmail?: string;
}

export const EditWalletDialog: React.FC<EditWalletDialogProps> = ({ 
  isOpen, 
  onClose, 
  assets, 
  onUpdateAsset,
  userEmail = "honor.member@honorwallet.com"
}) => {
  const [editStates, setEditStates] = useState<{ [key: string]: { balance: string, address: string } }>({});

  useEffect(() => {
    if (isOpen) {
      const initial = assets.reduce((acc, asset) => ({
        ...acc,
        [asset.id]: { 
            balance: asset.balance.toString(), 
            address: asset.wallet_address || '' 
        }
      }), {});
      setEditStates(initial);
    }
  }, [isOpen, assets]);

  if (!isOpen) return null;

  const handleUpdate = (asset: Asset) => {
    const state = editStates[asset.id];
    const newBal = parseFloat(state.balance);
    if (!isNaN(newBal)) {
      onUpdateAsset(asset.id, newBal, state.address);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-[#D4AF37]/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-[#D4AF37]/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Wallet Management</h2>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-[#D4AF37] transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-[#D4AF37]/60 text-[10px] font-black uppercase tracking-widest">
            <User className="w-3 h-3" />
            <span>{userEmail}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/40">
          {assets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 flex flex-col gap-6 hover:border-[#D4AF37]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                  <span className="text-black font-black text-sm">{wallet.symbol}</span>
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-wider text-sm">{wallet.name}</h4>
                  <p className="text-[10px] text-[#D4AF37]/40 uppercase tracking-widest font-black">Authorized Cryptographic Asset</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-2">
                        <Database className="w-3 h-3" /> Ledger Balance
                    </label>
                    <input
                        type="number"
                        value={editStates[wallet.id]?.balance || ''}
                        onChange={(e) => setEditStates({ ...editStates, [wallet.id]: { ...editStates[wallet.id], balance: e.target.value } })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-2">
                        <Key className="w-3 h-3" /> Public Wallet Address
                    </label>
                    <input
                        type="text"
                        value={editStates[wallet.id]?.address || ''}
                        onChange={(e) => setEditStates({ ...editStates, [wallet.id]: { ...editStates[wallet.id], address: e.target.value } })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                        placeholder="Enter wallet number"
                    />
                </div>
              </div>

              <button
                onClick={() => handleUpdate(wallet)}
                className="w-full py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                Synchronize Changes
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

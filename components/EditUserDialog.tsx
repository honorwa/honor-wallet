
import React, { useState } from "react";
import { User } from "../types";
import { X, Shield, AlertTriangle, DollarSign } from "lucide-react";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({ 
  isOpen, 
  onClose, 
  user,
  onUpdateUser
}) => {
  const [status, setStatus] = useState<'active' | 'suspended' | 'on_hold'>(user.status || 'active');
  const [isVerified, setIsVerified] = useState<boolean>(user.verified || false);
  const [fee, setFee] = useState<string>(user.fee_percentage?.toString() || '0');

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser(user.id, { 
        status, 
        verified: isVerified,
        fee_percentage: parseFloat(fee)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#151A25] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Edit User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-[#0B0E14] p-4 rounded-xl flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold">
                {user.full_name.charAt(0)}
             </div>
             <div>
                <p className="text-white font-medium">{user.full_name}</p>
                <p className="text-slate-400 text-sm">{user.email}</p>
             </div>
          </div>

          <div className="space-y-4">
             <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Account Status</label>
                <div className="grid grid-cols-3 gap-2">
                    <button 
                        onClick={() => setStatus('active')}
                        className={`py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${status === 'active' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-white/10 text-slate-400'}`}
                    >
                        Active
                    </button>
                    <button 
                        onClick={() => setStatus('on_hold')}
                        className={`py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${status === 'on_hold' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'border-white/10 text-slate-400'}`}
                    >
                        On Hold
                    </button>
                    <button 
                        onClick={() => setStatus('suspended')}
                        className={`py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${status === 'suspended' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-white/10 text-slate-400'}`}
                    >
                        Suspend
                    </button>
                </div>
                {status === 'on_hold' && (
                    <p className="text-[10px] text-amber-500 mt-2 flex items-center gap-1">
                        <AlertTriangle size={10} /> Funds frozen. User cannot withdraw/trade.
                    </p>
                )}
             </div>

             {status === 'active' && (
                 <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Transaction Fee (%)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="number"
                            step="0.01"
                            value={fee}
                            onChange={e => setFee(e.target.value)}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Applied to all outgoing transactions.</p>
                 </div>
             )}

             <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Verification Level</label>
                <div 
                    onClick={() => setIsVerified(!isVerified)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between ${isVerified ? 'bg-blue-500/10 border-blue-500' : 'bg-[#0B0E14] border-white/10'}`}
                >
                    <div className="flex items-center gap-3">
                        <Shield className={`w-5 h-5 ${isVerified ? 'text-blue-500' : 'text-slate-500'}`} />
                        <span className={isVerified ? 'text-blue-400' : 'text-slate-400'}>
                            {isVerified ? 'Identity Verified' : 'Unverified'}
                        </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isVerified ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                        {isVerified && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                </div>
             </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

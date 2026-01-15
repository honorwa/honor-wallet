
import React, { useState } from "react";
import { User, Asset } from "../types";
import { Search, Edit, Wallet, AlertTriangle } from "lucide-react";
import { EditUserDialog } from "./EditUserDialog";
import { EditWalletDialog } from "./EditWalletDialog";

interface AdminUsersProps {
  users: User[];
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  assets: Asset[];
  onUpdateUserAsset: (userId: string, assetId: string, amount: number) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onUpdateUser, assets, onUpdateUserAsset }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingWalletsFor, setEditingWalletsFor] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {editingUser && (
        <EditUserDialog 
            isOpen={true} 
            user={editingUser} 
            onClose={() => setEditingUser(null)} 
            onUpdateUser={onUpdateUser}
        />
      )}

      {editingWalletsFor && (
        <EditWalletDialog 
            isOpen={true}
            onClose={() => setEditingWalletsFor(null)}
            assets={assets} // Note: in real implementation, fetch specific user assets here
            onUpdateAsset={(id, val) => onUpdateUserAsset(editingWalletsFor.id, id, val)}
            userEmail={editingWalletsFor.email}
        />
      )}

      <div className="bg-[#151A25] border border-white/5 backdrop-blur-xl p-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-[#0B0E14] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className={`p-6 bg-[#0B0E14] rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                u.status === 'on_hold' ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg border border-white/10">
                  <span className="text-white font-bold text-lg">
                    {u.full_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-lg">{u.full_name}</h3>
                    {u.verified && <span className="w-2 h-2 bg-blue-500 rounded-full" title="Verified"></span>}
                  </div>
                  <p className="text-sm text-slate-400">{u.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-400"}`}>
                    {u.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                        u.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : 
                        u.status === 'on_hold' ? "bg-amber-500/10 text-amber-500" : 
                        "bg-red-500/10 text-red-400"
                    }`}>
                    {u.status === 'on_hold' && <AlertTriangle size={10} />}
                    {u.status.replace('_', ' ')}
                    </span>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                 <button 
                    onClick={() => setEditingWalletsFor(u)}
                    className="flex-1 md:flex-none px-4 py-2 bg-[#1C2333] hover:bg-[#252D40] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                 >
                    <Wallet className="w-4 h-4" /> Vaults
                 </button>
                 <button 
                    onClick={() => setEditingUser(u)}
                    className="flex-1 md:flex-none px-4 py-2 border border-white/10 hover:bg-white/5 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                 >
                    <Edit className="w-4 h-4" /> Edit
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

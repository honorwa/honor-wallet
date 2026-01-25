
import React, { useState } from "react";
import { User, Asset, SupportTicket, Transaction, KYCRequest } from "../types";
import { Users, AlertCircle, TrendingUp, DollarSign, FileText, Check, X, Eye } from "lucide-react";
import { KYCReviewModal } from "./KYCReviewModal";

interface AdminDashboardProps {
  users: User[];
  assets: Asset[];
  tickets: SupportTicket[];
  transactions?: Transaction[];
  kycRequests?: KYCRequest[];
  onProcessKYC?: (id: string, approved: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, assets, tickets, transactions = [], kycRequests = [], onProcessKYC }) => {
  const [selectedKYC, setSelectedKYC] = useState<KYCRequest | null>(null);

  const totalValue = assets.reduce((sum, wallet) => sum + wallet.value, 0) * 125; 
  const openTickets = tickets.filter(t => t.status === 'open');
  const pendingKYC = kycRequests.filter(k => k.status === 'pending');
  
  const totalFees = transactions
    .filter(t => t.type === 'fee_collection')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {selectedKYC && onProcessKYC && (
        <KYCReviewModal 
            isOpen={true}
            request={selectedKYC}
            onClose={() => setSelectedKYC(null)}
            onProcess={onProcessKYC}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-black to-zinc-900 border border-[#D4AF37]/20 backdrop-blur-xl p-6 rounded-2xl group">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-[#D4AF37]/70 text-sm font-black uppercase tracking-widest">Total Users</h3>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-[#D4AF37] transition-colors">{users.length}</div>
        </div>

        <div className="bg-gradient-to-br from-black to-zinc-900 border border-[#D4AF37]/20 backdrop-blur-xl p-6 rounded-2xl group">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-[#D4AF37]/70 text-sm font-black uppercase tracking-widest">Fees Collected</h3>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-[#D4AF37] transition-colors">${totalFees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>

        <div className="bg-gradient-to-br from-black to-zinc-900 border border-[#D4AF37]/20 backdrop-blur-xl p-6 rounded-2xl group">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-[#D4AF37]/70 text-sm font-black uppercase tracking-widest">Platform Value</h3>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-[#D4AF37] transition-colors">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-zinc-900 border border-[#D4AF37]/20 backdrop-blur-xl p-6 rounded-2xl group">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-[#D4AF37]/70 text-sm font-black uppercase tracking-widest">Open Tickets</h3>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-[#D4AF37] transition-colors">{openTickets.length}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending KYC Requests Panel */}
        <div className="bg-zinc-950 border border-white/5 backdrop-blur-xl p-6 rounded-2xl">
           <h3 className="text-white font-black uppercase tracking-wide mb-4 flex items-center gap-2">
               <FileText className="w-4 h-4 text-amber-500" />
               Pending KYC Requests
           </h3>
           <div className="space-y-3">
               {pendingKYC.length === 0 ? (
                   <p className="text-zinc-500 text-center py-8 text-xs uppercase tracking-widest">No pending verifications</p>
               ) : (
                   pendingKYC.map(req => (
                       <div key={req.id} className="p-4 bg-black rounded-lg border border-white/5 flex flex-col justify-between items-start gap-4">
                           <div className="w-full flex justify-between items-start">
                               <div>
                                    <p className="text-white font-bold text-sm">{req.userEmail}</p>
                                    <p className="text-xs text-zinc-500">Submitted: {new Date(req.submittedAt).toLocaleDateString()}</p>
                               </div>
                               <button 
                                   onClick={() => setSelectedKYC(req)}
                                   className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-xs font-bold uppercase rounded-lg transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
                               >
                                   <Eye size={14}/> Review
                               </button>
                           </div>
                       </div>
                   ))
               )}
           </div>
        </div>

        <div className="bg-zinc-950 border border-white/5 backdrop-blur-xl p-6 rounded-2xl">
          <h3 className="text-white font-black uppercase tracking-wide mb-4">Open Support Tickets</h3>
          <div className="space-y-3">
            {openTickets.length === 0 ? (
              <p className="text-zinc-500 text-center py-8 text-xs uppercase tracking-widest">No open tickets</p>
            ) : (
              openTickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="p-3 bg-black rounded-lg border border-white/5 hover:border-red-500/30 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-white text-sm">{ticket.subject}</p>
                    <span className="bg-red-500/20 text-red-400 text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-bold">{ticket.priority}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{ticket.user_email}</p>
                  <p className="text-xs text-zinc-400 mt-2 truncate">{ticket.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

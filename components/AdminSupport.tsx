
import React, { useState } from "react";
import { SupportTicket } from "../types";
import { MessageSquare, Headphones } from "lucide-react";
import { TicketDetailModal } from "./TicketDetailModal";
import { emailService } from "../services/emailService";

interface AdminSupportProps {
  tickets: SupportTicket[];
  onUpdateTicket: (id: string, updates: Partial<SupportTicket>) => void;
}

const statusColors = {
  open: "bg-blue-500/20 text-blue-300",
  in_progress: "bg-yellow-500/20 text-yellow-300",
  resolved: "bg-green-500/20 text-green-300",
  closed: "bg-slate-500/20 text-slate-300"
};

export const AdminSupport: React.FC<AdminSupportProps> = ({ tickets, onUpdateTicket }) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)]">
      {selectedTicket && (
        <TicketDetailModal
          isOpen={true}
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRespond={async (response) => {
            onUpdateTicket(selectedTicket.id, { 
                admin_response: response,
                status: 'resolved' // Auto-resolve on response, or add status selection in modal if needed 
            });
            await emailService.sendAdminReplyNotification(selectedTicket, response);
            setSelectedTicket(null);
          }}
        />
      )}

      <div className="overflow-y-auto custom-scrollbar h-full">
        <div className="bg-[#151A25] border border-white/5 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-6 text-xl">Support Inbox</h3>
          
          {tickets.length === 0 ? (
             <div className="text-center py-20 text-slate-500">
                <Headphones className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No support tickets yet.</p>
             </div>
          ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 rounded-xl border border-white/5 bg-[#0B0E14] hover:border-[#D4AF37]/30 hover:bg-[#0B0E14]/80 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${ticket.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-[#1C2333] text-slate-400 group-hover:text-[#D4AF37] transition-colors'}`}>
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{ticket.subject}</h3>
                          {ticket.admin_response && <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded font-bold uppercase">Replied</span>}
                      </div>
                      <p className="text-sm text-slate-400">{ticket.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2 line-clamp-1 ml-[52px]">{ticket.message}</p>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

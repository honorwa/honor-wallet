
import React, { useState } from "react";
import { SupportTicket } from "../types";
import { MessageSquare, Send, User } from "lucide-react";

interface SupportProps {
  tickets: SupportTicket[];
  onCreateTicket: (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'admin_response'>) => void;
  userEmail: string;
}

const statusColors = {
  open: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  resolved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  closed: "bg-slate-500/10 text-slate-400 border border-slate-500/20"
};

export const Support: React.FC<SupportProps> = ({ tickets, onCreateTicket, userEmail }) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;
    
    onCreateTicket({
      user_email: userEmail,
      subject,
      message,
      status: 'open',
      priority: 'medium'
    });

    setMessage("");
    setSubject("");
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex gap-6">
      {/* Ticket List */}
      <div className="w-1/3 flex flex-col bg-[#151A25] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-black/20">
            <h3 className="text-white font-bold">Your Tickets</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tickets.length === 0 && <p className="text-slate-500 text-center py-10 text-sm">No active support threads.</p>}
            {tickets.map(ticket => (
                <div key={ticket.id} className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusColors[ticket.status]}`}>{ticket.status}</span>
                        <span className="text-[10px] text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm truncate">{ticket.subject}</h4>
                    <p className="text-slate-400 text-xs truncate mt-1">{ticket.message}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#151A25] rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5 bg-black/20">
            <h2 className="text-xl font-bold text-white mb-1">Contact Support</h2>
            <p className="text-xs text-slate-400">Direct line to your Honor Concierge.</p>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-black" />
                </div>
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                    <p className="text-[#D4AF37] font-bold text-xs mb-1 uppercase tracking-wider">Honor Concierge</p>
                    <p className="text-white text-sm">Hello. How can we assist you with your assets today?</p>
                </div>
            </div>

            {tickets.map(ticket => (
                <React.Fragment key={ticket.id}>
                    <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-white">You</span>
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                             <p className="text-slate-400 font-bold text-xs mb-1 uppercase tracking-wider">{ticket.subject}</p>
                            <p className="text-white text-sm">{ticket.message}</p>
                            <p className="text-[10px] text-slate-500 mt-2 text-right">{new Date(ticket.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    {ticket.admin_response && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-black" />
                            </div>
                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                <p className="text-[#D4AF37] font-bold text-xs mb-1 uppercase tracking-wider">Honor Concierge</p>
                                <p className="text-white text-sm">{ticket.admin_response}</p>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
         </div>

         <div className="p-4 border-t border-white/5 bg-black/40">
             <form onSubmit={handleSend} className="space-y-3">
                 <input 
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    placeholder="Subject..."
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                 />
                 <div className="flex gap-2">
                    <textarea 
                        className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] resize-none h-12"
                        placeholder="Type your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <button 
                        type="submit"
                        disabled={!message || !subject}
                        className="bg-[#D4AF37] text-black rounded-xl px-6 font-bold hover:bg-[#FFD700] disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                 </div>
             </form>
         </div>
      </div>
    </div>
  );
};

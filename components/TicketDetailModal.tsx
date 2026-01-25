import React, { useState } from "react";
import { SupportTicket } from "../types";
import { X, Send, User, Clock, AlertTriangle } from "lucide-react";

interface TicketDetailModalProps {
  isOpen: boolean;
  ticket: SupportTicket;
  onClose: () => void;
  onRespond: (response: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ 
  isOpen, 
  ticket, 
  onClose, 
  onRespond 
}) => {
  const [response, setResponse] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    
    onRespond(response);
    setResponse("");
    onClose();
  };

  const statusColors = {
    open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    closed: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#151A25] w-full max-w-2xl rounded-2xl border border-[#D4AF37]/20 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[ticket.status]}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className="text-slate-500 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(ticket.created_at).toLocaleString()}
              </span>
              {ticket.priority === 'high' && (
                <span className="flex items-center gap-1 text-red-400 text-xs font-bold uppercase">
                  <AlertTriangle className="w-3 h-3" /> High Priority
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{ticket.subject}</h2>
            <p className="text-sm text-slate-400">From: <span className="text-white">{ticket.user_email}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Message */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl rounded-tl-none p-4">
                <p className="text-white text-sm whitespace-pre-wrap">{ticket.message}</p>
              </div>
            </div>
          </div>

          {/* Admin Response (if exists) */}
          {ticket.admin_response && (
             <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl rounded-tr-none p-4 text-right">
                    <p className="text-[#D4AF37] text-xs font-bold uppercase mb-1">Admin Response</p>
                    <p className="text-white text-sm whitespace-pre-wrap">{ticket.admin_response}</p>
                  </div>
                </div>
             </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              className="w-full h-32 bg-[#0B0E14] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF37] resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!response.trim()}
                className="bg-[#D4AF37] text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Send Response
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

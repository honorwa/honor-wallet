
import React, { useState } from "react";
import { SupportTicket } from "../types";
import { MessageSquare, Headphones, Sparkles, Loader2 } from "lucide-react";
import { generateTicketResponse } from "../services/geminiService";

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
  const [response, setResponse] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [isDrafting, setIsDrafting] = useState(false);

  const handleRespond = () => {
    if (!selectedTicket) return;
    
    const updates: Partial<SupportTicket> = {};
    if (response) updates.admin_response = response;
    if (newStatus) updates.status = newStatus as any;

    onUpdateTicket(selectedTicket.id, updates);
    setResponse("");
    setNewStatus("");
    setSelectedTicket(null);
  };

  const handleAiDraft = async () => {
    if (!selectedTicket) return;
    setIsDrafting(true);
    const draft = await generateTicketResponse({
        subject: selectedTicket.subject,
        message: selectedTicket.message,
        user_email: selectedTicket.user_email
    });
    setResponse(draft);
    setIsDrafting(false);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 overflow-y-auto custom-scrollbar">
        <div className="bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">All Support Tickets</h3>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                    setSelectedTicket(ticket);
                    setNewStatus(ticket.status);
                    setResponse(ticket.admin_response || "");
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-amber-500/20 border-amber-500'
                    : 'bg-slate-800/50 border-white/10 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${ticket.priority === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700/50 text-slate-300'}`}>
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{ticket.subject}</h3>
                      <p className="text-sm text-slate-400">{ticket.user_email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{ticket.message}</p>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                    {ticket.admin_response && <span className="text-xs text-amber-400">Responded</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-y-auto custom-scrollbar">
        <div className="bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sticky top-0">
          <h3 className="text-white font-semibold mb-4">Ticket Details</h3>
          {selectedTicket ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider">User</label>
                  <p className="text-white font-medium">{selectedTicket.user_email}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Subject</label>
                  <p className="text-white">{selectedTicket.subject}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Message</label>
                  <div className="mt-1 p-3 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-300">
                    {selectedTicket.message}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-400 block">Response</label>
                    <button 
                        onClick={handleAiDraft}
                        disabled={isDrafting}
                        className="text-xs flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20"
                    >
                        {isDrafting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                        {isDrafting ? "Drafting..." : "Draft with AI"}
                    </button>
                  </div>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response or use AI Draft..."
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white min-h-[120px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Status</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button
                  onClick={handleRespond}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Update Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Headphones className="w-12 h-12 mb-4 opacity-50" />
                <p>Select a ticket to respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { KYCRequest } from "../types";
import { X, Check, XCircle, FileText, User, Calendar, Mail } from "lucide-react";

interface KYCReviewModalProps {
  isOpen: boolean;
  request: KYCRequest;
  onClose: () => void;
  onProcess: (id: string, approved: boolean) => void;
}

export const KYCReviewModal: React.FC<KYCReviewModalProps> = ({ isOpen, request, onClose, onProcess }) => {
  const [viewingDoc, setViewingDoc] = useState<'id' | 'proof'>('id');

  if (!isOpen) return null;

  const handleApprove = () => {
    if (confirm("Are you sure you want to approve this KYC request? This will verify the user's account.")) {
        onProcess(request.id, true);
        onClose();
    }
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this request?")) {
        onProcess(request.id, false);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#151A25] w-full max-w-4xl rounded-2xl border border-[#D4AF37]/20 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                 Pending Verification
               </span>
               <span className="text-slate-500 text-xs flex items-center gap-1">
                 <Calendar className="w-3 h-3" />
                 {new Date(request.submittedAt).toLocaleString()}
               </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">KYC Review</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {request.userId}</span>
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {request.userEmail}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* Sidebar - Doc List */}
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 p-6 bg-black/20 overflow-y-auto">
                <h3 className="text-[#D4AF37] font-bold uppercase text-xs tracking-wider mb-4">Submitted Documents</h3>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => setViewingDoc('id')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                            viewingDoc === 'id' 
                            ? 'bg-slate-800 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' 
                            : 'bg-slate-900/50 border-white/10 hover:border-white/30'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${viewingDoc === 'id' ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-400'}`}>
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${viewingDoc === 'id' ? 'text-white' : 'text-slate-300'}`}>Identity Document</p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{request.idDocumentName}</p>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={() => setViewingDoc('proof')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                            viewingDoc === 'proof' 
                            ? 'bg-slate-800 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' 
                            : 'bg-slate-900/50 border-white/10 hover:border-white/30'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${viewingDoc === 'proof' ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-400'}`}>
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${viewingDoc === 'proof' ? 'text-white' : 'text-slate-300'}`}>Proof of Address</p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{request.proofDocumentName}</p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <h3 className="text-[#D4AF37] font-bold uppercase text-xs tracking-wider mb-4">Actions</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={handleApprove}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            <Check className="w-5 h-5" /> Approve KYC
                        </button>
                        <button 
                            onClick={handleReject}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <XCircle className="w-5 h-5" /> Reject Request
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Preview */}
            <div className="flex-1 bg-black/40 p-6 flex flex-col overflow-hidden">
                 <div className="flex-1 rounded-2xl border border-white/10 bg-[#0B0E14] flex items-center justify-center overflow-auto relative">
                     {/* Background Pattern */}
                     <div className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }} 
                     />
                     
                     {/* Document Image */}
                     {(viewingDoc === 'id' ? request.idDocumentData : request.proofDocumentData) ? (
                         <img 
                            src={viewingDoc === 'id' ? request.idDocumentData : request.proofDocumentData} 
                            alt="Document Preview" 
                            className="max-w-full max-h-full object-contain relative z-10 shadow-2xl"
                         />
                     ) : (
                         <div className="text-center text-slate-500 relative z-10">
                             <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                             <p>No preview available for this document.</p>
                             <p className="text-xs mt-2">Format used for simulation: Base64 string</p>
                         </div>
                     )}
                 </div>
                 <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                     <span>Document Preview Mode</span>
                     <span>Secure Viewer</span>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};

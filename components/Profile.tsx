
import React, { useState } from "react";
import { User, Shield, Smartphone, Globe, AlertTriangle, FileText, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { User as UserType, KYCRequest } from "../types";

interface ProfileProps {
  user: UserType;
  onSubmitKYC?: (req: KYCRequest) => void;
  language?: "en" | "fr" | "es" | "it";
}

const translations = {
    en: {
        personalInfo: "Personal Info",
        security: "Security",
        kyc: "Verification (KYC)",
        fullName: "Full Name",
        email: "Email",
        joinDate: "Join Date",
        feeTier: "Fee Tier",
        twoFactor: "Two-Factor Authentication",
        twoFactorDesc: "Use an app like Google Authenticator.",
        enabled: "Enabled",
        disabled: "Disabled",
        enable: "Enable 2FA",
        disable: "Disable 2FA",
        connectedDevices: "Current Session",
        revoke: "Revoke",
        verified: "You are Verified",
        pending: "Verification In Progress",
        kycDesc: "To comply with regulations, please upload your documents.",
        govtId: "Government ID",
        proofAddr: "Proof of Address",
        submit: "Submit Documents"
    },
    fr: {
        personalInfo: "Infos Personnelles",
        security: "Sécurité",
        kyc: "Vérification (KYC)",
        fullName: "Nom Complet",
        email: "Email",
        joinDate: "Date d'inscription",
        feeTier: "Niveau de frais",
        twoFactor: "Authentification à 2 facteurs",
        twoFactorDesc: "Utilisez Google Authenticator.",
        enabled: "Activé",
        disabled: "Désactivé",
        enable: "Activer 2FA",
        disable: "Désactiver 2FA",
        connectedDevices: "Session Actuelle",
        revoke: "Révoquer",
        verified: "Vous êtes vérifié",
        pending: "Vérification en cours",
        kycDesc: "Veuillez télécharger vos documents.",
        govtId: "Pièce d'identité",
        proofAddr: "Justificatif de domicile",
        submit: "Soumettre les documents"
    },
    es: {
        personalInfo: "Información Personal",
        security: "Seguridad",
        kyc: "Verificación (KYC)",
        fullName: "Nombre Completo",
        email: "Correo",
        joinDate: "Fecha de registro",
        feeTier: "Nivel de tarifa",
        twoFactor: "Autenticación de 2 factores",
        twoFactorDesc: "Usa Google Authenticator.",
        enabled: "Habilitado",
        disabled: "Deshabilitado",
        enable: "Activar 2FA",
        disable: "Desactivar 2FA",
        connectedDevices: "Sesión Actual",
        revoke: "Revocar",
        verified: "Estás verificado",
        pending: "Verificación en curso",
        kycDesc: "Por favor suba sus documentos.",
        govtId: "ID del Gobierno",
        proofAddr: "Prueba de dirección",
        submit: "Enviar Documentos"
    },
    it: {
        personalInfo: "Info Personali",
        security: "Sicurezza",
        kyc: "Verifica (KYC)",
        fullName: "Nome Completo",
        email: "Email",
        joinDate: "Data di iscrizione",
        feeTier: "Livello commissioni",
        twoFactor: "Autenticazione a 2 fattori",
        twoFactorDesc: "Usa Google Authenticator.",
        enabled: "Abilitato",
        disabled: "Disabilitato",
        enable: "Abilita 2FA",
        disable: "Disabilita 2FA",
        connectedDevices: "Sessione Corrente",
        revoke: "Revoca",
        verified: "Sei verificato",
        pending: "Verifica in corso",
        kycDesc: "Carica i tuoi documenti.",
        govtId: "Documento d'identità",
        proofAddr: "Prova di indirizzo",
        submit: "Invia Documenti"
    }
};

export const Profile: React.FC<ProfileProps> = ({ user, onSubmitKYC, language = "en" }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'kyc'>('info');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [kycFiles, setKycFiles] = useState({ id: null as File | null, proof: null as File | null });
  const [localStatus, setLocalStatus] = useState<'none' | 'pending' | 'verified' | 'rejected'>(user.kyc_status || 'none');
  const [uploading, setUploading] = useState(false);
  
  const t = translations[language] || translations.en;

  // Dynamic Session Info
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const platform = navigator.platform.split(' ')[0] || "Unknown OS";
  const browser = navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Safari") ? "Safari" : "Browser";

  const handleFileUpload = (type: 'id' | 'proof', file: File) => {
    setKycFiles(prev => ({ ...prev, [type]: file }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
      });
  };

  const submitKYC = async () => {
    if(!kycFiles.id || !kycFiles.proof) return;
    
    setUploading(true);

    try {
        const idBase64 = await convertToBase64(kycFiles.id);
        const proofBase64 = await convertToBase64(kycFiles.proof);

        setLocalStatus('pending');
        
        // Create Request Object with Data
        const request: KYCRequest = {
            id: `kyc_${Date.now()}`,
            userId: user.id,
            userEmail: user.email,
            idDocumentName: kycFiles.id.name,
            proofDocumentName: kycFiles.proof.name,
            idDocumentData: idBase64,
            proofDocumentData: proofBase64,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        if (onSubmitKYC) {
            onSubmitKYC(request);
        }
    } catch (error) {
        console.error("Error processing documents", error);
        alert("Error processing document files.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header with Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <span className="text-3xl text-white font-bold">{user.full_name.charAt(0)}</span>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
                <p className="text-slate-400">{user.email}</p>
                <div className="flex gap-2 mt-2">
                    <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold uppercase tracking-wide border border-indigo-500/30">
                    {user.role}
                    </span>
                    {user.status === 'on_hold' && (
                        <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-[10px] font-bold uppercase tracking-wide border border-red-500/30 flex items-center gap-1">
                            <AlertTriangle size={10} /> Account On Hold
                        </span>
                    )}
                </div>
            </div>
          </div>

          <div className="flex gap-1 bg-[#151A25] p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'info' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  {t.personalInfo}
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  {t.security}
              </button>
              <button 
                onClick={() => setActiveTab('kyc')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'kyc' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  {t.kyc}
              </button>
          </div>
      </div>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-white/10">
            <h3 className="text-white font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                {t.personalInfo}
            </h3>
            </div>
            <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider">{t.fullName}</label>
                <p className="text-white font-medium mt-1">{user.full_name}</p>
                </div>
                <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider">{t.email}</label>
                <p className="text-white font-medium mt-1">{user.email}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider">{t.joinDate}</label>
                <p className="text-slate-400 mt-1 font-mono">{new Date(user.join_date).toLocaleDateString()}</p>
                </div>
                <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider">{t.feeTier}</label>
                <p className="text-white font-medium mt-1">{user.fee_percentage ? `${user.fee_percentage}%` : 'Standard (0%)'}</p>
                </div>
            </div>
            </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* 2FA Section */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        {t.twoFactor}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                        {twoFactorEnabled ? t.enabled : t.disabled}
                    </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Authenticator App</p>
                        <p className="text-sm text-slate-400 mt-1">{t.twoFactorDesc}</p>
                    </div>
                    <button 
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${twoFactorEnabled ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                    >
                        {twoFactorEnabled ? t.disable : t.enable}
                    </button>
                </div>
            </div>

            {/* Connected Devices - Dynamic */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-400" />
                        {t.connectedDevices}
                    </h3>
                </div>
                <div className="divide-y divide-white/5">
                    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                {isMobile ? <Smartphone className="w-5 h-5 text-emerald-400" /> : <Globe className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{platform} - {browser}</p>
                                <p className="text-xs text-slate-400">Current Session • Active Now</p>
                            </div>
                        </div>
                        <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded">This Device</div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* KYC Tab */}
      {activeTab === 'kyc' && (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    {t.kyc}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-1
                    ${localStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                      localStatus === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                      'bg-slate-700 text-slate-400 border-slate-600'}`}>
                    {localStatus === 'verified' ? <CheckCircle size={12}/> : localStatus === 'pending' ? <Clock size={12}/> : <XCircle size={12}/>}
                    {localStatus.toUpperCase()}
                </span>
            </div>
            
            <div className="p-6 space-y-8">
                {localStatus === 'verified' ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">{t.verified}</h3>
                    </div>
                ) : localStatus === 'pending' ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20 animate-pulse">
                            <Clock className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">{t.pending}</h3>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-400 text-sm">
                            {t.kycDesc}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-black border border-white/10 border-dashed rounded-xl p-6 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer group relative">
                                <input type="file" onChange={(e) => e.target.files && handleFileUpload('id', e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D4AF37]/10 transition-colors">
                                    <User className="w-6 h-6 text-slate-400 group-hover:text-[#D4AF37]" />
                                </div>
                                <h4 className="text-white font-medium mb-1">{t.govtId}</h4>
                                <p className="text-xs text-slate-500">Passport, Driver's License</p>
                                {kycFiles.id && <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center justify-center gap-1"><CheckCircle size={10}/> {kycFiles.id.name}</p>}
                            </div>

                            <div className="bg-black border border-white/10 border-dashed rounded-xl p-6 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer group relative">
                                <input type="file" onChange={(e) => e.target.files && handleFileUpload('proof', e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D4AF37]/10 transition-colors">
                                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-[#D4AF37]" />
                                </div>
                                <h4 className="text-white font-medium mb-1">{t.proofAddr}</h4>
                                <p className="text-xs text-slate-500">Utility Bill, Bank Statement</p>
                                {kycFiles.proof && <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center justify-center gap-1"><CheckCircle size={10}/> {kycFiles.proof.name}</p>}
                            </div>
                        </div>

                        <button 
                            onClick={submitKYC}
                            disabled={!kycFiles.id || !kycFiles.proof || uploading}
                            className="w-full bg-[#D4AF37] hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                        >
                            {uploading ? <Clock className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
                            {uploading ? 'Processing...' : t.submit}
                        </button>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

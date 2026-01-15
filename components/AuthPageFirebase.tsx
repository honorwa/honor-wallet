
import React, { useState } from 'react';
import { VideoLogoLarge, Logo } from './Logo';
import { Lock, Mail, User, AlertCircle, RefreshCw, Globe, CheckCircle, Info } from 'lucide-react';
import { firebaseAuthService } from '../services/authServiceFirebase';

interface AuthPageProps {
  onLogin: (user: any) => void;
}

const translations = {
  en: {
    welcome_back: "Secure Access",
    create_account: "New Account",
    subtitle_login: "Authenticate to your personal wallet.",
    subtitle_signup: "Register for elite digital asset management.",
    email_label: "Email Address",
    pass_label: "Password",
    name_label: "Full Name",
    login_btn: "Access Wallet",
    signup_btn: "Create Account",
    or_continue: "Or continue with",
    google_btn: "Google",
    dont_have: "Don't have an account?",
    already_have: "Already have an account?",
    register_now: "Register now",
    login_now: "Log in",
    error_creds: "Invalid credentials",
    verification_sent: "Verification email sent! Please check your inbox.",
    check_spam: "Don't forget to check your spam folder.",
  },
  fr: {
    welcome_back: "Accès Sécurisé",
    create_account: "Nouveau Compte",
    subtitle_login: "Authentifiez-vous à votre portefeuille personnel.",
    subtitle_signup: "Inscrivez-vous pour la gestion d'actifs.",
    email_label: "Adresse Email",
    pass_label: "Mot de passe",
    name_label: "Nom complet",
    login_btn: "Accéder au portefeuille",
    signup_btn: "Créer un compte",
    or_continue: "Ou continuer avec",
    google_btn: "Google",
    dont_have: "Pas de compte ?",
    already_have: "Vous avez déjà un compte ?",
    register_now: "S'inscrire",
    login_now: "Se connecter",
    error_creds: "Identifiants invalides",
    verification_sent: "Email de vérification envoyé ! Consultez votre boîte.",
    check_spam: "N'oubliez pas de vérifier vos spams.",
  },
  es: {
    welcome_back: "Acceso Seguro",
    create_account: "Nueva Cuenta",
    subtitle_login: "Autentíquese en su billetera personal.",
    subtitle_signup: "Regístrese para gestión de activos.",
    email_label: "Correo electrónico",
    pass_label: "Contraseña",
    name_label: "Nombre completo",
    login_btn: "Acceder Billetera",
    signup_btn: "Crear cuenta",
    or_continue: "O continuar con",
    google_btn: "Google",
    dont_have: "¿No tienes una cuenta?",
    already_have: "¿Ya tienes una cuenta?",
    register_now: "Regístrate ahora",
    login_now: "Iniciar sesión",
    error_creds: "Credenciales inválidas",
    verification_sent: "Correo de verificación enviado! Revisa tu bandeja.",
    check_spam: "No olvides revisar tu carpeta de spam.",
  },
  it: {
    welcome_back: "Accesso Sicuro",
    create_account: "Nuovo Account",
    subtitle_login: "Autenticati al tuo portafoglio personale.",
    subtitle_signup: "Registrati per gestione asset.",
    email_label: "Indirizzo Email",
    pass_label: "Password",
    name_label: "Nome completo",
    login_btn: "Accedi al Portafoglio",
    signup_btn: "Crea account",
    or_continue: "O continua con",
    google_btn: "Google",
    dont_have: "Non hai un account?",
    already_have: "Hai già un account?",
    register_now: "Registrati ora",
    login_now: "Accedi",
    error_creds: "Credenziali non valide",
    verification_sent: "Email di verifica inviata! Controlla la tua casella.",
    check_spam: "Non dimenticare di controllare la cartella spam.",
  }
};

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [language, setLanguage] = useState<"en" | "fr" | "es" | "it">("en");

  const t = translations[language];

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await firebaseAuthService.loginWithGoogle();
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await firebaseAuthService.loginWithEmail(email, password);
        onLogin(user);
      } else {
        if (!fullName) throw new Error("Name required");
        const result = await firebaseAuthService.registerWithEmail(fullName, email, password);

        if (result.needsVerification) {
          setSuccess(t.verification_sent + ' ' + t.check_spam);
          setTimeout(() => {
            onLogin(result.user);
          }, 3000);
        } else {
          onLogin(result.user);
        }
      }
    } catch (err: any) {
      setError(err.message || t.error_creds);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050505] items-center justify-center overflow-hidden border-r border-[#D4AF37]/20">
        <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[linear-gradient(45deg,transparent,rgba(212,175,55,0.05))]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <VideoLogoLarge />
            <h1 className="mt-12 text-7xl font-black text-white tracking-tighter uppercase">Honor</h1>
            <div className="h-1 w-32 bg-[#D4AF37] mt-8 rounded-full shadow-[0_0_20px_#D4AF37]"></div>
            <p className="mt-6 text-[#D4AF37] text-sm font-black uppercase tracking-[0.5em]">Digital Asset Wallet</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-zinc-950 relative">
        <div className="lg:hidden absolute top-8 left-8">
            <Logo className="w-10 h-10" />
        </div>

        <div className="absolute top-8 right-8 z-20">
             <div className="relative group">
                <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider border border-white/10 px-3 py-1.5 rounded-full">
                    <Globe className="w-3 h-3" /> {language.toUpperCase()}
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden hidden group-hover:block z-50">
                    {['en', 'fr', 'es', 'it'].map((l) => (
                        <button key={l} onClick={() => setLanguage(l as any)} className="w-full text-left px-4 py-2 text-xs uppercase text-zinc-400 hover:text-white hover:bg-white/5">
                            {l === 'en' ? 'English' : l === 'fr' ? 'Français' : l === 'es' ? 'Español' : 'Italiano'}
                        </button>
                    ))}
                </div>
             </div>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center lg:text-left">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                    {isLogin ? t.welcome_back : t.create_account}
                </h2>
                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{isLogin ? t.subtitle_login : t.subtitle_signup}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t.name_label}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t.email_label}</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t.pass_label}</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 text-red-500 p-3 rounded-lg text-xs font-bold border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-start gap-2 bg-green-500/10 text-green-500 p-3 rounded-lg text-xs font-bold border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </div>
                )}

                {!isLogin && (
                    <div className="flex items-start gap-2 bg-blue-500/10 text-blue-400 p-3 rounded-lg text-xs border border-blue-500/20">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>You'll receive an email verification link after registration.</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (isLogin ? t.login_btn : t.signup_btn)}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-zinc-950 px-4 text-zinc-600">{t.or_continue}</span>
                </div>
            </div>

            <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-wider shadow-xl active:scale-95 disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                {t.google_btn}
            </button>

            <div className="text-center pt-4">
                <p className="text-zinc-500 text-xs">
                    {isLogin ? t.dont_have : t.already_have} {' '}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} className="text-[#D4AF37] font-bold hover:underline">
                        {isLogin ? t.register_now : t.login_now}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

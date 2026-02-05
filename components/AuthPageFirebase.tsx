import React, { useState, useEffect, useRef } from "react";
import { VideoLogoLarge, Logo } from "./Logo";
import {
  Lock,
  Mail,
  User,
  AlertCircle,
  RefreshCw,
  Globe,
  CheckCircle,
  Info,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { firebaseAuthService } from "../services/authServiceFirebase";
import { authService } from "../services/authServiceCompat";
import { RecaptchaVerifier } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../services/firebase.config";

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
    confirm_pass_label: "Confirm Password",
    first_name_label: "First Name",
    last_name_label: "Last Name",
    phone_label: "Phone Number",
    dob_label: "Date of Birth",
    country_label: "Country",
    address_label: "Address (Optional)",
    login_btn: "Access Wallet",
    signup_btn: "Create Account",
    next_btn: "Next Step",
    back_btn: "Back",
    or_continue: "Or continue with",
@@ -121,601 +135,767 @@ const translations = {
    confirm_pass_label: "Conferma password",
    first_name_label: "Nome",
    last_name_label: "Cognome",
    phone_label: "Telefono",
    dob_label: "Data di nascita",
    country_label: "Paese",
    address_label: "Indirizzo (Opzionale)",
    login_btn: "Accedi al Portafoglio",
    signup_btn: "Crea account",
    next_btn: "Prossimo passo",
    back_btn: "Indietro",
    or_continue: "O continua con",
    google_btn: "Google",
    dont_have: "Non hai un account?",
    already_have: "Hai già un account?",
    register_now: "Registrati ora",
    login_now: "Accedi",
    error_creds: "Credenziali non valide",
    verification_sent: "Email di verifica inviata! Controlla la tua casella.",
    check_spam: "Non dimenticare di controllare la cartella spam.",
    step_personal: "Informazioni personali",
    step_contact: "Dettagli di contatto",
    step_security: "Sicurezza",
    password_mismatch: "Le password non corrispondono",
    complete_captcha: "Si prega di completare la verifica reCAPTCHA",
  },
};

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [language, setLanguage] = useState<"en" | "fr" | "es" | "it">("en");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setCaptchaVerified(true);
      return;
    }

    if (
      !isLogin &&
      registrationStep === 3 &&
      recaptchaContainerRef.current &&
      !recaptchaRef.current &&
      auth
    ) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            callback: () => {
              setCaptchaVerified(true);
              setError("");
            },
            "expired-callback": () => {
              setCaptchaVerified(false);
              setError("reCAPTCHA expired. Please verify again.");
            },
          },
        );
        recaptchaRef.current.render();
      } catch (err) {
        console.error("reCAPTCHA initialization error:", err);
        setCaptchaVerified(true);
      }
    }

    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, [isLogin, registrationStep]);

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isFirebaseConfigured) {
        const user = await firebaseAuthService.loginWithGoogle();
        onLogin(user);
      } else {
        setError(
          "Google sign-in requires Firebase configuration. Please use email/password.",
        );
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setError("");

    if (registrationStep === 1) {
      if (!firstName || !lastName) {
        setError("Please fill in all required fields");
        return;
      }
      setRegistrationStep(2);
    } else if (registrationStep === 2) {
      if (!email || !phone || !country) {
        setError("Please fill in all required fields");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }
      setRegistrationStep(3);
    }
  };

  const handleBackStep = () => {
    setError("");
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isFirebaseConfigured) {
        if (isLogin) {
          const localUsers = authService.getAllUsers();
          const localAdmin = localUsers.find(
            (u) =>
              u.email.toLowerCase() === email.toLowerCase() &&
              (u.role === "admin" || u.role === "super_admin"),
          );

          try {
            const user = await firebaseAuthService.loginWithEmail(
              email,
              password,
            );
            onLogin(user);
          } catch (firebaseError: any) {
            const canFallbackToLocalAdmin =
              localAdmin &&
              firebaseError?.message === "Invalid email or password";
            if (!canFallbackToLocalAdmin) {
              throw firebaseError;
            }

            try {
              const adminUser = authService.login(email, password);
              if (
                adminUser.role === "admin" ||
                adminUser.role === "super_admin"
              ) {
                onLogin(adminUser);
                return;
              }
              authService.logout();
            } catch {
              // Ignore local fallback errors and surface Firebase error instead.
            }
            throw firebaseError;
          }
        } else {
          if (!captchaVerified) {
            setError(t.complete_captcha);
            setLoading(false);
            return;
          }

          if (password !== confirmPassword) {
            setError(t.password_mismatch);
            setLoading(false);
            return;
          }

          if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
          }

          const fullName = `${firstName} ${lastName}`;
          const result = await firebaseAuthService.registerWithEmail(
            fullName,
            email,
            password,
          );

          if (result.needsVerification) {
            setSuccess(t.verification_sent + " " + t.check_spam);
            setTimeout(() => {
              onLogin(result.user);
            }, 3000);
          } else {
            onLogin(result.user);
          }
        }
      } else {
        if (isLogin) {
          const user = authService.login(email, password);
          onLogin(user);
        } else {
          if (password !== confirmPassword) {
            setError(t.password_mismatch);
            setLoading(false);
            return;
          }

          if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
          }

          const fullName = `${firstName} ${lastName}`;
          const user = authService.register(fullName, email, password);
          setSuccess("Account created! Your account is pending approval.");
          setTimeout(() => {
            onLogin(user);
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || t.error_creds);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDob("");
    setCountry("");
    setAddress("");
    setPassword("");
    setConfirmPassword("");
    setRegistrationStep(1);
    setError("");
    setSuccess("");
    setCaptchaVerified(false);
    if (recaptchaRef.current) {
      recaptchaRef.current.clear();
      recaptchaRef.current = null;
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
          <h1 className="mt-12 text-7xl font-black text-white tracking-tighter uppercase">
            Honor
          </h1>
          <div className="h-1 w-32 bg-[#D4AF37] mt-8 rounded-full shadow-[0_0_20px_#D4AF37]"></div>
          <p className="mt-6 text-[#D4AF37] text-sm font-black uppercase tracking-[0.5em]">
            Digital Asset Wallet
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-zinc-950 relative">
        <div className="lg:hidden absolute top-8 left-8">
          <Logo className="w-10 h-10" />
        </div>

        <div className="absolute top-8 right-8 z-20">
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider border border-white/10 px-3 py-1.5 rounded-full hover:border-[#D4AF37]/40"
            >
              <Globe className="w-3 h-3" /> {language.toUpperCase()}
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden z-50">
                {["en", "fr", "es", "it"].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l as any);
                      setShowLanguageMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs uppercase text-zinc-300 hover:text-white hover:bg-white/5"
                  >
                    {l === "en"
                      ? "English"
                      : l === "fr"
                        ? "Français"
                        : l === "es"
                          ? "Español"
                          : "Italiano"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              {isLogin ? t.welcome_back : t.create_account}
            </h2>
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              {isLogin ? t.subtitle_login : t.subtitle_signup}
            </p>
          </div>

          {!isLogin && registrationStep < 3 && (
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 h-1 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${registrationStep >= step ? "bg-[#D4AF37]" : "bg-zinc-800"}`}
                  />
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={
              isLogin || registrationStep === 3
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleNextStep();
                  }
            }
            className="space-y-6"
          >
            {isLogin ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    {t.email_label}
                  </label>
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
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    {t.pass_label}
                  </label>
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
              </>
            ) : (
              <>
                {registrationStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">
                        {t.step_personal}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                          {t.first_name_label}
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                          placeholder="John"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                          {t.last_name_label}
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.dob_label}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {registrationStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">
                        {t.step_contact}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.email_label}
                      </label>
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
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.phone_label}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                          placeholder="+1 234 567 8900"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.country_label}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all font-medium appearance-none cursor-pointer"
                          required
                        >
                          <option value="" className="bg-zinc-900">
                            Select Country
                          </option>
                          <option value="US" className="bg-zinc-900">
                            United States
                          </option>
                          <option value="CA" className="bg-zinc-900">
                            Canada
                          </option>
                          <option value="GB" className="bg-zinc-900">
                            United Kingdom
                          </option>
                          <option value="FR" className="bg-zinc-900">
                            France
                          </option>
                          <option value="DE" className="bg-zinc-900">
                            Germany
                          </option>
                          <option value="ES" className="bg-zinc-900">
                            Spain
                          </option>
                          <option value="IT" className="bg-zinc-900">
                            Italy
                          </option>
                          <option value="AU" className="bg-zinc-900">
                            Australia
                          </option>
                          <option value="JP" className="bg-zinc-900">
                            Japan
                          </option>
                          <option value="CN" className="bg-zinc-900">
                            China
                          </option>
                          <option value="IN" className="bg-zinc-900">
                            India
                          </option>
                          <option value="BR" className="bg-zinc-900">
                            Brazil
                          </option>
                          <option value="MX" className="bg-zinc-900">
                            Mexico
                          </option>
                          <option value="CH" className="bg-zinc-900">
                            Switzerland
                          </option>
                          <option value="OTHER" className="bg-zinc-900">
                            Other
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.address_label}
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium resize-none"
                        placeholder="Street address, city, postal code..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {registrationStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">
                        {t.step_security}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.pass_label}
                      </label>
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

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        {t.confirm_pass_label}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 font-medium"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <div
                        id="recaptcha-container"
                        ref={recaptchaContainerRef}
                      ></div>
                    </div>

                    <div className="flex items-start gap-2 bg-blue-500/10 text-blue-400 p-3 rounded-lg text-xs border border-blue-500/20">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        You'll receive an email verification link after
                        registration.
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

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

            {isLogin ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  t.login_btn
                )}
              </button>
            ) : (
              <div className="flex gap-3">
                {registrationStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t.back_btn}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={
                    loading || (registrationStep === 3 && !captchaVerified)
                  }
                  className="flex-1 bg-[#D4AF37] hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : registrationStep < 3 ? (
                    <>
                      {t.next_btn} <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    t.signup_btn
                  )}
                </button>
              </div>
            )}
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-zinc-950 px-4 text-zinc-600">
                {t.or_continue}
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-wider shadow-xl active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t.google_btn}
          </button>

          <div className="text-center pt-4">
            <p className="text-zinc-500 text-xs">
              {isLogin ? t.dont_have : t.already_have}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-[#D4AF37] font-bold hover:underline"
              >
                {isLogin ? t.register_now : t.login_now}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
services/authServiceFirebase.ts

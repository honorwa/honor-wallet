import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

export type Locale = 'en' | 'fr' | 'es' | 'de' | 'it';

interface Translations {
  [key: string]: {
    [locale in Locale]: string;
  };
}

const translations: Translations = {
  'nav.dashboard': { en: 'Dashboard', fr: 'Tableau de bord', es: 'Panel', de: 'Dashboard', it: 'Pannello' },
  'nav.transactions': { en: 'Transactions', fr: 'Transactions', es: 'Transacciones', de: 'Transaktionen', it: 'Transazioni' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres', es: 'Configuración', de: 'Einstellungen', it: 'Impostazioni' },
  'auth.signIn': { en: 'Sign In', fr: 'Se connecter', es: 'Iniciar sesión', de: 'Anmelden', it: 'Accedi' },
  'auth.signInWithGoogle': { en: 'Sign in with Google', fr: 'Se connecter avec Google', es: 'Iniciar sesión con Google', de: 'Mit Google anmelden', it: 'Accedi con Google' },
  'auth.signOut': { en: 'Sign Out', fr: 'Se déconnecter', es: 'Cerrar sesión', de: 'Abmelden', it: 'Disconnetti' },
  'wallet.balance': { en: 'Balance', fr: 'Solde', es: 'Saldo', de: 'Guthaben', it: 'Saldo' },
  'wallet.totalAssets': { en: 'Total Assets', fr: 'Actifs totaux', es: 'Activos totales', de: 'Gesamtvermögen', it: 'Patrimonio totale' },
  'wallet.send': { en: 'Send', fr: 'Envoyer', es: 'Enviar', de: 'Senden', it: 'Invia' },
  'wallet.receive': { en: 'Receive', fr: 'Recevoir', es: 'Recibir', de: 'Empfangen', it: 'Ricevi' },
  'tx.recent': { en: 'Recent Transactions', fr: 'Transactions récentes', es: 'Transacciones recientes', de: 'Letzte Transaktionen', it: 'Transazioni recenti' },
  'tx.date': { en: 'Date', fr: 'Date', es: 'Fecha', de: 'Datum', it: 'Data' },
  'tx.amount': { en: 'Amount', fr: 'Montant', es: 'Cantidad', de: 'Betrag', it: 'Importo' },
  'tx.status': { en: 'Status', fr: 'Statut', es: 'Estado', de: 'Status', it: 'Stato' },
  'msg.loading': { en: 'Loading...', fr: 'Chargement...', es: 'Cargando...', de: 'Laden...', it: 'Caricamento...' },
  'msg.error': { en: 'An error occurred', fr: 'Une erreur s\'est produite', es: 'Ocurrió un error', de: 'Ein Fehler ist aufgetreten', it: 'Si è verificato un errore' },
  'msg.success': { en: 'Success!', fr: 'Succès !', es: '¡Éxito!', de: 'Erfolg!', it: 'Successo!' },
};

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      
      setLocale: (locale: Locale) => {
        set({ locale });
        document.documentElement.lang = locale;
        window.dispatchEvent(new CustomEvent('localeChange', { 
          detail: { locale } 
        }));
        console.log(`🌐 Langue changée: ${locale}`);
      },

      t: (key: string, fallback?: string): string => {
        const { locale } = get();
        const translation = translations[key];
        
        if (!translation) {
          console.warn(`⚠️ Traduction manquante: ${key}`);
          return fallback || key;
        }
        
        return translation[locale] || translation.en || fallback || key;
      },
    }),
    {
      name: 'i18n-storage',
    }
  )
);

export const useTranslation = () => {
  const { locale, setLocale, t } = useI18nStore();
  
  return { 
    locale, 
    setLocale, 
    t,
    getLanguageName: (loc: Locale) => {
      const names: Record<Locale, string> = {
        en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch', it: 'Italiano',
      };
      return names[loc];
    }
  };
};

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { locale, setLocale, getLanguageName } = useTranslation();

  const languages: Locale[] = ['en', 'fr', 'es', 'de', 'it'];
  const flags: Record<Locale, string> = {
    en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹',
  };

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className={`px-3 py-2 border rounded-lg bg-white ${className}`}
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {flags[lang]} {getLanguageName(lang)}
        </option>
      ))}
    </select>
  );
};

export const useLocaleSync = () => {
  const { setLocale } = useTranslation();

  React.useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Locale;
    const supportedLanguages: Locale[] = ['en', 'fr', 'es', 'de', 'it'];
    
    if (supportedLanguages.includes(browserLang) && !localStorage.getItem('i18n-storage')) {
      setLocale(browserLang);
    }

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setLocale(customEvent.detail.locale);
    };

    window.addEventListener('localeChange', handleLocaleChange);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange);
    };
  }, [setLocale]);
};

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import React from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyState {
  currentCurrency: Currency;
  exchangeRates: ExchangeRates;
  lastUpdate: number;
  isLoading: boolean;
  error: string | null;
  
  setCurrency: (currency: Currency) => void;
  fetchRates: () => Promise<void>;
  convertAmount: (amount: number, fromCurrency?: Currency) => number;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'USD',
      exchangeRates: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.35 },
      lastUpdate: Date.now(),
      isLoading: false,
      error: null,

      setCurrency: (currency: Currency) => {
        set({ currentCurrency: currency });
        window.dispatchEvent(new CustomEvent('currencyChange', { 
          detail: { currency } 
        }));
      },

      fetchRates: async () => {
        const state = get();
        const CACHE_DURATION = 5 * 60 * 1000;
        if (Date.now() - state.lastUpdate < CACHE_DURATION) {
          console.log('📦 Utilisation du cache de devises');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            'https://api.exchangerate-api.com/v4/latest/USD'
          );
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          
          set({
            exchangeRates: {
              USD: 1,
              EUR: data.rates.EUR,
              GBP: data.rates.GBP,
              JPY: data.rates.JPY,
              CAD: data.rates.CAD,
            },
            lastUpdate: Date.now(),
            isLoading: false,
            error: null
          });

          console.log('✅ Taux de change mis à jour:', data.rates);
          
          window.dispatchEvent(new CustomEvent('ratesUpdated', {
            detail: { rates: data.rates }
          }));

        } catch (error: any) {
          console.error('❌ Erreur récupération taux:', error);
          set({ 
            isLoading: false, 
            error: error.message 
          });
        }
      },

      convertAmount: (amount: number, fromCurrency: Currency = 'USD') => {
        const state = get();
        const { currentCurrency, exchangeRates } = state;
        
        if (fromCurrency === currentCurrency) return amount;
        
        const amountInUSD = amount / exchangeRates[fromCurrency];
        return amountInUSD * exchangeRates[currentCurrency];
      },
    }),
    {
      name: 'currency-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCurrencySync = () => {
  const { fetchRates, setCurrency } = useCurrencyStore();

  React.useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);

    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrency(customEvent.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, [fetchRates, setCurrency]);
};

export const CurrencySelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentCurrency, setCurrency, isLoading } = useCurrencyStore();

  const currencies: { code: Currency; symbol: string; name: string }[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  return (
    <select
      value={currentCurrency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      disabled={isLoading}
      className={`px-3 py-2 border rounded-lg bg-white ${className}`}
    >
      {currencies.map((curr) => (
        <option key={curr.code} value={curr.code}>
          {curr.symbol} {curr.code}
        </option>
      ))}
    </select>
  );
};

export const formatCurrency = (
  amount: number, 
  currency: Currency = 'USD'
): string => {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
  };

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbols[currency]}${formatted}`;
};

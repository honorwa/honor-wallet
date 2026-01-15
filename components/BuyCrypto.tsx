import React, { useState } from 'react';
import { CreditCard, ShieldCheck, DollarSign, Landmark, Globe, ExternalLink, CheckCircle, Sparkles, Bot, LayoutDashboard } from 'lucide-react';
import { CryptoOption, Page } from '../types';
import { AVAILABLE_CRYPTOS } from '../constants';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface BuyCryptoProps {
  onBuy: (amount: number, crypto: CryptoOption, fee: number, method: string, provider?: string) => void;
  availableCryptos?: CryptoOption[];
  onNavigate?: (page: Page) => void;
}

export const BuyCrypto: React.FC<BuyCryptoProps> = ({ onBuy, availableCryptos = AVAILABLE_CRYPTOS, onNavigate }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(availableCryptos[0]);
  const [step, setStep] = useState<'amount' | 'payment' | 'onramp_process' | 'success'>('amount');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'onramp'>('card');
  const [selectedProvider, setSelectedProvider] = useState<string>('MoonPay');

  const onRampProviders = [
    { name: 'MoonPay', description: 'Fast & secure, supports 160+ countries' },
    { name: 'Transak', description: 'Low fees, supports Apple Pay & Google Pay' },
    { name: 'Ramp Network', description: 'Instant transfers, bank cards & SEPA' },
    { name: 'Mont Pelerin', description: 'Swiss-based, SEPA & CHF support' },
    { name: 'Banxa', description: 'Global coverage, 200+ payment methods' }
  ];
  const [isProcessing, setIsProcessing] = useState(false);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  // Sync selected crypto if props update
  React.useEffect(() => {
    const updated = availableCryptos.find(c => c.symbol === selectedCrypto.symbol);
    if (updated) setSelectedCrypto(updated);
  }, [availableCryptos, selectedCrypto.symbol]);

  const calculateFee = () => {
    if (!amount) return 0;
    if (paymentMethod === 'card') return parseFloat(amount) * 0.029;
    if (paymentMethod === 'onramp') return parseFloat(amount) * 0.01;
    return 0;
  };

  const handleAnalyzeProviders = async () => {
    setIsAnalyzing(true);
    setAiRecommendation(null);
    
    try {
        const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
        
        const prompt = `Analyze the current typical fee structures and success rates for fiat-to-crypto on-ramp providers: MoonPay, Transak, Ramp Network, Mont Pelerin, and Banxa.
The user wants to buy ${selectedCrypto.name} (${selectedCrypto.symbol}).

Recommend the best provider based on:
1. Lowest fees for ${selectedCrypto.symbol}
2. Speed of transaction
3. Regional availability (assume Global/US)

Keep it very brief (max 2 sentences). Start with "I recommend [Provider] because...".`;

        const model = ai.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        setAiRecommendation(text || "I recommend MoonPay for its high success rate with major cards.");
    } catch (e) {
        console.error("AI Analysis error:", e);
        setAiRecommendation("Unable to connect to AI analysis. MoonPay is recommended by default.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleBuy = () => {
    setIsProcessing(true);
    
    if (paymentMethod === 'onramp') {
        setStep('onramp_process');
        setTimeout(() => {
             setIsProcessing(false);
             finalizeTransaction(); 
        }, 3000);
        return;
    }

    setTimeout(() => {
      finalizeTransaction();
    }, 2500);
  };

  const finalizeTransaction = () => {
    const fee = calculateFee();
    onBuy(parseFloat(amount), selectedCrypto, fee, paymentMethod, paymentMethod === 'onramp' ? selectedProvider : undefined);
    setIsProcessing(false);
    setStep('success');
  };

  const estimatedCrypto = parseFloat(amount) ? (parseFloat(amount) / selectedCrypto.price).toFixed(6) : '0.00';
  const fee = calculateFee();
  const total = parseFloat(amount) ? parseFloat(amount) + fee : 0;

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Buy Cryptocurrency</h2>
        <div className="flex items-center gap-2 text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      <div className="bg-zinc-950 border border-[#D4AF37]/20 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
        {step === 'amount' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 block">I want to spend</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-8 bg-white/10"></div>
            </div>

            <div>
              <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 block">I want to buy</label>
              <div className="grid grid-cols-2 gap-3">
                {availableCryptos.slice(0, 4).map(crypto => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedCrypto.symbol === crypto.symbol 
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]' 
                        : 'bg-black border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: crypto.color }}>
                      {crypto.symbol[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">{crypto.symbol}</div>
                      <div className="text-zinc-500 text-xs">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-xl p-4 flex justify-between items-center border border-white/5">
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Estimated Receive</span>
              <span className="text-white font-bold text-lg">{estimatedCrypto} {selectedCrypto.symbol}</span>
            </div>

            <button 
              onClick={() => setStep('payment')}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-[#D4AF37] hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#D4AF37]/20"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep('amount')} className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest">Back</button>
              <h3 className="text-white font-semibold">Select Payment Method</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-black p-1 rounded-xl border border-white/5">
                <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider transition-all ${paymentMethod === 'card' ? 'bg-[#D4AF37] text-black shadow' : 'text-zinc-500 hover:text-white'}`}
                >
                    Credit Card
                </button>
                <button 
                    onClick={() => setPaymentMethod('wire')}
                    className={`py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider transition-all ${paymentMethod === 'wire' ? 'bg-[#D4AF37] text-black shadow' : 'text-zinc-500 hover:text-white'}`}
                >
                    Wire Transfer
                </button>
                <button 
                    onClick={() => setPaymentMethod('onramp')}
                    className={`py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider transition-all ${paymentMethod === 'onramp' ? 'bg-[#D4AF37] text-black shadow' : 'text-zinc-500 hover:text-white'}`}
                >
                    Fiat On-Ramp
                </button>
            </div>

            {paymentMethod === 'card' && (
                <div className="space-y-4">
                     <div className="p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[#D4AF37] font-bold text-sm">Instant Deposit</h4>
                            <p className="text-zinc-400 text-xs">Funds will be available immediately.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-black border border-[#D4AF37] rounded-xl cursor-pointer">
                            <div className="flex items-center gap-3">
                            <CreditCard className="text-white w-6 h-6" />
                            <div>
                                <div className="text-white font-medium">Visa ending in 4242</div>
                                <div className="text-zinc-500 text-xs">Expires 12/25</div>
                            </div>
                            </div>
                            <div className="w-4 h-4 rounded-full border border-[#D4AF37] bg-[#D4AF37]"></div>
                        </div>
                        
                        <div className="p-4 bg-black border border-white/10 rounded-xl flex items-center gap-3 opacity-60">
                             <div className="w-10 h-6 bg-zinc-800 rounded"></div>
                             <span className="text-sm text-zinc-400">Add new card...</span>
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'wire' && (
                <div className="space-y-4">
                     <div className="p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl flex items-start gap-3">
                        <Landmark className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[#D4AF37] font-bold text-sm">Bank Transfer</h4>
                            <p className="text-zinc-400 text-xs">Processing time: 1-3 business days.</p>
                        </div>
                    </div>

                    <div className="bg-black border border-white/10 rounded-xl p-4 space-y-3">
                        <div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Bank Name</p>
                            <p className="text-white font-medium">Honor Trust Bank</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Account Number</p>
                            <p className="text-white font-medium font-mono">09812374652</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Routing Number (SWIFT)</p>
                            <p className="text-white font-medium font-mono">HTBUS33</p>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-black">Reference Code (Required)</p>
                            <p className="text-white font-bold font-mono">HR-{Math.floor(Math.random()*100000)}</p>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500 italic text-center">Please include the Reference Code in your transfer description.</p>
                </div>
            )}

            {paymentMethod === 'onramp' && (
                <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl flex items-start gap-3">
                        <Globe className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[#D4AF37] font-bold text-sm">Fiat On-Ramp</h4>
                            <p className="text-zinc-400 text-xs">Buy crypto using local methods (Apple Pay, SEPA) via partners.</p>
                        </div>
                    </div>

                    {!aiRecommendation && !isAnalyzing ? (
                        <button 
                            onClick={handleAnalyzeProviders}
                            className="w-full py-2 bg-gradient-to-r from-zinc-900 to-zinc-800 border border-[#D4AF37]/30 rounded-xl text-xs text-[#D4AF37] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors uppercase tracking-wide font-bold"
                        >
                            <Sparkles className="w-3 h-3" />
                            Ask Honor AI: Best provider?
                        </button>
                    ) : (
                        <div className="p-3 bg-zinc-900 border border-[#D4AF37]/20 rounded-xl flex gap-3 animate-in fade-in">
                            <div className="bg-[#D4AF37] rounded-full p-1.5 h-fit shrink-0">
                                <Bot className="w-3 h-3 text-black" />
                            </div>
                            <div className="text-xs">
                                {isAnalyzing ? (
                                    <p className="text-[#D4AF37] animate-pulse">Analyzing provider fees and rates...</p>
                                ) : (
                                    <p className="text-zinc-200">{aiRecommendation}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black block">Select Provider</label>
                        {onRampProviders.map(provider => (
                            <button
                                key={provider.name}
                                onClick={() => setSelectedProvider(provider.name)}
                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedProvider === provider.name ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-black border-white/10 text-white hover:border-white/30'}`}
                            >
                                <div className="text-left">
                                    <div className="font-bold">{provider.name}</div>
                                    <div className={`text-xs mt-0.5 ${selectedProvider === provider.name ? 'text-black/70' : 'text-zinc-500'}`}>{provider.description}</div>
                                </div>
                                {selectedProvider === provider.name && <CheckCircle className="w-5 h-5 text-black shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">${amount}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-zinc-400">Fee ({paymentMethod === 'card' ? '2.9%' : paymentMethod === 'onramp' ? '1.0% + Partner Fee' : '0%'})</span>
                <span className="text-white">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleBuy}
              disabled={isProcessing}
              className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              {isProcessing ? 'Processing...' : paymentMethod === 'card' ? 'Pay Now' : paymentMethod === 'wire' ? 'I Have Sent Funds' : `Continue to ${selectedProvider}`}
              {paymentMethod === 'onramp' && !isProcessing && <ExternalLink className="w-4 h-4" />}
            </button>
          </div>
        )}

        {step === 'onramp_process' && (
             <div className="absolute inset-0 bg-zinc-950 z-20 flex flex-col items-center justify-center p-8 animate-in fade-in">
                 <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-2xl relative">
                     <div className="absolute -top-10 left-0 w-full flex justify-center">
                         <div className="bg-zinc-800 text-white px-4 py-1 rounded-full text-xs">Secured Connection: {selectedProvider}</div>
                     </div>
                     
                     <div className="flex flex-col items-center justify-center space-y-4 py-8">
                         <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-gray-800 font-medium text-center">Redirecting to {selectedProvider}...</p>
                         <p className="text-gray-500 text-xs text-center">Please complete your transaction in the new window.</p>
                     </div>
                 </div>
             </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                {paymentMethod === 'wire' ? 'Transfer Registered' : 'Transaction Successful!'}
            </h3>
            <p className="text-zinc-400 mb-8">
              {paymentMethod === 'wire' 
                ? `We have registered your deposit request. Your wallet will be credited once funds clear.`
                : paymentMethod === 'onramp'
                ? `Your purchase via ${selectedProvider} has been initiated. Your assets will appear shortly.`
                : `You have successfully purchased ${estimatedCrypto} ${selectedCrypto.symbol}.` 
              }
              <br/>
              The transaction has been recorded in your history.
            </p>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                {onNavigate && (
                  <button 
                    onClick={() => onNavigate(Page.DASHBOARD)}
                    className="flex-1 bg-zinc-800 border border-white/10 text-white px-6 py-3 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold"
                  >
                    <LayoutDashboard className="w-4 h-4 text-white" /> Dashboard
                  </button>
                )}
                {onNavigate && (
                  <button 
                    onClick={() => onNavigate(Page.PORTFOLIO)}
                    className="flex-1 bg-[#D4AF37] text-black px-6 py-3 rounded-xl hover:bg-[#FFD700] transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold"
                  >
                    <Sparkles className="w-4 h-4" /> Portfolio
                  </button>
                )}
              </div>
              <button 
                onClick={() => {
                  setAmount('');
                  setStep('amount');
                }}
                className="w-full text-zinc-500 hover:text-white py-2 text-xs uppercase tracking-widest"
              >
                Buy More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

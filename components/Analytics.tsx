
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AVAILABLE_CRYPTOS } from '../constants';
import { analyzeMarketData } from '../services/geminiService';
import { Sparkles, Loader2, Bot } from 'lucide-react';

const DATA = [
  { name: 'Mon', value: 4000, volume: 2400 },
  { name: 'Tue', value: 3000, volume: 1398 },
  { name: 'Wed', value: 2000, volume: 9800 },
  { name: 'Thu', value: 2780, volume: 3908 },
  { name: 'Fri', value: 1890, volume: 4800 },
  { name: 'Sat', value: 2390, volume: 3800 },
  { name: 'Sun', value: 3490, volume: 4300 },
];

export const Analytics: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeMarketData(DATA);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Market Analytics</h2>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-600/30 transition-all shadow-lg shadow-indigo-500/10"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
            {analyzing ? "Analyzing Market..." : "Get AI Insight"}
          </button>
      </div>

      {analysis && (
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
                 <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-indigo-300 font-bold">Gemini Market Intelligence</h3>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pl-11 relative z-10">
                {analysis}
            </div>
        </div>
      )}
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#151A25] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-6">Market Trends (7D)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#333', color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#151A25] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-6">Trading Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#333', color: '#fff' }}
                />
                <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#151A25] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
            <h3 className="text-white font-semibold">Top Performers</h3>
        </div>
        <div className="p-6">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-slate-500 text-sm border-b border-white/5">
                        <th className="pb-4 font-medium">Asset</th>
                        <th className="pb-4 font-medium">Price</th>
                        <th className="pb-4 font-medium">24h Change</th>
                        <th className="pb-4 font-medium text-right">Market Cap</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {AVAILABLE_CRYPTOS.slice(0, 5).map(c => (
                        <tr key={c.symbol} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{backgroundColor: c.color}}>{c.symbol[0]}</div>
                                    <span className="font-medium">{c.name}</span>
                                    <span className="text-slate-500 text-sm">{c.symbol}</span>
                                </div>
                            </td>
                            <td className="py-4">${c.price.toLocaleString()}</td>
                            <td className="py-4 text-emerald-400">+{(Math.random() * 5).toFixed(2)}%</td>
                            <td className="py-4 text-right">${(c.price * 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

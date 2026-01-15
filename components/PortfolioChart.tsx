import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Asset } from "../types";

// Default colors if asset doesn't have one
const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const translations = {
  en: { title: "Portfolio Distribution" },
  fr: { title: "Distribution du Portefeuille" },
  es: { title: "Distribución del Portafolio" },
  it: { title: "Distribuzione del Portafoglio" }
};

interface PortfolioChartProps {
  assets: Asset[];
  language?: "en" | "fr" | "es" | "it";
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ assets, language = "en" }) => {
  const t = translations[language] || translations.en;

  const chartData = assets
    .filter(a => a.balance > 0)
    .map(a => ({
      name: a.symbol,
      value: a.value,
      color: a.color
    }))
    .filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
        <div className="h-[300px] flex items-center justify-center text-slate-500">
            No assets to display
        </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-xl p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
      <h3 className="text-white font-semibold mb-6 self-start">{t.title}</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              outerRadius={100}
              innerRadius={60}
              paddingAngle={5}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
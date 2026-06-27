/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Calendar, CreditCard, Layers } from 'lucide-react';

interface MonthlyData {
  month: string;
  quantity: number;
  estValue: number; // Approximate USD or TL value
  changePercent: number;
}

// Simulated data for the past 6 months leading up to May 2026.
const HISTORICAL_DATA: MonthlyData[] = [
  { month: 'Aralık', quantity: 68, estValue: 145000, changePercent: -2.1 },
  { month: 'Ocak', quantity: 74, estValue: 158000, changePercent: 8.8 },
  { month: 'Şubat', quantity: 71, estValue: 152000, changePercent: -4.0 },
  { month: 'Mart', quantity: 82, estValue: 185000, changePercent: 15.5 },
  { month: 'Nisan', quantity: 85, estValue: 194000, changePercent: 3.6 },
  { month: 'Mayıs', quantity: 94, estValue: 215000, changePercent: 10.5 }, // current highest
];

export default function InventoryTrendChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Calculate total historical context
  const currentMonthData = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const lastMonthData = HISTORICAL_DATA[HISTORICAL_DATA.length - 2];
  const isUp = currentMonthData.changePercent >= 0;

  // Chart measurements for building responsive SVG elements
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 20;

  // Find boundaries of the graph
  const maxVal = Math.max(...HISTORICAL_DATA.map(d => d.estValue)) * 1.1;
  const minVal = Math.min(...HISTORICAL_DATA.map(d => d.estValue)) * 0.9;

  // Generate Cartesian coordinates for the SVG path
  const points = HISTORICAL_DATA.map((d, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / (HISTORICAL_DATA.length - 1);
    const y = height - paddingY - ((d.estValue - minVal) * (height - paddingY * 2)) / (maxVal - minVal);
    return { x, y, data: d, index };
  });

  // Construct SVG Bezier Curve String (Cubic Hermite Spline)
  let dPath = '';
  if (points.length > 0) {
    dPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      dPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Generate Area path under the curve for a beautiful colored gradient shadow
  const dArea = points.length > 0 
    ? `${dPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col justify-between" id="inventory-trend-container">
      
      {/* Chart Title and Header metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#b83b3b]" />
            Aylık Envanter Değişim Trendi
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">Son 6 aylık toplam stok hacmi ve kurumsal maliyet analizi</p>
        </div>

        {/* Quick percentage change badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Yıllık Ortalama</span>
            <span className="text-xs font-mono font-extrabold text-slate-800">
              {Math.round(HISTORICAL_DATA.reduce((acc, current) => acc + current.quantity, 0) / HISTORICAL_DATA.length)} Birim
            </span>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide shadow-sm ${
            isUp ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-red-700 bg-red-105'
          }`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isUp ? '+' : ''}{currentMonthData.changePercent}%
          </div>
        </div>
      </div>

      {/* Main Stats summary ribbon */}
      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4 mb-4">
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-350" />
            Stok Hacmi (Mayıs)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">{currentMonthData.quantity}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Toplam Birim</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-slate-350" />
            Öngörülen Değer
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-mono font-extrabold" style={{ color: '#149508' }}>
              ₺{currentMonthData.estValue.toLocaleString('tr-TR')}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mali Tahmin</span>
          </div>
        </div>
      </div>

      {/* Responsive Sparkline Container */}
      <div className="relative mt-2" id="canvas-sparkline-area">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
          id="sparkline-trend-svg"
        >
          {/* Definitions for gorgeous gradients */}
          <defs>
            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b83b3b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#b83b3b" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#b83b3b" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          {/* Dotted horizontal alignment guidelines */}
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#f1f5f9" strokeWidth="1.5" />
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f8fafc" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

          {/* Glowing Area Fill */}
          <path d={dArea} fill="url(#gradient-area)" />

          {/* Smooth Bezier Line graph */}
          <path 
            d={dPath} 
            fill="none" 
            stroke="#12a312" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            className="drop-shadow-sm"
            style={{ color: '#12a312' }}
          />

          {/* Interaction vertical bar tracker */}
          {hoveredIndex !== null && (
            <line 
              x1={points[hoveredIndex].x} 
              y1={paddingY} 
              x2={points[hoveredIndex].x} 
              y2={height - paddingY} 
              stroke="#cbd5e1" 
              strokeWidth="1.5" 
              strokeDasharray="2 2"
            />
          )}

          {/* Dots on nodes */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;
            return (
              <g key={p.index}>
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={isHovered ? 6 : 4} 
                  fill={isHovered ? "#4f46e5" : "#070202"} 
                  stroke="#ffffff" 
                  strokeWidth={isHovered ? 2.5 : 1.5} 
                  className="transition-all duration-150 cursor-pointer"
                  style={{ color: '#070202' }}
                  onMouseEnter={() => setHoveredIndex(p.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Horizontal simple month label beneath node */}
                <text 
                  x={p.x} 
                  y={height - 2} 
                  fontSize="9px" 
                  fontFamily="sans-serif"
                  fontWeight="bold" 
                  fill={isHovered ? "#1c1e21" : "#94a3b8"} 
                  textAnchor="middle"
                  className="transition-colors uppercase tracking-wider"
                >
                  {p.data.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Custom HTML Tooltip context based on Hover state */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none h-1 z-10">
          {hoveredIndex !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-950/95 text-white/95 text-[10px] p-2.5 rounded-xl shadow-xl border border-slate-800 flex flex-col gap-1 min-w-[130px]"
            >
              <span className="font-extrabold text-[#b83b3b] uppercase tracking-wider">
                {HISTORICAL_DATA[hoveredIndex].month} Raporu
              </span>
              <div className="flex justify-between font-mono font-medium">
                <span className="text-slate-400">Toplam Stok:</span>
                <span className="font-bold">{HISTORICAL_DATA[hoveredIndex].quantity} Adet</span>
              </div>
              <div className="flex justify-between font-mono font-medium">
                <span className="text-slate-400">Tahmini Değer:</span>
                <span className="text-emerald-400 font-bold">₺{HISTORICAL_DATA[hoveredIndex].estValue.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between font-mono font-medium">
                <span className="text-slate-400">Değişim Oranı:</span>
                <span className={HISTORICAL_DATA[hoveredIndex].changePercent >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {HISTORICAL_DATA[hoveredIndex].changePercent >= 0 ? '+' : ''}{HISTORICAL_DATA[hoveredIndex].changePercent}%
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-4 text-[9px] text-slate-400/85 font-bold uppercase tracking-widest text-center">
        * Grafik üzerindeki noktalara dokunarak veya imleci gezdirerek detayları görebilirsiniz.
      </div>
    </div>
  );
}

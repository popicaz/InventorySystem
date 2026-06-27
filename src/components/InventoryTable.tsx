/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Package, Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom filter states: 'all' | 'critical' | 'category'
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'stable'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories list
  const categories = useMemo(() => {
    const list = new Set(items.map(item => item.category));
    return ['all', ...Array.from(list)];
  }, [items]);

  // Combined selector filter + search matching
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search matching
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status matching
      const isCritical = item.quantity < item.minThreshold;
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'critical' && isCritical) ||
                            (statusFilter === 'stable' && !isCritical);
      
      // Category matching
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, searchQuery, statusFilter, selectedCategory]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" id="inventory-table-container">
      
      {/* Header and Control Center */}
      <div className="p-4 sm:p-6 border-b border-slate-100 space-y-4" id="table-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-4 h-4 text-[#b83b3b]" />
              Mevcut Stok Durumu
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Hızlı arama ve filtreleme paneli</p>
          </div>

          <div className="flex items-center gap-2 select-none">
            {/* Quick Segment Controls for Mobile Layout (Extremely Quick & Easy) */}
            <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:inline mr-1">Durum:</span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[10px] font-bold uppercase transition-all">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tümü
              </button>
              <button 
                onClick={() => setStatusFilter('critical')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                  statusFilter === 'critical' ? 'bg-red-600 text-white shadow-sm' : 'text-red-600 hover:bg-slate-50'
                }`}
              >
                Kritik ({items.filter(i => i.quantity < i.minThreshold).length})
              </button>
              <button 
                onClick={() => setStatusFilter('stable')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  statusFilter === 'stable' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sorunsuz
              </button>
            </div>
          </div>
        </div>

        {/* Input search & category selector nested bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Elegant Search Bar */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ürün adı, kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/15 outline-none bg-slate-50/50 rounded-lg transition-all text-slate-800"
              id="inventory-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                title="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Combobox */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-slate-200 outline-none rounded-lg bg-slate-50/50 transition-all text-slate-700 font-medium appearance-none cursor-pointer focus:border-[#b83b3b]"
              id="category-filter-select"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- MOBILE COMPACT VIEW (High-density compact card layout, avoids scroll strain) --- */}
      <div className="block sm:hidden divide-y divide-slate-100 max-h-[380px] overflow-y-auto" id="mobile-inventory-list">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <AlertTriangle className="w-7 h-7 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Uyuşan ürün bulunamadı.</p>
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSelectedCategory('all'); }} 
              className="text-[10px] text-indigo-600 underline font-extrabold uppercase tracking-wide"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isCritical = item.quantity < item.minThreshold;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className={`p-3.5 flex items-center justify-between gap-3 active:bg-slate-50 transition-colors ${
                  isCritical ? 'bg-red-50/30' : ''
                }`}
                id={`mobile-item-${item.id}`}
              >
                {/* Left side name & category stacked */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-slate-950 truncate leading-snug">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 font-semibold text-slate-500 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      Eşik: {item.minThreshold}
                    </span>
                  </div>
                </div>

                {/* Right side status and count */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className={`text-sm font-mono font-extrabold ${isCritical ? 'text-red-600' : 'text-slate-800'}`}>
                        {item.quantity}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">/{item.unit || 'Adet'}</span>
                    </div>

                    <span className={`inline-block mt-1 text-[8px] font-extrabold px-1 rounded uppercase tracking-wider ${
                      isCritical ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'
                    }`}>
                      {isCritical ? 'KRİTİK' : 'YETERLİ'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* --- DESKTOP CLASSIC TABULAR VIEW (Remains rich and complete for wider screens) --- */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200">
              <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Ürün Adı</th>
              <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Kategori</th>
              <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Miktar</th>
              <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest font-sans text-right">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  <AlertTriangle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">Arama kriterlerine uygun ürün bulunamadı.</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const isCritical = item.quantity < item.minThreshold;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.4) }}
                    className={`hover:bg-slate-50/70 transition-colors group ${isCritical ? 'bg-red-50/30' : ''}`}
                    id={`item-row-${item.id}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-mono font-bold ${isCritical ? 'text-red-600' : 'text-slate-700'}`}>
                        {item.quantity} <span className="text-xs text-slate-400 font-normal">/{item.unit || 'Adet'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100/80 text-red-700 rounded text-[10px] font-bold uppercase tracking-widest" id={`status-critical-${item.id}`}>
                          <AlertTriangle className="w-3 h-3" />
                          KRİTİK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-100/80 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-widest" id={`status-ok-${item.id}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          GÜVENLİ
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Dynamic table metrics count bar */}
      <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span>Grup Verileri: {filteredItems.length} Kalem Listeleniyor</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 font-sans">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 
            {items.filter(i => i.quantity >= i.minThreshold).length} Güvenli
          </span>
          <span className="flex items-center gap-1.5 font-sans">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> 
            {items.filter(i => i.quantity < i.minThreshold).length} Kritik Stok
          </span>
        </div>
      </div>
    </div>
  );
}

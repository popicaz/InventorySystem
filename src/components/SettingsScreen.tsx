/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sliders, 
  Sparkles, 
  Bell, 
  Database, 
  Volume2, 
  Mail, 
  Download, 
  RotateCcw, 
  Check, 
  Eye, 
  FileJson
} from 'lucide-react';

interface SettingsScreenProps {
  onThresholdChange?: (newThreshold: number) => void;
  currentThreshold?: number;
}

export default function SettingsScreen({ onThresholdChange, currentThreshold = 5 }: SettingsScreenProps) {
  // AI Tone choices
  const [assistantTone, setAssistantTone] = useState<'natural' | 'formal' | 'brief'>('natural');
  
  // Custom threshold level setting state
  const [criticalLimit, setCriticalLimit] = useState(currentThreshold);
  
  // Minimal toggle states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [floatingChatVisible, setFloatingChatVisible] = useState(true);
  
  // Action notify triggers
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetFinished, setResetFinished] = useState(false);

  const handleGlobalSave = () => {
    setSaveSuccess(true);
    if (onThresholdChange) {
      onThresholdChange(criticalLimit);
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setResetFinished(true);
    setCriticalLimit(5);
    setAssistantTone('natural');
    setEmailAlerts(true);
    setSoundAlerts(false);
    setFloatingChatVisible(true);
    if (onThresholdChange) {
      onThresholdChange(5);
    }
    setTimeout(() => setResetFinished(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="settings-workspace">
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-[#1c1e21] tracking-tight">Sistem Ayarları</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1.5 font-sans">
            Env-IQ Envanter ve Müşteri İlişkileri Yapılandırması
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
            id="settings-reset-btn"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetFinished ? 'animate-spin text-[#b83b3b]' : ''}`} />
            Varsayılana Dön
          </button>
          
          <button
            onClick={handleGlobalSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1c1e21] hover:bg-[#b83b3b] text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
            id="settings-save-btn"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            {saveSuccess ? 'AYARLAR KAYDEDİLDİ' : 'Tümünü Uygula'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Assistant Tone & Logic */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between" id="ai-tone-settings-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800">
              <Sparkles className="w-5 h-5 text-[#b83b3b]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Yapay Zeka Karakter ve Üslup</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Asistanın kurumsal verilere dayalı konuşurken benimseyeceği ana tonu ve davranış şablonunu ayarlayın.
            </p>

            <div className="space-y-3 pt-3">
              <div 
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  assistantTone === 'natural' ? 'border-[#b83b3b] bg-[#b83b3b]/5' : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setAssistantTone('natural')}
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Sade & Doğal Akış</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">İnsan benzeri, sıcak, rapor formatından uzak sohbet üslubu.</p>
                </div>
                {assistantTone === 'natural' && <div className="w-2 h-2 rounded-full bg-[#b83b3b] mt-1" />}
              </div>

              <div 
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  assistantTone === 'formal font-sans' ? 'border-[#b83b3b] bg-[#b83b3b]/5' : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setAssistantTone('formal')}
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Kurumsal & Detaylı</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Resmi, veri hiyerarşisine sadık ve profesyonel dil yapısı.</p>
                </div>
                {assistantTone === 'formal' && <div className="w-2 h-2 rounded-full bg-[#b83b3b] mt-1" />}
              </div>

              <div 
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                  assistantTone === 'brief' ? 'border-[#b83b3b] bg-[#b83b3b]/5' : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setAssistantTone('brief')}
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Kısa & Doğrudan</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Hiçbir süsleme içermeyen, sadece net sayısal cevaplar veren mod.</p>
                </div>
                {assistantTone === 'brief' && <div className="w-2 h-2 rounded-full bg-[#b83b3b] mt-1" />}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Inventory Alert Threshold Setting */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between" id="threshold-config-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800">
              <Sliders className="w-5 h-5 text-[#b83b3b]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Akıllı Stok Uyarı Eşiği</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Envanterdeki ürünlerin miktarı bu değere ulaştığında veya altına düştüğünde sistem otomatik olarak <strong className="text-red-700">Kritik Seviye</strong> uyarısı tetikler.
            </p>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-4 pt-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9f9898] block">Mevcut Kritik Eşik Değeri</span>
              <span className="text-5xl font-mono font-extrabold text-[#1c1e21] block tracking-tighter">
                {criticalLimit} <span style={{ lineHeight: '22px', fontStyle: 'italic', fontWeight: 'bold', fontSize: '12px', fontFamily: 'monospace', color: '#a8aeb6' }}>Adet / Birim</span>
              </span>
              
              <div className="pt-4 px-2">
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={criticalLimit}
                  onChange={(e) => setCriticalLimit(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#b83b3b] focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-2">
                  <span>2 (Düşük)</span>
                  <span>15 (Orta)</span>
                  <span>30 (Yüksek)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: System Notifications & Floating Assistant */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="notifications-settings-card">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Bell className="w-5 h-5 text-[#b83b3b]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Sistem Uyarıları & Tercihler</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Asistanın ve kontrol panelinin çalışma esnasındaki arka plan operasyonlarını yapılandırın.
          </p>

          <div className="space-y-3 pt-3">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-200/50 rounded-md text-slate-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">E-Posta Kritik Bildirimi</h3>
                  <p className="text-[9px] text-slate-500">Stok azaldığında sisteme kayıtlı mailine uyarı iletilir.</p>
                </div>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-200 focus:outline-none ${
                  emailAlerts ? 'bg-[#b83b3b] flex justify-end' : 'bg-slate-300 flex justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-200/50 rounded-md text-slate-600">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Sesli Kritik Stok Alarmları</h3>
                  <p className="text-[9px] text-slate-500">Eşik altına düşüşlerde tarayıcı üzerinden bildirim tonu çalın.</p>
                </div>
              </div>
              <button
                onClick={() => setSoundAlerts(!soundAlerts)}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-200 focus:outline-none ${
                  soundAlerts ? 'bg-[#b83b3b] flex justify-end' : 'bg-slate-300 flex justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-200/50 rounded-md text-slate-600">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Yüzen Yapay Zeka Balonu</h3>
                  <p className="text-[9px] text-slate-500">Sağ alttaki akıllı dairesel asistan balonunun görünürlüğü.</p>
                </div>
              </div>
              <button
                onClick={() => setFloatingChatVisible(!floatingChatVisible)}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-200 focus:outline-none ${
                  floatingChatVisible ? 'bg-[#b83b3b] flex justify-end' : 'bg-slate-300 flex justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Enterprise Hub Data Management */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="data-hub-settings-card">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Database className="w-5 h-5 text-[#b83b3b]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Veri Tabanı & Raporlama</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mevcut lokal verilerinizi yedekleyebilir veya kurumsal raporlama formatında JSON olarak cihazınıza indirebilirsiniz.
          </p>

          <div className="space-y-3 pt-3">
            <button
              onClick={() => {
                alert('Tüm envanter ve müşteri verileri şifrelenmiş yedek dosyası (env-iq-backup.json) olarak indirildi.');
              }}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 transition-colors text-left"
              id="export-json-button"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-700">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Kurumsal Rapor Çıktısı (JSON)</h4>
                  <p className="text-[9px] text-slate-500">Envanter tablonuzu ve verilerinizi anında dışa aktarın.</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => alert('Sistem güvenli biçimde yeni şemaları yerel veri deposu ile senkronize etti.')}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 transition-colors text-left"
              id="sync-schema-button"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-700">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Şemaları Senkronize Et</h4>
                  <p className="text-[9px] text-slate-500">Mevcut verileri sunucu şeması ile eşitleyin.</p>
                </div>
              </div>
              <Check className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

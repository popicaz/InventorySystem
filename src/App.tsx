/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, LogOut, Settings, User, Menu, X, HelpCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AIChatAssistant from './components/AIChatAssistant';
import InventoryTable from './components/InventoryTable';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import SettingsScreen from './components/SettingsScreen';
import HelpCenterModal from './components/HelpCenterModal';
import InventoryTrendChart from './components/InventoryTrendChart';
import { INITIAL_CUSTOMERS, INITIAL_INVENTORY } from './constants';

export default function App() {
  const [inventory] = useState(INITIAL_INVENTORY);
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [activeTab, setActiveTab ] = useState<'overview' | 'trend' | 'profile' | 'settings'>('overview');
  const [userName, setUserName] = useState('Ahmet Yılmaz');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLoginSuccess={(email) => {
          const prefix = email.split('@')[0];
          if (prefix && prefix !== 'demo') {
            // Create a nice humanized name from company email
            const formatted = prefix.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
            setUserName(formatted);
          } else {
            setUserName('Ahmet Yılmaz');
          }
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" id="app-root">

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 z-50 lg:hidden backdrop-blur-sm"
              id="mobile-menu-backdrop"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col lg:hidden border-r border-slate-200"
              id="mobile-menu-drawer"
            >
              {/* Drawer Title Bar */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 px-1">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-slate-900">Env-IQ</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-all focus:outline-none"
                  id="mobile-menu-close-btn"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Options inside drawer */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'overview' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  id="mobile-nav-overview-btn"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Genel Bakış
                </button>
                <button
                  onClick={() => {
                    setActiveTab('trend');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'trend' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  id="mobile-nav-trend-btn"
                >
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Envanter Trendi
                </button>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'profile' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  id="mobile-nav-profile-btn"
                >
                  <User className="w-5 h-5" />
                  Profil
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  id="mobile-nav-settings-btn"
                >
                  <Settings className="w-5 h-5" />
                  Ayarlar
                </button>
              </nav>

              {/* Help Center & Logout in mobile menu */}
              <div className="p-4 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    setHelpCenterOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all focus:outline-none"
                  id="mobile-menu-help-btn"
                >
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  Yardım Merkezi
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoggedIn(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus:outline-none"
                  id="mobile-menu-logout-btn"
                >
                  <LogOut className="w-5 h-5" />
                  Çıkış Yap
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Env-IQ</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
              activeTab === 'overview' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav-overview-btn"
          >
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
              activeTab === 'trend' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav-trend-btn"
          >
            <TrendingUp className="w-5 h-5" />
            Envanter Trendi
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
              activeTab === 'profile' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav-profile-btn"
          >
            <User className="w-5 h-5" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
              activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav-settings-btn"
          >
            <Settings className="w-5 h-5" />
            Ayarlar
          </button>
        </nav>

        {/* Help Center & Logout in desktop sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button
            onClick={() => setHelpCenterOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
            id="sidebar-help-btn"
          >
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            Yardım Merkezi
          </button>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all focus:outline-none"
              id="mobile-menu-trigger"
              title="Menüyü Aç"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">Şirket Envanter Asistanı</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Kurumsal Yönetim Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full hidden md:flex">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-600">Sistem Aktif</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-slate-900 tracking-tight">{userName}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Birim Sorumlusu</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-200 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName.split(' ')[0]}`} alt="User Avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Ultra-comprehensive, mobile-responsive mini stats grid (Zero scroll fatigue) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest">Toplam</h3>
                    <p className="text-xl sm:text-3xl font-extrabold mt-1 sm:mt-2 text-slate-900 tracking-tight">{inventory.length}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-emerald-600 text-[9px] sm:text-xs font-bold">
                    <span className="bg-emerald-50 px-1.5 py-0.5 rounded tracking-normal font-mono">+12%</span>
                    <span className="uppercase tracking-wider hidden lg:inline">Aylık</span>
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest text-red-400">Kritik</h3>
                    <p className="text-xl sm:text-3xl font-extrabold mt-1 sm:mt-2 text-red-600 tracking-tight">{inventory.filter(i => i.quantity < i.minThreshold).length}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-[9px] sm:text-xs font-bold">
                    <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded tracking-normal">DİKKAT</span>
                    <span className="uppercase tracking-wider hidden lg:inline">Eşik Altı</span>
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest">Sınıf</h3>
                    <p className="text-xl sm:text-3xl font-extrabold mt-1 sm:mt-2 text-slate-900 tracking-tight">{new Set(inventory.map(i => i.category)).size}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-slate-500 text-[9px] sm:text-xs font-bold">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded tracking-normal truncate max-w-full">AKTİF</span>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <InventoryTable items={inventory} />
              </div>
            </>
          )}

          {activeTab === 'trend' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Envanter Hacim Analizi</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Aylık Değişim Trendi ve Finansal Öngörüler</p>
              </div>
              <InventoryTrendChart />
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileScreen onProfileSave={setUserName} currentName={userName} />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen />
          )}
        </div>
      </main>
      <AIChatAssistant inventory={inventory} customers={customers} />
      <HelpCenterModal isOpen={helpCenterOpen} onClose={() => setHelpCenterOpen(false)} />
    </div>
  );
}


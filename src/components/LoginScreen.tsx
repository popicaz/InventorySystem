/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('demo@sirket.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate high-end modern animation transition
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(email);
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fcfbfc] flex items-center justify-center p-6 relative overflow-hidden font-sans select-none" id="login-screen-root">
      {/* Decorative Modernist Background Grids & Spheres */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      
      {/* Abstract Architectural Shapes */}
      <div className="absolute top-1/4 left-1/12 w-64 h-64 rounded-full bg-[#b83b3b]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-80 h-80 rounded-full bg-[#1c1e21]/5 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 backdrop-blur-md relative z-10"
        id="login-card-container"
      >
        {/* Top Branding Section with Abstract Logo */}
        <div className="flex flex-col items-center mb-8 text-center" id="login-brand-group">
          <motion.div 
            className="w-14 h-14 rounded-full border border-[#b83b3b] bg-[#b83b3b]/5 flex items-center justify-center shadow-inner mb-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="login-logo-mark"
          >
            <div className="w-8 h-8 rounded-full border border-dashed border-[#1c1e21]/30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#b83b3b]" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-sans font-extrabold text-[#1c1e21] tracking-tight leading-tight">
            Sisteme Giriş Yapın
          </h1>
          <p className="text-[10px] text-[#b83b3b] font-bold uppercase tracking-widest mt-2 font-sans">
            Env-IQ Kurumsal Veri Hattı
          </p>
        </div>

        {/* Core Interactive Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" id="login-auth-form">
          {/* E-Mail Input with Clean Typography */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Kurumsal E-Posta</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isminiz@sirket.com"
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-xl bg-slate-50/50 transition-all font-sans text-slate-800"
              />
            </div>
          </div>

          {/* Password Input with Modern Aesthetics */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Şifre</label>
              <button 
                type="button" 
                onClick={() => alert('Şifre sıfırlama bağlantısı yöneticinize iletildi.')}
                className="text-[10px] font-bold text-[#b83b3b] hover:text-[#1c1e21] uppercase tracking-wider transition-colors"
                id="login-forgot-pwd"
              >
                Şifremi Unuttum?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreniz"
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-xl bg-slate-50/50 transition-all font-sans text-slate-800"
              />
            </div>
          </div>

          {/* Compact Trust / Remember Me Option */}
          <div className="flex items-center justify-between py-1" id="login-options-row">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-4 h-4 rounded border-slate-300 text-[#b83b3b] focus:ring-[#b83b3b]/30 accent-[#b83b3b]"
              />
              <span className="text-xs text-slate-500 font-medium">Beni hatırla</span>
            </label>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Güvenli Bağlantı
            </span>
          </div>

          {/* Single Heavy Modernist Centered CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3.5 bg-[#1c1e21] hover:bg-[#b83b3b] disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.98]"
              id="login-submit-btn"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  GİRİŞ YAPILDI
                </>
              ) : (
                <>
                  Hesaba Giriş Yap
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Minimal Bottom Info Line */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400/90 font-medium uppercase tracking-widest leading-relaxed">
            Bu portal yalnızca yetkili Env-IQ satış temsilcilerine ve depo personellerine özeldir.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

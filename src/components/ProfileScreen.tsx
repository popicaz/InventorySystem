/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Check } from 'lucide-react';

interface ProfileScreenProps {
  onProfileSave: (fullName: string) => void;
  currentName: string;
}

type FormView = 'register' | 'forgot' | 'confirm';

export default function ProfileScreen({ onProfileSave, currentName }: ProfileScreenProps) {
  // Form State
  const [firstName, setFirstName] = useState(currentName.split(' ')[0] || 'Ahmet');
  const [lastName, setLastName] = useState(currentName.split(' ')[1] || 'Yılmaz');
  const [email, setEmail] = useState('ahmet.yilmaz@sirket.com');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  
  // Forgot password & active views
  const [formView, setFormView] = useState<FormView>('register');
  const [isSaved, setIsSaved] = useState(false);

  // Simple Notification timer
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    onProfileSave(`${firstName} ${lastName}`);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-workspace">
      {/* Upper Title Band */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6" id="canvas-header-spec">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-[#1c1e21] tracking-tight leading-tight">
            {formView === 'register' && 'Profil Bilgilerini Düzenle'}
            {formView === 'forgot' && 'Şifre Kurtarma Operasyonu'}
            {formView === 'confirm' && 'Yeni Hesap Oluştur'}
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1.5 font-sans">
            {formView === 'register' && 'Kullanıcı Tercihleri ve Profil'}
            {formView === 'forgot' && 'Şifre Sıfırlama Hizmeti'}
            {formView === 'confirm' && 'Yeni Kurumsal Kayıt Hattı'}
          </p>
        </div>


      </div>

      {/* Centered White Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-10 shadow-sm relative" id="form-card">
        {/* Toast notify inside form if saved successfully */}
        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute inset-x-6 top-6 bg-[#b83b3b]/10 border border-[#b83b3b]/20 text-[#b83b3b] p-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 z-20"
              id="toast-notification"
            >
              <Check className="w-4 h-4 text-[#b83b3b]" />
              Profiliniz başarıyla kaydedildi ve asistan senkronize edildi!
            </motion.div>
          )}
        </AnimatePresence>

        {formView === 'register' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">İsim</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Örn: Ahmet"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/50 transition-all font-sans text-slate-800"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Soyisim</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Örn: Yılmaz"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/50 transition-all font-sans text-slate-800"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">E‑Posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isminiz@sirket.com"
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/50 transition-all font-sans text-slate-800"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Mevcut veya Yeni Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yeni şifrenizi belirleyin"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/50 transition-all font-sans text-slate-800"
              />
            </div>

            {/* Password Confirm */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Şifre Onayı</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi tekrar giriniz"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/50 transition-all font-sans text-slate-800"
              />
            </div>

            {/* Lower Buttons */}
            <div className="flex justify-start pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-[#1c1e21] hover:bg-[#b83b3b] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-sm active:scale-[0.98] w-full sm:w-auto font-sans"
                id="save-form-button"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        )}

        {formView === 'forgot' && (
          <div className="space-y-6">
            <p className="text-sm text-slate-500">
              E-posta adresinizi giriniz. Şifre sıfırlama bağlantısını doğrudan e-postanıza göndereceğiz.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Kurtarma E‑Posta Adresi</label>
              <input
                type="email"
                placeholder="isminiz@sirket.com"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/50 transition-all text-slate-800"
              />
            </div>
            <div className="flex justify-start pt-2">
              <button
                onClick={() => setFormView('register')}
                className="px-8 py-3 bg-[#1c1e21] hover:bg-[#b83b3b] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 w-full sm:w-auto"
              >
                Kurtarma Bağlantısı Gönder
              </button>
            </div>
          </div>
        )}

        {formView === 'confirm' && (
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Asistan sisteminde yeni bağımsız bir birim veya satış yetkilisi hesabı tanımlamak için formu doldurun.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yetkili Adı</label>
                <input type="text" placeholder="Örn: Mehmet" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-800 bg-slate-50/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yetkili Soyadı</label>
                <input type="text" placeholder="Örn: Kara" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-800 bg-slate-50/50" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-Posta</label>
              <input type="email" placeholder="mehmet.kara@sirket.com" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-800 bg-slate-50/50" />
            </div>
            <div className="flex justify-start pt-2">
              <button
                onClick={() => {
                  setFormView('register');
                  alert('Hesap oluşturuldu, giriş yapabilirsiniz.');
                }}
                className="px-8 py-3 bg-[#1c1e21] hover:bg-[#b83b3b] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 w-full sm:w-auto"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alternative links beneath direct box */}
      <div className="flex justify-between items-center text-[10px] tracking-wider font-bold uppercase font-sans text-slate-400/80 px-2" id="low-contrast-links">
        <button
          onClick={() => setFormView(formView === 'register' ? 'forgot' : 'register')}
          className="hover:text-[#b83b3b] transition-colors"
          id="forgot-pwd-trigger"
        >
          {formView === 'register' ? 'Şifremi Unuttum?' : '← Profil Düzenlemeye Dön'}
        </button>
        <button
          onClick={() => setFormView(formView === 'confirm' ? 'register' : 'confirm')}
          className="hover:text-[#b83b3b] transition-colors"
          id="create-account-trigger"
        >
          {formView === 'confirm' ? 'Vazgeç' : 'Yeni Hesap Oluştur'}
        </button>
      </div>
    </div>
  );
}

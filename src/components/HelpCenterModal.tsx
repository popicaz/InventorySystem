/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, HelpCircle, BookOpen, MessageSquare, Flame, CheckCircle2 } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'stok' | 'ai' | 'hesap';
}

const FAQS: FAQItem[] = [
  {
    id: 'faq1',
    category: 'stok',
    question: 'Kritik stok uyarısı nedir ve nasıl ayarlanır?',
    answer: 'Kritik stok uyarısı, envanterinizdeki bir ürünün miktarı belirlediğiniz güvenli sınırın altına düştüğünde sistemin sizi uyarmasını sağlar. Ayarlar (Settings) sekmesinden bu eşik değerini kolayca değiştirebilir, kaydettiğinizde anında tablonuzda güncelleyebilirsiniz.'
  },
  {
    id: 'faq2',
    category: 'ai',
    question: 'Yapay zeka asistanı Env-IQ ne işe yarar?',
    answer: 'Ekranın sağ alt köşesinde bulunan asistan, veritabanınızdaki canlı envanter ve müşteri verilerini okuyabilir. Ona "Kritik stoktaki ürünleri listele", "Müşteri analizini yapıp rapor ver" veya "X ürününün durumunu kontrol et" gibi tamamen Türkçe komutlar verebilirsiniz.'
  },
  {
    id: 'faq3',
    category: 'stok',
    question: 'Envanter verilerimi excel veya başka bir sisteme aktarabilir miyim?',
    answer: 'Evet! Ayarlar panelinde bulunan "Kurumsal Rapor Çıktısı (JSON)" butonu aracılığıyla tüm envanterinizi ve sistem verilerinizi anında şifreli bir JSON yedek dosyası olarak bilgisayarınıza indirebilirsiniz.'
  },
  {
    id: 'faq4',
    category: 'hesap',
    question: 'Profil bilgilerimi ve şebeke ismini nasıl değiştirebilirim?',
    answer: 'Menüde yer alan "Profil" sekmesine tıklayarak adınızı, soyadınızı, kurumsal e-posta adresinizi ve şifrenizi dilediğiniz zaman güncelleyebilirsiniz. Güncellenen isminiz anında tüm sistem paneline ve karşılama mesajlarına yansır.'
  },
  {
    id: 'faq5',
    category: 'ai',
    question: 'AI asistanın ses tonu veya yanıt uzunluğu sınırlandırılabilir mi?',
    answer: 'Evet, Ayarlar panelinde yer alan "Yapay Zeka Karakter ve Üslup" kartından asistanın tarzını; Sade ve Doğal, Kurumsal veya Kısa & Doğrudan olarak 3 farklı moda ayarlayabilirsiniz.'
  }
];

export default function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'stok' | 'ai' | 'hesap'>('all');
  const [openFaq, setOpenFaq] = useState<string | null>('faq1');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendTicket = (e: FormEvent) => {
    e.preventDefault();
    if (ticketSubject.trim() && ticketMessage.trim()) {
      setTicketSent(true);
      setTimeout(() => {
        setTicketSent(false);
        setTicketSubject('');
        setTicketMessage('');
      }, 3500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen lock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            id="help-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative z-10"
            id="help-modal-body"
          >
            {/* Header section with brand accent line */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 relative">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#b83b3b]/10 rounded-lg flex items-center justify-center text-[#b83b3b]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#1c1e21] tracking-tight">Destek & Yardım Merkezi</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Kolay ve Hızlı Bilgi Bankası</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-800 transition-colors focus:outline-none"
                id="close-help-modal-btn"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Interactive body split in tabs/scroller */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Top instant FAQ search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Yardım makalelerinde veya sorularda arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 focus:border-[#b83b3b] focus:ring-1 focus:ring-[#b83b3b]/20 outline-none rounded-lg bg-slate-50/40 transition-all text-slate-800 font-medium"
                  id="help-center-search"
                />
              </div>

              {/* Categorization tabs */}
              <div className="flex gap-1 border-b border-slate-100 pb-1.5 text-xs font-bold uppercase tracking-wider overflow-x-auto select-none no-scrollbar">
                {(['all', 'stok', 'ai', 'hesap'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeCategory === cat 
                        ? 'bg-[#1c1e21] text-white' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'all' && 'Tümü'}
                    {cat === 'stok' && 'Stok Yönetimi'}
                    {cat === 'ai' && 'AI Asistan'}
                    {cat === 'hesap' && 'Profil & Güvenlik'}
                  </button>
                ))}
              </div>

              {/* Grid content split: FAQ on Left side, quick Support request form on Right */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* FAQs Stack (Left 3 cols) */}
                <div className="md:col-span-3 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    Popüler Sorular ({filteredFaqs.length})
                  </span>

                  {filteredFaqs.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500 font-medium">Aradığınız kelimeye ait bir konu bulunamadı.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                        className="text-[10px] text-indigo-600 underline font-extrabold mt-1.5 block uppercase tracking-wide"
                      >
                        Sıfırla
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {filteredFaqs.map(faq => {
                        const isOpen = openFaq === faq.id;
                        return (
                          <div 
                            key={faq.id} 
                            className="border border-slate-150 rounded-lg overflow-hidden transition-all duration-200"
                          >
                            <button
                              onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                              className={`w-full flex items-center justify-between p-3 text-left text-xs font-bold transition-colors ${
                                isOpen ? 'bg-slate-50 text-[#b83b3b]' : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <span className="pr-4 leading-normal">{faq.question}</span>
                              <span className="text-slate-400 shrink-0 transform transition-transform duration-200">
                                {isOpen ? '−' : '+'}
                              </span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden bg-slate-50/50"
                                >
                                  <div className="p-3 text-[11px] text-slate-500 border-t border-slate-100 leading-relaxed font-sans">
                                    {faq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Direct Support Ticket Form (Right 2 cols) */}
                <div className="md:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-250 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#1c1e21] mb-2">
                      <MessageSquare className="w-4 h-4 text-[#b83b3b]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Hızlı Destek Hattı</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-sans">
                      Aradığınız cevabı bulamadınız mı? Bize anında bir talep iletin, teknik ekibimiz 15 dakika içinde yanıtlasın.
                    </p>

                    <AnimatePresence mode="wait">
                      {ticketSent ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-center space-y-2"
                        >
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                          <h5 className="text-xs font-bold text-emerald-800">Tebrikler!</h5>
                          <p className="text-[10px] text-emerald-600 font-sans leading-relaxed">
                            Destek biletiniz (#ENVIQ-419) açıldı. Sorumlu ekibimiz e-posta adresinizden dönüş yapacaktır.
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSendTicket} className="space-y-3">
                          <input
                            type="text"
                            placeholder="Konu başlığı (Örn: Hata)"
                            required
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            className="w-full px-3 py-2 text-[11px] border border-slate-250 bg-white rounded-lg outline-none focus:border-[#b83b3b] font-medium"
                          />
                          <textarea
                            placeholder="Sorununuzu kısaca buraya yazınız..."
                            required
                            rows={3}
                            value={ticketMessage}
                            onChange={(e) => setTicketMessage(e.target.value)}
                            className="w-full px-3 py-2 text-[11px] border border-slate-250 bg-white rounded-lg outline-none focus:border-[#b83b3b] font-medium resize-none"
                          />
                          <button
                            type="submit"
                            className="w-full py-2 bg-[#1c1e21] hover:bg-[#b83b3b] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors shadow-sm"
                          >
                            BAŞVURUYU GÖNDER
                          </button>
                        </form>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-widest select-none">
                    <span>Çevrimiçi Destek</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      AKTİF
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer with support hotlines */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest font-sans">
              <span>Kurumsal Yardım: support@enviq.com</span>
              <span className="text-[#b83b3b]">7/24 Kesintisiz Hizmet Modu</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

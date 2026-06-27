/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { Bot, RefreshCcw, Send, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage, Customer, InventoryItem } from '../types';

interface AIChatAssistantProps {
  inventory: InventoryItem[];
  customers: Customer[];
}

export default function AIChatAssistant({ inventory, customers }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    
    // Welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Merhaba! Ben Şirket Envanter ve Müşteri Asistanıyım. Stok durumu, kritik seviyedeki ürünler veya müşteri listemiz hakkında bilgi almak için bana yazabilirsiniz.',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!aiRef.current) {
        throw new Error('Gemini API anahtarı ayarlanmamış.');
      }

      const inventoryData = JSON.stringify(inventory, null, 2);
      const customerData = JSON.stringify(customers, null, 2);
      
      const systemPrompt = `Sen bir Şirket Envanter ve Müşteri Asistanısın. 
      
      YANIT STİLİ KURALLARI:
      1. Yanıtlarını rapor formatında veya madde işaretleri (*, -, vb.) kullanarak verme.
      2. Tamamen sade, akıcı ve bir insanla konuşuyormuşsun gibi doğal Türkçe cümleler kur.
      3. "Ürün Adı", "Kritik Eşik", "Miktar" gibi teknik alan isimlerini doğrudan kullanma; bunları "şu üründen elimizde şu kadar kalmış" gibi doğal cümlelere yedir.
      4. Bilgiyi doğrudan ve net bir şekilde, bir hikaye anlatır gibi veya sohbet eder gibi ilet.

      Sana verilen güncel veriler:
      
      ENVANTER:
      ${inventoryData}
      
      MÜŞTERİLER:
      ${customerData}

      ÖNEMLİ GÖREVLER:
      - Bir ürünün miktarı azaldığında bunu samimi bir dille hatırlat.
      - Sorulan sorulara (örn: "Elektronik kategorisinde neyimiz var?") listedeki verileri kullanarak, liste yapmadan cümlelerle cevap ver.
      - Müşteri bilgisi sorulduğunda kayıtlı kişileri doğal bir akışla anlat.
      - Bilmediğin bir şey olursa dürüstçe ama nazikçe belirt.`;

      // Filter messages for Gemini (exclude welcome message if it's first, or map correctly)
      // Gemini history must alternate User/Model and MUST start with User.
      const chatHistory = messages
        .filter(m => m.id !== 'welcome') // Skip welcome message to ensure we start with user
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'Üzgünüm, şu an yanıt veremiyorum.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, isteğinizi işlerken bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-all z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        id="chat-trigger-button"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <RefreshCcw className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="relative"
            >
              <Bot className="w-6 h-6" />
              {inventory.filter(i => i.quantity < i.minThreshold).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50"
            id="chat-window"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white" id="chat-header">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Env-IQ Asistan</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-none">Çevrimiçi</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-100"
                title="Sohbeti Temizle"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-slate-50/50"
              id="chat-messages"
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                      message.role === 'user' 
                        ? 'bg-white text-slate-800 rounded-tr-none border border-slate-200 shadow-sm' 
                        : 'bg-indigo-600 text-white font-medium rounded-tl-none shadow-md shadow-indigo-100'
                    }`}>
                      {message.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1.5 px-1 uppercase tracking-wider font-bold">
                      {message.role === 'user' ? 'Siz' : 'Asistan'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-indigo-100 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100" id="chat-input-container">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Bir mesaj yazın..."
                  className="w-full pl-4 pr-10 py-3 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  id="chat-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-2.5 text-indigo-600 disabled:text-slate-300"
                >
                  <Send className="w-5 h-5 shadow-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

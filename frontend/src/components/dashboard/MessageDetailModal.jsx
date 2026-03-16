{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import { X, Star, Camera, AlignLeft, AlignCenter } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

// Daftar tema warna untuk kartu Story
const THEMES = [
  { id: 'default', name: 'Klasik', class: 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800' },
  { id: 'rose', name: 'Asmara', class: 'bg-gradient-to-br from-rose-400 to-rose-600 text-white border-transparent' },
  { id: 'ocean', name: 'Samudra', class: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-transparent' },
  { id: 'sunset', name: 'Senja', class: 'bg-gradient-to-br from-orange-400 to-rose-500 text-white border-transparent' },
  { id: 'midnight', name: 'Malam', class: 'bg-gradient-to-br from-slate-800 to-zinc-900 text-white border-zinc-700/50' },
  { id: 'neon', name: 'Neon', class: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white border-transparent' }
];

export default function MessageDetailModal({ message, onClose, onToggleStar }) {
  const { t } = useTranslation();
  
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [textAlign, setTextAlign] = useState('text-left');
  const [hideUI, setHideUI] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Set default align dinamis saat pesan pertama kali dibuka
  useEffect(() => {
    if (message) {
      const isShort = message.message.length < 50 && !message.message.includes('\n');
      setTextAlign(isShort ? 'text-center' : 'text-left');
      setHideUI(false);
    }
  }, [message]);

  // Efek timer untuk menyembunyikan petunjuk "Ketuk layar..." setelah 3 detik
  useEffect(() => {
    let timer;
    if (hideUI) {
      setShowHint(true);
      timer = setTimeout(() => {
        setShowHint(false);
      }, 3000);
    } else {
      setShowHint(false);
    }
    return () => clearTimeout(timer);
  }, [hideUI]);

  if (!message) return null;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (hideUI) {
      setHideUI(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
      onClick={hideUI ? () => setHideUI(false) : undefined}
    >
      {/* Background Blur Gelap */}
      <div 
        className={`absolute inset-0 bg-zinc-900/80 backdrop-blur-md transition-opacity duration-300 ${hideUI ? 'opacity-100' : 'opacity-100'}`} 
        onClick={onClose}
      ></div>
      
      {/* HEADER NAVIGASI */}
      <div className={`relative w-full max-w-sm flex justify-between items-center mb-4 z-10 px-2 transition-all duration-300 ${hideUI ? 'opacity-0 invisible -translate-y-4' : 'opacity-100 visible translate-y-0'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleStar) onToggleStar();
          }}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
            message.starred 
              ? 'bg-yellow-500/20 text-yellow-400' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Star className={`w-5 h-5 ${message.starred ? 'fill-current' : ''}`} />
        </button>

        {/* Tombol Screenshot Mode / Hide UI */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setHideUI(true);
          }}
          className="text-white/90 font-bold text-xs flex items-center gap-1.5 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md transition-all shadow-lg"
        >
          <Camera className="w-3.5 h-3.5" /> Bersihkan Layar
        </button>

        <button 
          onClick={onClose} 
          className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* KARTU UTAMA */}
      <div 
        onClick={handleCardClick}
        className={`relative w-full max-w-sm rounded-[32px] shadow-2xl p-6 sm:p-8 border flex flex-col min-h-[400px] transition-all duration-500 ease-out cursor-default ${activeTheme.class} ${hideUI ? 'scale-[1.02] shadow-[0_0_40px_rgba(0,0,0,0.5)] cursor-pointer' : 'scale-100'}`}
      >
        
        {/* Header Kartu: Hint Pengirim */}
        <div className="text-center mb-4 sm:mb-6 shrink-0 mt-2">
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest opacity-80">
            {message.hint || "Pesan Anonim"}
          </h4>
          <div className="w-12 h-1 bg-current opacity-20 rounded-full mx-auto mt-2 sm:mt-3"></div>
        </div>

        {/* Isi Pesan dengan Align Dinamis */}
        <div className={`flex-1 flex flex-col justify-center my-2 sm:my-4 w-full ${textAlign === 'text-center' ? 'items-center' : 'items-start'}`}>
          <p className={`text-[15px] sm:text-base md:text-lg font-bold leading-relaxed whitespace-pre-wrap break-words w-full ${textAlign}`}>
            {message.message}
          </p>
        </div>

        {/* Watermark Branding */}
        <div className="mt-4 sm:mt-8 text-center shrink-0">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-50 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            secretly
          </p>
        </div>
      </div>

      {/* Petunjuk keluar dari Screenshot Mode (Memisah dari kartu, nempel di layar bawah, dan memudar setelah 3 detik) */}
      <div className={`fixed bottom-10 left-0 right-0 text-center text-white/60 text-xs font-medium transition-all duration-1000 ${showHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        Ketuk layar di mana saja untuk kembali
      </div>

      {/* FOOTER: PEMILIH TEMA & ALIGN */}
      <div className={`relative w-full max-w-sm mt-6 z-10 flex flex-col gap-3 transition-all duration-300 ${hideUI ? 'opacity-0 invisible translate-y-4' : 'opacity-100 visible translate-y-0'}`}>
        
        {/* Pilihan Tema */}
        <div className="flex items-center justify-center gap-2.5 bg-black/20 p-2.5 rounded-full backdrop-blur-md overflow-x-auto hide-scrollbar border border-white/5">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme)}
              title={theme.name}
              className={`w-10 h-10 rounded-full shrink-0 border-2 transition-all ${theme.class} ${
                activeTheme.id === theme.id 
                  ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            />
          ))}
        </div>

        {/* Pilihan Rata Teks (Alignment Toggle) */}
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => setTextAlign('text-left')} 
            className={`p-2 rounded-full backdrop-blur-md transition-all ${textAlign === 'text-left' ? 'bg-white/30 text-white shadow-md' : 'bg-black/20 text-white/50 hover:bg-black/40 hover:text-white/80'}`}
            title="Rata Kiri"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTextAlign('text-center')} 
            className={`p-2 rounded-full backdrop-blur-md transition-all ${textAlign === 'text-center' ? 'bg-white/30 text-white shadow-md' : 'bg-black/20 text-white/50 hover:bg-black/40 hover:text-white/80'}`}
            title="Rata Tengah"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
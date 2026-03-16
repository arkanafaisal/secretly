{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { MessageCircle } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function Navbar({ onOpenModal }) {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0 cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="text-white w-4 h-4 md:w-6 md:h-6" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Secretly</span>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
          <button 
            onClick={() => onOpenModal('login')}
            className="hidden sm:block font-bold text-sm md:text-base text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {t('navLogin')}
          </button>
          <button 
            onClick={() => onOpenModal('signup')}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-bold hover:bg-zinc-800 dark:hover:bg-white transition-transform hover:scale-105 active:scale-95 whitespace-nowrap shadow-sm"
          >
            {t('navGetLink')}
          </button>
        </div>
      </div>
    </nav>
  );
}
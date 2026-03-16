{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { X, Globe } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function GlobalSettingsModal({ isOpen, onClose }) {
  const { t, lang, changeLanguage } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 border border-zinc-100 dark:border-zinc-800 flex flex-col transition-colors">
        
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h2 className="text-xl font-black flex items-center gap-2 text-zinc-900 dark:text-white">
            <Globe className="w-5 h-5 text-rose-500" />
            {t('webPreferences')}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Pengaturan Bahasa Saja */}
          <div>
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 block">
              {t('language')}
            </label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-2xl">
              <button 
                onClick={() => changeLanguage('id')}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${lang === 'id' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Indonesia
              </button>
              <button 
                onClick={() => changeLanguage('eng')}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${lang === 'eng' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
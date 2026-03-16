{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { Sparkles, LogOut, Globe } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function Navbar({ onLogout, onOpenGlobalSettings }) {
  const { t } = useTranslation();

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Secretly</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={onOpenGlobalSettings}
            title={t('webPreferences')}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700/80 hidden sm:block"></div>

          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 p-2 sm:p-0 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 font-bold text-sm transition-colors"
          >
            <span className="hidden sm:inline">{t('logout')}</span>
            <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </nav>
  );
}
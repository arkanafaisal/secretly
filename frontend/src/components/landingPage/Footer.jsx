{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { MessageCircle } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800/80 py-12 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-800 rounded-lg flex items-center justify-center shadow-sm">
            <MessageCircle className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors">Secretly</span>
        </div>
        
        <div className="flex space-x-6 text-sm font-bold text-zinc-500 dark:text-zinc-400">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{t('footerTerms')}</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{t('footerPrivacy')}</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{t('footerHelp')}</a>
        </div>
        
        <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
          &copy; 2026 Secretly. {t('footerRights')}
        </p>
      </div>
    </footer>
  );
}
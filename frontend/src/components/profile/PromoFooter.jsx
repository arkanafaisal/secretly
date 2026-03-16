{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { navigate } from '../../utils/api';
import useTranslation from '../../hooks/useTranslation';

export default function PromoFooter() {
  const { t } = useTranslation();

  return (
    <div className="text-center bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-700/80 transition-colors w-full">
      <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 transition-colors">
        {t('wantToReceiveMessages')}
      </p>
      <button 
        onClick={() => navigate('/')}
        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-md w-full"
      >
        {t('createYourSecretlyLink')}
      </button>
    </div>
  );
}
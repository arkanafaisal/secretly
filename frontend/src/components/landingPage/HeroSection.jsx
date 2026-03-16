{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function HeroSection({ onOpenModal }) {
  const { t } = useTranslation();

  return (
    <section className="min-h-[100dvh] flex flex-col justify-center items-center px-6 pt-16 md:pt-20 relative overflow-hidden transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-orange-400/20 dark:from-rose-500/10 dark:via-pink-500/10 dark:to-orange-400/10 rounded-full blur-3xl -z-10 opacity-70"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        <div className="inline-flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-full mb-6 font-bold text-xs md:text-sm tracking-wide uppercase border border-rose-100 dark:border-rose-900/50 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span>{t('heroBadge')}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-[1.1] text-zinc-900 dark:text-white">
          {t('heroTitle1')} <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500">
            {t('heroTitle2')}
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium mb-8 max-w-2xl mx-auto leading-relaxed transition-colors">
          {t('heroDesc')}
        </p>

        <button 
          onClick={() => onOpenModal('signup')}
          className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white text-base md:text-xl font-black px-6 py-3.5 md:px-8 md:py-4 rounded-full shadow-[0_8px_30px_rgba(244,63,94,0.4)] dark:shadow-[0_8px_30px_rgba(244,63,94,0.2)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto whitespace-nowrap"
        >
          <span>{t('heroBtn')}</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </section>
  );
}
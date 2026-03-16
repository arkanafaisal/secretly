{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { Link as LinkIcon, Instagram, MessageCircle } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900 transition-colors px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-zinc-900 dark:text-white transition-colors">{t('hiwTitle')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium md:text-lg transition-colors">{t('hiwSubtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-700/50 text-center relative overflow-hidden group transition-colors">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 rounded-3xl mx-auto flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300">
              <LinkIcon className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-zinc-900 dark:text-white transition-colors">{t('hiwStep1Title')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed transition-colors">
              {t('hiwStep1Desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-700/50 text-center relative overflow-hidden group transition-colors">
            <div className="w-20 h-20 bg-pink-50 dark:bg-pink-950/50 text-pink-500 dark:text-pink-400 rounded-3xl mx-auto flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300">
              <Instagram className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-zinc-900 dark:text-white transition-colors">{t('hiwStep2Title')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed transition-colors">
              {t('hiwStep2Desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-700/50 text-center relative overflow-hidden group transition-colors">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/50 text-orange-500 dark:text-orange-400 rounded-3xl mx-auto flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300">
              <MessageCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-zinc-900 dark:text-white transition-colors">{t('hiwStep3Title')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed transition-colors">
              {t('hiwStep3Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
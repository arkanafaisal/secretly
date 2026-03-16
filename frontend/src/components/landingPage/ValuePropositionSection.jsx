{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function ValuePropositionSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-5xl mx-auto bg-zinc-900 dark:bg-zinc-900 rounded-[40px] md:rounded-[60px] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl dark:border dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-12">{t('vpTitle')}</h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="flex space-x-4 items-start bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-green-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">{t('vpFeat1Title')}</h4>
                <p className="text-zinc-400">{t('vpFeat1Desc')}</p>
              </div>
            </div>
            
            <div className="flex space-x-4 items-start bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">{t('vpFeat2Title')}</h4>
                <p className="text-zinc-400">{t('vpFeat2Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
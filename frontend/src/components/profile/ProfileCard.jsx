{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import Avatar from '../common/Avatar';
import useTranslation from '../../hooks/useTranslation';

export default function ProfileCard({ profileData }) {
  const { t } = useTranslation();
  const usernameFontSize = (profileData.username?.length || 0) > 15 ? 'text-2xl' : 'text-3xl';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl p-8 md:p-10 border border-zinc-100 dark:border-zinc-800 text-center relative overflow-hidden w-full transition-colors h-full flex flex-col justify-center">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-rose-500/20 dark:from-rose-500/10 to-transparent pointer-events-none"></div>
      
      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-[40px] flex items-center justify-center shadow-xl mb-6 ring-4 ring-white dark:ring-zinc-900 rotate-3 hover:rotate-0 transition-all duration-300 relative z-10 shrink-0">
        <Avatar index={profileData.avatarIndex || 0} className="w-16 h-16" strokeWidth={2.5} />
      </div>
      
      <h1 className={`${usernameFontSize} font-black text-zinc-900 dark:text-white mb-4 relative z-10 transition-colors shrink-0`}>
        @{profileData.username}
      </h1>
      
      <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap break-words relative z-10 transition-colors">
        {profileData.bio || t('defaultBio')}
      </p>
    </div>
  );
}
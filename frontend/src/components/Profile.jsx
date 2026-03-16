{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api, { navigate } from '../utils/api';
import { Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import useTranslation from '../hooks/useTranslation';

import ProfileCard from './profile/ProfileCard';
import MessageCard from './profile/MessageCard';
import PromoFooter from './profile/PromoFooter';

export default function Profile({ publicId }) {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { response, result } = await api.public.getProfile(publicId);
        
        if (response.ok && result.success && result.data) {
          setProfileData(result.data);
        } else {
          setError(result.message || t('oopsNotFound'));
        }
      } catch (err) {
        setError(t('connectionError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [publicId, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400 font-bold">{t('searchingProfile')}</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-2xl text-center max-w-sm w-full border border-zinc-100 dark:border-zinc-800 transition-colors">
          <AlertCircle className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('oopsNotFound')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
            {error || t('linkInactiveOrWrong')}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
          >
            {t('createOwnLink')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col md:overflow-hidden transition-colors">
      
      <div className="p-4 md:p-6 shrink-0 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <MessageCircle className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors">Secretly</span>
        </div>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 pb-10 md:pb-6 flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-stretch justify-center md:overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="w-full md:w-1/2 max-w-sm flex flex-col shrink-0 order-1">
          <ProfileCard profileData={profileData} />
          <div className="hidden md:block mt-auto pt-6">
            <PromoFooter />
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-md flex flex-col shrink-0 order-2 h-full">
          <MessageCard publicId={publicId} allowMessages={profileData.allowMessages} />
        </div>

        <div className="w-full max-w-sm md:hidden order-3 mt-2">
          <PromoFooter />
        </div>

      </main>
    </div>
  );
}
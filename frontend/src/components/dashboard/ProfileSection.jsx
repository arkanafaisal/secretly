{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; 
import { Copy, CheckCircle2, Edit3, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar, { AVATARS_COUNT } from '../common/Avatar';
import useTranslation from '../../hooks/useTranslation';

export default function ProfileSection({ userData, onOpenSettings }) {
  const { t } = useTranslation();
  const [copySuccess, setCopySuccess] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isMessagesAllowed, setIsMessagesAllowed] = useState(true);

  const [avatarIndex, setAvatarIndex] = useState(0);
  const [savedAvatarIndex, setSavedAvatarIndex] = useState(0);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsMessagesAllowed(userData.allowMessages !== false);
      setAvatarIndex(userData.avatarIndex || 0);
      setSavedAvatarIndex(userData.avatarIndex || 0);
    }
  }, [userData]);

  const handleCopyLink = () => {
    if (!userData || !isMessagesAllowed) return;
    const linkIdentifier = userData.publicId || userData.username;
    const link = `${window.location.origin}/profile/${linkIdentifier}`; 
    
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleToggleMessages = async () => {
    if (isToggling) return;
    setIsToggling(true);
    const newState = !isMessagesAllowed;
    const { response, result } = await api.users.toggleAllowMessages({ allowMessages: newState });
    if (response.ok && result.success) {
      setIsMessagesAllowed(newState);
    } else {
      alert(result.message || t('failedToggleMsg'));
    }
    setIsToggling(false);
  };

  const handleNextAvatar = () => setAvatarIndex((prev) => (prev + 1) % AVATARS_COUNT);
  const handlePrevAvatar = () => setAvatarIndex((prev) => (prev - 1 + AVATARS_COUNT) % AVATARS_COUNT);

  const handleSaveAvatar = async () => {
    if (isSavingAvatar) return;
    setIsSavingAvatar(true);
    try {
      const { response, result } = await api.users.updateAvatar({ avatarIndex });
      if (response.ok && result.success) {
        setSavedAvatarIndex(avatarIndex);
      } else {
        alert(result.message || t('failedSaveAvatar'));
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const usernameFontSize = (userData?.username?.length || 0) > 15 ? 'text-lg md:text-xl' : (userData?.username?.length || 0) > 10 ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-4 md:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 dark:border-zinc-800 mb-5 relative transition-colors">
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-5">
        
        {/* Kolom Kiri & Tengah: Avatar + Info Profil (Berjajar horizontal) */}
        <div className="flex flex-row items-start gap-4 flex-1 w-full min-w-0">
          
          {/* Avatar & Selector */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-[24px] flex items-center justify-center text-3xl font-black shadow-lg relative z-10">
              <Avatar index={avatarIndex} className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
            </div>

            <div className="relative mt-2 flex items-center justify-center w-20 md:w-24 z-20">
              <div className="relative z-10 flex items-center justify-between w-full bg-zinc-50 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/80 transition-colors">
                <button onClick={handlePrevAvatar} className="p-1 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors shrink-0">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 w-4 text-center select-none">
                  {avatarIndex + 1}
                </span>
                <button onClick={handleNextAvatar} className="p-1 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleSaveAvatar}
                disabled={isSavingAvatar}
                className={`absolute left-full ml-2 py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 flex items-center justify-center shadow-md z-30 whitespace-nowrap ${
                  avatarIndex !== savedAvatarIndex ? 'opacity-100 translate-x-0 visible' : 'opacity-0 -translate-x-2 invisible pointer-events-none'
                }`}
              >
                {isSavingAvatar ? t('saving') : t('save')}
              </button>
            </div>
          </div>
          
          {/* Info Akun & Bio */}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center justify-start gap-2 w-full">
              <h1 className={`${usernameFontSize} font-black text-zinc-900 dark:text-white truncate transition-all`}>
                @{userData?.username}
              </h1>
              <button 
                onClick={onOpenSettings}
                title={t('editProfile')}
                className="p-1.5 md:p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            {/* line-clamp-4 dihapus, ditambah break-words whitespace-pre-wrap */}
            <p className={`mt-1 text-xs md:text-sm leading-relaxed break-words whitespace-pre-wrap ${userData?.bio ? 'text-zinc-700 dark:text-zinc-300 font-medium' : 'text-zinc-400 dark:text-zinc-500 italic'}`}>
              {userData?.bio || t('noBio')}
            </p>
          </div>
        </div>

        {/* Kolom Kanan / Bawah: Actions Container */}
        <div className="flex flex-col gap-1.5 md:gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <div className="flex flex-row md:flex-col gap-1.5 md:gap-3 w-full">
            
            {/* TOGGLE ALLOW MESSAGES */}
            <div 
              onClick={handleToggleMessages}
              className={`flex-1 md:w-48 px-2 py-2 md:px-3 md:py-2.5 rounded-xl flex items-center justify-between gap-1.5 md:gap-2 border transition-all select-none
                ${isToggling ? 'opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/80' : 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/80'}
              `}
            >
              <div className="flex items-center gap-1 md:gap-1.5 overflow-hidden">
                <MessageSquare className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-colors ${isMessagesAllowed ? 'text-rose-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-zinc-700 dark:text-zinc-200 truncate transition-colors">
                  {t('receiveMessages')}
                </span>
              </div>
              <div className={`relative inline-flex h-4 w-7 md:h-5 md:w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isMessagesAllowed ? 'bg-rose-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                <span className={`pointer-events-none inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isMessagesAllowed ? 'translate-x-3 md:translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* COPY LINK */}
            <button 
              onClick={handleCopyLink}
              disabled={!isMessagesAllowed}
              className={`flex-1 md:w-48 px-2 py-2 md:px-3 md:py-2.5 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 md:gap-1.5 transition-all ${
                !isMessagesAllowed 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none border border-zinc-200 dark:border-zinc-700/80' 
                  : copySuccess 
                    ? 'bg-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] dark:shadow-[0_4px_15px_rgba(34,197,94,0.1)]' 
                    : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {copySuccess ? (
                <><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /><span className="whitespace-nowrap">{t('copied')}</span></>
              ) : (
                <><Copy className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /><span className="whitespace-nowrap"><span className="hidden sm:inline">{t('copy')}</span>{t('link')}</span></>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api, { navigate } from '../../utils/api';
import { Loader2, CheckCircle2, AlertCircle, KeyRound, Lock } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function ResetPassword({ token }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error', 'invalid'
  const [message, setMessage] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token || token.length < 10) {
      setStatus('invalid');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage(t('passMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      setMessage(t('passMismatch'));
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { response, result } = await api.auth.resetPassword(token, { 
        password, 
        confirmPassword 
      });
      
      if (response.ok && result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(result.message || t('resetFailed'));
      }
    } catch (err) {
      setStatus('error');
      setMessage(t('resetConnError'));
    }
  };

  if (status === 'invalid') {
    return (
      <div className="h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 text-center max-w-sm w-full transition-colors">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('invalidLinkTitle')}</h2>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
            {t('invalidResetLinkDesc')}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 text-center max-w-sm w-full transition-colors animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('passChangedTitle')}</h2>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
            {t('passChangedDesc')}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-rose-500 text-white py-3.5 rounded-2xl font-bold hover:bg-rose-600 transition-colors"
          >
            {t('loginNow')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors">
      
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 text-center max-w-sm w-full transition-colors animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
        
        <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shrink-0">
          <KeyRound className="w-7 h-7 md:w-8 md:h-8 text-rose-500" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-1.5 shrink-0">{t('createNewPassTitle')}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-4 md:mb-5 shrink-0">
          {t('createNewPassDesc')}
        </p>

        {(status === 'error' || message) && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-bold border border-red-100 dark:border-red-900/30 text-left shrink-0 animate-in fade-in slide-in-from-top-2">
            {message}
          </div>
        )}

        <div className="overflow-y-auto hide-scrollbar flex-1 px-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
            
            <div>
              <label className="text-xs md:text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400 dark:text-zinc-500" /> {t('newPassLabel')}
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('newPassPlaceholder')}
                required
                minLength={6}
                disabled={status === 'loading'}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-2.5 md:py-3 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs md:text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400 dark:text-zinc-500" /> {t('confirmPassLabel')}
              </label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPassPlaceholder')}
                required
                minLength={6}
                disabled={status === 'loading'}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-2.5 md:py-3 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-rose-500 text-white py-3 md:py-3.5 rounded-2xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('savePassword')
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
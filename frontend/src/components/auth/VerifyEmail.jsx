{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api, { navigate } from '../../utils/api';
import { Loader2, CheckCircle2, AlertCircle, MailCheck } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function VerifyEmail({ token }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'invalid'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token || token.length < 10) {
      setStatus('invalid');
      return;
    }

    const verifyToken = async () => {
      try {
        const { response, result } = await api.auth.verifyEmail(token);
        
        if (response.ok && result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(result.message || t('expiredVerifyLink'));
        }
      } catch (err) {
        setStatus('error');
        setMessage(t('verifyConnError'));
      }
    };

    verifyToken();
  }, [token, t]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl p-8 md:p-10 border border-zinc-100 dark:border-zinc-800 text-center max-w-sm w-full transition-colors animate-in zoom-in-95 duration-300">
        
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('verifyingTitle')}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t('verifyingDesc')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('emailVerifiedTitle')}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
              {t('emailVerifiedDesc')}
            </p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              {t('backToHome')}
            </button>
          </>
        )}

        {(status === 'error' || status === 'invalid') && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('verifyFailedTitle')}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
              {status === 'invalid' ? t('invalidVerifyLink') : message}
            </p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              {t('backToHome')}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
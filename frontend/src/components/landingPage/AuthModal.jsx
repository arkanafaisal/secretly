{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Loader2, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import api, { navigate } from '../../utils/api';
import useTranslation from '../../hooks/useTranslation';

export default function AuthModal({ isOpen, onClose, type, setType }) {
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotBtn, setShowForgotBtn] = useState(false);

  // Membersihkan modal dan mengembalikan mode awal ketika modal dibuka kembali
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setEmail('');
      setErrorMsg('');
      setShowForgotBtn(false);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const isLogin = type === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    // Alur Submission Berdasarkan Mode
    if (type === 'forgot') {
      const { response, result } = await api.users.forgotPassword({ email });
      if (response.ok && result.success) {
        setType('forgotSuccess');
      } else {
        setErrorMsg(result.message || t('failedSendResetLink'));
      }
    } else {
      const payload = { username, password };
      try {
        const { response, result } = isLogin 
          ? await api.auth.login(payload)
          : await api.auth.register(payload);

        if (response.ok && result.success) {
          if (result.data) {
            localStorage.setItem('accessToken', result.data);
          }
          setUsername('');
          setPassword('');
          onClose();
          navigate('/dashboard'); 
        } else {
          setErrorMsg(result.message || (isLogin ? t('loginFailed') : t('registerFailed')));
          if (isLogin) {
            setShowForgotBtn(true);
          }
        }
      } catch (error) {
        console.error("Auth Error:", error);
        setErrorMsg(t('connectionError'));
      }
    }
    
    setIsLoading(false);
  };

  // 1. Tampilan mode "Forgot Success"
  if (type === 'forgotSuccess') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-sm md:max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 transition-colors border border-zinc-100 dark:border-zinc-800 text-center">
          
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('checkYourEmail')}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
            {t('checkEmailDesc')}
          </p>
          <button 
            onClick={() => {
              setType('login');
              setShowForgotBtn(false); 
            }}
            className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
          >
            {t('backToLogin')}
          </button>

        </div>
      </div>
    );
  }

  // 2. Tampilan mode "Forgot Form"
  if (type === 'forgot') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative w-full max-w-sm md:max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl p-6 md:p-8 animate-in slide-in-from-right-4 duration-300 transition-colors border border-zinc-100 dark:border-zinc-800">
          
          <button 
            onClick={() => { setType('login'); setErrorMsg(''); }}
            className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-6 transition-colors w-max"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToLogin')}
          </button>
          
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t('resetPassModalTitle')}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6">
            {t('resetPassModalDesc')}
          </p>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2 ml-1">
                <Mail className="w-4 h-4 text-zinc-400" /> {t('emailAddress')}
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-colors disabled:opacity-50"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white font-black py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_8px_30px_rgba(244,63,94,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('sendResetLinkBtn')}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // 3. Tampilan Bawaan: Login & Signup Form
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-sm md:max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 transition-colors border border-zinc-100 dark:border-zinc-800">
        <button onClick={onClose} disabled={isLoading} className="absolute top-6 right-6 p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 pt-4">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <MessageCircle className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight transition-colors">
            {isLogin ? t('authWelcome') : t('authGetLink')}
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl text-center animate-in fade-in slide-in-from-top-2">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1 transition-colors">{t('authUsernameLabel')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 font-bold">@</span>
              <input 
                type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl pl-9 pr-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1 transition-colors">{t('authPasswordLabel')}</label>
            <input 
              type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-all disabled:opacity-50"
            />

            {/* Contextual UI: Tombol Lupa Kata Sandi muncul ketika gagal login */}
            {isLogin && showForgotBtn && (
              <div className="flex justify-end mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <button 
                  type="button"
                  onClick={() => { setType('forgot'); setErrorMsg(''); }}
                  className="text-sm font-bold text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors"
                >
                  {t('forgotPasswordPrompt')}
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading || !username || !password} className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white font-black text-lg py-4 rounded-2xl shadow-[0_8px_20px_rgba(244,63,94,0.3)] dark:shadow-[0_8px_20px_rgba(244,63,94,0.1)] hover:shadow-[0_8px_30px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-4 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : isLogin ? <span>{t('authLoginBtn')}</span> : <><Sparkles className="w-5 h-5" /><span>{t('authCreateBtn')}</span></>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => { 
              setType(isLogin ? 'signup' : 'login'); 
              setErrorMsg(''); 
              setShowForgotBtn(false); 
            }} 
            disabled={isLoading} 
            className="text-sm font-bold text-zinc-500 dark:text-zinc-400 transition-colors disabled:opacity-50"
          >
            {isLogin ? t('authToSignup') : t('authToLogin')}
            <span className="ml-1 text-rose-500 hover:text-rose-600 transition-colors">
              {isLogin ? t('authSignupLink') : t('authLoginLink')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
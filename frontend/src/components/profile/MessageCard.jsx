{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState } from 'react';
import api from '../../utils/api';
import { Send, CheckCircle2, Loader2, Lock } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function MessageCard({ publicId, allowMessages }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [hint, setHint] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDisabled = allowMessages === false;
  
  const trimmedMessage = message.trim();
  const trimmedHint = hint.trim();
  const isMessageValid = trimmedMessage.length >= 2 && trimmedMessage.length <= 300;
  const isHintValid = trimmedHint.length <= 20;
  const canSubmit = isMessageValid && isHintValid && !isSending && !isDisabled;

  const handleMessageChange = (e) => {
    const val = e.target.value;
    const lines = val.split('\n');
    
    // Validasi input form: Maksimal 300 Karakter, 10 Baris, dan 35 Karakter per baris (Untuk display aman)
    if (
      val.length <= 300 && 
      lines.length <= 10 && 
      lines.every(line => line.length <= 35)
    ) {
      setMessage(val);
    }
  };

  const handleHintChange = (e) => {
    const val = e.target.value;
    if (val.length <= 20) {
      setHint(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit) {
      if (trimmedMessage.length < 2) alert(t('msgMinLength'));
      else if (trimmedMessage.length > 300) alert(t('msgMaxLength'));
      else if (trimmedHint.length > 20) alert(t('hintMaxLength'));
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        message: trimmedMessage,
        hint: trimmedHint || null
      };

      const { response, result } = await api.public.sendMessage(publicId, payload);
      
      if (response.ok && result.success) {
        setIsSuccess(true);
        setMessage('');
        setHint('');
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(result.message || t('failedSendMsg'));
      }
    } catch (err) {
      alert(t('connectionError'));
    } finally {
      setIsSending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 text-center animate-in zoom-in-95 duration-300 w-full h-full flex flex-col justify-center transition-colors">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 transition-colors">{t('messageSent')}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed transition-colors">
          {t('messageSentDesc')}
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold py-3.5 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          {t('sendAnotherMessage')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 w-full h-full flex flex-col transition-colors relative">
      
      <h2 className="text-lg md:text-xl font-black mb-4 text-zinc-900 dark:text-white text-center transition-colors">
        {t('sendAnonymousMessage')}
      </h2>

      <form onSubmit={handleSubmit} className="relative flex-1 flex flex-col">
        <div className="relative mb-3 flex-1 flex flex-col">
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder={isDisabled ? t('inboxClosedPlaceholder') : t('writeSecretMessage')}
            minLength={2}
            maxLength={300}
            required
            disabled={isDisabled || isSending}
            rows="4"
            className={`flex-1 w-full min-h-[120px] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-[28px] p-5 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 resize-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 ${
              isDisabled ? 'opacity-70 cursor-not-allowed select-none' : ''
            }`}
          />
          
          {!isDisabled && (
            <div className={`absolute bottom-4 right-5 text-xs font-bold select-none pointer-events-none transition-colors ${message.length >= 300 ? 'text-rose-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {message.length}/300
            </div>
          )}

          {isDisabled && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 pointer-events-none opacity-50">
              <Lock className="w-10 h-10 mb-2" />
            </div>
          )}
        </div>

        <div className="relative mb-4 shrink-0">
          <input
            type="text"
            value={hint}
            onChange={handleHintChange}
            placeholder={isDisabled ? "" : t('senderHintOptional')}
            maxLength={20}
            disabled={isDisabled || isSending}
            className={`w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 ${
              isDisabled ? 'opacity-70 cursor-not-allowed select-none hidden' : ''
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full shrink-0 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-200 ${
            !canSubmit
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 shadow-[0_8px_20px_rgba(244,63,94,0.3)] dark:shadow-[0_8px_20px_rgba(244,63,94,0.1)] hover:shadow-[0_8px_30px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none'
          }`}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>{isDisabled ? t('inboxClosed') : t('sendMessage')}</span>
              {!isDisabled && <Send className="w-4 h-4" />}
            </>
          )}
        </button>
        
        {!isDisabled && (
          <p className="text-center shrink-0 text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 mt-4 font-medium flex items-center justify-center gap-1.5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {t('leaveHintEmpty')}
          </p>
        )}
      </form>
    </div>
  );
}
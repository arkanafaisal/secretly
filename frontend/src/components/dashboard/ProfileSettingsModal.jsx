{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; 
import { Settings, X, Share2, RefreshCw, User, MailWarning, Lock, Edit3, AlertCircle, Send, Mail } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function ProfileSettingsModal({ isOpen, onClose, userData, onUpdateSuccess }) {
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState(''); 
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [showForgotBtn, setShowForgotBtn] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setBio(userData.bio || ''); 
      setEmail(userData.email || '');
    }
    if (!isOpen) {
      setShowForgotBtn(false);
      setShowConfirmModal(false);
      setShowEmailConfirmModal(false);
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const showMessage = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  const handleUpdate = async (type, apiFunction, payload = null) => {
    setIsLoading(true);
    setStatusMsg({ type: '', text: '' });
    
    const { response, result } = await apiFunction(payload);

    if (response.ok && result.success) {
      showMessage('success', `${t('successUpdate')} ${type}!`);
      if (onUpdateSuccess) onUpdateSuccess(); 
      if (type === 'Password') {
        setOldPassword('');
        setNewPassword('');
        setShowForgotBtn(false);
      }
    } else {
      showMessage('error', result.message || `${t('failedUpdate')} ${type}.`);
      if (type === 'Password') {
        setShowForgotBtn(true);
      }
    }
    setIsLoading(false);
  };

  const handleBioChange = (e) => {
    const val = e.target.value;
    const lines = val.split('\n');
    if (val.length <= 120 && lines.length <= 4) {
      setBio(val);
    }
  };

  // Pembaruan: Memanggil API asli dan mengirimkan email dari userData
  const handleRequestPasswordReset = async () => {
    setIsResetting(true);
    try {
      const { response, result } = await api.users.forgotPassword({ email: userData.email });

      if (response.ok && result.success) {
        showMessage('success', t('resetLinkSent'));
        setShowConfirmModal(false);
        setShowForgotBtn(false); 
      } else {
        alert(result.message || t('failedSendResetLink'));
      }
    } catch (error) {
      alert(t('connectionError'));
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmEmailUpdate = async () => {
    setIsUpdatingEmail(true);
    try {
      const { response, result } = await api.users.updateEmail({ email });
      if (response.ok && result.success) {
        showMessage('success', t('emailVerifySentSuccess'));
        setShowEmailConfirmModal(false);
      } else {
        alert(result.message || t('failedSendVerifyLink'));
      }
    } catch (error) {
      alert(t('connectionError'));
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const isUsernameValid = username.length >= 3 && username.length <= 20 && username !== userData?.username;
  const isBioValid = bio.length <= 120 && bio !== (userData?.bio || '');
  const isEmailValid = email.length >= 5 && email.length <= 254 && email !== userData?.email;
  const isPasswordValid = oldPassword && newPassword.length >= 6 && newPassword.length <= 255;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 transition-colors">
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
            <h2 className="text-2xl font-black flex items-center gap-2 text-zinc-900 dark:text-white">
              <Settings className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
              {t('accountSettings')}
            </h2>
            <button onClick={onClose} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {statusMsg.text && (
            <div className={`mx-6 mt-4 p-3 rounded-xl text-sm font-bold text-center ${
              statusMsg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30'
            }`}>
              {statusMsg.text}
            </div>
          )}

          <div className="p-6 overflow-y-auto space-y-8">
            
            {/* Public ID */}
            <div>
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2">
                <Share2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> {t('publicId')}
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" readOnly value={userData?.publicId || t('noId')}
                  maxLength={21}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-500 dark:text-zinc-400 rounded-2xl px-4 py-3 font-medium cursor-not-allowed font-mono text-sm tracking-tight transition-colors"
                />
                <button 
                  onClick={() => handleUpdate('Public ID', api.users.refreshPublicId)}
                  disabled={isLoading}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 p-3 rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center gap-2 border border-transparent dark:border-zinc-700/80"
                  title={t('refreshIdTooltip')}
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">{t('resetIdHelp')}</p>
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> {t('username')}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 font-bold">@</span>
                  <input 
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    minLength={3} maxLength={20}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl pl-9 pr-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-colors"
                  />
                </div>
                <button 
                  onClick={() => handleUpdate('Username', api.users.updateUsername, { username })}
                  disabled={isLoading || !isUsernameValid}
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('save')}
                </button>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between mb-2">
                <span className="flex items-center gap-2"><Edit3 className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> {t('bioProfile')}</span>
                <span className={`text-xs font-medium transition-colors ${bio.length >= 120 ? 'text-rose-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {bio.length}/120
                </span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1 w-full flex flex-col gap-1.5">
                  <textarea 
                    value={bio} 
                    onChange={handleBioChange}
                    maxLength={120}
                    placeholder={t('bioPlaceholder')}
                    rows="4"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 resize-none overflow-hidden transition-colors"
                  />
                </div>
                <button 
                  onClick={() => handleUpdate('Bio', api.users.updateBio, { bio })}
                  disabled={isLoading || !isBioValid}
                  className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed h-fit mt-1 sm:mt-0"
                >
                  {t('save')}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-2">
                <MailWarning className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> {t('recoveryEmail')}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  placeholder={t('emailPlaceholder')}
                  minLength={5} maxLength={254}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 truncate transition-colors"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEmailConfirmModal(true);
                  }}
                  disabled={isLoading || !isEmailValid}
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('save')}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> {t('changePassword')}
              </label>
              <div className="space-y-3">
                <input 
                  type="password" placeholder={t('oldPassword')} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-colors"
                />
                <input 
                  type="password" placeholder={t('newPassword')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6} maxLength={255}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 rounded-2xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-colors"
                />
                
                {showForgotBtn && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-top-1 duration-300 px-1">
                    <button 
                      onClick={() => setShowConfirmModal(true)}
                      className="text-sm font-bold text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors"
                    >
                      {t('forgotPassword')}
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => handleUpdate('Password', api.users.updatePassword, { oldPassword, newPassword })}
                  disabled={isLoading || !isPasswordValid}
                  className="w-full bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {t('updatePassword')}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI UBAH EMAIL */}
      {showEmailConfirmModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setShowEmailConfirmModal(false)}></div>
          
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-zinc-100 dark:border-zinc-800 flex flex-col transition-colors text-center">
            
            <button 
              onClick={() => setShowEmailConfirmModal(false)} 
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">{t('verifyEmailTitle')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
              {t('verifyEmailDesc')}<br/>
              <strong className="text-zinc-900 dark:text-white mt-1 block">{email}</strong>
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmEmailUpdate}
                disabled={isUpdatingEmail}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-2xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdatingEmail ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {t('sendLink')}
                  </>
                )}
              </button>
              <button 
                onClick={() => setShowEmailConfirmModal(false)}
                disabled={isUpdatingEmail}
                className="w-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 py-3 rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI LUPA KATA SANDI */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirmModal(false)}></div>
          
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-zinc-100 dark:border-zinc-800 flex flex-col transition-colors text-center">
            
            <button 
              onClick={() => setShowConfirmModal(false)} 
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!userData?.email ? (
              <>
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">{t('emailNotSetTitle')}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
                  {t('emailNotSetDesc')}
                </p>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                >
                  {t('gotIt')}
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">{t('resetPasswordTitle')}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
                  {t('resetPasswordDesc')}<br/>
                  <strong className="text-zinc-900 dark:text-white mt-1 block">{userData.email}</strong>
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleRequestPasswordReset}
                    disabled={isResetting}
                    className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white py-3 rounded-2xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isResetting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> {t('sendResetLink')}
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isResetting}
                    className="w-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 py-3 rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
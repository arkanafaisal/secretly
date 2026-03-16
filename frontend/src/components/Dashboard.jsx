{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api, { navigate } from '../utils/api'; 
import useTranslation from '../hooks/useTranslation';

import Navbar from './dashboard/Navbar';
import ProfileSection from './dashboard/ProfileSection';
import InboxSection from './dashboard/InboxSection';
import ProfileSettingsModal from './dashboard/ProfileSettingsModal';
import GlobalSettingsModal from './dashboard/GlobalSettingsModal';

export default function Dashboard() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  
  const [msgFilters, setMsgFilters] = useState({
    oldest: false,
    starred: false,
    readStatus: '' 
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      const { response: userRes, result: userResult } = await api.users.getMe();
      if (userRes.ok && userResult.success && userResult.data) {
        setUserData(userResult.data);
      } else {
        if (userRes.status !== 401 && userRes.status !== 403) {
           navigate('/');
        }
      }
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchMessages = async (currentFilters) => {
    setIsMessagesLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.oldest) params.append('sort', 'oldest');
      if (currentFilters.starred) params.append('starred', 'true');
      if (currentFilters.readStatus === 'read') params.append('read', 'true');
      if (currentFilters.readStatus === 'unread') params.append('read', 'false');

      const queryString = params.toString() ? `?${params.toString()}` : '';

      const { response: msgRes, result: msgResult } = await api.users.getMessages(queryString);
      
      if (msgRes.ok && msgResult.success && msgResult.data) {
        setMessages(msgResult.data);
      } else {
        setMessages([]); 
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
      setMessages([]);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchMessages(msgFilters);
  }, [msgFilters]);

  const handleLogout = async () => {
    await api.auth.logout();
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-rose-200 dark:bg-rose-900/50 rounded-2xl mb-4"></div>
          <div className="text-zinc-400 dark:text-zinc-500 font-bold">{t('loadingDashboard')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col md:overflow-hidden transition-colors">
      
      <div className="shrink-0">
        <Navbar 
          onLogout={handleLogout} 
          onOpenGlobalSettings={() => setIsGlobalSettingsOpen(true)}
        />
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-4 flex flex-col md:overflow-hidden">
        <div className="shrink-0">
          <ProfileSection 
            userData={userData} 
            onOpenSettings={() => setIsProfileModalOpen(true)} 
          />
        </div>

        <InboxSection 
          messages={messages} 
          setMessages={setMessages}
          msgFilters={msgFilters} 
          setMsgFilters={setMsgFilters} 
          isLoading={isMessagesLoading}
        />
      </main>

      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userData={userData}
        onUpdateSuccess={fetchUserData} 
      />

      <GlobalSettingsModal 
        isOpen={isGlobalSettingsOpen} 
        onClose={() => setIsGlobalSettingsOpen(false)} 
      />
    </div>
  );
}
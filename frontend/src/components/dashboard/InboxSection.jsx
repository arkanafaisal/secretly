{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState } from 'react';
import { Inbox, Filter, Star, MessageSquareDashed } from 'lucide-react';
import api from '../../utils/api';
import MessageCard from './MessageCard';
import MessageDetailModal from './MessageDetailModal'; 
import useTranslation from '../../hooks/useTranslation';

export default function InboxSection({ messages, setMessages, msgFilters, setMsgFilters, isLoading }) {
  const { t } = useTranslation();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const toggleFilter = (type, value = null) => {
    setMsgFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'oldest') newFilters.oldest = !prev.oldest;
      if (type === 'starred') newFilters.starred = !prev.starred;
      if (type === 'readStatus') {
        newFilters.readStatus = prev.readStatus === value ? '' : value;
      }
      return newFilters;
    });
  };

  const handleUpdateMsg = async (id, type, value) => {
    if (type === 'read') {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      await api.users.updateMessage(id, { read: true });
    } else if (type === 'star') {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: value } : m));
      await api.users.updateMessage(id, { starred: value });
    }
  };

  const handleDeleteMsg = async (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await api.users.deleteMessage(id);
  };

  const isNoFilterActive = !msgFilters.oldest && !msgFilters.starred && !msgFilters.readStatus;

  return (
    <div className="flex-1 flex flex-col md:overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 pb-2 md:pb-4 relative">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 gap-4 shrink-0 pr-1">
        <h2 className="text-2xl font-black flex items-center gap-3 text-zinc-900 dark:text-white transition-colors">
          <div className="flex items-center gap-2">
            <Inbox className="w-6 h-6 text-rose-500 shrink-0" />
            <span>{t('messages')}</span>
          </div>
          <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center justify-center shrink-0">
            {messages.length}
          </span>
        </h2>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-zinc-400 dark:text-zinc-500 mr-1 shrink-0" />
          
          <button
            onClick={() => toggleFilter('oldest')}
            disabled={isLoading}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors border disabled:opacity-50 ${
              msgFilters.oldest ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {t('oldest')}
          </button>

          <button
            onClick={() => toggleFilter('starred')}
            disabled={isLoading}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 border disabled:opacity-50 ${
              msgFilters.starred ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Star className="w-3 h-3 fill-current" /> {t('starred')}
          </button>

          <button
            onClick={() => toggleFilter('readStatus', 'unread')}
            disabled={isLoading}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors border disabled:opacity-50 ${
              msgFilters.readStatus === 'unread' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {t('unread')}
          </button>

          <button
            onClick={() => toggleFilter('readStatus', 'read')}
            disabled={isLoading}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors border disabled:opacity-50 ${
              msgFilters.readStatus === 'read' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {t('read')}
          </button>
        </div>
      </div>

      <div className={`flex-1 md:overflow-y-auto pr-1 md:pr-2 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {messages.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] p-12 text-center transition-colors">
            <MessageSquareDashed className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">{t('noMessages')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 transition-colors">
              {isNoFilterActive ? t('shareLinkPrompt') : t('noFilterMatch')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 md:pb-6">
            {messages.map((msg, index) => (
              <MessageCard 
                key={msg.id || index} 
                msg={msg} 
                onClick={() => {
                  // Membuka modal dengan mengasumsikan data terbaru adalah read: true
                  setSelectedMessage({ ...msg, read: true });
                  
                  // Jika sebelumnya belum dibaca, jalankan pembaruan API
                  if (!msg.read) {
                    handleUpdateMsg(msg.id, 'read', true);
                  }
                }} 
                onUpdate={handleUpdateMsg}
                onDelete={handleDeleteMsg}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMessage && (
        <MessageDetailModal 
          message={selectedMessage} 
          onClose={() => setSelectedMessage(null)} 
          onToggleStar={() => {
            handleUpdateMsg(selectedMessage.id, 'star', !selectedMessage.starred);
            setSelectedMessage(prev => ({...prev, starred: !prev.starred}));
          }}
        />
      )}

    </div>
  );
}
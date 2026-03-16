{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React from 'react';
import { Star, MailOpen, Mail, Trash2 } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function MessageCard({ msg, onClick, onUpdate, onDelete }) {
  const { t } = useTranslation();

  const handleRead = (e) => {
    e.stopPropagation();
    if (!msg.read) onUpdate(msg.id, 'read', true);
  };
  
  const handleStar = (e) => {
    e.stopPropagation();
    onUpdate(msg.id, 'star', !msg.starred);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    // Konfirmasi penghapusan agar tidak tidak sengaja tertekan
    if(window.confirm("Hapus pesan ini secara permanen?")) {
       onDelete(msg.id);
    }
  };

  return (
    <div 
      onClick={onClick}
      // Dihapus animasi hover translateY agar tidak terpotong container
      className={`bg-white dark:bg-zinc-900 p-4 md:p-5 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-all relative group cursor-pointer hover:shadow-xl hover:border-zinc-200 dark:hover:border-zinc-700 flex flex-col h-full
      ${!msg.read ? 'border-rose-200 dark:border-rose-900/50 shadow-[0_4px_20px_rgba(244,63,94,0.1)] dark:shadow-[0_4px_20px_rgba(244,63,94,0.05)]' : 'border-zinc-100 dark:border-zinc-800/80'}
    `}>
      <div className="absolute top-4 right-4 flex gap-1.5">
        {msg.starred && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
        {!msg.read && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-0.5 shadow-sm"></span>}
      </div>

      <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider pr-10 truncate transition-colors">
        {msg.hint || t('anonymousMessage')}
      </h4>
      
      <p className="text-sm md:text-base font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4 line-clamp-2 break-words transition-colors">
        {msg.message}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50 dark:border-zinc-800/50 transition-colors">
        
        {msg.read ? (
          <span 
            className="text-[10px] md:text-xs font-bold text-zinc-400 flex items-center gap-1.5 p-1 -ml-1 cursor-default" 
            onClick={(e)=>e.stopPropagation()}
          >
            <MailOpen className="w-3.5 h-3.5" />
            {t('read') || 'Sudah Dibaca'}
          </span>
        ) : (
          <button 
            onClick={handleRead} 
            className="text-[10px] md:text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 p-1 -ml-1 rounded-lg transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {t('markRead') || 'Tandai Dibaca'}
          </button>
        )}

        <div className="flex items-center gap-1">
          {/* Tombol Delete + Tooltip Hitam */}
          <div className="relative group/tt1 flex items-center justify-center">
            <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-zinc-400 hover:text-rose-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/tt1:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Hapus Pesan
            </div>
          </div>

          {/* Tombol Star + Tooltip Hitam */}
          <div className="relative group/tt2 flex items-center justify-center">
            <button onClick={handleStar} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition-colors">
              <Star className={`w-4 h-4 ${msg.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/tt2:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              {msg.starred ? 'Hapus Bintang' : 'Tandai Bintang'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
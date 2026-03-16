import React, { useState } from 'react';
import { Copy, CheckCircle2, Edit3 } from 'lucide-react';

export default function DashboardHeader({ userData, onOpenSettings }) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    if (!userData) return;
    const linkIdentifier = userData.publicId || userData.username;
    const link = `${window.location.origin}/${linkIdentifier}`;
    
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-[24px] shrink-0 flex items-center justify-center text-3xl font-black shadow-lg">
          {userData?.username?.charAt(0).toUpperCase()}
        </div>
        
        {/* Info Akun & Link */}
        <div className="flex-1 text-center md:text-left w-full">
          <h1 className="text-2xl font-black mb-1">@{userData?.username}</h1>
          <p className="text-zinc-500 font-medium text-sm mb-4">
            Bagikan link ini ke teman-temanmu untuk menerima pesan anonim.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-2xl flex items-center gap-3 w-full">
            <div className="flex-1 truncate font-medium text-zinc-600 px-2 text-sm select-all">
              {window.location.origin}/{userData?.publicId || userData?.username}
            </div>
          </div>
        </div>

        {/* Actions: Copy & Edit */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <button 
            onClick={handleCopyLink}
            className={`w-full md:w-40 px-5 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
              copySuccess 
                ? 'bg-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm hover:-translate-y-0.5'
            }`}
          >
            {copySuccess ? (
              <><CheckCircle2 className="w-4 h-4" /><span>Tersalin!</span></>
            ) : (
              <><Copy className="w-4 h-4" /><span>Copy Link</span></>
            )}
          </button>
          
          <button 
            onClick={onOpenSettings}
            className="w-full md:w-40 px-5 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
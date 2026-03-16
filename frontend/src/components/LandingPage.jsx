{/*__DESIGN_SYSTEM__={"primary":"rose-500","secondary":"zinc-900","radius":"rounded-3xl","shadow":"shadow-2xl","spacing":"generous","font":"Inter","tone":"playful social","darkMode":"media (system preference)","stack":"react+vite+tailwindcss v4"}__*/}
import React, { useState, useEffect } from 'react';
import api, { navigate } from '../utils/api'; 
import useTranslation from '../hooks/useTranslation';

import Navbar from './landingPage/Navbar';
import HeroSection from './landingPage/HeroSection';
import HowItWorksSection from './landingPage/HowItWorksSection';
import ValuePropositionSection from './landingPage/ValuePropositionSection';
import Footer from './landingPage/Footer';
import AuthModal from './landingPage/AuthModal';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('login');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;

      if (currentSearch || currentPath !== '/') {
        setIsCheckingAuth(false);
        return;
      }

      const { response, result } = await api.users.getMe()
      
      if (response.ok && result.success) {
        navigate('/dashboard'); 
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkUserSession();
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors"></div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 overflow-x-hidden relative transition-colors">
      <style dangerouslySetInnerHTML={{__html: `
        html, body, * {
          -ms-overflow-style: none !important; 
          scrollbar-width: none !important; 
        }
        ::-webkit-scrollbar {
          display: none !important; 
        }
      `}} />
      
      <Navbar onOpenModal={openModal} />
      <HeroSection onOpenModal={openModal} />
      <HowItWorksSection />
      <ValuePropositionSection />
      <Footer />

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType}
        setType={setModalType}
      />
    </div>
  );
}
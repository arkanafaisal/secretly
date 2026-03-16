import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile'; 
import VerifyEmail from './components/auth/VerifyEmail';
import ResetPassword from './components/auth/ResetPassword';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/dashboard') {
    return <Dashboard />;
  }
  
  if (currentPath.startsWith('/profile/')) {
    const publicId = currentPath.split('/profile/')[1];
    if (publicId) {
      return <Profile publicId={publicId} />;
    }
  }

  // Routing untuk Verify Email
  if (currentPath.startsWith('/verify-email/')) {
    const token = currentPath.split('/verify-email/')[1];
    if (token) return <VerifyEmail token={token} />;
  }

  // Routing untuk Reset Password
  if (currentPath.startsWith('/reset-password/')) {
    const token = currentPath.split('/reset-password/')[1];
    if (token) return <ResetPassword token={token} />;
  }

  return <LandingPage />;
}
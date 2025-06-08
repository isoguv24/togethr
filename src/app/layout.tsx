'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/header';
import NotificationToast from '@/components/ui/notification-toast';
import { useUserStore } from '@/lib/store/user';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadUser } = useUserStore();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Initialize user on app load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Global scroll handler for dynamic header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scrolling up or near top - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* Dynamic Header */}
          <div className={`
            fixed top-0 left-0 right-0 z-50 transition-transform duration-300
            ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
          `}>
            <Header />
          </div>
          
          {/* Main Content */}
          <main className="pt-16">
            {children}
          </main>
        </div>
        
        {/* Global Notification Toast */}
        <NotificationToast />
      </body>
    </html>
  );
}

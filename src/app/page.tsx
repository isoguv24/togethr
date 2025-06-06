'use client';

import { useEffect } from 'react';
import { useTogethrStore } from '@/lib/store';
import OnboardingFlow from '@/components/onboarding/onboarding-flow';
import Dashboard from '@/components/dashboard/dashboard';
import SessionView from '@/components/session/session-view';
import FeedbackView from '@/components/feedback/feedback-view';
import ProfileView from '@/components/profile/profile-view';
import NotificationToast from '@/components/ui/notification-toast';

export default function Home() {
  const { 
    isAuthenticated, 
    currentView, 
    setCurrentView,
    isInSession,
    user 
  } = useTogethrStore();

  useEffect(() => {
    // Set initial view based on authentication state
    if (!isAuthenticated) {
      setCurrentView('onboarding');
    } else if (isInSession) {
      setCurrentView('session');
    } else {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, isInSession, setCurrentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'onboarding':
        return <OnboardingFlow />;
      case 'dashboard':
        return <Dashboard />;
      case 'session':
        return <SessionView />;
      case 'feedback':
        return <FeedbackView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="h-full flex flex-col">
      {renderCurrentView()}
      <NotificationToast />
    </main>
  );
}

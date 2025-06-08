'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';

// Import views
import OnboardingFlow from '@/components/onboarding/onboarding-flow';
import Dashboard from '@/components/dashboard/dashboard';
import SessionView from '@/components/session/session-view';
import FeedbackView from '@/components/feedback/feedback-view';
import ProfileView from '@/components/profile/profile-view';
import MoodTracker from '@/components/mood/mood-tracker';
import CrisisSupport from '@/components/crisis/crisis-support';
import CommunityChat from '@/components/community/community-chat';
import NotificationToast from '@/components/ui/notification-toast';

export default function HomePage() {
  // Get user state
  const { user, isAuthenticated, isLoading, loadUser } = useUserStore();
  
  // Get UI state
  const { currentView } = useAppStore();

  console.log('🏠 HomePage: Rendering with state:', {
    isAuthenticated,
    isLoading,
    currentView,
    hasUser: !!user
  });

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if not authenticated OR if onboarding view is explicitly requested
  if (!isAuthenticated || !user || currentView === 'onboarding') {
    console.log('🏠 HomePage: Showing onboarding (not authenticated or requested)');
    return (
      <>
        <OnboardingFlow />
        <NotificationToast />
      </>
    );
  }

  // Show the appropriate view based on current state
  console.log('🏠 HomePage: Showing view:', currentView);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'session':
        return <SessionView />;
      case 'feedback':
        return <FeedbackView />;
      case 'profile':
        return <ProfileView />;
      case 'mood':
        return <MoodTracker />;
      case 'crisis':
        return <CrisisSupport />;
      case 'community':
        return <CommunityChat />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {renderCurrentView()}
      <NotificationToast />
    </>
  );
}

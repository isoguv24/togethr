import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, MentalHealthTopic, SessionMode, AIModeratorPersona } from '@/types/user';
import { Session, ChatMessage, SessionParticipant } from '@/types/session';
import { PostSessionFeedback } from '@/types/feedback';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SessionState {
  currentSession: Session | null;
  isInSession: boolean;
  isConnecting: boolean;
  participants: SessionParticipant[];
  messages: ChatMessage[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

interface MatchmakingState {
  isInQueue: boolean;
  queuePosition: number;
  estimatedWaitTime: number;
  selectedTopic: MentalHealthTopic | null;
  selectedMode: SessionMode;
  queueStartTime: Date | null;
}

interface UIState {
  sidebarOpen: boolean;
  currentView: 'dashboard' | 'session' | 'feedback' | 'profile' | 'onboarding';
  notifications: Notification[];
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  selectedAvatarId: string | null;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface TogethrStore extends AuthState, SessionState, MatchmakingState, UIState {
  // Auth Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  login: (nickname: string, topic: MentalHealthTopic, preferences: any) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Session Actions
  joinSession: (sessionId: string) => Promise<void>;
  leaveSession: () => void;
  sendMessage: (content: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateParticipant: (userId: string, updates: Partial<SessionParticipant>) => void;
  setConnectionStatus: (status: SessionState['connectionStatus']) => void;

  // Matchmaking Actions
  joinQueue: (topic: MentalHealthTopic, mode: SessionMode) => Promise<void>;
  leaveQueue: () => void;
  updateQueueStatus: (position: number, estimatedWait: number) => void;

  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: UIState['currentView']) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  setSelectedAvatar: (avatarId: string) => void;

  // XP and Gamification Actions
  awardXP: (amount: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;
  levelUp: (newLevel: number) => void;
}

export const useTogethrStore = create<TogethrStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial Auth State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Initial Session State
        currentSession: null,
        isInSession: false,
        isConnecting: false,
        participants: [],
        messages: [],
        connectionStatus: 'disconnected',

        // Initial Matchmaking State
        isInQueue: false,
        queuePosition: 0,
        estimatedWaitTime: 0,
        selectedTopic: null,
        selectedMode: 'chat_only',
        queueStartTime: null,

        // Initial UI State
        sidebarOpen: false,
        currentView: 'dashboard',
        notifications: [],
        isVideoEnabled: false,
        isAudioEnabled: true,
        selectedAvatarId: null,

        // Auth Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        updateUser: (updates) => set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),

        login: async (nickname, topic, preferences) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            const newUser: User = {
              id: `user_${Date.now()}`,
              nickname,
              avatar: { id: 'calm_fox', name: 'Calm Fox', imageUrl: '/avatars/calm-fox.svg', isCustom: false, unlockedAtLevel: 1 },
              mentalHealthTopic: topic,
              joinedAt: new Date(),
              level: 1,
              xp: 0,
              badges: [],
              totalSessionsAttended: 0,
              streakCount: 0,
              preferredSessionMode: preferences.sessionMode || 'chat_only',
              aiModeratorPreference: preferences.aiModeratorPersona || 'calm_listener',
              isOnline: true,
              lastSeen: new Date()
            };
            
            set({ user: newUser, isAuthenticated: true, isLoading: false });
            get().addNotification({
              type: 'success',
              title: 'Welcome to Togethr!',
              message: `Hi ${nickname}! You're ready to connect with others.`
            });
          } catch (error) {
            set({ error: 'Failed to create account', isLoading: false });
          }
        },

        logout: () => set({
          user: null,
          isAuthenticated: false,
          currentSession: null,
          isInSession: false,
          isInQueue: false,
          currentView: 'onboarding'
        }),

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // Session Actions
        joinSession: async (sessionId) => {
          set({ isConnecting: true, connectionStatus: 'connecting' });
          try {
            // Simulate joining session
            const mockSession: Session = {
              id: sessionId,
              groupId: `group_${Date.now()}`,
              topic: get().user?.mentalHealthTopic || 'anxiety',
              participants: [],
              moderator: {
                id: 'ai_moderator_1',
                persona: get().user?.aiModeratorPreference || 'calm_listener',
                name: 'Sage',
                avatar: '/avatars/ai-sage.svg',
                promptingStyle: 'gentle and supportive',
                lastActivity: new Date()
              },
              status: 'active',
              mode: get().selectedMode,
              scheduledStartTime: new Date(),
              actualStartTime: new Date(),
              duration: 60,
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date()
            };

            set({
              currentSession: mockSession,
              isInSession: true,
              isConnecting: false,
              connectionStatus: 'connected',
              isInQueue: false
            });

            get().awardXP(10, 'Joined session');
          } catch (error) {
            set({ isConnecting: false, connectionStatus: 'error' });
          }
        },

        leaveSession: () => set({
          currentSession: null,
          isInSession: false,
          participants: [],
          messages: [],
          connectionStatus: 'disconnected',
          currentView: 'feedback'
        }),

        sendMessage: (content) => {
          const user = get().user;
          const session = get().currentSession;
          if (!user || !session) return;

          const message: ChatMessage = {
            id: `msg_${Date.now()}`,
            sessionId: session.id,
            senderId: user.id,
            senderType: 'user',
            content,
            timestamp: new Date(),
            type: 'text',
            reactions: [],
            xpAwarded: 1
          };

          get().addMessage(message);
          get().awardXP(1, 'Sent message');
        },

        addMessage: (message) => set((state) => ({
          messages: [...state.messages, message]
        })),

        updateParticipant: (userId, updates) => set((state) => ({
          participants: state.participants.map(p => 
            p.userId === userId ? { ...p, ...updates } : p
          )
        })),

        setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

        // Matchmaking Actions
        joinQueue: async (topic, mode) => {
          set({
            isInQueue: true,
            selectedTopic: topic,
            selectedMode: mode,
            queueStartTime: new Date(),
            queuePosition: 1,
            estimatedWaitTime: 5
          });

          get().addNotification({
            type: 'info',
            title: 'Joined Queue',
            message: `Looking for others interested in ${topic}. Estimated wait: 5 minutes.`
          });

          // Simulate finding a match after a delay
          setTimeout(() => {
            if (get().isInQueue) {
              get().addNotification({
                type: 'success',
                title: 'Match Found!',
                message: 'We found a group for you. Joining session...'
              });
              get().joinSession(`session_${Date.now()}`);
            }
          }, 10000); // 10 seconds for demo
        },

        leaveQueue: () => set({
          isInQueue: false,
          queuePosition: 0,
          estimatedWaitTime: 0,
          selectedTopic: null,
          queueStartTime: null
        }),

        updateQueueStatus: (queuePosition, estimatedWaitTime) => set({
          queuePosition,
          estimatedWaitTime
        }),

        // UI Actions
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setCurrentView: (currentView) => set({ currentView }),

        addNotification: (notification) => set((state) => ({
          notifications: [{
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false
          }, ...state.notifications]
        })),

        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        })),

        clearNotifications: () => set({ notifications: [] }),

        toggleVideo: async () => {
          const state = get();
          const newVideoState = !state.isVideoEnabled;
          
          if (newVideoState) {
            try {
              // Request camera access
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              console.log('Camera access granted:', stream);
              
              get().addNotification({
                type: 'success',
                title: 'Camera Enabled',
                message: 'Your camera is now on and accessible'
              });
              
              if (state.user) {
                get().awardXP(5, 'Enabled camera');
              }
              
              // Store stream reference (in a real app, you'd want to manage this properly)
              (window as any).localVideoStream = stream;
              
            } catch (error) {
              console.error('Camera access denied:', error);
              get().addNotification({
                type: 'error',
                title: 'Camera Access Denied',
                message: 'Please allow camera access in your browser settings'
              });
              return { isVideoEnabled: false };
            }
          } else {
            // Stop video stream
            const stream = (window as any).localVideoStream;
            if (stream) {
              stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
              (window as any).localVideoStream = null;
            }
            
            get().addNotification({
              type: 'info',
              title: 'Camera Disabled',
              message: 'Your camera is now off'
            });
          }
          
          set({ isVideoEnabled: newVideoState });
        },

        toggleAudio: async () => {
          const state = get();
          const newAudioState = !state.isAudioEnabled;
          
          if (newAudioState) {
            try {
              // Request microphone access
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              console.log('Microphone access granted:', stream);
              
              get().addNotification({
                type: 'success',
                title: 'Microphone Enabled',
                message: 'Your microphone is now on and accessible'
              });
              
              // Store stream reference
              (window as any).localAudioStream = stream;
              
            } catch (error) {
              console.error('Microphone access denied:', error);
              get().addNotification({
                type: 'error',
                title: 'Microphone Access Denied',
                message: 'Please allow microphone access in your browser settings'
              });
              return { isAudioEnabled: false };
            }
          } else {
            // Stop audio stream
            const stream = (window as any).localAudioStream;
            if (stream) {
              stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
              (window as any).localAudioStream = null;
            }
            
            get().addNotification({
              type: 'info',
              title: 'Microphone Disabled',
              message: 'Your microphone is now off'
            });
          }
          
          set({ isAudioEnabled: newAudioState });
        },
        setSelectedAvatar: (selectedAvatarId) => set({ selectedAvatarId }),

        // XP and Gamification Actions
        awardXP: (amount, reason) => {
          const user = get().user;
          if (!user) return;

          const newXP = user.xp + amount;
          const currentLevel = Math.floor(newXP / 100) + 1; // Simple level calculation
          const leveledUp = currentLevel > user.level;

          get().updateUser({ xp: newXP, level: currentLevel });

          get().addNotification({
            type: 'success',
            title: `+${amount} XP`,
            message: reason
          });

          if (leveledUp) {
            get().levelUp(currentLevel);
          }
        },

        unlockBadge: (badgeId) => {
          const user = get().user;
          if (!user) return;

          const newBadge = {
            id: badgeId,
            name: 'New Badge', // This would come from badge config
            description: 'Badge description',
            icon: '🏆',
            earnedAt: new Date(),
            rarity: 'common' as const
          };

          get().updateUser({
            badges: [...user.badges, newBadge]
          });

          get().addNotification({
            type: 'success',
            title: 'Badge Unlocked!',
            message: `You earned the "${newBadge.name}" badge!`
          });
        },

        levelUp: (newLevel) => {
          get().addNotification({
            type: 'success',
            title: 'Level Up!',
            message: `Congratulations! You reached level ${newLevel}!`
          });
        }
      }),
      {
        name: 'togethr-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          selectedAvatarId: state.selectedAvatarId
        })
      }
    ),
    { name: 'togethr-store' }
  )
); 
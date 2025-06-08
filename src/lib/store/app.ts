import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  avatar_id?: string;
}

export type CurrentView = 
  | 'dashboard' 
  | 'session' 
  | 'feedback' 
  | 'profile' 
  | 'onboarding' 
  | 'mood' 
  | 'crisis' 
  | 'community' 
  | 'sessions' 
  | 'communities' 
  | 'analytics' 
  | 'support';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy?: number;
  anxiety?: number;
  notes?: string;
  activities?: string[];
  triggers?: string[];
}

interface Session {
  id: string;
  title: string;
  type: 'group-chat' | 'voice-only' | 'video-call';
  topic: string;
  participantCount: number;
  maxParticipants: number;
  isActive: boolean;
  createdAt: Date;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  isSystem?: boolean;
}

interface AppState {
  // UI State
  currentView: CurrentView;
  notifications: Notification[];
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  
  // Session State
  isInQueue: boolean;
  queuePosition: number;
  estimatedWaitTime: number;
  queueStartTime: Date | null;
  currentSession: Session | null;
  sessionMessages: Message[];
  
  // Mood State
  moodEntries: MoodEntry[];
  currentStreak: number;
  longestStreak: number;
  
  // Community Messages
  communityMessages: { [communityId: string]: Message[] };
}

interface AppActions {
  // UI Actions
  setCurrentView: (view: CurrentView) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setVideoEnabled: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  
  // Queue Actions
  joinQueue: () => void;
  leaveQueue: () => void;
  updateQueuePosition: (position: number, waitTime: number) => void;
  
  // Mood Actions
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  getMoodEntry: (date: string) => MoodEntry | undefined;
  updateMoodStreaks: () => void;
  
  // Community Actions
  setCommunityMessages: (communityId: string, messages: Message[]) => void;
  addCommunityMessage: (communityId: string, message: Message) => void;
  
  // Session Actions
  joinSession: (session: Session) => void;
  sendMessage: (text: string) => Promise<void>;
  
  // Community Actions
  sendCommunityMessage: (communityId: string, text: string, user: UserProfile) => Promise<void>;
  subscribeToMessages: (communityId: string, callback: (messages: Message[]) => void) => () => void;
  
  // Mood Actions
  currentMood: number | null;
  setCurrentMood: (mood: number) => void;
  hasDailyMoodCheck: boolean;
  setHasDailyMoodCheck: (completed: boolean) => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial UI State
        currentView: 'dashboard',
        notifications: [],
        isVideoEnabled: false,
        isAudioEnabled: true,
        
        // Initial Session State
        isInQueue: false,
        queuePosition: 0,
        estimatedWaitTime: 0,
        queueStartTime: null,
        currentSession: null,
        sessionMessages: [],
        
        // Initial Mood State
        moodEntries: [],
        currentStreak: 0,
        longestStreak: 0,
        
        // Initial Community State
        communityMessages: {},
        
        // UI Actions
        setCurrentView: (view) => set({ currentView: view }),
        
        addNotification: (notification) => {
          const newNotification: Notification = {
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
            ...notification
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications].slice(0, 10)
          }));
        },
        
        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
        setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
        
        // Queue Actions
        joinQueue: () => set({
          isInQueue: true,
          queuePosition: 1,
          estimatedWaitTime: 120,
          queueStartTime: new Date()
        }),
        
        leaveQueue: () => set({
          isInQueue: false,
          queuePosition: 0,
          estimatedWaitTime: 0,
          queueStartTime: null
        }),
        
        updateQueuePosition: (position, waitTime) => set({
          queuePosition: position,
          estimatedWaitTime: waitTime
        }),
        
        // Mood Actions
        addMoodEntry: (entry) => {
          const newEntry: MoodEntry = {
            id: Date.now().toString(),
            ...entry
          };
          set((state) => ({
            moodEntries: [...state.moodEntries.filter(e => e.date !== entry.date), newEntry]
          }));
          get().updateMoodStreaks();
        },
        
        updateMoodEntry: (id, updates) => set((state) => ({
          moodEntries: state.moodEntries.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        })),
        
        deleteMoodEntry: (id) => set((state) => ({
          moodEntries: state.moodEntries.filter(entry => entry.id !== id)
        })),
        
        getMoodEntry: (date) => {
          const { moodEntries } = get();
          return moodEntries.find(entry => entry.date === date);
        },
        
        updateMoodStreaks: () => {
          const { moodEntries } = get();
          const sortedEntries = [...moodEntries].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;
          
          const today = new Date();
          let checkDate = new Date(today);
          
          // Check current streak backwards from today
          while (checkDate >= new Date(sortedEntries[0]?.date || today)) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const hasEntry = sortedEntries.some(entry => entry.date === dateStr);
            
            if (hasEntry) {
              if (currentStreak === 0 || 
                  Math.abs(checkDate.getTime() - today.getTime()) <= currentStreak * 24 * 60 * 60 * 1000) {
                currentStreak++;
              }
            } else if (currentStreak === 0) {
              // No entry today, current streak is 0
              break;
            } else {
              // Gap found, stop current streak calculation
              break;
            }
            
            checkDate.setDate(checkDate.getDate() - 1);
          }
          
          // Calculate longest streak
          for (let i = 0; i < sortedEntries.length; i++) {
            const currentDate = new Date(sortedEntries[i].date);
            tempStreak = 1;
            
            for (let j = i + 1; j < sortedEntries.length; j++) {
              const nextDate = new Date(sortedEntries[j].date);
              const dayDiff = Math.abs(nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
              
              if (dayDiff === j - i) {
                tempStreak++;
              } else {
                break;
              }
            }
            
            longestStreak = Math.max(longestStreak, tempStreak);
          }
          
          set({ currentStreak, longestStreak });
        },
        
        // Community Actions
        setCommunityMessages: (communityId, messages) => set((state) => ({
          communityMessages: {
            ...state.communityMessages,
            [communityId]: messages
          }
        })),
        
        addCommunityMessage: (communityId, message) => set((state) => ({
          communityMessages: {
            ...state.communityMessages,
            [communityId]: [...(state.communityMessages[communityId] || []), message]
          }
        })),
        
        // Session Actions
        joinSession: (session) => {
          console.log('🚀 AppStore: Joining session:', session.id);
          
          // Add initial system messages
          const initialMessages: Message[] = [
            {
              id: 'system-welcome',
              text: `Welcome to ${session.title}! This is a safe space for sharing and support.`,
              timestamp: new Date(),
              sender: {
                id: 'system',
                name: 'System',
                avatar: ''
              },
              isSystem: true
            },
            {
              id: 'demo-message-1',
              text: 'Hi everyone! Looking forward to our discussion today.',
              timestamp: new Date(Date.now() - 60000),
              sender: {
                id: 'user-1',
                name: 'Sarah M.',
                avatar: '/avatars/gentle_bear.svg'
              }
            },
            {
              id: 'demo-message-2',
              text: 'Thank you for creating this space. I appreciate having somewhere to share.',
              timestamp: new Date(Date.now() - 30000),
              sender: {
                id: 'user-2',
                name: 'Alex K.',
                avatar: '/avatars/serene_deer.svg'
              }
            }
          ];

          set({ 
            currentSession: session, 
            sessionMessages: initialMessages 
          });
        },
        
        sendMessage: async (text: string) => {
          const session = get().currentSession;
          if (!session) {
            throw new Error('No active session');
          }

          // This is a demo implementation - in real app would send to backend
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            text,
            timestamp: new Date(),
            sender: {
              id: 'current-user',
              name: 'You',
              avatar: '/avatars/hopeful-butterfly.svg'
            }
          };

          set(state => ({
            sessionMessages: [...state.sessionMessages, newMessage]
          }));

          // Simulate AI moderator response after a delay
          setTimeout(() => {
            if (text.toLowerCase().includes('anxiety') || text.toLowerCase().includes('worry')) {
              const aiResponse: Message = {
                id: `ai-${Date.now()}`,
                text: 'I understand anxiety can be challenging. Remember that you\'re not alone in this journey. What coping strategies have worked for you in the past?',
                timestamp: new Date(),
                sender: {
                  id: 'ai-moderator',
                  name: 'AI Companion',
                  avatar: '/avatars/wise-owl.svg'
                }
              };

              set(state => ({
                sessionMessages: [...state.sessionMessages, aiResponse]
              }));
            }
          }, 2000);
        },
        
        // Community Actions
                 sendCommunityMessage: async (communityId: string, text: string, user: UserProfile) => {
           console.log('📤 AppStore: Sending community message:', { communityId, text, userId: user.id });

           // Demo implementation - add message locally
           const newMessage: Message = {
             id: `msg-${Date.now()}`,
             text,
             timestamp: new Date(),
             sender: {
               id: user.id,
               name: user.name,
               avatar: user.avatar_id ? `/avatars/${user.avatar_id}.svg` : '/avatars/gentle_bear.svg'
             }
           };

           set(state => ({
             communityMessages: {
               ...state.communityMessages,
               [communityId]: [...(state.communityMessages[communityId] || []), newMessage]
             }
           }));
         },
        
                 subscribeToMessages: (communityId: string, callback: (messages: Message[]) => void) => {
           console.log('🔔 AppStore: Demo subscription for community:', communityId);
           
           // Demo implementation - just return empty unsubscribe function
           return () => {
             console.log('📴 AppStore: Demo unsubscribe for community:', communityId);
           };
         },
        
        // Mood Actions
        currentMood: null,
        setCurrentMood: (mood) => set({ currentMood: mood }),
        hasDailyMoodCheck: false,
        setHasDailyMoodCheck: (completed) => set({ hasDailyMoodCheck: completed })
      }),
      {
        name: 'togethr-app-store',
        partialize: (state) => ({
          isVideoEnabled: state.isVideoEnabled,
          isAudioEnabled: state.isAudioEnabled,
          moodEntries: state.moodEntries,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          communityMessages: state.communityMessages
        })
      }
    ),
    { name: 'togethr-app-store' }
  )
); 
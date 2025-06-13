import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  createAnonymousUser,
  signUpWithEmail,
  signInWithEmail,
  getUser,
  updateUser as updateUserInDB,
  awardUserXP,
  updateUserOnlineStatus,
  getUserBadges,
  awardBadge
} from '@/lib/supabase/queries';
import { 
  subscribeToUserProgress,
  subscribeToUserBadges,
  unsubscribeAll
} from '@/lib/supabase/realtime';
import { supabase } from '@/lib/supabase/client';
import { User as SupabaseUser, Badge as SupabaseBadge } from '@/lib/supabase/types';
import { MentalHealthTopic, SessionMode, AIModeratorPersona } from '@/types/user';

// Transform Supabase user to app user format
const transformSupabaseUser = (user: SupabaseUser) => ({
  id: user.id,
  nickname: user.nickname,
  avatar: { 
    id: user.avatar, 
    name: user.avatar, 
    imageUrl: `/avatars/${user.avatar}.svg`, 
    isCustom: false, 
    unlockedAtLevel: 1 
  },
  mentalHealthTopic: user.mental_health_topic as MentalHealthTopic,
  joinedAt: new Date(user.created_at),
  level: user.level,
  xp: user.xp,
  badges: [] as Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>, // Will be loaded separately
  totalSessionsAttended: user.total_sessions_attended,
  streakCount: user.streak_count,
  preferredSessionMode: user.preferred_session_mode as SessionMode,
  aiModeratorPreference: user.ai_moderator_preference as AIModeratorPersona,
  isOnline: user.is_online,
  lastSeen: new Date(user.last_seen)
});

// Transform Supabase badge to app badge format
const transformSupabaseBadge = (badge: SupabaseBadge) => ({
  id: badge.id,
  name: badge.badge_name,
  description: badge.badge_description,
  icon: badge.badge_icon,
  earnedAt: new Date(badge.awarded_at),
  rarity: badge.rarity as 'common' | 'rare' | 'epic' | 'legendary'
});

interface UserState {
  user: any | null; // Stored user profile with badges loaded separately
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authUser: any | null; // Supabase auth user
  subscriptions: any[]; // Track active subscriptions
}

interface UserActions {
  // Auth Actions
  loginAnonymous: (nickname: string, avatar: string, topic: MentalHealthTopic, preferences: any) => Promise<void>;
  signUpWithEmail: (email: string, password: string, nickname: string, avatar: string, topic: MentalHealthTopic, preferences: any) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // User Profile Actions
  updateUser: (updates: any) => Promise<void>;
  awardXP: (amount: number, reason: string) => Promise<void>;
  unlockBadge: (badgeType: string, badgeName: string, description: string, icon: string, rarity?: 'common' | 'rare' | 'epic' | 'legendary') => Promise<void>;
  refreshUserData: () => Promise<void>;

  // Private helper methods (exposed for internal use)
  setupRealtimeSubscriptions: (userId: string) => void;
  checkLevelBadges: (level: number) => Promise<void>;

  // Cleanup
  cleanup: () => void;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        authUser: null,
        subscriptions: [],

        // Auth Actions
        loginAnonymous: async (nickname, avatar, topic, preferences) => {
          set({ isLoading: true, error: null });
          
          try {
            const { user, authUser } = await createAnonymousUser(
              nickname,
              avatar,
              topic,
              preferences
            );

            const transformedUser = transformSupabaseUser(user);
            
            set({ 
              user: transformedUser, 
              authUser,
              isAuthenticated: true, 
              isLoading: false 
            });

            // Set up real-time subscriptions
            const { setupRealtimeSubscriptions } = get();
            setupRealtimeSubscriptions(user.id);

            // Update online status
            await updateUserOnlineStatus(user.id, true);

            console.log('✅ User logged in successfully:', transformedUser);
          } catch (error: any) {
            console.error('❌ Login failed:', error);
            set({ 
              error: error.message || 'Failed to create account', 
              isLoading: false 
            });
          }
        },

        signUpWithEmail: async (email, password, nickname, avatar, topic, preferences) => {
          set({ isLoading: true, error: null });
          
          try {
            const { user, authUser } = await signUpWithEmail(
              email,
              password,
              nickname,
              avatar,
              topic,
              preferences
            );

            const transformedUser = transformSupabaseUser(user);
            
            set({ 
              user: transformedUser, 
              authUser,
              isAuthenticated: true, 
              isLoading: false 
            });

            // Set up real-time subscriptions
            const { setupRealtimeSubscriptions } = get();
            setupRealtimeSubscriptions(user.id);

            // Update online status
            await updateUserOnlineStatus(user.id, true);

            console.log('✅ User signed up successfully:', transformedUser);
          } catch (error: any) {
            console.error('❌ Sign up failed:', error);
            set({ 
              error: error.message || 'Failed to create account', 
              isLoading: false 
            });
          }
        },

        signInWithEmail: async (email, password) => {
          set({ isLoading: true, error: null });
          
          try {
            console.log('🔐 Starting email sign in...');
            const { user, authUser } = await signInWithEmail(email, password);
            console.log('📧 Got user data:', { userId: user.id, nickname: user.nickname });

            const transformedUser = transformSupabaseUser(user);
            
            // Load user badges
            console.log('🏅 Loading user badges...');
            const badges = await getUserBadges(user.id);
            transformedUser.badges = badges.map(transformSupabaseBadge);
            console.log('🏅 Loaded badges:', badges.length);
            
            console.log('💾 Setting user state...');
            set({ 
              user: transformedUser, 
              authUser,
              isAuthenticated: true, 
              isLoading: false 
            });

            console.log('📡 Setting up realtime subscriptions...');
            // Set up real-time subscriptions
            const { setupRealtimeSubscriptions } = get();
            setupRealtimeSubscriptions(user.id);

            // Update online status
            console.log('🟢 Updating online status...');
            await updateUserOnlineStatus(user.id, true);

            console.log('✅ User signed in successfully:', { 
              id: transformedUser.id, 
              nickname: transformedUser.nickname,
              isAuthenticated: true
            });
          } catch (error: any) {
            console.error('❌ Sign in failed:', error);
            set({ 
              error: error.message || 'Failed to sign in', 
              isLoading: false 
            });
            throw error;
          }
        },

        logout: async () => {
          const { user, cleanup } = get();
          
          try {
            // Update online status before logout
            if (user?.id) {
              await updateUserOnlineStatus(user.id, false);
            }
            
            // Sign out from Supabase
            await supabase.auth.signOut();
            
            // Cleanup subscriptions
            cleanup();
            
            set({
              user: null,
              authUser: null,
              isAuthenticated: false,
              error: null
            });

            console.log('✅ User logged out successfully');
          } catch (error: any) {
            console.error('❌ Logout error:', error);
            // Still clear the state even if logout fails
            set({
              user: null,
              authUser: null,
              isAuthenticated: false,
              error: null
            });
          }
        },

        loadUser: async () => {
          set({ isLoading: true });
          
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session?.user) {
              set({ isLoading: false, isAuthenticated: false });
              return;
            }

            const userData = await getUser(session.user.id);
            if (!userData) {
              throw new Error('User profile not found');
            }

            const transformedUser = transformSupabaseUser(userData);
            
            // Load user badges
            const badges = await getUserBadges(session.user.id);
            transformedUser.badges = badges.map(transformSupabaseBadge);

            set({
              user: transformedUser,
              authUser: session.user,
              isAuthenticated: true,
              isLoading: false
            });

            // Set up real-time subscriptions only if not already set up
            const { subscriptions, setupRealtimeSubscriptions } = get();
            if (subscriptions.length === 0) {
              setupRealtimeSubscriptions(session.user.id);
            }

            // Update online status
            await updateUserOnlineStatus(session.user.id, true);

            console.log('✅ User loaded successfully:', transformedUser);
          } catch (error: any) {
            console.error('❌ Failed to load user:', error);
            set({ 
              error: error.message || 'Failed to load user data',
              isLoading: false,
              isAuthenticated: false
            });
          }
        },

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // User Profile Actions
        updateUser: async (updates) => {
          const { user } = get();
          if (!user?.id) {
            console.error('❌ No user ID found for update');
            return;
          }

          console.log('🔄 Updating user with:', updates);

          try {
            // Transform avatar object to avatar ID for database
            const dbUpdates = { ...updates };
            if (updates.avatar && typeof updates.avatar === 'object') {
              dbUpdates.avatar = updates.avatar.id;
              console.log('🎭 Transformed avatar object to ID:', updates.avatar.id);
            }
            
            // Transform mentalHealthTopic to mental_health_topic for database
            if (updates.mentalHealthTopic) {
              dbUpdates.mental_health_topic = updates.mentalHealthTopic;
              delete dbUpdates.mentalHealthTopic;
              console.log('🎯 Transformed mentalHealthTopic to mental_health_topic:', updates.mentalHealthTopic);
            }
            
            console.log('💾 Sending updates to database:', dbUpdates);
            const updatedUser = await updateUserInDB(user.id, dbUpdates);
            
            if (updatedUser) {
              console.log('📨 Received updated user from DB:', updatedUser);
              const transformedUser = transformSupabaseUser(updatedUser);
              // Preserve existing badges
              transformedUser.badges = user.badges;
              
              // If avatar was updated, refresh the avatar object
              if (updates.avatar && typeof updates.avatar === 'object') {
                transformedUser.avatar = updates.avatar;
              }
              
              set({ user: transformedUser });
              console.log('✅ User updated successfully in store:', transformedUser);
            } else {
              console.error('❌ No user data returned from database');
              throw new Error('No user data returned from database');
            }
          } catch (error: any) {
            console.error('❌ Error updating user:', error);
            set({ error: error.message || 'Failed to update profile' });
            throw error; // Rethrow so UI can handle it
          }
        },

        awardXP: async (amount, reason) => {
          const { user } = get();
          if (!user?.id) return;

          try {
            const updatedUser = await awardUserXP(user.id, amount);
            if (updatedUser) {
              const transformedUser = transformSupabaseUser(updatedUser);
              // Preserve existing badges
              transformedUser.badges = user.badges;

              const leveledUp = transformedUser.level > user.level;
              
              set({ user: transformedUser });

              // Check for level-based badge awards
              if (leveledUp) {
                await get().checkLevelBadges(transformedUser.level);
              }

              console.log(`✅ Awarded ${amount} XP for: ${reason}`);
            }
          } catch (error: any) {
            console.error('❌ Failed to award XP:', error);
          }
        },

        unlockBadge: async (badgeType, badgeName, description, icon, rarity = 'common') => {
          const { user } = get();
          if (!user?.id) return;

          try {
            const newBadge = await awardBadge(
              user.id,
              badgeType,
              badgeName,
              description,
              icon,
              rarity
            );

            if (newBadge) {
              const transformedBadge = transformSupabaseBadge(newBadge);
              
              set((state) => ({
                user: state.user ? {
                  ...state.user,
                  badges: [...state.user.badges, transformedBadge]
                } : null
              }));

              console.log(`✅ Badge unlocked: ${badgeName}`);
            }
          } catch (error: any) {
            console.error('❌ Failed to unlock badge:', error);
          }
        },

        refreshUserData: async () => {
          const { user } = get();
          if (!user?.id) return;

          try {
            const [userData, badges] = await Promise.all([
              getUser(user.id),
              getUserBadges(user.id)
            ]);

            if (userData) {
              const transformedUser = transformSupabaseUser(userData);
              transformedUser.badges = badges.map(transformSupabaseBadge);
              
              set({ user: transformedUser });
              console.log('✅ User data refreshed');
            }
          } catch (error: any) {
            console.error('❌ Failed to refresh user data:', error);
          }
        },

        // Private helper methods
        setupRealtimeSubscriptions: (userId: string) => {
          try {
            // First cleanup any existing subscriptions
            const { cleanup } = get();
            cleanup();

            const subscriptions: any[] = [];

            // Subscribe to XP/level updates
            const progressSub = subscribeToUserProgress(
              userId,
              (updatedUser) => {
                const { user } = get();
                if (user) {
                  const transformedUser = transformSupabaseUser(updatedUser);
                  transformedUser.badges = user.badges;
                  set({ user: transformedUser });
                }
              },
              (error) => console.warn('⚠️ Progress subscription error (non-critical):', error.message)
            );
            subscriptions.push(progressSub);

            // Subscribe to new badges
            const badgeSub = subscribeToUserBadges(
              userId,
              (newBadge) => {
                const transformedBadge = transformSupabaseBadge(newBadge);
                set((state) => ({
                  user: state.user ? {
                    ...state.user,
                    badges: [...state.user.badges, transformedBadge]
                  } : null
                }));
              },
              (error) => console.warn('⚠️ Badge subscription error (non-critical):', error.message)
            );
            subscriptions.push(badgeSub);

            // Store subscriptions in state
            set({ subscriptions });
            console.log('📡 Realtime subscriptions set up successfully');
          } catch (error: any) {
            console.warn('⚠️ Failed to set up realtime subscriptions (non-critical):', error.message);
            // Don't throw error - realtime is optional
          }
        },

        checkLevelBadges: async (level: number) => {
          const levelBadges = [
            { level: 5, type: 'level_5', name: 'Rising Star', description: 'Reached level 5', icon: '⭐' },
            { level: 10, type: 'level_10', name: 'Dedicated Learner', description: 'Reached level 10', icon: '🎓' },
            { level: 25, type: 'level_25', name: 'Community Champion', description: 'Reached level 25', icon: '🏆' },
            { level: 50, type: 'level_50', name: 'Mental Health Advocate', description: 'Reached level 50', icon: '🌟' },
          ];

          for (const badge of levelBadges) {
            if (level >= badge.level) {
              await get().unlockBadge(
                badge.type,
                badge.name,
                badge.description,
                badge.icon,
                'rare'
              );
            }
          }
        },

        cleanup: () => {
          const { subscriptions } = get();
          
          // Unsubscribe from all tracked subscriptions
          subscriptions.forEach(subscription => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          });

          // Clear all Supabase channels
          unsubscribeAll();
          
          // Reset subscriptions array
          set({ subscriptions: [] });
          
          console.log('🧹 User store cleanup completed');
        },
      }),
      {
        name: 'unmute-user-store',
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    { name: 'UserStore' }
  )
); 
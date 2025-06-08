import { supabase } from './client';
import { 
  User, UserInsert, UserUpdate, 
  Message, MessageInsert, 
  Badge, BadgeInsert,
  Mood, MoodInsert,
  MentalHealthTopic, 
  SessionMode, 
  AIModeratorPersona 
} from './types';

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create a new user with anonymous authentication
 */
export const createAnonymousUser = async (
  nickname: string,
  avatar: string,
  mentalHealthTopic: MentalHealthTopic,
  preferences: {
    sessionMode: SessionMode;
    aiModeratorPersona: AIModeratorPersona;
  }
) => {
  try {
    // First create anonymous auth user
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('Failed to create anonymous user');

    // Then create user profile
    const userData: UserInsert = {
      id: userId,
      nickname,
      avatar,
      mental_health_topic: mentalHealthTopic,
      preferred_session_mode: preferences.sessionMode,
      ai_moderator_preference: preferences.aiModeratorPersona,
      xp: 0,
      level: 1,
      total_sessions_attended: 0,
      streak_count: 0,
      is_online: true,
      last_seen: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return { user: data, authUser: authData.user };
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  nickname: string,
  avatar: string,
  mentalHealthTopic: MentalHealthTopic,
  preferences: {
    sessionMode: SessionMode;
    aiModeratorPersona: AIModeratorPersona;
  }
) => {
  try {
    console.log('📝 Starting email signup for:', email);
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      console.error('❌ Auth signup error:', authError);
      throw authError;
    }

    console.log('✅ Auth user created:', authData.user?.id);
    console.log('📧 Email confirmation required:', authData.user?.email_confirmed_at === null);

    const userId = authData.user?.id;
    if (!userId) throw new Error('Failed to create user account');

    // Check if user needs email confirmation
    if (!authData.session && authData.user?.email_confirmed_at === null) {
      console.log('📧 Email confirmation required - user will need to check email');
      throw new Error('Please check your email and click the confirmation link to complete signup.');
    }

    // Create user profile
    const userData: UserInsert = {
      id: userId,
      nickname,
      avatar,
      mental_health_topic: mentalHealthTopic,
      preferred_session_mode: preferences.sessionMode,
      ai_moderator_preference: preferences.aiModeratorPersona,
      xp: 0,
      level: 1,
      total_sessions_attended: 0,
      streak_count: 0,
      is_online: true,
      last_seen: new Date().toISOString(),
    };

    console.log('💾 Creating user profile...');
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('❌ User profile creation error:', error);
      throw error;
    }

    console.log('✅ User profile created successfully');
    return { user: data, authUser: authData.user };
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('Failed to sign in');

    // Get user profile
    const userData = await getUser(userId);
    if (!userData) throw new Error('User profile not found');

    return { user: userData, authUser: authData.user };
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUser = async (userId: string, updates: UserUpdate): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error updating user:', error);
      throw error;
    }
    
    console.log('✅ User updated in database:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error; // Rethrow to let the caller handle it
  }
};

/**
 * Update user XP and level
 */
export const awardUserXP = async (userId: string, xpAmount: number): Promise<User | null> => {
  try {
    // Get current user data
    const currentUser = await getUser(userId);
    if (!currentUser) throw new Error('User not found');

    const newXP = currentUser.xp + xpAmount;
    const newLevel = Math.floor(newXP / 100) + 1; // Simple level calculation

    const { data, error } = await supabase
      .from('users')
      .update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error awarding XP:', error);
    return null;
  }
};

/**
 * Update user online status
 */
export const updateUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        is_online: isOnline,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating online status:', error);
  }
};

// ============================================
// MESSAGE OPERATIONS
// ============================================

/**
 * Send a message to a chat room
 */
export const sendMessage = async (
  userId: string,
  room: string,
  content: string,
  messageType: string = 'text'
): Promise<Message | null> => {
  try {
    const messageData: MessageInsert = {
      user_id: userId,
      room,
      content,
      message_type: messageType,
      sender_type: 'user',
      xp_awarded: 1,
      is_supportive: false, // Could be enhanced with AI detection
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;

    // Award XP for sending message
    await awardUserXP(userId, 1);

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

/**
 * Get messages for a specific room
 */
export const getMessages = async (room: string, limit: number = 50): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users (
          nickname,
          avatar,
          level
        )
      `)
      .eq('room', room)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

/**
 * Subscribe to real-time messages for a room
 */
export const subscribeToMessages = (
  room: string,
  onMessage: (message: Message) => void,
  onError?: (error: any) => void
) => {
  const subscription = supabase
    .channel(`messages:${room}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room=eq.${room}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to room: ${room}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Channel subscription error');
        onError?.(new Error('Channel subscription failed'));
      }
    });

  return subscription;
};

// ============================================
// BADGE OPERATIONS
// ============================================

/**
 * Award a badge to a user
 */
export const awardBadge = async (
  userId: string,
  badgeType: string,
  badgeName: string,
  badgeDescription: string,
  badgeIcon: string,
  rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common'
): Promise<Badge | null> => {
  try {
    // Check if user already has this badge
    const { data: existingBadge } = await supabase
      .from('badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .single();

    if (existingBadge) {
      console.log('User already has this badge');
      return null; // Return null to indicate badge already exists
    }

    const badgeData: BadgeInsert = {
      user_id: userId,
      badge_type: badgeType,
      badge_name: badgeName,
      badge_description: badgeDescription,
      badge_icon: badgeIcon,
      rarity,
    };

    const { data, error } = await supabase
      .from('badges')
      .insert(badgeData)
      .select()
      .single();

    if (error) throw error;

    // Award XP for earning badge
    const xpReward = rarity === 'legendary' ? 50 : rarity === 'epic' ? 25 : rarity === 'rare' ? 10 : 5;
    await awardUserXP(userId, xpReward);

    return data;
  } catch (error) {
    console.error('Error awarding badge:', error);
    return null;
  }
};

/**
 * Get user badges
 */
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
};

// ============================================
// MOOD OPERATIONS
// ============================================

/**
 * Save a mood entry
 */
export const saveMoodEntry = async (
  userId: string,
  moodData: {
    mood_score: number;
    energy_score?: number;
    anxiety_score?: number;
    notes?: string;
    activities?: string[];
    triggers?: string[];
    date: string;
  }
): Promise<Mood | null> => {
  try {
    // Check if mood entry for this date already exists
    const { data: existingMood } = await supabase
      .from('moods')
      .select('id')
      .eq('user_id', userId)
      .eq('date', moodData.date)
      .single();

    if (existingMood) {
      // Update existing mood entry
      const { data, error } = await supabase
        .from('moods')
        .update(moodData)
        .eq('id', existingMood.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new mood entry
      const { data, error } = await supabase
        .from('moods')
        .insert({
          user_id: userId,
          ...moodData,
        })
        .select()
        .single();

      if (error) throw error;

      // Award XP for mood tracking
      await awardUserXP(userId, 5);

      return data;
    }
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return null;
  }
};

/**
 * Get mood entries for a user within a date range
 */
export const getMoodEntries = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<Mood[]> => {
  try {
    let query = supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

/**
 * Get mood entry for a specific date
 */
export const getMoodEntryByDate = async (
  userId: string,
  date: string
): Promise<Mood | null> => {
  try {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found" error
    return data || null;
  } catch (error) {
    console.error('Error getting mood entry by date:', error);
    return null;
  }
};

// ============================================
// ANALYTICS & STATS
// ============================================

/**
 * Calculate mood statistics for a user
 */
export const getMoodStats = async (userId: string, days: number = 30) => {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const entries = await getMoodEntries(userId, startDate, endDate);
    
    if (entries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        currentStreak: 0,
        trend: 'stable' as const,
      };
    }

    const averageMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length;
    
    // Calculate streak (consecutive days with mood entries)
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasEntry = entries.some(entry => entry.date === dateStr);
      
      if (hasEntry) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate trend (comparing first half vs second half of period)
    const midpoint = Math.floor(entries.length / 2);
    const firstHalf = entries.slice(0, midpoint);
    const secondHalf = entries.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.mood_score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.mood_score, 0) / secondHalf.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.5) trend = 'up';
    else if (secondHalfAvg < firstHalfAvg - 0.5) trend = 'down';

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      totalEntries: entries.length,
      currentStreak,
      trend,
    };
  } catch (error) {
    console.error('Error calculating mood stats:', error);
    return {
      averageMood: 0,
      totalEntries: 0,
      currentStreak: 0,
      trend: 'stable' as const,
    };
  }
};

/**
 * Get user activity summary
 */
export const getUserActivitySummary = async (userId: string) => {
  try {
    const [user, badges, recentMoods] = await Promise.all([
      getUser(userId),
      getUserBadges(userId),
      getMoodEntries(userId, undefined, undefined),
    ]);

    if (!user) throw new Error('User not found');

    const moodStats = await getMoodStats(userId);

    return {
      user,
      badges,
      moodStats,
      recentMoodEntries: recentMoods.slice(0, 7), // Last 7 entries
    };
  } catch (error) {
    console.error('Error getting user activity summary:', error);
    return null;
  }
}; 
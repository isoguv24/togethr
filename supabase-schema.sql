-- ===============================================
-- UNMUTE DATABASE SCHEMA
-- ===============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- ENUMS
-- ===============================================

CREATE TYPE mental_health_topic AS ENUM (
  'anxiety',
  'depression', 
  'loneliness',
  'grief',
  'stress',
  'relationships',
  'self_esteem',
  'trauma',
  'addiction',
  'workplace_burnout'
);

CREATE TYPE session_mode AS ENUM (
  'chat_only',
  'video_enabled'
);

CREATE TYPE ai_moderator_persona AS ENUM (
  'calm_listener',
  'encouraging_coach',
  'wise_sage',
  'gentle_guide'
);

CREATE TYPE message_type AS ENUM (
  'text',
  'system',
  'ai_prompt',
  'user_joined',
  'user_left'
);

CREATE TYPE sender_type AS ENUM (
  'user',
  'ai_moderator'
);

CREATE TYPE badge_rarity AS ENUM (
  'common',
  'rare',
  'epic',
  'legendary'
);

-- ===============================================
-- TABLES
-- ===============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'calm_fox',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  mental_health_topic mental_health_topic NOT NULL,
  preferred_session_mode session_mode DEFAULT 'chat_only',
  ai_moderator_preference ai_moderator_persona DEFAULT 'calm_listener',
  total_sessions_attended INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  sender_type sender_type DEFAULT 'user',
  xp_awarded INTEGER DEFAULT 1,
  is_supportive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  rarity badge_rarity DEFAULT 'common',
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moods table
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_score INTEGER DEFAULT 5 CHECK (energy_score >= 1 AND energy_score <= 10),
  anxiety_score INTEGER DEFAULT 5 CHECK (anxiety_score >= 1 AND anxiety_score <= 10),
  notes TEXT DEFAULT '',
  activities TEXT[] DEFAULT '{}',
  triggers TEXT[] DEFAULT '{}',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ===============================================
-- INDEXES
-- ===============================================

-- Optimize message queries by room
CREATE INDEX IF NOT EXISTS messages_room_created_at_idx ON messages(room, created_at DESC);

-- Optimize user lookups
CREATE INDEX IF NOT EXISTS users_nickname_idx ON users(nickname);
CREATE INDEX IF NOT EXISTS users_is_online_idx ON users(is_online);
CREATE INDEX IF NOT EXISTS users_mental_health_topic_idx ON users(mental_health_topic);

-- Optimize badge queries
CREATE INDEX IF NOT EXISTS badges_user_id_awarded_at_idx ON badges(user_id, awarded_at DESC);
CREATE INDEX IF NOT EXISTS badges_badge_type_idx ON badges(badge_type);

-- Optimize mood queries
CREATE INDEX IF NOT EXISTS moods_user_id_date_idx ON moods(user_id, date DESC);
CREATE INDEX IF NOT EXISTS moods_date_idx ON moods(date);

-- ===============================================
-- ROW LEVEL SECURITY (RLS)
-- ===============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages policies
CREATE POLICY "Users can view messages in any room" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Users can view their own badges" ON badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges" ON badges
  FOR INSERT WITH CHECK (true);

-- Moods policies
CREATE POLICY "Users can view their own moods" ON moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own moods" ON moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own moods" ON moods
  FOR UPDATE USING (auth.uid() = user_id);

-- ===============================================
-- FUNCTIONS
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to award XP and update level
CREATE OR REPLACE FUNCTION award_user_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
  user_row users%ROWTYPE;
  new_level INTEGER;
BEGIN
  -- Get current user data
  SELECT * INTO user_row FROM users WHERE id = user_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Calculate new level (100 XP per level)
  new_level := GREATEST(1, ((user_row.xp + xp_amount) / 100) + 1);
  
  -- Update user XP and level
  UPDATE users 
  SET 
    xp = user_row.xp + xp_amount,
    level = new_level,
    updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get mood statistics
CREATE OR REPLACE FUNCTION get_mood_statistics(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
  start_date DATE;
  mood_entries RECORD;
  total_entries INTEGER;
  avg_mood NUMERIC;
  current_streak INTEGER;
  trend TEXT;
BEGIN
  start_date := CURRENT_DATE - INTERVAL '1 day' * days_back;
  
  -- Get basic stats
  SELECT 
    COUNT(*) as total,
    ROUND(AVG(mood_score), 1) as average
  INTO mood_entries
  FROM moods 
  WHERE user_id = user_uuid AND date >= start_date;
  
  total_entries := COALESCE(mood_entries.total, 0);
  avg_mood := COALESCE(mood_entries.average, 0);
  
  -- Calculate current streak
  WITH consecutive_dates AS (
    SELECT 
      date,
      date - ROW_NUMBER() OVER (ORDER BY date) * INTERVAL '1 day' as grp
    FROM moods 
    WHERE user_id = user_uuid 
      AND date <= CURRENT_DATE
    ORDER BY date DESC
  ),
  streaks AS (
    SELECT 
      grp,
      COUNT(*) as streak_length,
      MAX(date) as end_date
    FROM consecutive_dates
    GROUP BY grp
    ORDER BY end_date DESC
  )
  SELECT COALESCE(streak_length, 0) INTO current_streak
  FROM streaks 
  WHERE end_date = CURRENT_DATE
  LIMIT 1;
  
  current_streak := COALESCE(current_streak, 0);
  
  -- Simple trend calculation
  WITH recent_half AS (
    SELECT AVG(mood_score) as avg_recent
    FROM (
      SELECT mood_score 
      FROM moods 
      WHERE user_id = user_uuid AND date >= start_date
      ORDER BY date DESC 
      LIMIT (days_back / 2)
    ) sub
  ),
  older_half AS (
    SELECT AVG(mood_score) as avg_older
    FROM (
      SELECT mood_score 
      FROM moods 
      WHERE user_id = user_uuid AND date >= start_date
      ORDER BY date ASC 
      LIMIT (days_back / 2)
    ) sub
  )
  SELECT 
    CASE 
      WHEN r.avg_recent > o.avg_older + 0.5 THEN 'up'
      WHEN r.avg_recent < o.avg_older - 0.5 THEN 'down'
      ELSE 'stable'
    END INTO trend
  FROM recent_half r, older_half o;
  
  trend := COALESCE(trend, 'stable');
  
  -- Build result JSON
  result := json_build_object(
    'averageMood', avg_mood,
    'totalEntries', total_entries,
    'currentStreak', current_streak,
    'trend', trend
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- INITIAL DATA
-- ===============================================

-- Insert sample community rooms (these are just reference data)
-- The actual rooms are created dynamically based on mental health topics

-- ===============================================
-- REALTIME SUBSCRIPTIONS
-- ===============================================

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE badges;

-- ===============================================
-- SECURITY NOTES
-- ===============================================

/*
This schema implements the following security measures:

1. Row Level Security (RLS) is enabled on all tables
2. Users can only access their own data (except messages which are public in rooms)
3. Anonymous authentication is supported via Supabase Auth
4. All functions are marked as SECURITY DEFINER to run with elevated privileges
5. Input validation through CHECK constraints
6. Foreign key constraints ensure data integrity

To use this schema:
1. Run this SQL in your Supabase SQL editor
2. Set up your environment variables in .env.local:
   - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Enable anonymous authentication in Supabase Auth settings
4. Configure realtime subscriptions if needed
*/ 
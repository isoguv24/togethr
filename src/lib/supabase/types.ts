export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nickname: string;
          avatar: string;
          xp: number;
          level: number;
          mental_health_topic: string;
          preferred_session_mode: string;
          ai_moderator_preference: string;
          total_sessions_attended: number;
          streak_count: number;
          is_online: boolean;
          last_seen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nickname: string;
          avatar: string;
          xp?: number;
          level?: number;
          mental_health_topic: string;
          preferred_session_mode?: string;
          ai_moderator_preference?: string;
          total_sessions_attended?: number;
          streak_count?: number;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          avatar?: string;
          xp?: number;
          level?: number;
          mental_health_topic?: string;
          preferred_session_mode?: string;
          ai_moderator_preference?: string;
          total_sessions_attended?: number;
          streak_count?: number;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          room: string;
          content: string;
          message_type: string;
          sender_type: string;
          xp_awarded: number;
          is_supportive: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          room: string;
          content: string;
          message_type?: string;
          sender_type?: string;
          xp_awarded?: number;
          is_supportive?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          room?: string;
          content?: string;
          message_type?: string;
          sender_type?: string;
          xp_awarded?: number;
          is_supportive?: boolean;
          created_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          badge_name: string;
          badge_description: string;
          badge_icon: string;
          rarity: string;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          badge_name: string;
          badge_description: string;
          badge_icon: string;
          rarity?: string;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_type?: string;
          badge_name?: string;
          badge_description?: string;
          badge_icon?: string;
          rarity?: string;
          awarded_at?: string;
        };
      };
      moods: {
        Row: {
          id: string;
          user_id: string;
          mood_score: number;
          energy_score: number;
          anxiety_score: number;
          notes: string;
          activities: string[];
          triggers: string[];
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood_score: number;
          energy_score?: number;
          anxiety_score?: number;
          notes?: string;
          activities?: string[];
          triggers?: string[];
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood_score?: number;
          energy_score?: number;
          anxiety_score?: number;
          notes?: string;
          activities?: string[];
          triggers?: string[];
          date?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      mental_health_topic: 'anxiety' | 'depression' | 'loneliness' | 'grief' | 'stress' | 'relationships' | 'self_esteem' | 'trauma' | 'addiction' | 'workplace_burnout';
      session_mode: 'chat_only' | 'video_enabled';
      ai_moderator_persona: 'calm_listener' | 'encouraging_coach' | 'wise_sage' | 'gentle_guide';
      message_type: 'text' | 'system' | 'ai_prompt' | 'user_joined' | 'user_left';
      sender_type: 'user' | 'ai_moderator';
      badge_rarity: 'common' | 'rare' | 'epic' | 'legendary';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type Badge = Database['public']['Tables']['badges']['Row'];
export type BadgeInsert = Database['public']['Tables']['badges']['Insert'];
export type BadgeUpdate = Database['public']['Tables']['badges']['Update'];

export type Mood = Database['public']['Tables']['moods']['Row'];
export type MoodInsert = Database['public']['Tables']['moods']['Insert'];
export type MoodUpdate = Database['public']['Tables']['moods']['Update'];

export type MentalHealthTopic = Database['public']['Enums']['mental_health_topic'];
export type SessionMode = Database['public']['Enums']['session_mode'];
export type AIModeratorPersona = Database['public']['Enums']['ai_moderator_persona']; 
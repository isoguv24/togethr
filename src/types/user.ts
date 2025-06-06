export type MentalHealthTopic = 
  | 'anxiety' 
  | 'depression' 
  | 'loneliness' 
  | 'grief' 
  | 'stress' 
  | 'relationships' 
  | 'self_esteem' 
  | 'trauma' 
  | 'addiction'
  | 'workplace_burnout';

export type SessionMode = 'chat_only' | 'video_enabled';

export type AIModeratorPersona = 
  | 'calm_listener' 
  | 'encouraging_coach' 
  | 'wise_sage' 
  | 'gentle_guide';

export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
  isCustom: boolean;
  unlockedAtLevel: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface User {
  id: string;
  nickname: string;
  avatar: Avatar;
  mentalHealthTopic: MentalHealthTopic;
  joinedAt: Date;
  level: number;
  xp: number;
  badges: Badge[];
  totalSessionsAttended: number;
  streakCount: number;
  preferredSessionMode: SessionMode;
  aiModeratorPreference: AIModeratorPersona;
  isOnline: boolean;
  lastSeen: Date;
}

export interface UserPreferences {
  sessionMode: SessionMode;
  aiModeratorPersona: AIModeratorPersona;
  notificationsEnabled: boolean;
  reminderTime?: string;
} 
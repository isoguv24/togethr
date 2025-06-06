import { Avatar } from '@/types/user';

export interface AvatarConfig extends Avatar {
  personality: string;
  description: string;
}

export const AVATARS: AvatarConfig[] = [
  {
    id: 'calm_fox',
    name: 'Calm Fox',
    imageUrl: '/avatars/calm-fox.svg',
    isCustom: false,
    unlockedAtLevel: 1,
    personality: 'Peaceful and wise',
    description: 'A serene fox that represents tranquility and inner peace'
  },
  {
    id: 'shy_turtle',
    name: 'Shy Turtle',
    imageUrl: '/avatars/shy-turtle.svg',
    isCustom: false,
    unlockedAtLevel: 1,
    personality: 'Gentle and thoughtful',
    description: 'A gentle turtle that takes things slow and steady'
  },
  {
    id: 'wise_owl',
    name: 'Wise Owl',
    imageUrl: '/avatars/wise-owl.svg',
    isCustom: false,
    unlockedAtLevel: 2,
    personality: 'Insightful and observant',
    description: 'A wise owl that sees the bigger picture'
  },
  {
    id: 'hopeful_butterfly',
    name: 'Hopeful Butterfly',
    imageUrl: '/avatars/hopeful-butterfly.svg',
    isCustom: false,
    unlockedAtLevel: 3,
    personality: 'Optimistic and transformative',
    description: 'A beautiful butterfly representing growth and transformation'
  },
  {
    id: 'brave_lion',
    name: 'Brave Lion',
    imageUrl: '/avatars/brave-lion.svg',
    isCustom: false,
    unlockedAtLevel: 5,
    personality: 'Courageous and strong',
    description: 'A brave lion that faces challenges head-on'
  },
  {
    id: 'peaceful_dove',
    name: 'Peaceful Dove',
    imageUrl: '/avatars/peaceful-dove.svg',
    isCustom: false,
    unlockedAtLevel: 7,
    personality: 'Harmonious and healing',
    description: 'A peaceful dove that brings calm to any situation'
  },
  {
    id: 'mystic_cat',
    name: 'Mystic Cat',
    imageUrl: '/avatars/mystic-cat.svg',
    isCustom: false,
    unlockedAtLevel: 4,
    personality: 'Intuitive and mysterious',
    description: 'A wise cat with deep understanding'
  },
  {
    id: 'gentle_bear',
    name: 'Gentle Bear',
    imageUrl: '/avatars/gentle-bear.svg',
    isCustom: false,
    unlockedAtLevel: 6,
    personality: 'Protective and caring',
    description: 'A strong but gentle bear that offers comfort'
  },
  {
    id: 'serene_deer',
    name: 'Serene Deer',
    imageUrl: '/avatars/serene-deer.svg',
    isCustom: false,
    unlockedAtLevel: 3,
    personality: 'Graceful and peaceful',
    description: 'A gentle deer that moves with quiet grace'
  },
  {
    id: 'vibrant_bird',
    name: 'Vibrant Bird',
    imageUrl: '/avatars/vibrant-bird.svg',
    isCustom: false,
    unlockedAtLevel: 8,
    personality: 'Energetic and uplifting',
    description: 'A colorful bird that brings joy and energy'
  }
];

// AI Moderator Avatars
export const AI_MODERATOR_AVATARS: Record<string, AvatarConfig> = {
  ai_sage: {
    id: 'ai_sage',
    name: 'Sage',
    imageUrl: '/avatars/ai-sage.svg',
    isCustom: false,
    unlockedAtLevel: 1,
    personality: 'Wise and supportive',
    description: 'An AI moderator focused on gentle guidance and wisdom'
  }
};

export const getBasicAvatars = (): AvatarConfig[] => {
  return AVATARS.filter(avatar => avatar.unlockedAtLevel <= 1);
};

export const getAvatarsForLevel = (level: number): AvatarConfig[] => {
  return AVATARS.filter(avatar => avatar.unlockedAtLevel <= level);
};

export const getAvatarById = (id: string): AvatarConfig | undefined => {
  return AVATARS.find(avatar => avatar.id === id);
};

export const getAvatar = (avatarId: string): AvatarConfig | undefined => {
  return AVATARS.find(avatar => avatar.id === avatarId) || AI_MODERATOR_AVATARS[avatarId];
};

export const getAIModerators = (): AvatarConfig[] => {
  return Object.values(AI_MODERATOR_AVATARS);
};

// Fallback avatar URLs (using emoji-based SVGs that can be generated)
export const generateAvatarUrl = (avatarId: string): string => {
  const avatar = getAvatar(avatarId);
  if (!avatar) return '/avatars/default.svg';
  
  // For MVP, we'll use placeholder URLs that can be replaced with actual SVG assets
  return avatar.imageUrl;
};

// Default avatar for users who haven't selected one
export const DEFAULT_AVATAR: AvatarConfig = {
  id: 'default',
  name: 'Gentle Circle',
  description: 'A simple, calming presence',
  imageUrl: '/avatars/default.svg',
  personality: 'Neutral, calming',
  unlockedAtLevel: 0,
  isCustom: false
}; 
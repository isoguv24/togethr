import { Badge } from '@/types/user';

export interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: BadgeCriteria;
  xpReward: number;
  category: BadgeCategory;
  unlockMessage: string;
}

export interface BadgeCriteria {
  type: BadgeType;
  threshold: number;
  conditions?: Record<string, any>;
}

export type BadgeType = 
  | 'sessions_attended'
  | 'messages_sent'
  | 'camera_time'
  | 'supportive_messages'
  | 'consecutive_weeks'
  | 'first_time'
  | 'special_action'
  | 'community_contribution';

export type BadgeCategory = 
  | 'participation'
  | 'communication'
  | 'vulnerability'
  | 'support'
  | 'consistency'
  | 'milestone'
  | 'special';

export const BADGES: Record<string, BadgeConfig> = {
  // First Time Badges
  first_step: {
    id: 'first_step',
    name: 'First Step',
    description: 'You joined your first group therapy session',
    icon: '🎖️',
    rarity: 'common',
    criteria: {
      type: 'first_time',
      threshold: 1,
      conditions: { action: 'join_session' }
    },
    xpReward: 50,
    category: 'milestone',
    unlockMessage: 'Congratulations! Taking the first step is often the hardest. You\'re on your way to meaningful connections.'
  },
  face_forward: {
    id: 'face_forward',
    name: 'Face Forward',
    description: 'You turned on your camera for the first time',
    icon: '👁️',
    rarity: 'rare',
    criteria: {
      type: 'first_time',
      threshold: 1,
      conditions: { action: 'camera_enabled' }
    },
    xpReward: 100,
    category: 'vulnerability',
    unlockMessage: 'It takes courage to show yourself. Your openness helps create a safe space for everyone.'
  },
  voice_of_support: {
    id: 'voice_of_support',
    name: 'Voice of Support',
    description: 'You sent your first supportive message',
    icon: '💬',
    rarity: 'common',
    criteria: {
      type: 'supportive_messages',
      threshold: 1
    },
    xpReward: 25,
    category: 'support',
    unlockMessage: 'Your words of support can make all the difference. Thank you for being there for others.'
  },

  // Participation Badges
  quiet_strength: {
    id: 'quiet_strength',
    name: 'Quiet Strength',
    description: 'You attended 3 sessions while listening more than speaking',
    icon: '🐢',
    rarity: 'rare',
    criteria: {
      type: 'sessions_attended',
      threshold: 3,
      conditions: { max_messages_per_session: 2 }
    },
    xpReward: 75,
    category: 'participation',
    unlockMessage: 'Sometimes the greatest strength is in listening. Your presence alone provides comfort to others.'
  },
  active_participant: {
    id: 'active_participant',
    name: 'Active Participant',
    description: 'You sent at least 5 messages in a single session',
    icon: '🗣️',
    rarity: 'common',
    criteria: {
      type: 'messages_sent',
      threshold: 5,
      conditions: { same_session: true }
    },
    xpReward: 30,
    category: 'communication',
    unlockMessage: 'Your active participation helps keep the conversation flowing and engaging for everyone.'
  },
  conversation_starter: {
    id: 'conversation_starter',
    name: 'Conversation Starter',
    description: 'You were the first to speak in a session',
    icon: '🌟',
    rarity: 'rare',
    criteria: {
      type: 'special_action',
      threshold: 1,
      conditions: { action: 'first_message_in_session' }
    },
    xpReward: 60,
    category: 'communication',
    unlockMessage: 'Breaking the ice helps everyone feel more comfortable. Thank you for taking the lead!'
  },

  // Support & Empathy Badges
  empathy_star: {
    id: 'empathy_star',
    name: 'Empathy Star',
    description: 'AI detected 5 supportive messages from you',
    icon: '⭐',
    rarity: 'epic',
    criteria: {
      type: 'supportive_messages',
      threshold: 5
    },
    xpReward: 150,
    category: 'support',
    unlockMessage: 'Your empathy shines through in everything you share. You\'re making a real difference in people\'s lives.'
  },
  healing_helper: {
    id: 'healing_helper',
    name: 'Healing Helper',
    description: 'You provided practical advice that helped someone',
    icon: '🤝',
    rarity: 'rare',
    criteria: {
      type: 'special_action',
      threshold: 1,
      conditions: { action: 'helpful_advice', recipient_confirmed: true }
    },
    xpReward: 80,
    category: 'support',
    unlockMessage: 'Your practical wisdom and lived experience are invaluable gifts to this community.'
  },
  emotional_anchor: {
    id: 'emotional_anchor',
    name: 'Emotional Anchor',
    description: 'You helped someone through a difficult moment',
    icon: '⚓',
    rarity: 'epic',
    criteria: {
      type: 'special_action',
      threshold: 1,
      conditions: { action: 'crisis_support', ai_detected: true }
    },
    xpReward: 200,
    category: 'support',
    unlockMessage: 'In someone\'s storm, you were their anchor. Your support in difficult moments is truly heroic.'
  },

  // Consistency Badges
  consistency: {
    id: 'consistency',
    name: 'Consistency',
    description: 'You attended sessions for 4 weeks in a row',
    icon: '🧭',
    rarity: 'epic',
    criteria: {
      type: 'consecutive_weeks',
      threshold: 4
    },
    xpReward: 200,
    category: 'consistency',
    unlockMessage: 'Your consistency is inspiring! Regular participation creates stability for your entire group.'
  },
  marathon_supporter: {
    id: 'marathon_supporter',
    name: 'Marathon Supporter',
    description: 'You attended sessions for 12 weeks in a row',
    icon: '🏃‍♂️',
    rarity: 'legendary',
    criteria: {
      type: 'consecutive_weeks',
      threshold: 12
    },
    xpReward: 500,
    category: 'consistency',
    unlockMessage: 'Your dedication to growth and community is extraordinary. You\'re a pillar of strength for others.'
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'You attended 10 weekend sessions',
    icon: '🌅',
    rarity: 'rare',
    criteria: {
      type: 'sessions_attended',
      threshold: 10,
      conditions: { weekend_only: true }
    },
    xpReward: 100,
    category: 'participation',
    unlockMessage: 'Making time for healing on weekends shows true commitment to your wellbeing.'
  },

  // Vulnerability & Growth Badges
  camera_comfortable: {
    id: 'camera_comfortable',
    name: 'Camera Comfortable',
    description: 'You used video for over 2 hours total',
    icon: '📹',
    rarity: 'rare',
    criteria: {
      type: 'camera_time',
      threshold: 120 // minutes
    },
    xpReward: 120,
    category: 'vulnerability',
    unlockMessage: 'Your comfort with video calls helps create deeper, more personal connections in your group.'
  },
  story_sharer: {
    id: 'story_sharer',
    name: 'Story Sharer',
    description: 'You shared a personal story that moved others',
    icon: '📖',
    rarity: 'epic',
    criteria: {
      type: 'special_action',
      threshold: 1,
      conditions: { action: 'impactful_story', peer_reactions: 3 }
    },
    xpReward: 180,
    category: 'vulnerability',
    unlockMessage: 'Your courage in sharing your story creates space for others to open up. Thank you for your vulnerability.'
  },
  growth_mindset: {
    id: 'growth_mindset',
    name: 'Growth Mindset',
    description: 'You shared about personal growth or positive changes',
    icon: '🌱',
    rarity: 'rare',
    criteria: {
      type: 'special_action',
      threshold: 3,
      conditions: { action: 'growth_sharing' }
    },
    xpReward: 90,
    category: 'milestone',
    unlockMessage: 'Celebrating growth inspires others to see possibilities in their own journey.'
  },

  // Community Contribution Badges
  session_regular: {
    id: 'session_regular',
    name: 'Session Regular',
    description: 'You attended 25 total sessions',
    icon: '🏠',
    rarity: 'epic',
    criteria: {
      type: 'sessions_attended',
      threshold: 25
    },
    xpReward: 250,
    category: 'milestone',
    unlockMessage: 'You\'ve become a cornerstone of this community. Your regular presence provides stability for everyone.'
  },
  community_champion: {
    id: 'community_champion',
    name: 'Community Champion',
    description: 'You attended 50 total sessions',
    icon: '👑',
    rarity: 'legendary',
    criteria: {
      type: 'sessions_attended',
      threshold: 50
    },
    xpReward: 500,
    category: 'milestone',
    unlockMessage: 'You are a true champion of mental health community. Your dedication inspires everyone around you.'
  },
  bridge_builder: {
    id: 'bridge_builder',
    name: 'Bridge Builder',
    description: 'You helped two quiet members connect in a session',
    icon: '🌉',
    rarity: 'epic',
    criteria: {
      type: 'special_action',
      threshold: 1,
      conditions: { action: 'facilitate_connection' }
    },
    xpReward: 150,
    category: 'support',
    unlockMessage: 'You have a gift for bringing people together. Your facilitation skills strengthen the entire community.'
  }
};

export const getBadgeConfig = (badgeId: string): BadgeConfig | undefined => {
  return BADGES[badgeId];
};

export const getAllBadges = (): BadgeConfig[] => {
  return Object.values(BADGES);
};

export const getBadgesByCategory = (category: BadgeCategory): BadgeConfig[] => {
  return getAllBadges().filter(badge => badge.category === category);
};

export const getBadgesByRarity = (rarity: Badge['rarity']): BadgeConfig[] => {
  return getAllBadges().filter(badge => badge.rarity === rarity);
};

// XP Level thresholds
export const XP_LEVELS = [
  { level: 1, xpRequired: 0, title: 'Newcomer', benefits: ['Basic avatars'] },
  { level: 2, xpRequired: 100, title: 'Participant', benefits: ['Basic avatars', 'Session reactions'] },
  { level: 3, xpRequired: 250, title: 'Contributor', benefits: ['Basic avatars', 'Session reactions', 'Theme variations'] },
  { level: 4, xpRequired: 500, title: 'Supporter', benefits: ['Basic avatars', 'Session reactions', 'Theme variations', 'Custom colors'] },
  { level: 5, xpRequired: 1000, title: 'Advocate', benefits: ['Basic avatars', 'Session reactions', 'Theme variations', 'Custom colors', 'Advanced avatars'] },
  { level: 6, xpRequired: 1750, title: 'Mentor', benefits: ['Basic avatars', 'Session reactions', 'Theme variations', 'Custom colors', 'Advanced avatars', 'Session feedback priority'] },
  { level: 7, xpRequired: 2750, title: 'Leader', benefits: ['All previous', 'Group creation rights'] },
  { level: 8, xpRequired: 4000, title: 'Champion', benefits: ['All previous', 'Custom avatar upload'] },
  { level: 9, xpRequired: 6000, title: 'Guardian', benefits: ['All previous', 'Moderation privileges'] },
  { level: 10, xpRequired: 10000, title: 'Elder', benefits: ['All previous', 'Exclusive elder sessions'] }
];

export const getLevel = (xp: number) => {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  const levelTitles = [
    'Newcomer', 'Explorer', 'Supporter', 'Helper', 'Guide', 
    'Mentor', 'Leader', 'Healer', 'Sage', 'Master'
  ];
  
  const title = levelTitles[Math.min(level - 1, levelTitles.length - 1)] || 'Master';
  
  return {
    level,
    title,
    progress,
    currentLevelXP,
    nextLevelXP,
    xpToNext: nextLevelXP - xp
  };
};

export const getBadgeById = (id: string): BadgeConfig | undefined => {
  return BADGES[id];
}; 
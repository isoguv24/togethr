import { MentalHealthTopic } from '@/types/user';

export interface TopicConfig {
  id: MentalHealthTopic;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  keywords: string[];
  sessionPrompts: string[];
  supportingResources: string[];
}

export const MENTAL_HEALTH_TOPICS: Record<MentalHealthTopic, TopicConfig> = {
  anxiety: {
    id: 'anxiety',
    name: 'Anxiety & Worry',
    description: 'Connect with others who understand the challenges of anxiety, worry, and overwhelming thoughts.',
    icon: '🌊',
    color: 'blue',
    gradient: 'from-blue-400 to-blue-600',
    keywords: ['worry', 'panic', 'overthinking', 'stress', 'fear'],
    sessionPrompts: [
      'What does anxiety feel like in your body?',
      'Share a coping strategy that has helped you.',
      'What would you tell someone experiencing their first panic attack?',
      'How do you handle overwhelming thoughts?'
    ],
    supportingResources: [
      'Breathing exercises',
      'Grounding techniques',
      'Mindfulness apps',
      'Progressive muscle relaxation'
    ]
  },
  depression: {
    id: 'depression',
    name: 'Depression & Low Mood',
    description: 'A safe space for those navigating depression, low energy, and difficult emotions.',
    icon: '🌱',
    color: 'green',
    gradient: 'from-green-400 to-green-600',
    keywords: ['sadness', 'hopelessness', 'fatigue', 'numbness', 'emptiness'],
    sessionPrompts: [
      'What does hope look like for you today?',
      'Share one small thing that brought you comfort recently.',
      'How do you take care of yourself on difficult days?',
      'What would you want others to know about depression?'
    ],
    supportingResources: [
      'Daily routine building',
      'Light therapy information',
      'Gentle exercise ideas',
      'Sleep hygiene tips'
    ]
  },
  loneliness: {
    id: 'loneliness',
    name: 'Loneliness & Isolation',
    description: 'Find connection and understanding with others who know what loneliness feels like.',
    icon: '🫂',
    color: 'purple',
    gradient: 'from-purple-400 to-purple-600',
    keywords: ['isolation', 'disconnection', 'solitude', 'belonging', 'friendship'],
    sessionPrompts: [
      'What does meaningful connection mean to you?',
      'Share about a time you felt truly understood.',
      'How do you reach out when feeling isolated?',
      'What makes it hard to connect with others?'
    ],
    supportingResources: [
      'Social connection tips',
      'Community group finder',
      'Online communities',
      'Volunteering opportunities'
    ]
  },
  stress: {
    id: 'stress',
    name: 'Stress & Overwhelm',
    description: 'Learn to manage stress and overwhelm with others facing similar challenges.',
    icon: '⚡',
    color: 'yellow',
    gradient: 'from-yellow-400 to-yellow-600',
    keywords: ['overwhelm', 'pressure', 'burnout', 'tension', 'chaos'],
    sessionPrompts: [
      'What are your biggest stress triggers?',
      'Share a time management technique that works for you.',
      'How do you know when you\'re reaching your limit?',
      'What helps you feel more in control?'
    ],
    supportingResources: [
      'Time management techniques',
      'Stress reduction exercises',
      'Work-life balance tips',
      'Priority setting methods'
    ]
  },
  grief: {
    id: 'grief',
    name: 'Grief & Loss',
    description: 'Support for those processing loss, change, and the complex emotions of grief.',
    icon: '🕊️',
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600',
    keywords: ['loss', 'mourning', 'bereavement', 'change', 'healing'],
    sessionPrompts: [
      'How has grief changed over time for you?',
      'What would you want people to know about grief?',
      'Share a cherished memory if you feel comfortable.',
      'How do you honor what you\'ve lost?'
    ],
    supportingResources: [
      'Grief stages information',
      'Memorial ideas',
      'Support group finder',
      'Healing rituals'
    ]
  },
  relationships: {
    id: 'relationships',
    name: 'Relationships & Communication',
    description: 'Navigate relationship challenges, communication issues, and interpersonal growth.',
    icon: '💕',
    color: 'pink',
    gradient: 'from-pink-400 to-pink-600',
    keywords: ['communication', 'boundaries', 'conflict', 'intimacy', 'trust'],
    sessionPrompts: [
      'What makes relationships challenging for you?',
      'How do you set healthy boundaries?',
      'Share about a relationship that taught you something important.',
      'What does good communication look like to you?'
    ],
    supportingResources: [
      'Communication techniques',
      'Boundary setting guide',
      'Conflict resolution tips',
      'Relationship building activities'
    ]
  },
  self_esteem: {
    id: 'self_esteem',
    name: 'Self-Esteem & Confidence',
    description: 'Build self-worth and confidence alongside others on a similar journey.',
    icon: '✨',
    color: 'indigo',
    gradient: 'from-indigo-400 to-indigo-600',
    keywords: ['self-worth', 'confidence', 'self-doubt', 'validation', 'identity'],
    sessionPrompts: [
      'What would you tell your younger self?',
      'Share something you\'re proud of about yourself.',
      'How do you challenge negative self-talk?',
      'What does self-compassion mean to you?'
    ],
    supportingResources: [
      'Self-compassion exercises',
      'Positive affirmations',
      'Journaling prompts',
      'Confidence building activities'
    ]
  },
  trauma: {
    id: 'trauma',
    name: 'Trauma & Healing',
    description: 'A gentle space for trauma survivors to share, heal, and support each other.',
    icon: '🦋',
    color: 'teal',
    gradient: 'from-teal-400 to-teal-600',
    keywords: ['healing', 'recovery', 'resilience', 'safety', 'empowerment'],
    sessionPrompts: [
      'What does feeling safe mean to you?',
      'Share a small step you\'ve taken in healing.',
      'How do you practice self-care on difficult days?',
      'What strength have you discovered in yourself?'
    ],
    supportingResources: [
      'Trauma-informed resources',
      'Grounding techniques',
      'Professional help finder',
      'Safety planning tools'
    ]
  },
  addiction: {
    id: 'addiction',
    name: 'Addiction & Recovery',
    description: 'Support for those in recovery or struggling with addictive behaviors.',
    icon: '🌟',
    color: 'orange',
    gradient: 'from-orange-400 to-orange-600',
    keywords: ['recovery', 'sobriety', 'habits', 'triggers', 'support'],
    sessionPrompts: [
      'What does recovery mean to you?',
      'Share a healthy coping strategy you\'ve developed.',
      'How do you handle difficult moments?',
      'What motivates you to keep going?'
    ],
    supportingResources: [
      'Recovery programs',
      'Sober activities',
      'Trigger management',
      'Support meeting finder'
    ]
  },
  workplace_burnout: {
    id: 'workplace_burnout',
    name: 'Workplace Burnout',
    description: 'Address work-related stress, burnout, and finding balance in your career.',
    icon: '💼',
    color: 'red',
    gradient: 'from-red-400 to-red-600',
    keywords: ['burnout', 'work-stress', 'career', 'balance', 'exhaustion'],
    sessionPrompts: [
      'What does work-life balance look like for you?',
      'How do you recognize burnout symptoms?',
      'Share a boundary you\'ve set at work.',
      'What brings you fulfillment in your career?'
    ],
    supportingResources: [
      'Burnout prevention tips',
      'Work boundary setting',
      'Career counseling resources',
      'Stress management at work'
    ]
  }
};

export const getTopicConfig = (topicId: MentalHealthTopic): TopicConfig => {
  return MENTAL_HEALTH_TOPICS[topicId] || MENTAL_HEALTH_TOPICS.anxiety;
};

export const getAllTopics = (): TopicConfig[] => {
  return Object.values(MENTAL_HEALTH_TOPICS);
};

export const getTopicsByKeyword = (keyword: string): TopicConfig[] => {
  return getAllTopics().filter(topic => 
    topic.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
    topic.name.toLowerCase().includes(keyword.toLowerCase()) ||
    topic.description.toLowerCase().includes(keyword.toLowerCase())
  );
}; 
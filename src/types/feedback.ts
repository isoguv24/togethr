export interface PostSessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  overallRating: number; // 1-5 scale: "How did this session make you feel?"
  helpfulnessRating: number; // 1-5 scale: "How helpful was the session?"
  moderatorRating: number; // 1-5 scale: "How effective was the AI moderator?"
  groupDynamicsRating: number; // 1-5 scale: "How supportive was the group?"
  textualFeedback?: string;
  wouldReturnToSameGroup: boolean;
  preferredSessionLength: number; // in minutes
  suggestedImprovements: string[];
  emotionalState: EmotionalState;
  submittedAt: Date;
}

export interface EmotionalState {
  before: EmotionalRating;
  after: EmotionalRating;
}

export interface EmotionalRating {
  anxiety: number; // 1-10 scale
  sadness: number; // 1-10 scale
  loneliness: number; // 1-10 scale
  hopefulness: number; // 1-10 scale
  supported: number; // 1-10 scale
  understood: number; // 1-10 scale
}

export interface AIGeneratedSummary {
  id: string;
  sessionId: string;
  keyThemes: SummaryTheme[];
  participationAnalysis: ParticipationAnalysis;
  emotionalJourney: EmotionalJourney;
  breakthroughMoments: BreakthroughMoment[];
  supportiveInteractions: SupportiveInteraction[];
  recommendations: PersonalizedRecommendation[];
  overallTone: SessionTone;
  generatedAt: Date;
  confidence: number; // 0-1, AI confidence in the analysis
}

export interface SummaryTheme {
  theme: string;
  frequency: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedMessages: string[]; // message IDs
}

export interface ParticipationAnalysis {
  totalParticipants: number;
  activeParticipants: number;
  quietParticipants: number;
  averageMessageLength: number;
  participationBalance: 'well_balanced' | 'dominated_by_few' | 'evenly_quiet';
  cameraUsage: number; // percentage
}

export interface EmotionalJourney {
  initialTone: SessionTone;
  finalTone: SessionTone;
  emotionalShifts: EmotionalShift[];
  overallProgression: 'positive' | 'negative' | 'stable' | 'mixed';
}

export interface EmotionalShift {
  timestamp: Date;
  fromTone: SessionTone;
  toTone: SessionTone;
  triggerEvent: string; // what caused the shift
}

export interface BreakthroughMoment {
  timestamp: Date;
  participantId: string;
  description: string;
  impact: 'minor' | 'moderate' | 'significant';
  relatedMessageId: string;
}

export interface SupportiveInteraction {
  supporterId: string;
  recipientId: string;
  messageId: string;
  supportType: SupportType;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface PersonalizedRecommendation {
  userId: string;
  category: RecommendationCategory;
  suggestion: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
}

export type SessionTone = 
  | 'hopeful'
  | 'supportive'
  | 'reflective'
  | 'challenging'
  | 'healing'
  | 'tense'
  | 'breakthrough'
  | 'contemplative';

export type SupportType = 
  | 'emotional_validation'
  | 'shared_experience'
  | 'practical_advice'
  | 'encouragement'
  | 'active_listening'
  | 'resource_sharing';

export type RecommendationCategory = 
  | 'session_participation'
  | 'communication_style'
  | 'self_care'
  | 'group_engagement'
  | 'personal_growth'
  | 'coping_strategies';

export interface FeedbackAnalytics {
  sessionId: string;
  averageRatings: {
    overall: number;
    helpfulness: number;
    moderator: number;
    groupDynamics: number;
  };
  emotionalImprovement: {
    averageImprovement: number;
    mostImproved: keyof EmotionalRating;
    leastImproved: keyof EmotionalRating;
  };
  satisfactionTrends: {
    returningUsers: number;
    newUsers: number;
    retentionRate: number;
  };
  commonThemes: string[];
  areasForImprovement: string[];
} 
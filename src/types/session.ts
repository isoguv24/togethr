import { User, MentalHealthTopic, SessionMode, AIModeratorPersona } from './user';

export interface Session {
  id: string;
  groupId: string;
  topic: MentalHealthTopic;
  participants: SessionParticipant[];
  moderator: AIModerator;
  status: SessionStatus;
  mode: SessionMode;
  scheduledStartTime: Date;
  actualStartTime?: Date;
  endTime?: Date;
  duration: number; // in minutes
  messages: ChatMessage[];
  summary?: SessionSummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionParticipant {
  userId: string;
  user: User;
  joinedAt: Date;
  leftAt?: Date;
  participantMode: ParticipantMode;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  avatar?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  xpEarned: number;
  messagesCount: number;
  cameraTimeMinutes: number;
}

export interface AIModerator {
  id: string;
  persona: AIModeratorPersona;
  name: string;
  avatar: string;
  promptingStyle: string;
  lastActivity: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'user' | 'ai_moderator';
  content: string;
  timestamp: Date;
  type: MessageType;
  reactions: MessageReaction[];
  xpAwarded?: number;
  isSupportive?: boolean; // AI-detected supportive message
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface SessionSummary {
  sessionId: string;
  keyThemes: string[];
  participationLevel: 'low' | 'medium' | 'high';
  overallTone: 'positive' | 'neutral' | 'challenging';
  aiInsights: string;
  participantFeedback: SessionFeedback[];
  generatedAt: Date;
}

export interface SessionFeedback {
  userId: string;
  rating: number; // 1-5 scale
  feedback?: string;
  helpfulnessRating: number; // 1-5 scale
  wouldRecommend: boolean;
  submittedAt: Date;
}

export interface Group {
  id: string;
  topic: MentalHealthTopic;
  participants: string[]; // user IDs
  createdAt: Date;
  maxParticipants: number;
  currentSessionId?: string;
  weeklySchedule: {
    dayOfWeek: number; // 0-6, Sunday is 0
    timeSlot: string; // "19:00"
  };
  isActive: boolean;
}

export interface MatchmakingQueue {
  userId: string;
  topic: MentalHealthTopic;
  preferredMode: SessionMode;
  joinedQueueAt: Date;
  estimatedWaitTime?: number; // in minutes
}

export type SessionStatus = 
  | 'scheduled' 
  | 'waiting_for_participants'
  | 'active' 
  | 'ended' 
  | 'cancelled';

export type ParticipantMode = 
  | 'observer' // just listening/reading
  | 'chat_participant' // actively chatting
  | 'video_participant' // using video
  | 'full_participant'; // chat + video

export type MessageType = 
  | 'text'
  | 'system' // automated messages
  | 'ai_prompt' // AI moderator messages
  | 'user_joined'
  | 'user_left'
  | 'session_started'
  | 'session_ended';

export interface WebRTCConnection {
  userId: string;
  peerId: string;
  isVideo: boolean;
  isAudio: boolean;
  connectionState: RTCPeerConnectionState;
  stream?: MediaStream;
}

export interface SessionStats {
  totalParticipants: number;
  averageParticipationTime: number;
  totalMessages: number;
  aiInterventions: number;
  cameraUsagePercentage: number;
  overallSatisfactionRating: number;
} 
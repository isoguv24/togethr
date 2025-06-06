'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { MentalHealthTopic } from '@/types/user';
import { ChatMessage } from '@/types/session';
import { 
  getPromptConfig, 
  getRandomExample, 
  getRandomSilenceBreaker, 
  getRandomEncouragement, 
  getRandomTransition,
  getCommunityPrompt,
  GENERAL_SAFETY_RESPONSES,
  RESPONSE_TIMING
} from '@/lib/moderator/prompts';

export interface CategoryAwareModeratorProps {
  category: MentalHealthTopic;
  incomingMessages: ChatMessage[];
  onModeratorMessage: (text: string) => void;
  userCount: number;
  mode?: 'therapy_session' | 'community_chat'; // New mode prop
  silenceDurationMs?: number;
  isActive?: boolean;
  sessionDurationMs?: number;
}

interface ModeratorState {
  lastMessageTime: number;
  lastAIMessageTime: number;
  consecutiveAIMessages: number;
  detectedDistress: boolean;
  participationLevel: 'low' | 'medium' | 'high';
  messageFrequency: number;
  silenceStreak: number;
}

export default function CategoryAwareModerator({
  category,
  incomingMessages,
  onModeratorMessage,
  userCount,
  mode = 'therapy_session',
  silenceDurationMs,
  isActive = true,
  sessionDurationMs = 0
}: CategoryAwareModeratorProps) {
  
  // Get timing configuration based on mode
  const timingConfig = mode === 'community_chat' 
    ? RESPONSE_TIMING.COMMUNITY_CHAT 
    : RESPONSE_TIMING.THERAPY_SESSION;
  
  const defaultSilenceDuration = silenceDurationMs || timingConfig.SILENCE_THRESHOLD_MS;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [moderatorState, setModeratorState] = useState<ModeratorState>({
    lastMessageTime: Date.now(),
    lastAIMessageTime: 0,
    consecutiveAIMessages: 0,
    detectedDistress: false,
    participationLevel: 'medium',
    messageFrequency: 0,
    silenceStreak: 0
  });

  const promptConfig = getPromptConfig(category);

  // Analyze message sentiment and detect distress
  const analyzeMessage = useCallback((message: ChatMessage): boolean => {
    const content = message.content.toLowerCase();
    const safetyKeywords = promptConfig.safetyKeywords;
    
    // Check for safety keywords
    const hasDistressKeywords = safetyKeywords.some(keyword => 
      content.includes(keyword.toLowerCase())
    );

    // Check for emotional intensity markers
    const intensityMarkers = [
      'really', 'extremely', 'totally', 'completely', 'absolutely',
      '!!!', '??', 'help', 'scared', 'terrified', 'overwhelmed'
    ];
    
    const hasIntensityMarkers = intensityMarkers.some(marker => 
      content.includes(marker.toLowerCase())
    );

    return hasDistressKeywords || hasIntensityMarkers;
  }, [promptConfig.safetyKeywords]);

  // Calculate participation level
  const calculateParticipationLevel = useCallback((): 'low' | 'medium' | 'high' => {
    const recentMessages = incomingMessages.slice(-10); // Last 10 messages
    const userMessages = recentMessages.filter(msg => msg.senderType === 'user');
    const uniqueUsers = new Set(userMessages.map(msg => msg.senderId)).size;
    
    const participationRatio = uniqueUsers / Math.max(userCount, 1);
    
    if (participationRatio >= 0.7) return 'high';
    if (participationRatio >= 0.4) return 'medium';
    return 'low';
  }, [incomingMessages, userCount]);

  // Generate contextual AI response
  const generateResponse = useCallback((context: 'silence' | 'regular' | 'distress' | 'encouragement' | 'transition'): string => {
    const participationLevel = calculateParticipationLevel();
    
    // Community chat mode uses more casual prompts
    if (mode === 'community_chat') {
      switch (context) {
        case 'silence':
          return getCommunityPrompt('silence');
        case 'regular':
          return getCommunityPrompt('check_in');
        case 'distress':
          const safetyResponse = GENERAL_SAFETY_RESPONSES[Math.floor(Math.random() * GENERAL_SAFETY_RESPONSES.length)];
          return safetyResponse;
        case 'encouragement':
          return getRandomEncouragement(category);
        case 'transition':
          return getCommunityPrompt('check_in');
        default:
          return getCommunityPrompt('check_in');
      }
    }
    
    // Therapy session mode uses structured prompts
    switch (context) {
      case 'silence':
        if (participationLevel === 'low') {
          return getRandomSilenceBreaker(category);
        } else {
          return getRandomExample(category);
        }
        
      case 'distress':
        const safetyResponse = GENERAL_SAFETY_RESPONSES[Math.floor(Math.random() * GENERAL_SAFETY_RESPONSES.length)];
        return safetyResponse;
        
      case 'encouragement':
        return getRandomEncouragement(category);
        
      case 'transition':
        return getRandomTransition(category);
        
      case 'regular':
      default:
        // Adapt based on session duration and participation
        if (sessionDurationMs < 5 * 60 * 1000) { // First 5 minutes
          return getRandomExample(category);
        } else if (participationLevel === 'low') {
          return getRandomSilenceBreaker(category);
        } else {
          return getRandomTransition(category);
        }
    }
  }, [category, mode, calculateParticipationLevel, sessionDurationMs]);

  // Send AI moderator message
  const sendModeratorMessage = useCallback((context: 'silence' | 'regular' | 'distress' | 'encouragement' | 'transition') => {
    if (!isActive) return;
    
    // Prevent too many consecutive AI messages
    if (moderatorState.consecutiveAIMessages >= timingConfig.MAX_CONSECUTIVE_AI_MESSAGES) {
      return;
    }

    const message = generateResponse(context);
    onModeratorMessage(message);
    
    setModeratorState(prev => ({
      ...prev,
      lastAIMessageTime: Date.now(),
      consecutiveAIMessages: prev.consecutiveAIMessages + 1
    }));
  }, [isActive, moderatorState.consecutiveAIMessages, generateResponse, onModeratorMessage]);

  // Handle silence detection
  const handleSilenceTimeout = useCallback(() => {
    const now = Date.now();
    const timeSinceLastMessage = now - moderatorState.lastMessageTime;
    
    if (timeSinceLastMessage >= defaultSilenceDuration) {
      setModeratorState(prev => ({
        ...prev,
        silenceStreak: prev.silenceStreak + 1
      }));
      
      sendModeratorMessage('silence');
    }
  }, [moderatorState.lastMessageTime, silenceDurationMs, sendModeratorMessage]);

  // Regular check-in interval
  const handleRegularInterval = useCallback(() => {
    if (!isActive) return;
    
    const now = Date.now();
    const timeSinceLastAI = now - moderatorState.lastAIMessageTime;
    
    // Only send regular messages if enough time has passed
    if (timeSinceLastAI >= timingConfig.REGULAR_INTERVAL_MS) {
      const participationLevel = calculateParticipationLevel();
      
      if (participationLevel === 'low') {
        sendModeratorMessage('regular');
      } else if (Math.random() < 0.3) { // 30% chance for active groups
        sendModeratorMessage('transition');
      }
    }
  }, [isActive, moderatorState.lastAIMessageTime, calculateParticipationLevel, sendModeratorMessage]);

  // Process new messages
  useEffect(() => {
    if (incomingMessages.length === 0) return;
    
    const latestMessage = incomingMessages[incomingMessages.length - 1];
    
    // Skip AI messages
    if (latestMessage.senderType === 'ai_moderator') return;
    
    const now = Date.now();
    const isDistressed = analyzeMessage(latestMessage);
    
    setModeratorState(prev => ({
      ...prev,
      lastMessageTime: now,
      consecutiveAIMessages: 0, // Reset consecutive count when user messages
      detectedDistress: isDistressed,
      participationLevel: calculateParticipationLevel()
    }));
    
    // Clear existing silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    // Handle distress response
    if (isDistressed) {
      setTimeout(() => {
        sendModeratorMessage('distress');
      }, timingConfig.DISTRESS_RESPONSE_MS);
    } else {
      // Occasionally provide encouragement for positive sharing
      if (Math.random() < 0.2) { // 20% chance
        setTimeout(() => {
          sendModeratorMessage('encouragement');
        }, 3000 + Math.random() * 2000); // 3-5 seconds delay
      }
    }
    
    // Set new silence timer
    silenceTimerRef.current = setTimeout(handleSilenceTimeout, defaultSilenceDuration);
    
  }, [incomingMessages, analyzeMessage, calculateParticipationLevel, handleSilenceTimeout, silenceDurationMs, sendModeratorMessage]);

  // Set up regular interval checking
  useEffect(() => {
    if (!isActive) return;
    
    intervalRef.current = setInterval(handleRegularInterval, timingConfig.REGULAR_INTERVAL_MS);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, handleRegularInterval]);

  // Initial welcome message
  useEffect(() => {
    if (isActive && incomingMessages.length === 0 && sessionDurationMs === 0) {
      // Send welcome message after a short delay
      setTimeout(() => {
        let welcomeMessage: string;
        
        if (mode === 'community_chat') {
          welcomeMessage = getCommunityPrompt('welcome');
        } else {
          welcomeMessage = `Welcome everyone! I'm here to facilitate our ${category} support session. This is a safe space where we can share and support each other. ${getRandomExample(category)}`;
        }
        
        onModeratorMessage(welcomeMessage);
      }, 2000);
    }
  }, [isActive, incomingMessages.length, sessionDurationMs, category, mode, onModeratorMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  // This component doesn't render anything - it's purely functional
  return null;
}

// Hook for easier integration
export const useCategoryAwareModerator = (props: CategoryAwareModeratorProps) => {
  return CategoryAwareModerator(props);
}; 
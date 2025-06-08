import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  sendMessage as sendMessageToDB,
  getMessages
} from '@/lib/supabase/queries';
import { 
  subscribeToRoomMessages,
  MessageWithUser
} from '@/lib/supabase/realtime';
import { MentalHealthTopic } from '@/types/user';

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  user: {
    nickname: string;
    avatar: string;
    level: number;
  };
  xpAwarded?: number;
  isSupportive?: boolean;
}

interface ChatState {
  // Current chat room state
  currentRoom: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  // Typing indicators
  typingUsers: string[];
  isTyping: boolean;

  // Message composition
  messageText: string;
  isSending: boolean;
}

interface ChatActions {
  // Room management
  joinRoom: (room: string) => Promise<void>;
  leaveRoom: () => void;
  
  // Message actions
  sendMessage: (content: string, userId: string) => Promise<void>;
  loadMessages: (room: string) => Promise<void>;
  
  // UI state
  setMessageText: (text: string) => void;
  setTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  
  // Cleanup
  cleanup: () => void;
}

export type ChatStore = ChatState & ChatActions;

// Transform Supabase message to app message format
const transformMessage = (msg: MessageWithUser): ChatMessage => ({
  id: msg.id,
  userId: msg.user_id,
  content: msg.content,
  timestamp: new Date(msg.created_at),
  user: {
    nickname: msg.users?.nickname || 'Anonymous',
    avatar: msg.users?.avatar || 'default',
    level: msg.users?.level || 1,
  },
  xpAwarded: msg.xp_awarded,
  isSupportive: msg.is_supportive,
});

let roomSubscription: any = null;

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      currentRoom: null,
      messages: [],
      isLoading: false,
      isConnected: false,
      error: null,
      typingUsers: [],
      isTyping: false,
      messageText: '',
      isSending: false,

      // Room Management
      joinRoom: async (room: string) => {
        const { leaveRoom } = get();
        
        // Leave current room if any
        if (get().currentRoom) {
          leaveRoom();
        }

        set({ 
          currentRoom: room, 
          isLoading: true, 
          error: null,
          messages: [] 
        });

        try {
          // Load existing messages
          await get().loadMessages(room);

          // Set up real-time subscription
          roomSubscription = subscribeToRoomMessages(
            room,
            (newMessage) => {
              const transformedMessage = transformMessage(newMessage);
              
              set((state) => ({
                messages: [...state.messages, transformedMessage]
              }));

              console.log(`📨 New message in ${room}:`, transformedMessage);
            },
            (error) => {
              console.error('❌ Real-time subscription error:', error);
              set({ error: error.message, isConnected: false });
            }
          );

          set({ isConnected: true, isLoading: false });
          console.log(`✅ Joined room: ${room}`);
        } catch (error: any) {
          console.error('❌ Failed to join room:', error);
          set({ 
            error: error.message || 'Failed to join chat room',
            isLoading: false,
            isConnected: false
          });
        }
      },

      leaveRoom: () => {
        const { currentRoom } = get();
        
        if (roomSubscription) {
          roomSubscription.unsubscribe();
          roomSubscription = null;
        }

        set({
          currentRoom: null,
          messages: [],
          isConnected: false,
          messageText: '',
          typingUsers: [],
          isTyping: false,
          error: null
        });

        if (currentRoom) {
          console.log(`👋 Left room: ${currentRoom}`);
        }
      },

      // Message Actions
      sendMessage: async (content: string, userId: string) => {
        const { currentRoom } = get();
        if (!currentRoom || !content.trim()) return;

        set({ isSending: true, error: null });

        try {
          const message = await sendMessageToDB(
            userId,
            currentRoom,
            content.trim()
          );

          if (!message) {
            throw new Error('Failed to send message');
          }

          // Clear message text
          set({ messageText: '', isSending: false });
          
          console.log('✅ Message sent successfully');
        } catch (error: any) {
          console.error('❌ Failed to send message:', error);
          set({ 
            error: error.message || 'Failed to send message',
            isSending: false 
          });
        }
      },

      loadMessages: async (room: string) => {
        try {
          const messages = await getMessages(room, 50);
          const transformedMessages = messages.map(transformMessage);
          
          set({ 
            messages: transformedMessages,
            isLoading: false 
          });

          console.log(`📜 Loaded ${transformedMessages.length} messages for room: ${room}`);
        } catch (error: any) {
          console.error('❌ Failed to load messages:', error);
          set({ 
            error: error.message || 'Failed to load messages',
            isLoading: false 
          });
        }
      },

      // UI State Management
      setMessageText: (messageText: string) => set({ messageText }),
      
      setTyping: (isTyping: boolean) => set({ isTyping }),

      setError: (error: string | null) => set({ error }),

      // Cleanup
      cleanup: () => {
        const { leaveRoom } = get();
        leaveRoom();
        console.log('🧹 Chat store cleanup completed');
      },
    }),
    { name: 'ChatStore' }
  )
);

// Helper function to get room name from topic
export const getRoomFromTopic = (topic: MentalHealthTopic): string => {
  return `community_${topic}`;
};

// Helper function to get topic display name
export const getTopicDisplayName = (topic: MentalHealthTopic): string => {
  const displayNames: Record<MentalHealthTopic, string> = {
    anxiety: 'Anxiety Support',
    depression: 'Depression Support',
    loneliness: 'Loneliness & Connection',
    grief: 'Grief & Loss',
    stress: 'Stress Management',
    relationships: 'Relationships',
    self_esteem: 'Self-Esteem',
    trauma: 'Trauma Recovery',
    addiction: 'Addiction Recovery',
    workplace_burnout: 'Workplace Burnout'
  };
  
  return displayNames[topic] || topic;
}; 
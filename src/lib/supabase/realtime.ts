import { supabase } from './client';
import { Message, User } from './types';

export type MessageWithUser = Message & {
  users?: {
    nickname: string;
    avatar: string;
    level: number;
  };
};

/**
 * Subscribe to real-time messages for a specific chat room
 */
export function subscribeToRoomMessages(
  room: string,
  onNewMessage: (message: MessageWithUser) => void,
  onError?: (error: Error) => void
) {
  const channel = supabase
    .channel(`room:${room}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room=eq.${room}`,
      },
      async (payload) => {
        try {
          // Fetch the complete message with user data
          const { data: messageWithUser, error } = await supabase
            .from('messages')
            .select(`
              *,
              users (
                nickname,
                avatar,
                level
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (error) {
            onError?.(new Error(`Failed to fetch message details: ${error.message}`));
            return;
          }

          onNewMessage(messageWithUser);
        } catch (error) {
          onError?.(error as Error);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to room: ${room}`);
      } else if (status === 'CHANNEL_ERROR') {
        const error = new Error(`Failed to subscribe to room: ${room}`);
        console.error('❌ Channel subscription error:', error);
        onError?.(error);
      }
    });

  return channel;
}

/**
 * Subscribe to user online status changes
 */
export function subscribeToUserStatus(
  onUserStatusChange: (user: User) => void,
  onError?: (error: Error) => void
) {
  const channel = supabase
    .channel('user-status')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: 'is_online=eq.true',
      },
      (payload) => {
        onUserStatusChange(payload.new as User);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: 'is_online=eq.false',
      },
      (payload) => {
        onUserStatusChange(payload.new as User);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Subscribed to user status changes');
      } else if (status === 'CHANNEL_ERROR') {
        const error = new Error('Failed to subscribe to user status changes');
        console.error('❌ User status subscription error:', error);
        onError?.(error);
      }
    });

  return channel;
}

/**
 * Subscribe to user badge awards
 */
export function subscribeToUserBadges(
  userId: string,
  onNewBadge: (badge: any) => void,
  onError?: (error: Error) => void
) {
  const channel = supabase
    .channel(`user-badges:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'badges',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewBadge(payload.new);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to badges for user: ${userId}`);
      } else if (status === 'CHANNEL_ERROR') {
        const error = new Error(`Failed to subscribe to badges for user: ${userId}`);
        console.error('❌ Badge subscription error:', error);
        onError?.(error);
      }
    });

  return channel;
}

/**
 * Subscribe to XP and level updates
 */
export function subscribeToUserProgress(
  userId: string,
  onProgressUpdate: (user: User) => void,
  onError?: (error: Error) => void
) {
  const channel = supabase
    .channel(`user-progress:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        const updatedUser = payload.new as User;
        // Only trigger on XP or level changes
        const oldUser = payload.old as User;
        if (updatedUser.xp !== oldUser.xp || updatedUser.level !== oldUser.level) {
          onProgressUpdate(updatedUser);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to progress for user: ${userId}`);
      } else if (status === 'CHANNEL_ERROR') {
        const error = new Error(`Failed to subscribe to progress for user: ${userId}`);
        console.error('❌ Progress subscription error:', error);
        onError?.(error);
      }
    });

  return channel;
}

/**
 * Clean up all subscriptions
 */
export function unsubscribeAll() {
  supabase.removeAllChannels();
  console.log('🧹 Cleaned up all real-time subscriptions');
}

/**
 * Get current active channel count for debugging
 */
export function getActiveChannelCount(): number {
  return supabase.getChannels().length;
} 
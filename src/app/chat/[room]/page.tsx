'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useChatStore, getTopicDisplayName } from '@/lib/store/chat';
import { useUserStore } from '@/lib/store/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Users, AlertCircle, Loader2 } from 'lucide-react';
import { MentalHealthTopic } from '@/types/user';

export default function ChatPage() {
  const params = useParams();
  const room = params.room as string;
  
  const { user, isAuthenticated } = useUserStore();
  const { 
    messages,
    messageText,
    isLoading,
    isConnected,
    isSending,
    error,
    joinRoom,
    leaveRoom,
    sendMessage,
    setMessageText
  } = useChatStore();

  const [isInitialized, setIsInitialized] = useState(false);

  // Extract topic from room name
  const topic = room?.replace('community_', '') as MentalHealthTopic;
  const displayName = topic ? getTopicDisplayName(topic) : 'Chat Room';

  useEffect(() => {
    if (isAuthenticated && user && room && !isInitialized) {
      joinRoom(room);
      setIsInitialized(true);
    }

    return () => {
      if (isInitialized) {
        leaveRoom();
        setIsInitialized(false);
      }
    };
  }, [isAuthenticated, user, room, joinRoom, leaveRoom, isInitialized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user?.id || isSending) return;
    
    await sendMessage(messageText, user.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-orange-500" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please log in to join the chat room.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {displayName}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Community support chat for {topic}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-4 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && !isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto mb-2 h-8 w-8" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage 
                          src={`/avatars/${message.user.avatar}.svg`} 
                          alt={message.user.nickname} 
                        />
                        <AvatarFallback>
                          {message.user.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.user.nickname}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Level {message.user.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm break-words">{message.content}</p>
                        {message.xpAwarded && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            +{message.xpAwarded} XP
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={!isConnected || isSending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!messageText.trim() || !isConnected || isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
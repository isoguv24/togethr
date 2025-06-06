'use client';

import { useState, useRef, useEffect } from 'react';
import { useTogethrStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CategoryAwareModerator from '@/components/moderator/category-aware-moderator';
import { getTopicConfig } from '@/data/topics';
import { 
  Send, 
  Users, 
  ArrowLeft,
  Heart,
  MessageCircle,
  Globe,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommunityChat() {
  const [message, setMessage] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    user,
    messages,
    sendMessage,
    addMessage,
    setCurrentView
  } = useTogethrStore();

  // Mock community data - bu gerçek uygulamada API'den gelecek
  const communities = [
    { 
      id: 'anxiety-support', 
      topic: 'anxiety', 
      name: 'Anxiety Support', 
      memberCount: 1247, 
      activeNow: 23,
      lastActivity: '2 minutes ago',
      description: 'A safe space to discuss anxiety, share coping strategies, and support each other.'
    },
    { 
      id: 'depression-warriors', 
      topic: 'depression', 
      name: 'Depression Warriors', 
      memberCount: 892, 
      activeNow: 15,
      lastActivity: '5 minutes ago',
      description: 'Finding strength together through the challenges of depression.'
    },
    { 
      id: 'loneliness-connection', 
      topic: 'loneliness', 
      name: 'Connection Circle', 
      memberCount: 567, 
      activeNow: 8,
      lastActivity: '1 hour ago',
      description: 'Building meaningful connections and combating loneliness together.'
    },
    { 
      id: 'self-love-journey', 
      topic: 'self_esteem', 
      name: 'Self-Love Journey', 
      memberCount: 734, 
      activeNow: 12,
      lastActivity: '10 minutes ago',
      description: 'Learning to love ourselves and build healthy self-esteem.'
    }
  ];

  const currentCommunity = communities.find(c => c.id === selectedCommunity);
  const topicConfig = currentCommunity ? getTopicConfig(currentCommunity.topic as any) : null;

  // Mock messages for community - gerçek uygulamada WebSocket ile gelecek
  const communityMessages = selectedCommunity ? [
    {
      id: 'msg1',
      sessionId: selectedCommunity,
      senderId: 'user1',
      senderType: 'user' as const,
      content: "Having a rough day today. Anyone else feeling overwhelmed?",
      timestamp: new Date(Date.now() - 3600000),
      type: 'text' as const,
      reactions: []
    },
    {
      id: 'msg2', 
      sessionId: selectedCommunity,
      senderId: 'user2',
      senderType: 'user' as const,
      content: "I hear you. Some days are just harder than others. What usually helps you feel better?",
      timestamp: new Date(Date.now() - 3000000),
      type: 'text' as const,
      reactions: []
    },
    {
      id: 'ai_msg1',
      sessionId: selectedCommunity,
      senderId: 'ai_moderator',
      senderType: 'ai_moderator' as const,
      content: "The community has been quiet lately. How is everyone doing?",
      timestamp: new Date(Date.now() - 1800000),
      type: 'ai_prompt' as const,
      reactions: []
    }
  ] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [communityMessages]);

  // Handle AI moderator messages for community
  const handleModeratorMessage = (content: string) => {
    if (!selectedCommunity || !user) return;
    
    const moderatorMessage = {
      id: `ai_${Date.now()}`,
      sessionId: selectedCommunity,
      senderId: 'ai_moderator',
      senderType: 'ai_moderator' as const,
      content,
      timestamp: new Date(),
      type: 'ai_prompt' as const,
      reactions: []
    };
    
    addMessage(moderatorMessage);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedCommunity) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedCommunity) {
    // Community List View
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('dashboard')}
              className="absolute top-8 left-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Support</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join always-active support communities. Connect with others who understand your journey, 
              share experiences, and find support whenever you need it.
            </p>
          </div>

          {/* Communities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {communities.map((community) => {
              const config = getTopicConfig(community.topic as any);
              return (
                <Card 
                  key={community.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setSelectedCommunity(community.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${community.activeNow > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <div className="text-3xl">{config.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{community.name}</CardTitle>
                          <p className="text-sm text-gray-600">{config.name}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-sm">{community.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{community.memberCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{community.activeNow} online</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{community.lastActivity}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Community
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Always Active</h3>
                <p className="text-gray-600 text-sm">24/7 support from your community</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Safe & Supportive</h3>
                <p className="text-gray-600 text-sm">AI-moderated for a positive environment</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Find Your Tribe</h3>
                <p className="text-gray-600 text-sm">Connect with people who understand</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Community Chat View
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* CategoryAwareModerator for community chat */}
      {currentCommunity && user && (
        <CategoryAwareModerator
          category={currentCommunity.topic as any}
          incomingMessages={communityMessages}
          onModeratorMessage={handleModeratorMessage}
          userCount={currentCommunity.activeNow}
          mode="community_chat"
          isActive={true}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedCommunity(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{topicConfig?.icon}</div>
              <div>
                <h1 className="font-semibold text-gray-900">{currentCommunity?.name}</h1>
                <p className="text-sm text-gray-600">
                  {currentCommunity?.activeNow} online • {currentCommunity?.memberCount} members
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Community Chat</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {communityMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex space-x-3",
              msg.senderType === 'ai_moderator' && "bg-blue-50 -mx-4 px-4 py-3 rounded-lg"
            )}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              {msg.senderType === 'ai_moderator' ? (
                <AvatarImage src="/avatars/ai-sage.svg" alt="AI Moderator" />
              ) : (
                <AvatarImage src="/avatars/calm-fox.svg" alt="User avatar" />
              )}
              <AvatarFallback>
                {msg.senderType === 'ai_moderator' ? 'AI' : 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {msg.senderType === 'ai_moderator' 
                    ? 'AI Moderator'
                    : `Anonymous${msg.senderId.slice(-2)}`
                  }
                </span>
                {msg.senderType === 'ai_moderator' && (
                  <Badge variant="secondary" className="text-xs">AI Moderator</Badge>
                )}
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-3 max-w-7xl mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share with the community..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 
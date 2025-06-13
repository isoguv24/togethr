'use client';

import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Users,
  Send,
  Shield,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

const COMMUNITIES = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    description: 'A supportive space for those dealing with anxiety and related challenges.',
    icon: '🌙',
    memberCount: 234
  },
  {
    id: 'depression',
    name: 'Depression Support', 
    description: 'Connect with others navigating depression and find encouragement.',
    icon: '🌻',
    memberCount: 189
  },
  {
    id: 'stress',
    name: 'Stress Management',
    description: 'Share strategies and support for managing daily stress.',
    icon: '🧘',
    memberCount: 156
  },
  {
    id: 'relationships',
    name: 'Relationship Support',
    description: 'Navigate relationship challenges with understanding peers.',
    icon: '💝',
    memberCount: 98
  },
  {
    id: 'self-care',
    name: 'Self-Care Circle',
    description: 'Discover and share self-care practices that work.',
    icon: '🌸',
    memberCount: 167
  }
];

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  isSystem?: boolean;
}

export default function CommunityChat() {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useUserStore();
  const { 
    setCurrentView, 
    addNotification, 
    sendCommunityMessage, 
    communityMessages, 
    setCommunityMessages 
  } = useAppStore();

  const messages = selectedCommunity ? (communityMessages[selectedCommunity] || []) : [];

  // Load demo messages when community is selected
  useEffect(() => {
    if (selectedCommunity && messages.length === 0) {
      const demoMessages: Message[] = [
        {
          id: 'demo-1',
          text: 'Welcome to our community! This is a safe space to share and support each other.',
          timestamp: new Date(Date.now() - 60000),
          sender: {
            id: 'demo-user-1',
            name: 'CommunityBot',
            avatar: '/avatars/wise-owl.svg'
          },
          isSystem: true
        },
        {
          id: 'demo-2', 
          text: 'Hi everyone! Looking forward to connecting with you all.',
          timestamp: new Date(Date.now() - 30000),
          sender: {
            id: 'demo-user-2',
            name: 'HopefulSoul',
            avatar: '/avatars/hopeful-butterfly.svg'
          }
        }
      ];
      setCommunityMessages(selectedCommunity, demoMessages);
    }
  }, [selectedCommunity, messages.length, setCommunityMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedCommunity) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      console.log(`📤 Sending community message to ${selectedCommunity}:`, messageContent);
      
      await sendCommunityMessage(selectedCommunity, messageContent, {
        id: user.id,
        name: user.nickname,
        avatar_id: user.avatar.id
      });
      
      console.log('✅ Community message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send community message:', error);
      addNotification({
        type: 'error',
        title: 'Message Failed',
        message: 'Failed to send your message. Please try again.'
      });
      setNewMessage(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedCommunityData = COMMUNITIES.find(c => c.id === selectedCommunity);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access community chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
                          <div className="flex items-center space-x-2">
                <div className="h-6 w-6 relative">
                  <Image 
                    src="/unmute-logo-light.svg" 
                    alt="unmute logo" 
                    width={24} 
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">unmute Communities</span>
              </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCommunity ? (
          // Community List
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Community Support</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect with others who understand your journey. Join supportive communities 
                where you can share experiences and find encouragement.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMUNITIES.map((community) => (
                <Card 
                  key={community.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                  onClick={() => setSelectedCommunity(community.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{community.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{community.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{community.memberCount} members</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{community.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Guidelines */}
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Community Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">✨ Be Kind & Supportive</h4>
                    <p className="text-gray-600">Treat everyone with respect and empathy</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🔒 Respect Privacy</h4>
                    <p className="text-gray-600">Don't share personal information</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🛡️ Stay Safe</h4>
                    <p className="text-gray-600">Report inappropriate behavior</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">💬 Share Thoughtfully</h4>
                    <p className="text-gray-600">Keep conversations helpful and positive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Chat Interface
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCommunity(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Communities
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{selectedCommunityData?.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCommunityData?.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{selectedCommunityData?.memberCount} members</span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="h-96 flex flex-col">
              {/* Messages Area */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.isSystem ? 'justify-center' : ''
                        }`}
                      >
                        {!message.isSystem && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`flex-1 ${message.isSystem ? 'text-center' : ''}`}>
                          {!message.isSystem && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {message.sender.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(() => {
                                  try {
                                    const timestamp = message.timestamp instanceof Date 
                                      ? message.timestamp 
                                      : new Date(message.timestamp);
                                    return timestamp.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    });
                                  } catch (error) {
                                    console.warn('Invalid timestamp:', message.timestamp);
                                    return new Date().toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    });
                                  }
                                })()}
                              </span>
                            </div>
                          )}
                          
                          <div className={`${
                            message.isSystem 
                              ? 'inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'
                              : 'bg-white p-3 rounded-lg border shadow-sm text-gray-900'
                          }`}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedCommunityData?.name}...`}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Remember to be kind and supportive to fellow community members
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 
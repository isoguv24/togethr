'use client';

import { useState, useRef, useEffect } from 'react';
import { useTogethrStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Send, 
  Users, 
  Clock,
  LogOut,
  Settings,
  Heart,
  MessageCircle,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SessionView() {
  const [message, setMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  const { 
    currentSession,
    user,
    messages,
    participants,
    isVideoEnabled,
    isAudioEnabled,
    sendMessage,
    leaveSession,
    toggleVideo,
    toggleAudio
  } = useTogethrStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle local video stream
  useEffect(() => {
    if (isVideoEnabled && localVideoRef.current) {
      const stream = (window as any).localVideoStream;
      if (stream && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(console.error);
      }
    }
  }, [isVideoEnabled]);

  // Simulate AI moderator messages
  useEffect(() => {
    if (currentSession && messages.length === 0) {
      // Welcome message from AI moderator
      setTimeout(() => {
        const welcomeMessage = {
          id: `ai_${Date.now()}`,
          sessionId: currentSession.id,
          senderId: currentSession.moderator.id,
          senderType: 'ai_moderator' as const,
          content: `Welcome everyone! I'm ${currentSession.moderator.name}, your AI moderator for today's session. This is a safe space where we can share and support each other. Would anyone like to start by sharing how they're feeling today?`,
          timestamp: new Date(),
          type: 'ai_prompt' as const,
          reactions: []
        };
        useTogethrStore.getState().addMessage(welcomeMessage);
      }, 2000);
    }
  }, [currentSession, messages.length]);

  if (!currentSession || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      
      // Simulate AI response after user message
      setTimeout(() => {
        const responses = [
          "Thank you for sharing that. Can others relate to this experience?",
          "That sounds really challenging. How are you coping with that?",
          "I appreciate your openness. What support would be most helpful right now?",
          "That's a valuable insight. How has this affected your daily life?",
          "Thank you for being vulnerable with us. What would you want others to know about this?"
        ];
        
        const aiResponse = {
          id: `ai_${Date.now()}`,
          sessionId: currentSession.id,
          senderId: currentSession.moderator.id,
          senderType: 'ai_moderator' as const,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'ai_prompt' as const,
          reactions: []
        };
        
        useTogethrStore.getState().addMessage(aiResponse);
      }, 3000 + Math.random() * 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const mockParticipants = [
    { id: user.id, nickname: user.nickname, avatar: user.avatar, isCurrentUser: true, cameraOn: isVideoEnabled, micOn: isAudioEnabled },
    { id: 'user2', nickname: 'QuietStrength', avatar: { imageUrl: '/avatars/shy-turtle.svg', name: 'Shy Turtle' }, isCurrentUser: false, cameraOn: false, micOn: true },
    { id: 'user3', nickname: 'HopefulJourney', avatar: { imageUrl: '/avatars/hopeful-butterfly.svg', name: 'Hopeful Butterfly' }, isCurrentUser: false, cameraOn: true, micOn: true },
    { id: 'user4', nickname: 'CalmWaters', avatar: { imageUrl: '/avatars/wise-owl.svg', name: 'Wise Owl' }, isCurrentUser: false, cameraOn: false, micOn: true }
  ];

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Heart className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="font-semibold text-gray-900">
                {currentSession.topic.charAt(0).toUpperCase() + currentSession.topic.slice(1)} Support Group
              </h1>
              <p className="text-sm text-gray-600">
                Moderated by {currentSession.moderator.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>45 min remaining</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{mockParticipants.length} participants</span>
            </div>
            <Button variant="outline" size="sm" onClick={leaveSession}>
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex space-x-3",
                  msg.senderType === 'ai_moderator' && "bg-blue-50 -mx-4 px-4 py-3 rounded-lg"
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {msg.senderType === 'ai_moderator' ? (
                    <AvatarImage src={currentSession.moderator.avatar} alt={currentSession.moderator.name} />
                  ) : (
                    <AvatarImage 
                      src={mockParticipants.find(p => p.id === msg.senderId)?.avatar.imageUrl} 
                      alt="User avatar" 
                    />
                  )}
                  <AvatarFallback>
                    {msg.senderType === 'ai_moderator' ? 'AI' : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {msg.senderType === 'ai_moderator' 
                        ? currentSession.moderator.name
                        : mockParticipants.find(p => p.id === msg.senderId)?.nickname || 'Unknown'
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
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Video Controls */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Your Controls</h3>
            <div className="flex space-x-2">
              <Button
                variant={isVideoEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleVideo}
                className="flex-1"
              >
                {isVideoEnabled ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
                {isVideoEnabled ? 'Camera On' : 'Camera Off'}
              </Button>
              <Button
                variant={isAudioEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAudio}
                className="flex-1"
              >
                {isAudioEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                {isAudioEnabled ? 'Mic On' : 'Mic Off'}
              </Button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Participants</h3>
            <div className="grid grid-cols-2 gap-2">
              {mockParticipants.map((participant) => (
                <div key={participant.id} className="relative">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {participant.cameraOn ? (
                      participant.isCurrentUser ? (
                        <video 
                          ref={localVideoRef}
                          className="w-full h-full object-cover"
                          muted
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={participant.avatar.imageUrl} alt={participant.avatar.name} />
                            <AvatarFallback>{participant.nickname.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={participant.avatar.imageUrl} alt={participant.avatar.name} />
                          <AvatarFallback>{participant.nickname.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center justify-between">
                      <span className="truncate">{participant.nickname}</span>
                      <div className="flex space-x-1">
                        {!participant.micOn && <MicOff className="h-3 w-3" />}
                        {!participant.cameraOn && <VideoOff className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                  {participant.isCurrentUser && (
                    <div className="absolute top-1 right-1">
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="p-4 flex-1">
            <h3 className="font-medium text-gray-900 mb-3">Session Guidelines</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Respect everyone's privacy and experiences</p>
              <p>• Share only what feels comfortable</p>
              <p>• Listen actively and support others</p>
              <p>• Keep discussions confidential</p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">AI Moderator</h4>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentSession.moderator.avatar} alt={currentSession.moderator.name} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentSession.moderator.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{currentSession.moderator.persona.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
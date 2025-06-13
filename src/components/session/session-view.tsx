'use client';

import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Users, 
  MessageCircle, 
  Heart, 
  ArrowLeft,
  Smile,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Share,
  Settings,
  Maximize,
  Minimize,
  Monitor,
  MonitorSpeaker,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface SessionParticipant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role: 'participant' | 'moderator';
  isSpeaking?: boolean;
  isMuted?: boolean;
  hasVideo?: boolean;
  videoStream?: MediaStream;
}

export default function SessionView() {
  const [messageInput, setMessageInput] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get user from user store
  const { user } = useUserStore();
  
  // Get app state and actions from app store
  const { 
    currentSession, 
    sessionMessages, 
    setCurrentView, 
    addNotification,
    sendMessage,
    joinSession
  } = useAppStore();

  // Use WebRTC hook for video/audio management
  const {
    localStream,
    isVideoEnabled,
    isAudioEnabled,
    isMuted,
    devices,
    error: webrtcError,
    startVideo,
    stopVideo,
    toggleVideo,
    toggleAudio,
    toggleMute,
    switchCamera,
    shareScreen,
    stopScreenShare,
    selectVideoDevice,
    selectAudioDevice
  } = useWebRTC({ 
    roomId: currentSession?.id,
    isEnabled: true 
  });

  console.log('📺 SessionView: Rendering with user:', !!user, 'session:', !!currentSession);

  // Update local video element when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Show WebRTC errors as notifications
  useEffect(() => {
    if (webrtcError) {
      addNotification({
        type: 'error',
        title: 'Camera/Microphone Error',
        message: webrtcError
      });
    }
  }, [webrtcError, addNotification]);

  // Handle scroll for dynamic header - only for chat area
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const currentScrollY = chatContainerRef.current.scrollTop;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
          // Scrolling up or near top - show header
          setIsHeaderVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessionMessages]);

  useEffect(() => {
    console.log('🔄 SessionView: User state changed, user exists:', !!user);
    
    if (user && !currentSession) {
      console.log('📍 SessionView: User exists but no current session, attempting to join...');
      const mockSession = {
        id: 'demo-session-1',
        title: 'Anxiety Support Circle',
        type: 'group-chat' as const,
        topic: 'Managing Daily Anxiety',
        participantCount: 4,
        maxParticipants: 8,
        isActive: true,
        createdAt: new Date()
      };
      joinSession(mockSession);
    }
  }, [user, currentSession, joinSession]);

  // Cleanup streams when component unmounts
  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []); // Empty dependency array - only run on unmount

  if (!user) {
    console.log('⚠️ SessionView: No user found, rendering fallback');
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    console.log('⚠️ SessionView: No current session, rendering session selector');
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Join a Session</h2>
            <p className="text-gray-600 mb-6">
              Connect with others in a supportive environment
            </p>
            <Button onClick={() => setCurrentView('dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ SessionView: Rendering session interface');

  // Mock participants for demo
  const mockParticipants: SessionParticipant[] = [
    {
      id: 'current-user',
      name: user.nickname,
      avatar: user.avatar.imageUrl,
      isOnline: true,
      role: 'participant',
      isSpeaking: false,
      isMuted: isMuted,
      hasVideo: isVideoEnabled
    },
    {
      id: 'user-1',
      name: 'Sarah M.',
      avatar: '/avatars/gentle_bear.svg',
      isOnline: true,
      role: 'participant',
      isSpeaking: false,
      isMuted: false,
      hasVideo: true
    },
    {
      id: 'user-2', 
      name: 'Alex K.',
      avatar: '/avatars/serene_deer.svg',
      isOnline: true,
      role: 'participant',
      isSpeaking: true,
      isMuted: false,
      hasVideo: false
    },
    {
      id: 'ai-moderator',
      name: 'AI Companion',
      avatar: '/avatars/wise-owl.svg',
      isOnline: true,
      role: 'moderator',
      isSpeaking: false,
      isMuted: false,
      hasVideo: false
    }
  ];

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput.trim());
      setMessageInput('');
      
      console.log('✅ SessionView: Message sent successfully');
    } catch (error) {
      console.error('❌ SessionView: Failed to send message:', error);
      addNotification({
        type: 'error',
        title: 'Message Failed',
        message: 'Could not send your message. Please try again.'
      });
    }
  };

  const handleLeaveSession = () => {
    // Stop video stream before leaving
    stopVideo();
    
    addNotification({
      type: 'info',
      title: 'Session Left',
      message: 'You have left the session. Take care!'
    });
    setCurrentView('dashboard');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleVideo = async () => {
    try {
      await toggleVideo();
      addNotification({
        type: 'success',
        title: isVideoEnabled ? 'Camera Stopped' : 'Camera Started',
        message: isVideoEnabled ? 'Your camera is now off' : 'Your camera is now active'
      });
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const handleShareScreen = async () => {
    try {
      await shareScreen();
      addNotification({
        type: 'success',
        title: 'Screen Sharing',
        message: 'You are now sharing your screen'
      });
    } catch (error) {
      console.error('Failed to share screen:', error);
    }
  };

  const handleSwitchCamera = async () => {
    try {
      await switchCamera();
      addNotification({
        type: 'success',
        title: 'Camera Switched',
        message: 'Camera facing direction changed'
      });
    } catch (error) {
      console.error('Failed to switch camera:', error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Dynamic Header - Fixed at top */}
      <header className={`
        bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 
        transition-transform duration-300 ease-in-out absolute top-0 left-0 right-0 z-50 shadow-sm
        ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeaveSession}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Leave Session
            </Button>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{currentSession.title}</h1>
              <p className="text-sm text-gray-600">{currentSession.topic}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{mockParticipants.length} participants</span>
            </Badge>

            {/* Audio/Video Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={isMuted ? "destructive" : "default"}
                size="sm"
                onClick={toggleMute}
                className="h-8 w-8 p-0 transition-all"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                variant={isVideoEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleToggleVideo}
                className="h-8 w-8 p-0 transition-all"
              >
                {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>

              <Button
                variant={isAudioEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAudio}
                className="h-8 w-8 p-0 transition-all"
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              {/* Advanced Controls Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleSwitchCamera}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Switch Camera
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareScreen}>
                    <Monitor className="h-4 w-4 mr-2" />
                    Share Screen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={stopScreenShare}>
                    <MonitorSpeaker className="h-4 w-4 mr-2" />
                    Stop Screen Share
                  </DropdownMenuItem>
                  {devices.videoDevices.length > 1 && (
                    <>
                      {devices.videoDevices.map((device) => (
                        <DropdownMenuItem 
                          key={device.deviceId} 
                          onClick={() => selectVideoDevice(device.deviceId)}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  {devices.audioDevices.length > 1 && (
                    <>
                      {devices.audioDevices.map((device) => (
                        <DropdownMenuItem 
                          key={device.deviceId} 
                          onClick={() => selectAudioDevice(device.deviceId)}
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Video Grid - Resizable */}
        {isVideoEnabled && (
          <div className="w-80 bg-gradient-to-b from-gray-900/10 to-gray-800/10 backdrop-blur-sm border-r border-gray-200/50 p-4 flex-shrink-0">
            <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto">
              {/* Local Video */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
                    You
                  </Badge>
                  {isMuted && <MicOff className="h-3 w-3 text-red-400" />}
                </div>
                <div className="absolute top-3 right-3 space-x-1 flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (localVideoRef.current?.requestFullscreen) {
                        localVideoRef.current.requestFullscreen();
                      }
                    }}
                    className="h-7 w-7 p-0 bg-black/30 hover:bg-black/50 text-white border-0"
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Other Participants */}
              {mockParticipants.filter(p => p.hasVideo && p.id !== 'current-user').map((participant) => (
                <div key={participant.id} className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Avatar className="h-16 w-16 ring-4 ring-white/20">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback className="text-2xl font-semibold">{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
                      {participant.name}
                    </Badge>
                    {participant.isMuted && <MicOff className="h-3 w-3 text-red-400" />}
                    {participant.isSpeaking && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {sessionMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.isSystem ? 'justify-center' : ''
                }`}
              >
                {!message.isSystem && (
                  <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm flex-shrink-0">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>
                      {message.sender.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex-1 min-w-0 ${message.isSystem ? 'text-center' : ''}`}>
                  {!message.isSystem && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {message.sender.name}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
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
                            console.warn('Invalid timestamp in session:', message.timestamp);
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
                      : 'bg-white p-3 rounded-lg border shadow-sm text-gray-900 max-w-lg break-words'
                  }`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts with the group..."
                  className="pr-12 bg-white/95 border-gray-200 focus:border-blue-400 transition-colors"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Remember to be kind and supportive to fellow participants
            </p>
          </div>
        </div>

        {/* Participants Sidebar - Always visible */}
        <div className="w-64 bg-white/95 backdrop-blur-sm border-l border-gray-200/50 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-200/50">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Participants ({mockParticipants.length})</span>
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
              {mockParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                    {participant.isSpeaking && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {participant.name}
                        {participant.id === 'current-user' && (
                          <span className="text-xs text-blue-600 ml-1">(You)</span>
                        )}
                      </p>
                      {participant.role === 'moderator' && (
                        <Badge variant="outline" className="text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-1">
                      {participant.isMuted && (
                        <MicOff className="h-3 w-3 text-gray-400" />
                      )}
                      {participant.hasVideo && (
                        <Camera className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="p-4 border-t border-gray-200/50 space-y-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Session Duration</span>
              <span className="font-medium">24:15</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Mode</span>
              <Badge variant="secondary">Group Chat</Badge>
            </div>

            {/* Video Status */}
            {isVideoEnabled && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Video</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              Session Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
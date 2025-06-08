'use client';

import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { getTopicConfig } from '@/data/topics';
import { getLevel } from '@/data/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Trophy, 
  Star, 
  Play, 
  Settings, 
  Heart,
  MessageCircle,
  Video,
  Zap,
  BarChart3,
  Brain,
  AlertTriangle,
  Shield
} from 'lucide-react';

export default function Dashboard() {
  // Get user from the new user store
  const { user, logout } = useUserStore();
  
  // Get UI state and actions from the app store
  const { 
    joinSession,
    setCurrentView
  } = useAppStore();

  console.log('📊 Dashboard: user from store:', user);
  console.log('📊 Dashboard: user properties check:', {
    mentalHealthTopic: user?.mentalHealthTopic,
    xp: user?.xp,
    totalSessionsAttended: user?.totalSessionsAttended,
    streakCount: user?.streakCount,
    badges: user?.badges?.length,
    avatar: user?.avatar,
    nickname: user?.nickname,
    preferredSessionMode: user?.preferredSessionMode
  });
  console.log('📊 Dashboard: store methods available:', {
    joinSession: !!joinSession,
    logout: !!logout,
    setCurrentView: !!setCurrentView
  });

  if (!user) {
    console.log('❌ Dashboard: No user found, returning null');
    return null;
  }

  console.log('✅ Dashboard: User found, proceeding with render');

  const topicConfig = getTopicConfig(user.mentalHealthTopic);
  const levelInfo = getLevel(user.xp);

  const handleJoinSession = () => {
    // Direkt session'a yönlendir - queue sistemini bypass et
    console.log('🚀 Dashboard: Joining session directly');
    
    const mockSession = {
      id: 'demo-session-1',
      title: `${topicConfig.name} Support Circle`,
      type: 'group-chat' as const,
      topic: `Managing ${topicConfig.name}`,
      participantCount: 4,
      maxParticipants: 8,
      isActive: true,
      createdAt: new Date()
    };

    joinSession(mockSession);
    setCurrentView('session');
  };

  const stats = [
    {
      label: 'Sessions Attended',
      value: user.totalSessionsAttended,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Current Streak',
      value: `${user.streakCount} weeks`,
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      label: 'Badges Earned',
      value: user.badges.length,
      icon: Trophy,
      color: 'text-purple-600'
    },
    {
      label: 'Total XP',
      value: user.xp,
      icon: Star,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar.imageUrl} alt={user.avatar.name} />
                    <AvatarFallback>{user.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome back, {user.nickname}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Ready to connect with your {topicConfig.name.toLowerCase()} support group?
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      Level {levelInfo.level} {levelInfo.title}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {user.xp} XP
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Support Banner */}
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900">Need immediate support?</h3>
                      <p className="text-sm text-red-700">Crisis resources and coping strategies are available 24/7</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setCurrentView('crisis')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Get Help Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Mood Check */}
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Brain className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Daily Mood Check</h3>
                      <p className="text-sm text-green-700">How are you feeling today? Take a moment to track your mood.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {['😰', '😔', '😐', '🙂', '😊'].map((emoji, index) => (
                        <button
                          key={index}
                          className="text-2xl hover:scale-110 transition-transform"
                          onClick={() => {
                            // Mood tracking logic here
                            console.log('Mood selected:', emoji);
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView('mood')}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Track Mood
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Join Session */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleJoinSession}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-blue-600">
                    <Video className="h-5 w-5" />
                    <span>Join Group Session</span>
                  </CardTitle>
                  <CardDescription>
                    Connect with others in your {topicConfig.name.toLowerCase()} support group
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">4 people currently waiting</p>
                      <p className="text-xs text-gray-500">Average wait: 2-3 minutes</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Join Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('community')}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <MessageCircle className="h-5 w-5" />
                    <span>Community Chat</span>
                  </CardTitle>
                  <CardDescription>
                    Join ongoing conversations and share experiences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">12 active conversations</p>
                      <p className="text-xs text-gray-500">Last message 2 min ago</p>
                    </div>
                    <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Badges */}
            {user.badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {user.badges.slice(0, 5).map((badge: any) => (
                      <div key={badge.id} className="flex-shrink-0 text-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium text-gray-900">{badge.name}</div>
                        <div className="text-xs text-gray-600">{badge.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Level {levelInfo.level}</span>
                    <span className="text-sm text-gray-600">{levelInfo.title}</span>
                  </div>
                  <Progress 
                    value={levelInfo.progress} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{Math.round(levelInfo.progress)}% to next level</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Focus */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Your Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{topicConfig.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{topicConfig.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">Today's Reflection</h5>
                    <p className="text-sm text-gray-600 italic">"{topicConfig.sessionPrompts?.[0] || 'Take a moment to reflect on your progress today.'}"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('feedback')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share Feedback
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('community')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Browse Resources
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('profile')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useTogethrStore } from '@/lib/store';
import { getTopicConfig } from '@/data/topics';
import { getLevel } from '@/data/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Clock, 
  Trophy, 
  Star, 
  Play, 
  Settings, 
  LogOut,
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
  const { 
    user, 
    isInQueue, 
    queuePosition, 
    estimatedWaitTime,
    joinQueue,
    leaveQueue,
    logout,
    setCurrentView
  } = useTogethrStore();

  if (!user) return null;

  const topicConfig = getTopicConfig(user.mentalHealthTopic);
  const levelInfo = getLevel(user.xp);

  const handleJoinSession = () => {
    if (isInQueue) {
      leaveQueue();
    } else {
      joinQueue(user.mentalHealthTopic, user.preferredSessionMode);
    }
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Togethr</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('profile')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

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
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Get Help Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Mood Check */}
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span>Daily Mood Check</span>
                </CardTitle>
                <CardDescription>
                  How are you feeling today? Take a moment to track your mood.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {['😢', '😔', '😐', '😊', '😄'].map((emoji, index) => (
                        <button 
                          key={index} 
                          className="text-2xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-white/50"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentView('mood')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Track Mood
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Join Session Card */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="text-2xl">{topicConfig.icon}</div>
                  <span>{topicConfig.name} Session</span>
                </CardTitle>
                <CardDescription>
                  {isInQueue 
                    ? `You're in the queue! Position ${queuePosition}, estimated wait: ${estimatedWaitTime} minutes`
                    : 'Join others who understand your journey in a supportive group session'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {user.preferredSessionMode === 'video_enabled' ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      <span className="capitalize">
                        {user.preferredSessionMode.replace('_', ' ')} Mode
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>~60 minutes</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleJoinSession}
                    size="lg"
                    className={isInQueue ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {isInQueue ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Leave Queue
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Join Session
                      </>
                    )}
                  </Button>
                </div>

                {isInQueue && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Finding your group...</span>
                      <span>{estimatedWaitTime} min remaining</span>
                    </div>
                    <Progress value={(5 - estimatedWaitTime) * 20} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Community Chat Card */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  <span>Community Support</span>
                </CardTitle>
                <CardDescription>
                  Join always-active support communities. Connect with others 24/7 who understand your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Always Active</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat & Support</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentView('community')}
                    size="lg"
                    variant="outline"
                    className="bg-white hover:bg-purple-50 border-purple-200"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Communities
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your journey highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.badges.length > 0 ? (
                    user.badges.slice(0, 3).map((badge, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{badge.name}</p>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                        </div>
                        <Badge variant="secondary">{badge.rarity}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Start attending sessions to earn your first badges!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Level {levelInfo.level}</span>
                    <span className="text-sm text-gray-600">{levelInfo.title}</span>
                  </div>
                  <Progress value={levelInfo.progress} className="w-full" />
                  <p className="text-xs text-gray-600">
                    {Math.round(levelInfo.progress)}% to next level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Topic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">{topicConfig.icon}</span>
                  <span className="text-lg">Your Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">{topicConfig.name}</h3>
                  <p className="text-sm text-gray-600">{topicConfig.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Today's Reflection</h4>
                    <p className="text-sm text-gray-600 italic">
                      "{topicConfig.sessionPrompts[0]}"
                    </p>
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
                  onClick={() => setCurrentView('community')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Community Support
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('profile')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Update Preferences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('feedback')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  View Past Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Support Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topicConfig.supportingResources.slice(0, 3).map((resource, index) => (
                    <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      • {resource}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
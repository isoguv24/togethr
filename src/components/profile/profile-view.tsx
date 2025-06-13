'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { getTopicConfig, getAllTopics } from '@/data/topics';
import { getLevel, getAllBadges } from '@/data/badges';
import { getAvatarsForLevel } from '@/data/avatars';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Settings, 
  Trophy, 
  Star, 
  ArrowLeft,
  Edit,
  Save,
  X
} from 'lucide-react';
import Image from 'next/image';

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');
  const [isSelectingTopic, setIsSelectingTopic] = useState(false);
  
  // Get user from the correct store
  const { user, updateUser } = useUserStore();
  
  // Get UI actions from the app store
  const { setCurrentView, addNotification } = useAppStore();

  console.log('👤 ProfileView: Rendering with user:', !!user, user?.id);

  if (!user) {
    console.log('⚠️ ProfileView: No user found, rendering fallback');
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  console.log('✅ ProfileView: User found, rendering profile interface');

  const topicConfig = getTopicConfig(user.mentalHealthTopic);
  const levelInfo = getLevel(user.xp);
  const availableAvatars = getAvatarsForLevel(10); // Show all avatars in profile
  const allBadges = getAllBadges();
  const allTopics = getAllTopics();

  const handleSaveNickname = () => {
    if (editedNickname.trim() && editedNickname !== user.nickname) {
      updateUser({ nickname: editedNickname.trim() });
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your nickname has been updated successfully.'
      });
    }
    setIsEditing(false);
  };

  const handleAvatarChange = (avatarId: string) => {
    const newAvatar = availableAvatars.find(a => a.id === avatarId);
    if (newAvatar) {
      updateUser({ 
        avatar: {
          id: newAvatar.id,
          name: newAvatar.name,
          imageUrl: newAvatar.imageUrl,
          isCustom: newAvatar.isCustom,
          unlockedAtLevel: newAvatar.unlockedAtLevel
        }
      });
      addNotification({
        type: 'success',
        title: 'Avatar Updated',
        message: `You're now using the ${newAvatar.name} avatar.`
      });
    }
  };

  const handleTopicChange = async (topicId: string) => {
    try {
      console.log('🎯 Changing topic to:', topicId);
      await updateUser({ mentalHealthTopic: topicId as any });
      addNotification({
        type: 'success',
        title: 'Focus Updated',
        message: 'Your support topic has been updated. You can join new groups with this topic.'
      });
    } catch (error: any) {
      console.error('❌ Failed to update topic:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        cause: error?.cause
      });
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error?.message || 'Failed to update your support topic. Please try again.'
      });
    }
  };

  const earnedBadges = user.badges;
  const availableBadges = allBadges.filter(badge => 
    !earnedBadges.some((earned: any) => earned.id === badge.id)
  );

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
                <span className="text-xl font-bold text-gray-900">unmute</span>
              </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account settings and view your progress</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar.imageUrl} alt={user.avatar.name} />
                        <AvatarFallback>{user.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={editedNickname}
                                onChange={(e) => setEditedNickname(e.target.value)}
                                className="max-w-xs"
                                placeholder="Enter nickname"
                              />
                              <Button size="sm" onClick={handleSaveNickname}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setIsEditing(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h2 className="text-2xl font-bold text-gray-900">{user.nickname}</h2>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditedNickname(user.nickname);
                                  setIsEditing(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">
                            Level {levelInfo.level} {levelInfo.title}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Member since {new Date(user.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Level Progress</span>
                        <span className="text-sm text-gray-600">{user.xp} XP</span>
                      </div>
                      <Progress value={levelInfo.progress} className="w-full" />
                      <p className="text-xs text-gray-600">
                        {Math.round(levelInfo.progress)}% to Level {levelInfo.level + 1}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Focus */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Focus</CardTitle>
                    <CardDescription>The mental health topic you're working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-3xl">{topicConfig.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{topicConfig.name}</h3>
                        <p className="text-sm text-gray-600">{topicConfig.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsSelectingTopic(true)}
                      >
                        Change Focus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Avatar</CardTitle>
                    <CardDescription>
                      Available avatars for Level {user.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {availableAvatars.map((avatar) => (
                        <div
                          key={avatar.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            user.avatar.id === avatar.id
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleAvatarChange(avatar.id)}
                        >
                          <Avatar className="w-12 h-12 mx-auto mb-2">
                            <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                            <AvatarFallback>{avatar.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <p className="text-xs text-center font-medium">{avatar.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sessions Attended</span>
                      <span className="font-medium">{user.totalSessionsAttended}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-medium">{user.streakCount} weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Badges Earned</span>
                      <span className="font-medium">{user.badges.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total XP</span>
                      <span className="font-medium">{user.xp}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Earned Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span>Earned Badges ({earnedBadges.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {earnedBadges.length > 0 ? (
                    <div className="space-y-4">
                      {earnedBadges.map((badge: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="text-2xl">{badge.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{badge.name}</h3>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Earned {badge.earnedAt.toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">{badge.rarity}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No badges earned yet. Keep participating to unlock achievements!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Badges</CardTitle>
                  <CardDescription>Badges you can work towards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {availableBadges.slice(0, 10).map((badge: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg opacity-75">
                        <div className="text-2xl grayscale">{badge.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{badge.name}</h3>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                        </div>
                        <Badge variant="outline">{badge.rarity}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Preferences</CardTitle>
                  <CardDescription>How you prefer to participate in sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 block">
                      Default Session Mode
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'chat_only', label: 'Chat Only', description: 'Text-based conversations' },
                        { value: 'video_enabled', label: 'Video Enabled', description: 'Camera and microphone' },
                        { value: 'mixed', label: 'Mixed Mode', description: 'Choose each time' }
                      ].map((mode) => (
                        <div
                          key={mode.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            user.preferredSessionMode === mode.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => updateUser({ preferredSessionMode: mode.value as any })}
                        >
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-sm text-gray-600">{mode.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Moderator Style</CardTitle>
                  <CardDescription>Choose your preferred moderation approach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { value: 'calm_listener', label: '🌱 Calm Listener', description: 'Gentle and quiet' },
                      { value: 'encouraging_coach', label: '🏆 Encouraging Coach', description: 'Motivating and supportive' },
                      { value: 'wise_sage', label: '🕵️ Wise Sage', description: 'Asks thoughtful questions' },
                      { value: 'gentle_guide', label: '⚖️ Gentle Guide', description: 'Structured approach' }
                    ].map((persona) => (
                      <div
                        key={persona.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          user.aiModeratorPreference === persona.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => updateUser({ aiModeratorPreference: persona.value as any })}
                      >
                        <div className="font-medium">{persona.label}</div>
                        <div className="text-sm text-gray-600">{persona.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total XP</p>
                      <p className="text-2xl font-bold text-gray-900">{user.xp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Level</p>
                      <p className="text-2xl font-bold text-gray-900">{levelInfo.level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{user.totalSessionsAttended}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Settings className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Streak</p>
                      <p className="text-2xl font-bold text-gray-900">{user.streakCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Your journey with unmute</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Account Created</span>
                    <span className="font-medium">{new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Last Active</span>
                      <span className="font-medium">{new Date(user.lastSeen).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Current Focus</span>
                    <Badge variant="secondary">{topicConfig.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Topic Selection Modal */}
      <Dialog open={isSelectingTopic} onOpenChange={setIsSelectingTopic}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Your Focus</DialogTitle>
            <DialogDescription>
              Select a new mental health topic to focus on. This will affect your session recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            {allTopics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                  user.mentalHealthTopic === topic.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={async () => {
                  await handleTopicChange(topic.id);
                  setIsSelectingTopic(false);
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">{topic.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{topic.description}</p>
                    {user.mentalHealthTopic === topic.id && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Current Focus
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
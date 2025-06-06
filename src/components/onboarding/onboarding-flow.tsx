'use client';

import { useState } from 'react';
import { useTogethrStore } from '@/lib/store';
import { MentalHealthTopic, SessionMode, AIModeratorPersona } from '@/types/user';
import { getAllTopics } from '@/data/topics';
import { getAvatarsForLevel, AvatarConfig } from '@/data/avatars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, Shield, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

type OnboardingStep = 'welcome' | 'nickname' | 'topic' | 'preferences' | 'avatar' | 'complete';

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    nickname: '',
    topic: null as MentalHealthTopic | null,
    sessionMode: 'chat_only' as SessionMode,
    aiModeratorPersona: 'calm_listener' as AIModeratorPersona,
    selectedAvatarId: 'calm_fox'
  });

  const { login, isLoading } = useTogethrStore();
  const topics = getAllTopics();
  const avatars = getAvatarsForLevel(12); // Show 12 avatars in onboarding

  const steps: OnboardingStep[] = ['welcome', 'nickname', 'topic', 'preferences', 'avatar', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    if (formData.nickname && formData.topic) {
      await login(formData.nickname, formData.topic, {
        sessionMode: formData.sessionMode,
        aiModeratorPersona: formData.aiModeratorPersona,
        selectedAvatarId: formData.selectedAvatarId
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'nickname':
        return formData.nickname.trim().length >= 2;
      case 'topic':
        return formData.topic !== null;
      default:
        return true;
    }
  };

  const renderWelcome = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Togethr</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A safe, anonymous space for group therapy sessions moderated by AI. 
          Connect with others who understand your journey.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Find Your Tribe</h3>
            <p className="text-sm text-gray-600">
              Connect with others facing similar challenges in supportive group sessions
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Safe & Anonymous</h3>
            <p className="text-sm text-gray-600">
              Share openly with complete anonymity and AI-powered safety moderation
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">AI-Guided Growth</h3>
            <p className="text-sm text-gray-600">
              Thoughtful AI moderators help facilitate meaningful conversations
            </p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleNext} size="lg" className="px-8">
        Get Started <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderNickname = () => (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Nickname</h2>
        <p className="text-gray-600">
          This is how others will see you in sessions. Keep it anonymous and comfortable.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Enter a nickname..."
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          className="text-center text-lg"
          maxLength={20}
        />
        <p className="text-sm text-gray-500 text-center">
          2-20 characters. No personal information needed.
        </p>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!canProceed()}
          className="flex-1"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderTopic = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">What brings you here?</h2>
        <p className="text-gray-600">
          Choose the topic that best matches what you'd like to work on. You can always change this later.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.topic === topic.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setFormData({ ...formData, topic: topic.id })}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{topic.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{topic.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!canProceed()}
          className="flex-1"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Customize Your Experience</h2>
        <p className="text-gray-600">
          Set your preferences for how you'd like to participate in sessions.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Mode</CardTitle>
            <CardDescription>How would you like to participate?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'chat_only', label: 'Chat Only', description: 'Text-based conversations only' },
              { value: 'video_enabled', label: 'Video Enabled', description: 'Join with camera and microphone' },
              { value: 'mixed', label: 'Mixed Mode', description: 'Choose each session' }
            ].map((mode) => (
              <div
                key={mode.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.sessionMode === mode.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setFormData({ ...formData, sessionMode: mode.value as SessionMode })}
              >
                <div className="font-medium">{mode.label}</div>
                <div className="text-sm text-gray-600">{mode.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Moderator Style</CardTitle>
            <CardDescription>Choose your preferred moderation approach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'calm_listener', label: '🌱 Calm Listener', description: 'Gentle and quiet, speaks when needed' },
              { value: 'reflective_thinker', label: '🕵️ Reflective Thinker', description: 'Asks thoughtful questions' },
              { value: 'balanced_guide', label: '⚖️ Balanced Guide', description: 'Structured and organized approach' }
            ].map((persona) => (
              <div
                key={persona.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.aiModeratorPersona === persona.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setFormData({ ...formData, aiModeratorPersona: persona.value as AIModeratorPersona })}
              >
                <div className="font-medium">{persona.label}</div>
                <div className="text-sm text-gray-600">{persona.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderAvatar = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Avatar</h2>
        <p className="text-gray-600">
          Select an avatar to represent you in sessions. You can change this anytime.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
        {avatars.map((avatar) => (
          <Card
            key={avatar.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.selectedAvatarId === avatar.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setFormData({ ...formData, selectedAvatarId: avatar.id })}
          >
            <CardContent className="p-3 text-center">
              <Avatar className="w-12 h-12 mx-auto mb-2">
                <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                <AvatarFallback>{avatar.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-xs">{avatar.name}</h3>
              <p className="text-xs text-gray-600 mt-1 leading-tight">{avatar.personality}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're All Set!</h2>
        <p className="text-gray-600">
          Welcome to Togethr, {formData.nickname}! You're ready to join your first group session.
        </p>
      </div>

      <Card className="text-left">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Nickname:</span>
            <span className="font-medium">{formData.nickname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Topic:</span>
            <Badge variant="secondary">
              {topics.find(t => t.id === formData.topic)?.name}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium capitalize">{formData.sessionMode.replace('_', ' ')}</span>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleComplete} 
        disabled={isLoading}
        size="lg" 
        className="w-full"
      >
        {isLoading ? 'Creating Account...' : 'Enter Togethr'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Progress Bar */}
      {currentStep !== 'welcome' && (
        <div className="w-full bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {currentStep === 'welcome' && renderWelcome()}
          {currentStep === 'nickname' && renderNickname()}
          {currentStep === 'topic' && renderTopic()}
          {currentStep === 'preferences' && renderPreferences()}
          {currentStep === 'avatar' && renderAvatar()}
          {currentStep === 'complete' && renderComplete()}
        </div>
      </div>
    </div>
  );
} 
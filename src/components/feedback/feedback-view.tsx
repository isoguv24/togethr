'use client';

import { useState } from 'react';
import { useTogethrStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Star, 
  MessageCircle, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Target
} from 'lucide-react';

export default function FeedbackView() {
  const [feedbackStep, setFeedbackStep] = useState<'rating' | 'details' | 'summary'>('rating');
  const [ratings, setRatings] = useState({
    overall: [3],
    helpfulness: [3],
    moderator: [3],
    groupDynamics: [3]
  });
  const [textFeedback, setTextFeedback] = useState('');
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);

  const { setCurrentView, awardXP, user } = useTogethrStore();

  const handleSubmitFeedback = () => {
    // Award XP for completing feedback
    awardXP(15, 'Completed session feedback');
    setFeedbackStep('summary');
  };

  const handleReturnToDashboard = () => {
    setCurrentView('dashboard');
  };

  const ratingLabels = {
    overall: 'How did this session make you feel?',
    helpfulness: 'How helpful was the session?',
    moderator: 'How effective was the AI moderator?',
    groupDynamics: 'How supportive was the group?'
  };

  const ratingDescriptions = {
    1: 'Not helpful',
    2: 'Slightly helpful',
    3: 'Moderately helpful',
    4: 'Very helpful',
    5: 'Extremely helpful'
  };

  const mockSummary = {
    keyThemes: [
      { theme: 'Coping strategies', frequency: 8, sentiment: 'positive' },
      { theme: 'Daily challenges', frequency: 6, sentiment: 'neutral' },
      { theme: 'Support systems', frequency: 5, sentiment: 'positive' },
      { theme: 'Self-care practices', frequency: 4, sentiment: 'positive' }
    ],
    participationAnalysis: {
      totalParticipants: 4,
      activeParticipants: 3,
      quietParticipants: 1,
      averageMessageLength: 45,
      participationBalance: 'well_balanced' as const,
      cameraUsage: 50
    },
    emotionalJourney: {
      initialTone: 'contemplative' as const,
      finalTone: 'hopeful' as const,
      overallProgression: 'positive' as const
    },
    breakthroughMoments: [
      {
        description: 'A participant shared a personal breakthrough about setting boundaries',
        impact: 'significant' as const,
        timestamp: new Date()
      }
    ],
    recommendations: [
      {
        category: 'self_care' as const,
        suggestion: 'Consider exploring mindfulness techniques discussed in today\'s session',
        reasoning: 'You showed interest in stress management strategies',
        priority: 'medium' as const
      },
      {
        category: 'session_participation' as const,
        suggestion: 'Try sharing more about your experiences - your insights are valuable',
        reasoning: 'Your contributions were well-received by the group',
        priority: 'low' as const
      }
    ]
  };

  if (feedbackStep === 'rating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Session Complete</h1>
            <p className="text-gray-600">
              Thank you for participating! Your feedback helps us improve the experience for everyone.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How was your session?</CardTitle>
              <CardDescription>
                Please rate your experience on a scale of 1-5
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(ratingLabels).map(([key, label]) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-900">{label}</label>
                    <Badge variant="secondary">
                      {ratings[key as keyof typeof ratings][0]}/5
                    </Badge>
                  </div>
                  <Slider
                    value={ratings[key as keyof typeof ratings]}
                    onValueChange={(value) => setRatings({ ...ratings, [key]: value })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Not helpful</span>
                    <span>Extremely helpful</span>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button onClick={() => setFeedbackStep('details')} className="w-full" size="lg">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (feedbackStep === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Additional Feedback</h2>
            <p className="text-gray-600">
              Help us understand your experience better (optional)
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  What did you find most helpful about today's session?
                </label>
                <Textarea
                  value={textFeedback}
                  onChange={(e) => setTextFeedback(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Would you return to this same group?
                </label>
                <div className="flex space-x-3">
                  <Button
                    variant={wouldReturn === true ? "default" : "outline"}
                    onClick={() => setWouldReturn(true)}
                    className="flex-1"
                  >
                    Yes, I'd return
                  </Button>
                  <Button
                    variant={wouldReturn === false ? "default" : "outline"}
                    onClick={() => setWouldReturn(false)}
                    className="flex-1"
                  >
                    I'd prefer a different group
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setFeedbackStep('rating')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleSubmitFeedback} className="flex-1">
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Summary</h1>
          <p className="text-gray-600">
            Here's what happened in today's session and personalized insights for your journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Themes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span>Key Themes Discussed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSummary.keyThemes.map((theme, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-gray-900">{theme.theme}</span>
                        <Badge 
                          variant={theme.sentiment === 'positive' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {theme.sentiment}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">{theme.frequency} mentions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Participation Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Group Dynamics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Participation Balance</span>
                        <span className="font-medium capitalize">
                          {mockSummary.participationAnalysis.participationBalance.replace('_', ' ')}
                        </span>
                      </div>
                      <Progress value={85} className="w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Camera Usage</span>
                        <span className="font-medium">{mockSummary.participationAnalysis.cameraUsage}%</span>
                      </div>
                      <Progress value={mockSummary.participationAnalysis.cameraUsage} className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Participants</span>
                      <span className="font-medium">{mockSummary.participationAnalysis.totalParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Participants</span>
                      <span className="font-medium">{mockSummary.participationAnalysis.activeParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Message Length</span>
                      <span className="font-medium">{mockSummary.participationAnalysis.averageMessageLength} chars</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Journey */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Emotional Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Session Started</p>
                    <Badge variant="secondary" className="capitalize">
                      {mockSummary.emotionalJourney.initialTone}
                    </Badge>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gradient-to-r from-purple-200 to-green-200 rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Session Ended</p>
                    <Badge variant="default" className="capitalize bg-green-600">
                      {mockSummary.emotionalJourney.finalTone}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Overall progression: <span className="font-medium capitalize text-green-600">
                    {mockSummary.emotionalJourney.overallProgression}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Breakthrough Moments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Breakthrough Moments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockSummary.breakthroughMoments.map((moment, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {moment.impact} impact
                    </Badge>
                    <p className="text-sm text-gray-700">{moment.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Personal Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                  <span>For You</span>
                </CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSummary.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {rec.category.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        variant={rec.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{rec.suggestion}</p>
                    <p className="text-xs text-gray-600">{rec.reasoning}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* XP Earned */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Session Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Session Attendance</span>
                    <Badge variant="secondary">+10 XP</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Messages Sent</span>
                    <Badge variant="secondary">+5 XP</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Feedback Completed</span>
                    <Badge variant="secondary">+15 XP</Badge>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Earned</span>
                    <Badge variant="default">+30 XP</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleReturnToDashboard} className="w-full" size="lg">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
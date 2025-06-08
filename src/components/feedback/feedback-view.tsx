'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Award,
  Target,
  Brain
} from 'lucide-react';

export default function FeedbackView() {
  const [sessionRating, setSessionRating] = useState<number>(0);
  const [moderatorRating, setModeratorRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get user from user store
  const { user, awardXP } = useUserStore();
  
  // Get UI actions from app store
  const { setCurrentView, addNotification } = useAppStore();

  console.log('📝 FeedbackView: Rendering with user:', !!user, user?.id);

  if (!user) {
    console.log('⚠️ FeedbackView: No user found, rendering fallback');
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  console.log('✅ FeedbackView: User found, rendering feedback form');

  const feedbackCategories = [
    'Helpful discussions',
    'Supportive community',
    'Good moderation',
    'Safe environment',
    'Relevant topics',
    'Clear communication',
    'Appropriate pace',
    'Inclusive atmosphere'
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmitFeedback = async () => {
    if (sessionRating === 0) {
      addNotification({
        type: 'warning',
        title: 'Rating Required',
        message: 'Please rate your session experience before submitting.'
      });
      return;
    }

    try {
      // Award XP for providing feedback
      await awardXP(5, 'Session feedback provided');

      addNotification({
        type: 'success',
        title: 'Feedback Submitted!',
        message: 'Thank you for helping us improve. You earned 5 XP!'
      });

      setIsSubmitted(true);

      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        setCurrentView('dashboard');
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to submit feedback. Please try again.'
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-4">
              Your feedback helps us create better experiences for everyone.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-medium">+5 XP Earned</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
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
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Session Feedback</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">How was your session?</h1>
          <p className="text-gray-600">Your feedback helps us improve the community experience for everyone</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feedback Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Session Experience</CardTitle>
                <CardDescription>How would you rate this session overall?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSessionRating(rating)}
                      className={`p-2 rounded-lg transition-colors ${
                        sessionRating >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>
                {sessionRating > 0 && (
                  <p className="text-sm text-gray-600">
                    {sessionRating === 1 && "We're sorry to hear that. We'll work to improve."}
                    {sessionRating === 2 && "Thank you for the feedback. We'll do better."}
                    {sessionRating === 3 && "Thanks for the feedback. How can we improve?"}
                    {sessionRating === 4 && "Great! We're glad you had a good experience."}
                    {sessionRating === 5 && "Wonderful! We're thrilled you loved it."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* AI Moderator Rating */}
            <Card>
              <CardHeader>
                <CardTitle>AI Moderator Performance</CardTitle>
                <CardDescription>How helpful was the AI moderator during your session?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant={moderatorRating === 1 ? "default" : "outline"}
                    onClick={() => setModeratorRating(1)}
                    className="flex items-center space-x-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful</span>
                  </Button>
                  <Button
                    variant={moderatorRating === 0 ? "default" : "outline"}
                    onClick={() => setModeratorRating(0)}
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Neutral</span>
                  </Button>
                  <Button
                    variant={moderatorRating === -1 ? "destructive" : "outline"}
                    onClick={() => setModeratorRating(-1)}
                    className="flex items-center space-x-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not Helpful</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Categories */}
            <Card>
              <CardHeader>
                <CardTitle>What made this session valuable?</CardTitle>
                <CardDescription>Select all that apply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feedbackCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Written Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Comments</CardTitle>
                <CardDescription>
                  Share any specific thoughts, suggestions, or concerns (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Your feedback helps us create better experiences..."
                  rows={6}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Session Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">45 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Participants</span>
                  <span className="font-medium">6 people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Topic</span>
                  <Badge variant="secondary">Anxiety Support</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mode</span>
                  <span className="font-medium">Chat Only</span>
                </div>
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Session Rating</span>
                    <span className="text-sm font-medium">
                      {sessionRating > 0 ? '✓' : '-'}
                    </span>
                  </div>
                  <Progress value={sessionRating > 0 ? 100 : 0} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categories</span>
                    <span className="text-sm font-medium">
                      {selectedCategories.length}/8
                    </span>
                  </div>
                  <Progress 
                    value={(selectedCategories.length / 8) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleSubmitFeedback}
                    className="w-full"
                    disabled={sessionRating === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reward Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Earn 5 XP for feedback
                    </p>
                    <p className="text-xs text-blue-700">
                      Help us improve and level up!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
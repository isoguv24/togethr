'use client';

import { useState, useEffect } from 'react';
import { useTogethrStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import MoodCalendar from './mood-calendar';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Heart,
  Brain,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Smile,
  Meh,
  Frown,
  Calendar,
  BarChart3,
  Target,
  Lightbulb,
  ArrowLeft,
  Home
} from 'lucide-react';

interface MoodEntry {
  id: string;
  date: Date;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  notes: string;
  activities: string[];
  triggers: string[];
}

export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState(5);
  const [currentEnergy, setCurrentEnergy] = useState(5);
  const [currentAnxiety, setCurrentAnxiety] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [view, setView] = useState<'tracker' | 'analytics' | 'calendar'>('tracker');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { 
    user, 
    addNotification, 
    setCurrentView, 
    saveMoodEntry, 
    getMoodEntry, 
    calculateMoodStats, 
    entries,
    currentStreak,
    longestStreak
  } = useTogethrStore();

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
    { value: 2, emoji: '😔', label: 'Sad', color: 'text-red-400' },
    { value: 3, emoji: '😕', label: 'Down', color: 'text-orange-400' },
    { value: 4, emoji: '😐', label: 'Neutral', color: 'text-yellow-400' },
    { value: 5, emoji: '🙂', label: 'Okay', color: 'text-yellow-300' },
    { value: 6, emoji: '😊', label: 'Good', color: 'text-green-400' },
    { value: 7, emoji: '😄', label: 'Happy', color: 'text-green-500' },
    { value: 8, emoji: '😁', label: 'Great', color: 'text-green-600' },
    { value: 9, emoji: '🤗', label: 'Excellent', color: 'text-blue-500' },
    { value: 10, emoji: '🌟', label: 'Amazing', color: 'text-purple-500' }
  ];

  const activities = [
    'Exercise', 'Meditation', 'Reading', 'Music', 'Nature Walk', 
    'Social Time', 'Creative Work', 'Sleep', 'Therapy Session', 
    'Journaling', 'Cooking', 'Gaming', 'Work', 'Study'
  ];

  const triggers = [
    'Work Stress', 'Social Anxiety', 'Family Issues', 'Health Concerns',
    'Financial Worry', 'Relationship Problems', 'Sleep Issues', 'News/Media',
    'Weather', 'Hormone Changes', 'Caffeine', 'Alcohol', 'Social Media'
  ];

  // Calculate real mood data
  const moodStats = calculateMoodStats();
  const realMoodData = {
    weeklyAverage: moodStats.weeklyAverage,
    monthlyAverage: moodStats.monthlyAverage,
    trend: moodStats.trend,
    currentStreak,
    longestStreak,
    totalEntries: entries.length,
    // Calculate most common activity and trigger
    topActivity: entries.length > 0 
      ? entries.flatMap(e => e.activities)
               .reduce((acc, activity) => {
                 acc[activity] = (acc[activity] || 0) + 1;
                 return acc;
               }, {} as Record<string, number>)
      : {},
    mainTrigger: entries.length > 0
      ? entries.flatMap(e => e.triggers)
               .reduce((acc, trigger) => {
                 acc[trigger] = (acc[trigger] || 0) + 1;
                 return acc;
               }, {} as Record<string, number>)
      : {}
  };

  const getMostCommon = (obj: Record<string, number>) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return 'None';
    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const getCurrentMoodEmoji = () => {
    return moodEmojis.find(m => m.value === currentMood) || moodEmojis[4];
  };

  const getEnergyIcon = () => {
    if (currentEnergy >= 8) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (currentEnergy >= 6) return <Sun className="w-5 h-5 text-orange-500" />;
    if (currentEnergy >= 4) return <Cloud className="w-5 h-5 text-gray-500" />;
    return <CloudRain className="w-5 h-5 text-blue-500" />;
  };

  const getAnxietyColor = () => {
    if (currentAnxiety >= 8) return 'text-red-500';
    if (currentAnxiety >= 6) return 'text-orange-500';
    if (currentAnxiety >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Load existing mood entry for selected date
  useEffect(() => {
    const existingEntry = getMoodEntry(selectedDate);
    if (existingEntry) {
      setCurrentMood(existingEntry.mood);
      setCurrentEnergy(existingEntry.energy);
      setCurrentAnxiety(existingEntry.anxiety);
      setNotes(existingEntry.notes);
      setSelectedActivities(existingEntry.activities);
      setSelectedTriggers(existingEntry.triggers);
    } else {
      // Reset to defaults for new entries
      setCurrentMood(5);
      setCurrentEnergy(5);
      setCurrentAnxiety(5);
      setNotes('');
      setSelectedActivities([]);
      setSelectedTriggers([]);
    }
  }, [selectedDate, getMoodEntry]);

  const handleSaveMood = () => {
    saveMoodEntry({
      date: selectedDate,
      mood: currentMood,
      energy: currentEnergy,
      anxiety: currentAnxiety,
      notes,
      activities: selectedActivities,
      triggers: selectedTriggers
    });

    // Reset form if it's today's entry
    if (selectedDate === new Date().toISOString().split('T')[0]) {
      setNotes('');
      setSelectedActivities([]);
      setSelectedTriggers([]);
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  if (view === 'calendar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Brain className="h-8 w-8 text-green-600" />
                  <span className="text-xl font-bold text-gray-900">Mood Calendar</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MoodCalendar 
            onDateSelect={(date) => {
              setSelectedDate(date);
              setView('tracker');
            }}
            onViewChange={setView}
          />
        </div>
      </div>
    );
  }

  if (view === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Brain className="h-8 w-8 text-green-600" />
                  <span className="text-xl font-bold text-gray-900">Mood Analytics</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mood Analytics</h2>
              <Button variant="outline" onClick={() => setView('tracker')}>
                <Target className="w-4 h-4 mr-2" />
                Track Mood
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                                      <div>
                    <p className="text-sm text-gray-600">Weekly Average</p>
                    <p className="text-2xl font-bold text-gray-900">{realMoodData.weeklyAverage.toFixed(1)}/10</p>
                  </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trend</p>
                      <p className="text-2xl font-bold text-green-600 capitalize">{realMoodData.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Streak</p>
                      <p className="text-2xl font-bold text-gray-900">{realMoodData.currentStreak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Entries</p>
                      <p className="text-2xl font-bold text-gray-900">{realMoodData.totalEntries}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Insights & Patterns</CardTitle>
                  <CardDescription>What we've learned about your mood patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Best Day Pattern</p>
                      <p className="text-sm text-gray-600">Longest streak: {realMoodData.longestStreak} days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Helpful Activity</p>
                      <p className="text-sm text-gray-600">{getMostCommon(realMoodData.topActivity)} appears most often in good mood days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Main Challenge</p>
                      <p className="text-sm text-gray-600">{getMostCommon(realMoodData.mainTrigger)} appears most frequently</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Personalized suggestions based on your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">💡 Try scheduling more meditation on Mondays</p>
                    <p className="text-xs text-blue-700">You've indicated this helps on challenging days</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">🎯 Consider a work stress management session</p>
                    <p className="text-xs text-green-700">This trigger appears frequently in your entries</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">🌟 Your consistency is improving!</p>
                    <p className="text-xs text-purple-700">Keep tracking daily for better insights</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">Mood Tracker</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedDate === new Date().toISOString().split('T')[0] 
                  ? 'How are you feeling today?' 
                  : `Mood for ${new Date(selectedDate).toLocaleDateString()}`
                }
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => setView('calendar')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button variant="outline" onClick={() => setView('analytics')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood Check-in</CardTitle>
              <CardDescription>Take a moment to reflect on your current state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Mood Scale */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Overall Mood</label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl ${getCurrentMoodEmoji().color}`}>
                      {getCurrentMoodEmoji().emoji}
                    </span>
                    <Badge variant="secondary">{getCurrentMoodEmoji().label}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {moodEmojis.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setCurrentMood(mood.value)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                        currentMood === mood.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <p className="text-xs mt-1">{mood.value}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Energy Level</label>
                  <div className="flex items-center space-x-2">
                    {getEnergyIcon()}
                    <span className="text-sm font-medium">{currentEnergy}/10</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEnergy}
                    onChange={(e) => setCurrentEnergy(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Exhausted</span>
                    <span>Energized</span>
                  </div>
                </div>
              </div>

              {/* Anxiety Level */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Anxiety Level</label>
                  <span className={`text-sm font-medium ${getAnxietyColor()}`}>{currentAnxiety}/10</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentAnxiety}
                    onChange={(e) => setCurrentAnxiety(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Calm</span>
                    <span>Very Anxious</span>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900">What have you done today?</label>
                <div className="flex flex-wrap gap-2">
                  {activities.map((activity) => (
                    <Button
                      key={activity}
                      variant={selectedActivities.includes(activity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900">Any challenges today?</label>
                <div className="flex flex-wrap gap-2">
                  {triggers.map((trigger) => (
                    <Button
                      key={trigger}
                      variant={selectedTriggers.includes(trigger) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleTrigger(trigger)}
                    >
                      {trigger}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900">Additional notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? What's on your mind?"
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveMood} className="w-full" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Save Mood Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
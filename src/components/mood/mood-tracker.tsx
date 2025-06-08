'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Save,
  Zap,
  Sun,
  Cloud,
  CloudRain,
  Heart,
  BarChart3,
  Smile,
  Frown,
  Meh,
  Target,
  Award
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-600' },
  { value: 2, emoji: '😔', label: 'Sad', color: 'text-red-400' },
  { value: 3, emoji: '😕', label: 'Down', color: 'text-orange-400' },
  { value: 4, emoji: '😐', label: 'Neutral', color: 'text-gray-400' },
  { value: 5, emoji: '🙂', label: 'Okay', color: 'text-gray-600' },
  { value: 6, emoji: '😊', label: 'Good', color: 'text-blue-400' },
  { value: 7, emoji: '😃', label: 'Happy', color: 'text-blue-600' },
  { value: 8, emoji: '😄', label: 'Very Happy', color: 'text-green-400' },
  { value: 9, emoji: '😆', label: 'Joyful', color: 'text-green-600' },
  { value: 10, emoji: '🤩', label: 'Ecstatic', color: 'text-green-700' }
];

const activityOptions = [
  'Exercise', 'Meditation', 'Reading', 'Socializing', 'Work', 'Hobbies',
  'Music', 'Nature', 'Learning', 'Creativity', 'Rest', 'Gaming'
];

const triggerOptions = [
  'Stress', 'Loneliness', 'Fatigue', 'Conflict', 'Overwhelm', 'Rejection',
  'Uncertainty', 'Criticism', 'Financial', 'Health', 'Work', 'Relationships'
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [selectedEnergy, setSelectedEnergy] = useState<number>(5);
  const [selectedAnxiety, setSelectedAnxiety] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [view, setView] = useState<'tracker' | 'analytics' | 'calendar'>('tracker');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Get user from user store
  const { user } = useUserStore();
  
  // Get mood functionality and UI actions from app store
  const {
    setCurrentView,
    addNotification,
    getMoodEntry,
    addMoodEntry,
    currentStreak,
    longestStreak,
    moodEntries
  } = useAppStore();

  console.log('😊 MoodTracker: Rendering with user:', !!user, user?.id);

  if (!user) {
    console.log('⚠️ MoodTracker: No user found, rendering fallback');
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading mood tracker...</p>
        </div>
      </div>
    );
  }

  console.log('✅ MoodTracker: User found, rendering mood tracker interface');

  const getCurrentMoodEmoji = () => {
    return moodEmojis.find(m => m.value === selectedMood) || moodEmojis[4];
  };

  const getEnergyIcon = () => {
    if (selectedEnergy >= 8) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (selectedEnergy >= 6) return <Sun className="w-5 h-5 text-orange-500" />;
    if (selectedEnergy >= 4) return <Cloud className="w-5 h-5 text-gray-500" />;
    return <CloudRain className="w-5 h-5 text-blue-500" />;
  };

  const getAnxietyColor = () => {
    if (selectedAnxiety >= 8) return 'text-red-500';
    if (selectedAnxiety >= 6) return 'text-orange-500';
    if (selectedAnxiety >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Load mood entry for selected date
  useEffect(() => {
    const existingEntry = getMoodEntry(selectedDate);
    if (existingEntry) {
      setSelectedMood(existingEntry.mood);
      setSelectedEnergy(existingEntry.energy || 5);
      setSelectedAnxiety(existingEntry.anxiety || 5);
      setNotes(existingEntry.notes || '');
      setSelectedActivities(existingEntry.activities || []);
      setSelectedTriggers(existingEntry.triggers || []);
    } else {
      // Reset to defaults for new entries
      setSelectedMood(5);
      setSelectedEnergy(5);
      setSelectedAnxiety(5);
      setNotes('');
      setSelectedActivities([]);
      setSelectedTriggers([]);
    }
  }, [selectedDate, getMoodEntry]);

  const handleSaveMood = () => {
    addMoodEntry({
      date: selectedDate,
      mood: selectedMood,
      energy: selectedEnergy,
      anxiety: selectedAnxiety,
      notes,
      activities: selectedActivities,
      triggers: selectedTriggers
    });

    addNotification({
      type: 'success',
      title: 'Mood Saved!',
      message: 'Your mood entry has been saved successfully.'
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

  const calculateStats = () => {
    const last30Days = moodEntries.slice(-30);
    const avgMood = last30Days.length > 0 
      ? last30Days.reduce((sum, entry) => sum + entry.mood, 0) / last30Days.length 
      : 0;
    const totalEntries = moodEntries.length;
    
    return { avgMood, totalEntries };
  };

  const stats = calculateStats();

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
              <span className="text-xl font-bold text-gray-900">Mood Tracker</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling?</h1>
          <p className="text-gray-600">Track your daily mood and identify patterns over time</p>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracker">Daily Tracker</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Tracker */}
              <div className="lg:col-span-2 space-y-6">
                {/* Date Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5" />
                      <span>Select Date</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="max-w-xs"
                    />
                  </CardContent>
                </Card>

                {/* Mood Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>How is your mood today?</CardTitle>
                    <CardDescription>Select the emoji that best represents your current mood</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-3">
                      {moodEmojis.map((mood) => (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                            selectedMood === mood.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-xs text-gray-600">{mood.label}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Energy and Anxiety Levels */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Energy Level</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getEnergyIcon()}
                          <span className="text-sm font-medium">{selectedEnergy}/10</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedEnergy}
                        onChange={(e) => setSelectedEnergy(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Anxiety Level</CardTitle>
                        <span className={`text-sm font-medium ${getAnxietyColor()}`}>{selectedAnxiety}/10</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedAnxiety}
                        onChange={(e) => setSelectedAnxiety(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>What did you do today?</CardTitle>
                    <CardDescription>Select activities that contributed to your mood</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {activityOptions.map((activity) => (
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
                  </CardContent>
                </Card>

                {/* Triggers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Any triggers today?</CardTitle>
                    <CardDescription>Identify factors that may have affected your mood</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {triggerOptions.map((trigger) => (
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
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                    <CardDescription>Share any thoughts or reflections about your day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What's on your mind today?"
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-6">
                {/* Current Mood Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getCurrentMoodEmoji().emoji}</div>
                      <p className="font-medium">{getCurrentMoodEmoji().label}</p>
                      <p className="text-sm text-gray-600">Mood: {selectedMood}/10</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Energy</span>
                        <div className="flex items-center space-x-2">
                          {getEnergyIcon()}
                          <span className="text-sm font-medium">{selectedEnergy}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Anxiety</span>
                        <span className={`text-sm font-medium ${getAnxietyColor()}`}>{selectedAnxiety}/10</span>
                      </div>
                    </div>

                    <Button onClick={handleSaveMood} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Entry
                    </Button>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Streak</span>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{currentStreak} days</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Longest Streak</span>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{longestStreak} days</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Entries</span>
                      <span className="font-medium">{stats.totalEntries}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Smile className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Mood (30 days)</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.avgMood.toFixed(1)}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Streak</p>
                      <p className="text-2xl font-bold text-gray-900">{currentStreak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Entries</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mood Calendar</CardTitle>
                <CardDescription>View your mood history over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Calendar view coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 
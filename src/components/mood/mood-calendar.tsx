'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3
} from 'lucide-react';

interface MoodCalendarProps {
  onDateSelect?: (date: string) => void;
  onViewChange?: (view: 'tracker' | 'analytics') => void;
}

interface MoodEntry {
  date: string;
  mood: number;
  notes?: string;
}

export default function MoodCalendar({ onDateSelect, onViewChange }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries] = useState<MoodEntry[]>([]); // Mock data for now

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of the month and how many days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Days of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-500';
    if (mood >= 6) return 'bg-green-300';
    if (mood >= 4) return 'bg-yellow-300';
    if (mood >= 2) return 'bg-orange-300';
    return 'bg-red-300';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 9) return '🌟';
    if (mood >= 8) return '😁';
    if (mood >= 7) return '😄';
    if (mood >= 6) return '😊';
    if (mood >= 5) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 3) return '😕';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    const dateString = selectedDate.toISOString().split('T')[0];
    onDateSelect?.(dateString);
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const isFutureDate = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    return dateToCheck > today;
  };

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Calculate monthly stats
  const monthEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  });

  const monthlyAverage = monthEntries.length > 0
    ? monthEntries.reduce((sum, entry) => sum + entry.mood, 0) / monthEntries.length
    : 0;

  const monthlyTrend = monthEntries.length >= 2 
    ? (() => {
        const firstHalf = monthEntries.slice(0, Math.floor(monthEntries.length / 2));
        const secondHalf = monthEntries.slice(Math.floor(monthEntries.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, e) => sum + e.mood, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, e) => sum + e.mood, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 0.5) return 'up';
        if (secondAvg < firstAvg - 0.5) return 'down';
        return 'stable';
      })()
    : 'stable';

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange?.('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Days Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{monthEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 flex items-center justify-center text-2xl">
                {monthlyAverage > 0 ? getMoodEmoji(monthlyAverage) : '😐'}
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyAverage > 0 ? monthlyAverage.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 flex items-center justify-center">
                {monthlyTrend === 'up' && <TrendingUp className="h-6 w-6 text-green-600" />}
                {monthlyTrend === 'down' && <TrendingDown className="h-6 w-6 text-red-600" />}
                {monthlyTrend === 'stable' && <Minus className="h-6 w-6 text-gray-600" />}
              </div>
              <div>
                <p className="text-sm text-gray-600">Trend</p>
                <p className="text-2xl font-bold capitalize text-gray-900">{monthlyTrend}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Calendar</CardTitle>
          <CardDescription>
            Click on any date to view or edit your mood entry for that day
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2" />;
              }

              const dateString = new Date(year, month, day).toISOString().split('T')[0];
              const moodEntry = entries.find(entry => entry.date === dateString);
              const todayClass = isToday(day) ? 'ring-2 ring-blue-500' : '';
              const futureClass = isFutureDate(day) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50';

              return (
                <button
                  key={day}
                  onClick={() => !isFutureDate(day) && handleDateClick(day)}
                  disabled={isFutureDate(day)}
                  className={`
                    relative p-2 h-12 w-full border border-gray-200 rounded-lg text-sm font-medium
                    ${todayClass} ${futureClass}
                    ${moodEntry ? getMoodColor(moodEntry.mood) + ' text-white' : 'bg-white text-gray-900'}
                    transition-all duration-200
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-xs">{day}</span>
                    {moodEntry && (
                      <span className="absolute inset-0 flex items-center justify-center text-lg">
                        {getMoodEmoji(moodEntry.mood)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-300 rounded"></div>
              <span>Poor (1-2)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-300 rounded"></div>
              <span>Low (3)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
              <span>Neutral (4-5)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>Good (6-7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Great (8-10)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
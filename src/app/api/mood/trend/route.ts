import { NextResponse } from 'next/server';
import { getMoodStats, getMoodEntries } from '@/lib/supabase/queries';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const userId = session.user.id;

    // Get mood statistics
    const stats = await getMoodStats(userId, days);
    
    // Get recent mood entries for trend analysis
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const entries = await getMoodEntries(userId, startDate, endDate);

    // Calculate additional trend data
    const moodData = entries.map(entry => ({
      date: entry.date,
      mood: entry.mood_score,
      energy: entry.energy_score,
      anxiety: entry.anxiety_score,
    }));

    // Calculate weekly averages for chart data
    const weeklyAverages = [];
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedEntries.length; i += 7) {
      const weekEntries = sortedEntries.slice(i, i + 7);
      if (weekEntries.length > 0) {
        const weekStart = weekEntries[0].date;
        const weekAverage = weekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / weekEntries.length;
        weeklyAverages.push({ week: weekStart, average: Math.round(weekAverage * 10) / 10 });
      }
    }

    return NextResponse.json({
      stats,
      moodData,
      weeklyAverages,
      totalEntries: entries.length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching mood trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood trends' },
      { status: 500 }
    );
  }
} 
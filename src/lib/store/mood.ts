import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  saveMoodEntry as saveMoodEntryToDB,
  getMoodEntries,
  getMoodEntryByDate,
  getMoodStats
} from '@/lib/supabase/queries';

interface MoodEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  notes: string;
  activities: string[];
  triggers: string[];
  timestamp: Date;
}

interface MoodStats {
  averageMood: number;
  totalEntries: number;
  currentStreak: number;
  trend: 'up' | 'down' | 'stable';
}

interface MoodState {
  // Current mood entry being created/edited
  currentEntry: Partial<MoodEntry> | null;
  
  // Historical data
  entries: MoodEntry[];
  stats: MoodStats | null;
  
  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Date navigation
  selectedDate: string; // YYYY-MM-DD format
  calendarView: 'week' | 'month';
}

interface MoodActions {
  // Entry management
  startNewEntry: (date: string, userId: string) => void;
  loadEntryForDate: (date: string, userId: string) => Promise<void>;
  updateCurrentEntry: (updates: Partial<MoodEntry>) => void;
  saveEntry: (userId: string) => Promise<void>;
  
  // Data loading
  loadEntries: (userId: string, startDate?: string, endDate?: string) => Promise<void>;
  loadStats: (userId: string) => Promise<void>;
  refreshData: (userId: string) => Promise<void>;
  
  // UI state
  setSelectedDate: (date: string) => void;
  setCalendarView: (view: 'week' | 'month') => void;
  setError: (error: string | null) => void;
  
  // Cleanup
  cleanup: () => void;
}

export type MoodStore = MoodState & MoodActions;

// Transform Supabase mood to app mood format
const transformMoodEntry = (mood: any): MoodEntry => ({
  id: mood.id,
  userId: mood.user_id,
  date: mood.date,
  mood: mood.mood_score,
  energy: mood.energy_score || 5,
  anxiety: mood.anxiety_score || 5,
  notes: mood.notes || '',
  activities: mood.activities || [],
  triggers: mood.triggers || [],
  timestamp: new Date(mood.created_at),
});

export const useMoodStore = create<MoodStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        currentEntry: null,
        entries: [],
        stats: null,
        isLoading: false,
        isSaving: false,
        error: null,
        selectedDate: new Date().toISOString().split('T')[0],
        calendarView: 'week',

        // Entry Management
        startNewEntry: (date: string, userId: string) => {
          const entry: Partial<MoodEntry> = {
            userId,
            date,
            mood: 5,
            energy: 5,
            anxiety: 5,
            notes: '',
            activities: [],
            triggers: [],
          };
          
          set({ 
            currentEntry: entry,
            selectedDate: date,
            error: null 
          });
          
          console.log(`📝 Started new mood entry for ${date}`);
        },

        loadEntryForDate: async (date: string, userId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const entry = await getMoodEntryByDate(userId, date);
            
            if (entry) {
              const transformedEntry = transformMoodEntry(entry);
              set({ 
                currentEntry: transformedEntry,
                selectedDate: date,
                isLoading: false 
              });
              console.log(`📖 Loaded mood entry for ${date}`);
            } else {
              // No entry for this date, start a new one
              get().startNewEntry(date, userId);
              set({ isLoading: false });
            }
          } catch (error: any) {
            console.error('❌ Failed to load mood entry:', error);
            set({ 
              error: error.message || 'Failed to load mood entry',
              isLoading: false 
            });
          }
        },

        updateCurrentEntry: (updates: Partial<MoodEntry>) => {
          set((state) => ({
            currentEntry: state.currentEntry ? {
              ...state.currentEntry,
              ...updates
            } : null
          }));
        },

        saveEntry: async (userId: string) => {
          const { currentEntry } = get();
          if (!currentEntry || !currentEntry.date) return;

          set({ isSaving: true, error: null });

          try {
            const moodData = {
              mood_score: currentEntry.mood || 5,
              energy_score: currentEntry.energy || 5,
              anxiety_score: currentEntry.anxiety || 5,
              notes: currentEntry.notes || '',
              activities: currentEntry.activities || [],
              triggers: currentEntry.triggers || [],
              date: currentEntry.date,
            };

            const savedEntry = await saveMoodEntryToDB(userId, moodData);
            
            if (savedEntry) {
              const transformedEntry = transformMoodEntry(savedEntry);
              
              // Update entries list
              set((state) => {
                const existingIndex = state.entries.findIndex(
                  entry => entry.date === transformedEntry.date
                );
                
                let newEntries;
                if (existingIndex >= 0) {
                  // Update existing entry
                  newEntries = [...state.entries];
                  newEntries[existingIndex] = transformedEntry;
                } else {
                  // Add new entry
                  newEntries = [...state.entries, transformedEntry]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                }
                
                return {
                  entries: newEntries,
                  currentEntry: transformedEntry,
                  isSaving: false
                };
              });

              // Refresh stats
              await get().loadStats(userId);
              
              console.log(`✅ Mood entry saved for ${currentEntry.date}`);
            }
          } catch (error: any) {
            console.error('❌ Failed to save mood entry:', error);
            set({ 
              error: error.message || 'Failed to save mood entry',
              isSaving: false 
            });
          }
        },

        // Data Loading
        loadEntries: async (userId: string, startDate?: string, endDate?: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const entries = await getMoodEntries(userId, startDate, endDate);
            const transformedEntries = entries.map(transformMoodEntry);
            
            set({ 
              entries: transformedEntries,
              isLoading: false 
            });
            
            console.log(`📊 Loaded ${transformedEntries.length} mood entries`);
          } catch (error: any) {
            console.error('❌ Failed to load mood entries:', error);
            set({ 
              error: error.message || 'Failed to load mood entries',
              isLoading: false 
            });
          }
        },

        loadStats: async (userId: string) => {
          try {
            const stats = await getMoodStats(userId);
            set({ stats });
            console.log('📈 Loaded mood stats:', stats);
          } catch (error: any) {
            console.error('❌ Failed to load mood stats:', error);
          }
        },

        refreshData: async (userId: string) => {
          await Promise.all([
            get().loadEntries(userId),
            get().loadStats(userId)
          ]);
          console.log('🔄 Mood data refreshed');
        },

        // UI State Management
        setSelectedDate: (selectedDate: string) => set({ selectedDate }),
        
        setCalendarView: (calendarView: 'week' | 'month') => set({ calendarView }),
        
        setError: (error: string | null) => set({ error }),

        // Cleanup
        cleanup: () => {
          set({
            currentEntry: null,
            entries: [],
            stats: null,
            error: null,
            isLoading: false,
            isSaving: false
          });
          console.log('🧹 Mood store cleanup completed');
        },
      }),
      {
        name: 'togethr-mood-store',
        partialize: (state) => ({
          selectedDate: state.selectedDate,
          calendarView: state.calendarView,
        }),
      }
    ),
    { name: 'MoodStore' }
  )
);

// Helper functions
export const getMoodColor = (mood: number): string => {
  if (mood <= 2) return 'bg-red-500';
  if (mood <= 4) return 'bg-orange-500';
  if (mood <= 6) return 'bg-yellow-500';
  if (mood <= 8) return 'bg-green-500';
  return 'bg-emerald-500';
};

export const getMoodEmoji = (mood: number): string => {
  if (mood <= 2) return '😢';
  if (mood <= 4) return '😔';
  if (mood <= 6) return '😐';
  if (mood <= 8) return '🙂';
  return '😊';
};

export const formatMoodDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up': return '📈';
    case 'down': return '📉';
    case 'stable': return '➡️';
    default: return '➡️';
  }
}; 
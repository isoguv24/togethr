import { getMoodStats } from '../src/lib/supabase/queries';
import { Mood } from '../src/lib/supabase/types';

describe('getMoodStats', () => {
  const createEntry = (date: string, score: number): Mood => ({
    id: date,
    user_id: 'u',
    mood_score: score,
    energy_score: 0,
    anxiety_score: 0,
    notes: '',
    activities: [],
    triggers: [],
    date,
    created_at: date,
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('detects an upward trend', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-06-04'));
    const entries = [
      createEntry('2024-06-04', 2),
      createEntry('2024-06-03', 2),
      createEntry('2024-06-02', 4),
      createEntry('2024-06-01', 4),
    ];
    jest.spyOn(require('../src/lib/supabase/queries'), 'getMoodEntries').mockResolvedValue(entries);

    const stats = await getMoodStats('u');
    expect(stats.trend).toBe('up');
    expect(stats.totalEntries).toBe(4);
  });

  it('detects a downward trend', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-06-04'));
    const entries = [
      createEntry('2024-06-04', 4),
      createEntry('2024-06-03', 4),
      createEntry('2024-06-02', 2),
      createEntry('2024-06-01', 2),
    ];
    jest.spyOn(require('../src/lib/supabase/queries'), 'getMoodEntries').mockResolvedValue(entries);

    const stats = await getMoodStats('u');
    expect(stats.trend).toBe('down');
  });

  it('detects a stable trend', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-06-04'));
    const entries = [
      createEntry('2024-06-04', 3),
      createEntry('2024-06-03', 3),
      createEntry('2024-06-02', 3),
      createEntry('2024-06-01', 3),
    ];
    jest.spyOn(require('../src/lib/supabase/queries'), 'getMoodEntries').mockResolvedValue(entries);

    const stats = await getMoodStats('u');
    expect(stats.trend).toBe('stable');
  });
});

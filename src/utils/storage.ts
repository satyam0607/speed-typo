import { TestResult, UserStats, CodeSnippet, SoundTheme, SegmentTier, DailyStreakInfo } from '../types';

const STATS_KEY = 'syntaxtype_user_stats';
const CUSTOM_SNIPPETS_KEY = 'syntaxtype_custom_snippets';
const SETTINGS_KEY = 'syntaxtype_settings';
const SEGMENT_KEY = 'syntaxtype_segment_pref';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DEFAULT_STREAK: DailyStreakInfo = {
  currentStreak: 0,
  bestStreak: 0,
  lastPracticedDate: '',
  todayTestsCount: 0,
  dailyGoal: 3,
  historyDates: [],
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return {
        testsCompleted: 0,
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 100,
        totalWordsTyped: 0,
        streak: { ...DEFAULT_STREAK },
        history: []
      };
    }
    const parsed: UserStats = JSON.parse(raw);
    
    // Validate and recalculate streak based on current date
    const streak: DailyStreakInfo = parsed.streak || { ...DEFAULT_STREAK };
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    if (streak.lastPracticedDate === today) {
      // Practiced today - streak is active
    } else if (streak.lastPracticedDate === yesterday) {
      // Practiced yesterday - streak is active but today count is 0
      streak.todayTestsCount = 0;
    } else if (streak.lastPracticedDate) {
      // Missed more than 1 day - streak reset
      streak.currentStreak = 0;
      streak.todayTestsCount = 0;
    }

    return {
      ...parsed,
      streak: {
        ...DEFAULT_STREAK,
        ...streak,
      }
    };
  } catch (e) {
    console.error('Failed to load stats:', e);
    return {
      testsCompleted: 0,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 100,
      totalWordsTyped: 0,
      streak: { ...DEFAULT_STREAK },
      history: []
    };
  }
}

export function saveTestResult(result: TestResult): UserStats {
  const current = loadUserStats();
  const history = [result, ...current.history].slice(0, 50); // keep last 50
  const testsCompleted = current.testsCompleted + 1;
  const bestWpm = Math.max(current.bestWpm, result.wpm);
  
  const totalWpmSum = history.reduce((sum, h) => sum + h.wpm, 0);
  const avgWpm = Math.round(totalWpmSum / history.length);
  
  const totalAccSum = history.reduce((sum, h) => sum + h.accuracy, 0);
  const avgAccuracy = Math.round(totalAccSum / history.length);
  
  const totalWordsTyped = current.totalWordsTyped + Math.round(result.totalChars / 5);

  // Daily practice streak computation
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const prevStreak = current.streak || { ...DEFAULT_STREAK };
  
  let newCurrentStreak = prevStreak.currentStreak;
  let newTodayCount = prevStreak.todayTestsCount + 1;

  if (prevStreak.lastPracticedDate === today) {
    // Already active today, streak stays
  } else if (prevStreak.lastPracticedDate === yesterday) {
    // Continues unbroken streak
    newCurrentStreak = prevStreak.currentStreak + 1;
    newTodayCount = 1;
  } else {
    // Starting a fresh streak
    newCurrentStreak = 1;
    newTodayCount = 1;
  }

  const newBestStreak = Math.max(prevStreak.bestStreak, newCurrentStreak);
  const newHistoryDates = prevStreak.historyDates.includes(today)
    ? prevStreak.historyDates
    : [...prevStreak.historyDates, today].slice(-30);

  const updatedStreak: DailyStreakInfo = {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastPracticedDate: today,
    todayTestsCount: newTodayCount,
    dailyGoal: prevStreak.dailyGoal || 3,
    historyDates: newHistoryDates,
  };

  const updated: UserStats = {
    testsCompleted,
    bestWpm,
    avgWpm,
    avgAccuracy,
    totalWordsTyped,
    streak: updatedStreak,
    history
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }

  return updated;
}

export function clearUserStats(): UserStats {
  const empty: UserStats = {
    testsCompleted: 0,
    bestWpm: 0,
    avgWpm: 0,
    avgAccuracy: 100,
    totalWordsTyped: 0,
    streak: { ...DEFAULT_STREAK },
    history: []
  };
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (e) {
    console.error('Failed to clear stats:', e);
  }
  return empty;
}

export function loadSavedSegment(): SegmentTier {
  try {
    const val = localStorage.getItem(SEGMENT_KEY) as SegmentTier;
    if (val === 'kids' || val === 'teens' || val === 'pro') return val;
    return 'teens';
  } catch {
    return 'teens';
  }
}

export function saveSegmentPref(tier: SegmentTier) {
  try {
    localStorage.setItem(SEGMENT_KEY, tier);
  } catch {}
}

export function loadCustomSnippets(): CodeSnippet[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SNIPPETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomSnippet(snippet: CodeSnippet): CodeSnippet[] {
  const current = loadCustomSnippets();
  const updated = [snippet, ...current.filter((s) => s.id !== snippet.id)];
  try {
    localStorage.setItem(CUSTOM_SNIPPETS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom snippet:', e);
  }
  return updated;
}

export function deleteCustomSnippet(id: string): CodeSnippet[] {
  const current = loadCustomSnippets();
  const updated = current.filter((s) => s.id !== id);
  try {
    localStorage.setItem(CUSTOM_SNIPPETS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete custom snippet:', e);
  }
  return updated;
}

export function loadSavedSoundPref(): SoundTheme {
  try {
    const val = localStorage.getItem(`${SETTINGS_KEY}_sound`) as SoundTheme;
    if (val === 'melodic' || val === 'mechanical' || val === 'chiptune' || val === 'synthwave' || val === 'off') {
      return val;
    }
    return 'melodic';
  } catch {
    return 'melodic';
  }
}

export function saveSoundPref(val: SoundTheme) {
  try {
    localStorage.setItem(`${SETTINGS_KEY}_sound`, val);
  } catch {}
}

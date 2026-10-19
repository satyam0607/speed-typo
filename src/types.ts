export type Language = 
  | 'all'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'rust'
  | 'go'
  | 'cpp'
  | 'sql'
  | 'html-css'
  | 'git-bash';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface SyntaxWord {
  id: string;
  term: string;
  language: Language;
  category: 'keyword' | 'concept' | 'data-structure' | 'method' | 'operator' | 'pattern';
  difficulty: Difficulty;
  tier?: SegmentTier;
  definition: string;
  explanation: string;
  exampleSnippet: string;
  proTip: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: Language;
  difficulty: Difficulty;
  description: string;
  code: string;
}

export type TestMode = 'timed' | 'words' | 'snippet' | 'custom' | 'word-drill';

export type SoundTheme = 'melodic' | 'mechanical' | 'chiptune' | 'synthwave' | 'off';

export interface TestSettings {
  mode: TestMode;
  duration: number; // in seconds (15, 30, 60, 120)
  wordCount: number; // for words mode (10, 25, 50, 100)
  language: Language;
  soundType: SoundTheme;
  strictMode: boolean; // if true, must backspace and fix errors before advancing
  punctuation: boolean; // include symbols and syntax
}

export interface TestResult {
  id: string;
  date: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  duration: number; // seconds taken
  mode: TestMode;
  language: Language;
  totalChars: number;
  correctChars: number;
  errorChars: number;
  troubleKeys: Record<string, number>;
  wpmHistory: number[]; // second-by-second WPM for chart
}

export type SegmentTier = 'kids' | 'teens' | 'pro';

export interface DailyStreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastPracticedDate: string; // YYYY-MM-DD
  todayTestsCount: number;
  dailyGoal: number; // e.g. 3 tests
  historyDates: string[]; // List of YYYY-MM-DD when tests were completed
}

export interface UserStats {
  testsCompleted: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalWordsTyped: number;
  streak: DailyStreakInfo;
  history: TestResult[];
}

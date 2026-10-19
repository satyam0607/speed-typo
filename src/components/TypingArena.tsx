import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, Hash, Code2, Volume2, VolumeX, Terminal, Music, Sparkles, Baby, GraduationCap, Cpu, Keyboard } from 'lucide-react';
import { TestMode, Language, TestResult, CodeSnippet, SyntaxWord, SoundTheme, SegmentTier } from '../types';
import { playKeySound, playWordTune, playCelebrationTune, playErrorSound } from '../utils/soundEffects';
import { KEYWORD_SPEED_WORDS, SEGMENT_CONFIG } from '../data/syntaxDictionary';
import { CODE_SNIPPETS } from '../data/codeSnippets';

interface TypingArenaProps {
  initialMode?: TestMode;
  initialLanguage?: Language;
  initialSnippet?: CodeSnippet;
  initialDrillWord?: SyntaxWord;
  soundType: SoundTheme;
  setSoundType: (sound: SoundTheme) => void;
  segment: SegmentTier;
  setSegment: (segment: SegmentTier) => void;
  onOpenHotkeys?: () => void;
  onFinishTest: (result: TestResult) => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  initialMode = 'words',
  initialLanguage = 'all',
  initialSnippet,
  initialDrillWord,
  soundType,
  setSoundType,
  segment,
  setSegment,
  onOpenHotkeys,
  onFinishTest,
}) => {
  const [mode, setMode] = useState<TestMode>(initialMode);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [duration, setDuration] = useState<number>(30); // 15, 30, 60, custom
  const [wordGoal, setWordGoal] = useState<number>(25); // 10, 25, 50, custom
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [customDurationInput, setCustomDurationInput] = useState<string>('45');
  const [isCustomTimeModalOpen, setIsCustomTimeModalOpen] = useState<boolean>(false);
  const [isCustomWordGoal, setIsCustomWordGoal] = useState<boolean>(false);
  const [customWordGoalInput, setCustomWordGoalInput] = useState<string>('35');
  const [isCustomWordsModalOpen, setIsCustomWordsModalOpen] = useState<boolean>(false);
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet | null>(initialSnippet || null);
  const [activeDrillWord, setActiveDrillWord] = useState<SyntaxWord | null>(initialDrillWord || null);

  // Core typing state
  const [targetText, setTargetText] = useState<string>('');
  const [inputChars, setInputChars] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [troubleKeys, setTroubleKeys] = useState<Record<string, number>>({});
  const [wordStreak, setWordStreak] = useState<number>(0);
  const [recentTunedWord, setRecentTunedWord] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to construct target text based on active mode and age segment
  const generateTargetText = useCallback(() => {
    if (activeDrillWord) {
      // Practice the drill word + its realistic snippet
      return `${activeDrillWord.term}\n\n${activeDrillWord.exampleSnippet}`;
    }

    if (mode === 'snippet' && activeSnippet) {
      return activeSnippet.code;
    }

    if (mode === 'timed' || mode === 'words') {
      let pool = SEGMENT_CONFIG[segment]?.words || SEGMENT_CONFIG.teens.words;

      if (language !== 'all' && KEYWORD_SPEED_WORDS[language]) {
        if (segment === 'kids') {
          const shortWords = KEYWORD_SPEED_WORDS[language].filter((w) => w.length <= 6);
          pool = shortWords.length > 0 ? shortWords : SEGMENT_CONFIG.kids.words;
        } else if (segment === 'pro') {
          pool = [...KEYWORD_SPEED_WORDS[language], ...SEGMENT_CONFIG.pro.words];
        } else {
          pool = KEYWORD_SPEED_WORDS[language];
        }
      }

      const count = mode === 'words' ? wordGoal : Math.max(duration * 2, 40);
      const shuffled: string[] = [];
      for (let i = 0; i < count; i++) {
        const rand = pool[Math.floor(Math.random() * pool.length)];
        shuffled.push(rand);
      }
      return shuffled.join(' ');
    }

    return KEYWORD_SPEED_WORDS['all'].slice(0, 30).join(' ');
  }, [mode, language, duration, wordGoal, activeSnippet, activeDrillWord, segment]);

  // Reset or initialize test
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newText = generateTargetText();
    setTargetText(newText);
    setInputChars([]);
    setStatus('idle');
    setStartTime(null);
    setElapsedSeconds(0);
    setWpmHistory([]);
    setTroubleKeys({});
    setWordStreak(0);
    setRecentTunedWord(null);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
      hiddenInputRef.current.focus();
    }
  }, [generateTargetText]);

  // On mount or when mode/language changes
  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // If initialSnippet or initialDrillWord passed from outside
  useEffect(() => {
    if (initialSnippet) {
      setActiveSnippet(initialSnippet);
      setMode('snippet');
      setLanguage(initialSnippet.language);
    }
  }, [initialSnippet]);

  useEffect(() => {
    if (initialDrillWord) {
      setActiveDrillWord(initialDrillWord);
      setMode('word-drill');
      setLanguage(initialDrillWord.language);
    }
  }, [initialDrillWord]);

  // Focus input automatically
  const handleContainerClick = () => {
    if (!isCustomTimeModalOpen && !isCustomWordsModalOpen) {
      hiddenInputRef.current?.focus();
    }
  };

  // Timer runner
  useEffect(() => {
    if (status !== 'running') return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;

        // Calculate interim WPM
        const correctCount = inputChars.filter((char, idx) => char === targetText[idx]).length;
        const currentWpm = Math.round((correctCount / 5) / (next / 60)) || 0;
        setWpmHistory((hist) => [...hist, currentWpm]);

        // If timed mode reached duration limit
        if (mode === 'timed' && next >= duration) {
          finishTest(inputChars, next);
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, mode, duration, inputChars, targetText]);

  // Finish test
  const finishTest = useCallback((finalChars: string[], totalTime: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('finished');
    playCelebrationTune(soundType);

    const totalTyped = finalChars.length;
    let correctCount = 0;
    const errorsMap: Record<string, number> = { ...troubleKeys };

    finalChars.forEach((char, idx) => {
      if (char === targetText[idx]) {
        correctCount++;
      } else {
        const expected = targetText[idx] || ' ';
        errorsMap[expected] = (errorsMap[expected] || 0) + 1;
      }
    });

    const errorCount = totalTyped - correctCount;
    const timeInMinutes = Math.max(totalTime / 60, 0.05);
    const wpm = Math.round((correctCount / 5) / timeInMinutes);
    const rawWpm = Math.round((totalTyped / 5) / timeInMinutes);
    const cpm = Math.round(correctCount / timeInMinutes);
    const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;

    const result: TestResult = {
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      wpm: Math.max(wpm, 0),
      rawWpm: Math.max(rawWpm, 0),
      cpm,
      accuracy,
      duration: totalTime,
      mode,
      language,
      totalChars: totalTyped,
      correctChars: correctCount,
      errorChars: errorCount,
      troubleKeys: errorsMap,
      wpmHistory: wpmHistory.length > 0 ? wpmHistory : [wpm]
    };

    onFinishTest(result);
  }, [targetText, troubleKeys, mode, language, wpmHistory, soundType, onFinishTest]);

  // Key handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCustomTimeModalOpen || isCustomWordsModalOpen) return;

    // Quick Reset on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      resetTest();
      return;
    }

    if (status === 'finished') return;

    // Start timer on first valid key press
    if (status === 'idle') {
      if (e.key.length === 1 || e.key === 'Enter') {
        setStatus('running');
        setStartTime(Date.now());
      }
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      e.preventDefault();
      playKeySound(soundType, 'Backspace');
      setInputChars((prev) => prev.slice(0, -1));
      return;
    }

    // Tab key support: in snippet mode, insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      playKeySound(soundType, ' ');
      const nextChars = [...inputChars, ' ', ' '];
      setInputChars(nextChars);
      return;
    }

    // Enter key: newline
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextChars = [...inputChars, '\n'];
      setInputChars(nextChars);

      // Check current word for tune
      const typedText = nextChars.join('');
      const words = typedText.trim().split(/\s+/);
      const currentWord = words[words.length - 1] || 'newline';
      const newStreak = wordStreak + 1;
      setWordStreak(newStreak);
      setRecentTunedWord(currentWord);
      playWordTune(currentWord, soundType, newStreak);

      // Check if finished entire text
      if (nextChars.length >= targetText.length) {
        finishTest(nextChars, Math.max(elapsedSeconds, 1));
      }
      return;
    }

    // Standard character key
    if (e.key.length === 1) {
      e.preventDefault();
      const expectedChar = targetText[inputChars.length];
      const isCorrect = e.key === expectedChar;
      const nextChars = [...inputChars, e.key];

      if (isCorrect) {
        // If completing a word (space or punctuation or finished)
        if (e.key === ' ' || nextChars.length >= targetText.length) {
          const typedText = nextChars.join('');
          const words = typedText.trim().split(/\s+/);
          const currentWord = words[words.length - 1] || '';
          const newStreak = wordStreak + 1;
          setWordStreak(newStreak);
          setRecentTunedWord(currentWord);
          playWordTune(currentWord, soundType, newStreak);
        } else {
          playKeySound(soundType, e.key);
        }
      } else {
        setWordStreak(0);
        playErrorSound(soundType !== 'off');
        // Register trouble key
        if (expectedChar) {
          setTroubleKeys((prev) => ({
            ...prev,
            [expectedChar]: (prev[expectedChar] || 0) + 1
          }));
        }
      }

      setInputChars(nextChars);

      // In words mode, check if word count goal reached
      if (mode === 'words') {
        const wordsTyped = nextChars.join('').trim().split(/\s+/).length;
        if (wordsTyped >= wordGoal || nextChars.length >= targetText.length) {
          finishTest(nextChars, Math.max(elapsedSeconds, 1));
          return;
        }
      }

      // Check end of text
      if (nextChars.length >= targetText.length) {
        finishTest(nextChars, Math.max(elapsedSeconds, 1));
      }
    }
  };

  // Live telemetry calculations
  const currentIndex = inputChars.length;
  const correctCount = inputChars.filter((char, idx) => char === targetText[idx]).length;
  const errorCount = currentIndex - correctCount;
  const liveMinutes = Math.max(elapsedSeconds / 60, 0.016); // min 1 sec
  const liveWpm = elapsedSeconds > 0 ? Math.round((correctCount / 5) / liveMinutes) : 0;
  const liveAccuracy = currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 100;
  const remainingSeconds = Math.max(duration - elapsedSeconds, 0);

  // Auto scroll to caret inside code view
  useEffect(() => {
    if (caretRef.current && containerRef.current) {
      const caret = caretRef.current;
      const container = containerRef.current;
      const caretTop = caret.offsetTop;
      const containerScroll = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (caretTop < containerScroll + 40 || caretTop > containerScroll + containerHeight - 60) {
        container.scrollTo({
          top: Math.max(caretTop - 80, 0),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Active Drill Banner if launched from Vocabulary */}
      {activeDrillWord && (
        <div className="bg-cyan-950/30 border border-cyan-800/60 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Code2 className="w-4 h-4" />
              <span>VOCABULARY DRILL</span>
              <span>·</span>
              <span className="capitalize">{activeDrillWord.language}</span>
              <span>·</span>
              <span className="capitalize">{activeDrillWord.category}</span>
            </div>
            <div className="text-sm font-semibold text-white mt-0.5">
              Target: <span className="text-cyan-300 font-mono">{activeDrillWord.term}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{activeDrillWord.definition}</p>
          </div>
          <button
            onClick={() => {
              setActiveDrillWord(null);
              setMode('words');
              resetTest();
            }}
            className="text-xs font-medium text-slate-400 hover:text-white underline whitespace-nowrap self-start sm:self-auto"
          >
            Exit Drill Mode
          </button>
        </div>
      )}

      {/* Control Strip: 2 Balanced, Clean Rows */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-md max-w-full overflow-hidden">
        {/* Row 1: Target Level & Practice Mode */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
          {/* Audience Tiers */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-mono hidden md:inline">Level:</span>
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-lg">
              <button
                onClick={() => { setSegment('kids'); resetTest(); }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  segment === 'kids'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Kids (6-10)</span>
              </button>
              <button
                onClick={() => { setSegment('teens'); resetTest(); }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  segment === 'teens'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Teens (10-18)</span>
              </button>
              <button
                onClick={() => { setSegment('pro'); resetTest(); }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  segment === 'pro'
                    ? 'bg-purple-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Pro (18+)</span>
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-lg">
              <button
                onClick={() => { setActiveDrillWord(null); setMode('words'); }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  mode === 'words' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Word Blitz
              </button>
              <button
                onClick={() => { setActiveDrillWord(null); setMode('timed'); }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  mode === 'timed' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Timed Sprint
              </button>
              <button
                onClick={() => {
                  setActiveDrillWord(null);
                  setMode('snippet');
                  if (!activeSnippet) {
                    const s = CODE_SNIPPETS.find((snip) => language === 'all' || snip.language === language) || CODE_SNIPPETS[0];
                    setActiveSnippet(s);
                  }
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  mode === 'snippet' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Snippet
              </button>
            </div>

            {/* Language dropdown */}
            {!activeDrillWord && (
              <select
                value={language}
                onChange={(e) => {
                  const nextLang = e.target.value as Language;
                  setLanguage(nextLang);
                  if (mode === 'snippet') {
                    const matching = CODE_SNIPPETS.find((s) => nextLang === 'all' || s.language === nextLang);
                    if (matching) setActiveSnippet(matching);
                  }
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="cpp">C++</option>
                <option value="sql">SQL</option>
                <option value="html-css">HTML &amp; CSS</option>
                <option value="git-bash">Git &amp; Shell</option>
              </select>
            )}
          </div>
        </div>

        {/* Row 2: Duration / Words goal + Custom Time + Sound + Hotkeys & Restart */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Left: Duration presets & Custom Time */}
          <div className="flex flex-wrap items-center gap-2">
            {mode === 'timed' && (
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-lg">
                <Clock className="w-3 h-3 text-cyan-400 ml-1.5 mr-0.5 shrink-0" />
                {[15, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setDuration(t);
                      setIsCustomDuration(false);
                      resetTest();
                    }}
                    className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                      duration === t && !isCustomDuration
                        ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}s
                  </button>
                ))}

                {/* Custom Time Modal Trigger */}
                <button
                  onClick={() => setIsCustomTimeModalOpen(true)}
                  title="Configure custom time duration in seconds (Alt+C)"
                  className={`px-2 py-0.5 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                    isCustomDuration || ![15, 30, 60, 120].includes(duration)
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                  }`}
                >
                  <span>
                    {isCustomDuration || ![15, 30, 60, 120].includes(duration)
                      ? `${duration}s (Custom)`
                      : 'Custom...'}
                  </span>
                </button>
              </div>
            )}

            {mode === 'words' && (
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-lg">
                <Hash className="w-3 h-3 text-cyan-400 ml-1.5 mr-0.5 shrink-0" />
                {[10, 25, 50, 100].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWordGoal(w);
                      setIsCustomWordGoal(false);
                      resetTest();
                    }}
                    className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                      wordGoal === w && !isCustomWordGoal
                        ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {w}w
                  </button>
                ))}

                {/* Custom Word Goal Modal Trigger */}
                <button
                  onClick={() => setIsCustomWordsModalOpen(true)}
                  title="Configure custom words goal"
                  className={`px-2 py-0.5 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                    isCustomWordGoal || ![10, 25, 50, 100].includes(wordGoal)
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                  }`}
                >
                  <span>
                    {isCustomWordGoal || ![10, 25, 50, 100].includes(wordGoal)
                      ? `${wordGoal}w (Custom)`
                      : 'Custom...'}
                  </span>
                </button>
              </div>
            )}

            {mode === 'snippet' && (
              <select
                value={activeSnippet?.id || ''}
                onChange={(e) => {
                  const s = CODE_SNIPPETS.find((sn) => sn.id === e.target.value);
                  if (s) {
                    setActiveSnippet(s);
                    setLanguage(s.language);
                  }
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-cyan-500 focus:outline-none max-w-[220px] truncate"
              >
                {CODE_SNIPPETS.filter((s) => language === 'all' || s.language === language).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Right: Sound Theme & Cheatsheet & Restart */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Sound Theme Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 border border-slate-800 rounded-lg">
              <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={soundType}
                onChange={(e) => setSoundType(e.target.value as SoundTheme)}
                aria-label="Sound tunes theme"
                className="bg-transparent text-xs font-mono text-slate-300 hover:text-white focus:outline-none cursor-pointer"
              >
                <option value="melodic" className="bg-[#0b0f17]">🎵 Melodic</option>
                <option value="mechanical" className="bg-[#0b0f17]">⌨️ Mechanical</option>
                <option value="chiptune" className="bg-[#0b0f17]">👾 8-Bit</option>
                <option value="synthwave" className="bg-[#0b0f17]">🌆 Synth</option>
                <option value="off" className="bg-[#0b0f17]">🔇 Off</option>
              </select>
            </div>

            {/* Hotkeys Cheatsheet Button */}
            {onOpenHotkeys && (
              <button
                onClick={onOpenHotkeys}
                title="Keyboard Shortcuts Cheatsheet (?)"
                className="px-2 sm:px-2.5 py-1 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Keys</span>
                <kbd className="px-1 py-0.2 bg-slate-800 rounded text-[10px] text-cyan-300">?</kbd>
              </button>
            )}

            {/* Quick Restart */}
            <button
              onClick={resetTest}
              title="Restart Test (Esc)"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Duration Modal */}
      {isCustomTimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0e1628] border border-cyan-500/40 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Custom Sprint Duration</span>
              </div>
              <button
                onClick={() => setIsCustomTimeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Pick a quick time preset or specify any custom test duration in seconds (5–600s).
            </p>

            {/* Preset chips */}
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30, 45, 60, 90, 120, 180, 300].map((secs) => (
                <button
                  key={secs}
                  onClick={() => setCustomDurationInput(String(secs))}
                  className={`py-1.5 px-2 text-xs font-mono rounded border transition-colors ${
                    customDurationInput === String(secs)
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {secs >= 60 ? `${secs / 60}m (${secs}s)` : `${secs}s`}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = Math.max(5, Math.min(600, parseInt(customDurationInput) || 30));
                setDuration(val);
                setIsCustomDuration(true);
                setIsCustomTimeModalOpen(false);
                resetTest();
              }}
              className="space-y-3 pt-1"
            >
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-mono">Seconds:</label>
                <input
                  type="number"
                  min={5}
                  max={600}
                  autoFocus
                  value={customDurationInput}
                  onChange={(e) => setCustomDurationInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none"
                  placeholder="e.g. 45"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomTimeModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg shadow-sm"
                >
                  Apply &amp; Start
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Word Goal Modal */}
      {isCustomWordsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0e1628] border border-cyan-500/40 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>Custom Word Goal</span>
              </div>
              <button
                onClick={() => setIsCustomWordsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Pick a quick word count preset or specify any custom count (5–500 words).
            </p>

            {/* Word preset chips */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 35, 50, 75, 100, 150, 250].map((wCount) => (
                <button
                  key={wCount}
                  onClick={() => setCustomWordGoalInput(String(wCount))}
                  className={`py-1.5 px-2 text-xs font-mono rounded border transition-colors ${
                    customWordGoalInput === String(wCount)
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {wCount}w
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = Math.max(5, Math.min(500, parseInt(customWordGoalInput) || 25));
                setWordGoal(val);
                setIsCustomWordGoal(true);
                setIsCustomWordsModalOpen(false);
                resetTest();
              }}
              className="space-y-3 pt-1"
            >
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-mono">Word count:</label>
                <input
                  type="number"
                  min={5}
                  max={500}
                  autoFocus
                  value={customWordGoalInput}
                  onChange={(e) => setCustomWordGoalInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none"
                  placeholder="e.g. 35"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomWordsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg shadow-sm"
                >
                  Apply Word Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Performance HUD Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0f172a] border border-slate-800/90 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Live Speed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-cyan-400 tabular-nums">{liveWpm}</span>
            <span className="text-[10px] text-slate-500 font-mono">WPM</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800/90 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Accuracy</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-emerald-400 tabular-nums">{liveAccuracy}%</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800/90 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Errors</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-mono font-bold tabular-nums ${errorCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {errorCount}
            </span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800/90 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            {mode === 'timed' ? 'Time Remaining' : 'Elapsed Time'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
              {mode === 'timed' ? `${remainingSeconds}s` : `${elapsedSeconds}s`}
            </span>
          </div>
        </div>
      </div>

      {/* Code Editor Style Typing Box */}
      <div
        onClick={handleContainerClick}
        className="relative bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden cursor-text shadow-xl group transition-all duration-200 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30"
      >
        {/* Editor Window Bar */}
        <div className="bg-[#0c121e] border-b border-slate-800/90 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              {mode === 'snippet'
                ? `${activeSnippet?.title || 'snippet'}.${language === 'python' ? 'py' : language === 'rust' ? 'rs' : language === 'go' ? 'go' : 'ts'}`
                : mode === 'word-drill'
                ? `${activeDrillWord?.term || 'drill'}.spec`
                : `syntax_speed_drill.${language === 'all' ? 'dev' : language}`}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded hidden sm:inline ${
                segment === 'kids'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : segment === 'teens'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-purple-950 text-purple-300 border border-purple-800'
              }`}
            >
              {SEGMENT_CONFIG[segment].title} · {SEGMENT_CONFIG[segment].difficultyLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            {wordStreak > 1 && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/90 border border-cyan-800/80 rounded text-cyan-300 font-medium">
                <Music className="w-3 h-3 text-cyan-400" />
                <span>{wordStreak} Streak</span>
                {recentTunedWord && (
                  <span className="text-white font-bold max-w-[100px] truncate">
                    ♪ {recentTunedWord}
                  </span>
                )}
              </div>
            )}
            <span className="hidden sm:inline">Tab: indent</span>
            <span className="hidden sm:inline">·</span>
            <span>Esc: restart</span>
          </div>
        </div>

        {/* Hidden capturing input */}
        <input
          ref={hiddenInputRef}
          type="text"
          className="absolute -top-10 left-0 opacity-0 pointer-events-none"
          autoFocus
          onKeyDown={handleKeyDown}
          onChange={() => {}}
        />

        {/* Code Canvas */}
        <div
          ref={containerRef}
          className="p-4 sm:p-6 font-mono text-base sm:text-lg leading-relaxed sm:leading-8 min-h-[220px] max-h-[420px] overflow-y-auto whitespace-pre-wrap break-words break-all sm:break-normal overflow-x-hidden w-full max-w-full select-none relative"
        >
          {targetText.split('').map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;
            const typedChar = inputChars[index];
            const isCorrect = isTyped && typedChar === char;
            const isIncorrect = isTyped && typedChar !== char;

            let charClass = 'text-slate-500'; // unreached
            if (isCorrect) {
              charClass = 'text-cyan-300 font-medium';
            } else if (isIncorrect) {
              charClass = 'text-rose-400 bg-rose-500/25 underline decoration-rose-500 decoration-2';
            }

            return (
              <span key={index} className="relative inline">
                {isCurrent && (
                  <span
                    ref={caretRef}
                    className="inline-block w-2 h-5 -mb-0.5 bg-cyan-400 animate-caret align-middle rounded-[1px] shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                )}
                <span className={charClass}>
                  {char === '\n' ? (
                    <span className="text-slate-600 text-xs inline-block ml-1 mr-1">↵{'\n'}</span>
                  ) : char === ' ' && isIncorrect ? (
                    '·'
                  ) : (
                    char
                  )}
                </span>
              </span>
            );
          })}
        </div>

        {/* Click to focus hint if idle */}
        {status === 'idle' && (
          <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs text-slate-300 shadow-lg">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Start typing to begin timer...</span>
            </span>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Footer Note */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
        <span>Click anywhere in code box to focus</span>
        <span>Standard calculation: 5 characters = 1 word</span>
      </div>
    </div>
  );
};

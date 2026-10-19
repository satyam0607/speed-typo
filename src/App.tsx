/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TypingArena } from './components/TypingArena';
import { LearnVocabulary } from './components/LearnVocabulary';
import { SyntaxDrills } from './components/SyntaxDrills';
import { CustomPractice } from './components/CustomPractice';
import { StatsView } from './components/StatsView';
import { ResultsModal } from './components/ResultsModal';
import { DailyWordModal } from './components/DailyWordModal';
import { SYNTAX_DICTIONARY } from './data/syntaxDictionary';
import { CODE_SNIPPETS } from './data/codeSnippets';
import {
  TestResult,
  UserStats,
  CodeSnippet,
  SyntaxWord,
  Language,
  SoundTheme,
  SegmentTier,
} from './types';
import {
  loadUserStats,
  saveTestResult,
  clearUserStats,
  loadSavedSoundPref,
  saveSoundPref,
  loadSavedSegment,
  saveSegmentPref,
} from './utils/storage';
import { SegmentSelector } from './components/SegmentSelector';
import { DailyStreakBanner } from './components/DailyStreakBanner';
import { HotkeyCheatsheet } from './components/HotkeyCheatsheet';

export default function App() {
  const [activeTab, setActiveTab] = useState<'test' | 'learn' | 'snippets' | 'custom' | 'stats'>('test');
  const [soundType, setSoundType] = useState<SoundTheme>(loadSavedSoundPref);
  const [segment, setSegment] = useState<SegmentTier>(loadSavedSegment);
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState<boolean>(false);

  // Active targets
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet | null>(null);
  const [activeDrillWord, setActiveDrillWord] = useState<SyntaxWord | null>(null);
  const [arenaKey, setArenaKey] = useState<number>(0); // force remount when switching drills

  const handleSegmentChange = (newSegment: SegmentTier) => {
    setSegment(newSegment);
    saveSegmentPref(newSegment);
    setArenaKey((k) => k + 1);
  };

  // Global Hotkey Navigation listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.getAttribute('type') !== 'text';
      
      // ? or Ctrl+/ toggles Hotkeys Drawer
      if ((e.key === '?' || (e.ctrlKey && e.key === '/')) && !e.altKey) {
        if (target?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsHotkeysOpen((prev) => !prev);
          return;
        }
      }

      // Alt Navigation Shortcuts
      if (e.altKey) {
        if (e.key === '1') { e.preventDefault(); setActiveTab('test'); }
        else if (e.key === '2') { e.preventDefault(); setActiveTab('learn'); }
        else if (e.key === '3') { e.preventDefault(); setActiveTab('snippets'); }
        else if (e.key === '4') { e.preventDefault(); setActiveTab('custom'); }
        else if (e.key === '5') { e.preventDefault(); setActiveTab('stats'); }
        else if (e.key.toLowerCase() === 'k') { e.preventDefault(); handleSegmentChange('kids'); }
        else if (e.key.toLowerCase() === 't') { e.preventDefault(); handleSegmentChange('teens'); }
        else if (e.key.toLowerCase() === 'p') { e.preventDefault(); handleSegmentChange('pro'); }
        else if (e.key.toLowerCase() === 's') { 
          e.preventDefault(); 
          const modes: SoundTheme[] = ['melodic', 'mechanical', 'chiptune', 'synthwave', 'off'];
          setSoundType((curr) => {
            const next = modes[(modes.indexOf(curr) + 1) % modes.length];
            saveSoundPref(next);
            return next;
          });
        }
        else if (e.key.toLowerCase() === 'w') { 
          e.preventDefault(); 
          setIsDailyWordOpen((prev) => !prev); 
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Featured word of the day
  const [featuredWordIndex, setFeaturedWordIndex] = useState<number>(() => {
    // Pick deterministic word of the day based on date
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return dayOfYear % SYNTAX_DICTIONARY.length;
  });
  const [isDailyWordOpen, setIsDailyWordOpen] = useState(false);

  const featuredWord = SYNTAX_DICTIONARY[featuredWordIndex] || SYNTAX_DICTIONARY[0];

  const handleSoundChange = (newSound: SoundTheme) => {
    setSoundType(newSound);
    saveSoundPref(newSound);
  };

  const handleFinishTest = (result: TestResult) => {
    const updated = saveTestResult(result);
    setUserStats(updated);
    setLastResult(result);
  };

  const handlePracticeWord = (word: SyntaxWord) => {
    setActiveDrillWord(word);
    setActiveSnippet(null);
    setActiveTab('test');
    setArenaKey((k) => k + 1);
  };

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setActiveSnippet(snippet);
    setActiveDrillWord(null);
    setActiveTab('test');
    setArenaKey((k) => k + 1);
  };

  const handleShuffleDailyWord = () => {
    const nextIdx = Math.floor(Math.random() * SYNTAX_DICTIONARY.length);
    setFeaturedWordIndex(nextIdx);
  };

  const handlePracticeTroubleKeys = (keys: string[]) => {
    // Generate synthetic snippet repeating trouble keys in realistic coding contexts
    const keyStr = keys.join(' ');
    const syntheticCustom: CodeSnippet = {
      id: `trouble-keys-${Date.now()}`,
      title: `Syntax Bottlenecks Drill (${keys.join(', ')})`,
      language: 'typescript',
      difficulty: 'advanced',
      description: 'Special practice session targeting your recent mis-typed symbols.',
      code: `// Drill focus keys: ${keyStr}\nconst verify = [${keys.map((k) => JSON.stringify(k)).join(', ')}];\n${keys.map((k, i) => `const val_${i} = (item) => ({ key: "${k}", valid: item === "${k}" });`).join('\n')}`
    };
    setLastResult(null);
    handleSelectSnippet(syntheticCustom);
  };

  const handleNextSnippet = () => {
    setLastResult(null);
    const currentIndex = CODE_SNIPPETS.findIndex((s) => s.id === activeSnippet?.id);
    const nextSnippet = CODE_SNIPPETS[(currentIndex + 1) % CODE_SNIPPETS.length];
    handleSelectSnippet(nextSnippet);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden w-full max-w-full">
      {/* 3-Zone Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        soundType={soundType}
        setSoundType={handleSoundChange}
        onOpenDailyWord={() => setIsDailyWordOpen(true)}
        dailyStreak={userStats.streak?.currentStreak || 0}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 overflow-x-hidden">
        {activeTab === 'test' && (
          <div className="space-y-6">
            <DailyStreakBanner streak={userStats.streak} />
            <SegmentSelector
              currentSegment={segment}
              onSelectSegment={handleSegmentChange}
            />
            <TypingArena
              key={arenaKey}
              initialSnippet={activeSnippet || undefined}
              initialDrillWord={activeDrillWord || undefined}
              soundType={soundType}
              setSoundType={handleSoundChange}
              segment={segment}
              setSegment={handleSegmentChange}
              onOpenHotkeys={() => setIsHotkeysOpen(true)}
              onFinishTest={handleFinishTest}
            />
          </div>
        )}

        {activeTab === 'learn' && (
          <LearnVocabulary
            featuredWord={featuredWord}
            onPracticeWord={handlePracticeWord}
            onRefreshDailyWord={handleShuffleDailyWord}
            soundType={soundType}
          />
        )}

        {activeTab === 'snippets' && (
          <SyntaxDrills onSelectSnippet={handleSelectSnippet} />
        )}

        {activeTab === 'custom' && (
          <CustomPractice onPracticeCustom={handleSelectSnippet} />
        )}

        {activeTab === 'stats' && (
          <StatsView
            stats={userStats}
            onClearStats={() => {
              const empty = clearUserStats();
              setUserStats(empty);
            }}
            onRetestLanguage={(lang) => {
              setActiveSnippet(null);
              setActiveDrillWord(null);
              setActiveTab('test');
            }}
          />
        )}
      </main>

      {/* Post-Test Report Modal */}
      {lastResult && (
        <ResultsModal
          result={lastResult}
          onRestart={() => {
            setLastResult(null);
            setArenaKey((k) => k + 1);
          }}
          onNextSnippet={activeSnippet ? handleNextSnippet : undefined}
          onPracticeTroubleKeys={handlePracticeTroubleKeys}
        />
      )}

      {/* Word of the Day Modal */}
      <DailyWordModal
        isOpen={isDailyWordOpen}
        word={featuredWord}
        onClose={() => setIsDailyWordOpen(false)}
        onPractice={handlePracticeWord}
        onShuffle={handleShuffleDailyWord}
      />

      {/* Slide-out Hotkey Cheatsheet Drawer */}
      <HotkeyCheatsheet
        isOpen={isHotkeysOpen}
        onClose={() => setIsHotkeysOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsHotkeysOpen(false);
        }}
      />

      {/* Clean Unboxed Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080d16] py-5 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 font-semibold">SyntaxType</span>
            <span>·</span>
            <span>Learn &amp; Type for Coding Enthusiasts</span>
            <span>·</span>
            <span>Web Audio Feedback</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] text-slate-400 flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => setIsHotkeysOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <kbd className="px-1 py-0.2 bg-slate-800 rounded text-cyan-300 font-bold">?</kbd>
              <span>Hotkey Cheatsheet</span>
            </button>
            <span>·</span>
            <span>Esc: Restart Test</span>
            <span>·</span>
            <span>Tab: Indent</span>
            <span>·</span>
            <span>No signup required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

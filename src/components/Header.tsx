import React from 'react';
import { Volume2, VolumeX, Sparkles, Keyboard, Flame } from 'lucide-react';

import { SoundTheme } from '../types';

interface HeaderProps {
  activeTab: 'test' | 'learn' | 'snippets' | 'custom' | 'stats';
  setActiveTab: (tab: 'test' | 'learn' | 'snippets' | 'custom' | 'stats') => void;
  soundType: SoundTheme;
  setSoundType: (sound: SoundTheme) => void;
  onOpenDailyWord: () => void;
  dailyStreak: number;
  onOpenHotkeys?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundType,
  setSoundType,
  onOpenDailyWord,
  dailyStreak,
  onOpenHotkeys,
}) => {
  const soundModes: SoundTheme[] = ['melodic', 'mechanical', 'chiptune', 'synthwave', 'off'];
  
  const cycleSound = () => {
    const currentIndex = soundModes.indexOf(soundType);
    const nextIndex = (currentIndex + 1) % soundModes.length;
    setSoundType(soundModes[nextIndex]);
  };

  return (
    <header className="border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('test')}
          className="flex items-center gap-2 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0f17] rounded-[4px] flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="font-mono font-bold text-base sm:text-lg tracking-tight text-white flex items-center">
            <span className="text-cyan-400">&lt;</span>
            SyntaxType
            <span className="text-cyan-400">/&gt;</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('test')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'test'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Speed Test
            {activeTab === 'test' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'learn'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Learn Words
            {activeTab === 'learn' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('snippets')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'snippets'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Syntax Drills
            {activeTab === 'snippets' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'custom'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Custom Code
            {activeTab === 'custom' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'stats'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Statistics
            {activeTab === 'stats' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('stats')}
            title={`Daily Practice Streak: ${dailyStreak} Days`}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono font-medium text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-900/60 hover:border-amber-700/80 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold tabular-nums">{dailyStreak}</span>
            <span className="hidden sm:inline">d</span>
          </button>

          <button
            onClick={cycleSound}
            title={`Sound Tune Mode: ${soundType} (click to switch)`}
            aria-label={`Sound tune theme: ${soundType}`}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            {soundType === 'off' ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="capitalize hidden sm:inline">
              {soundType === 'melodic' ? '🎵 Tunes' : soundType === 'chiptune' ? '👾 8-Bit' : soundType === 'synthwave' ? '🌆 Synth' : soundType}
            </span>
          </button>

          {onOpenHotkeys && (
            <button
              onClick={onOpenHotkeys}
              title="Keyboard Shortcuts Cheatsheet (?)"
              aria-label="Hotkey Cheatsheet"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Hotkeys</span>
              <kbd className="px-1 py-0.2 bg-slate-800 rounded text-[10px] text-cyan-300 border border-slate-700">?</kbd>
            </button>
          )}

          <button
            onClick={onOpenDailyWord}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap shrink-0 font-semibold shadow-sm shadow-cyan-950"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            <span className="hidden sm:inline">Word of the Day</span>
            <span className="sm:hidden">Word</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 px-2 py-2 text-xs font-medium text-slate-400 overflow-x-auto">
        <button
          onClick={() => setActiveTab('test')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'test' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Speed Test
        </button>
        <button
          onClick={() => setActiveTab('learn')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'learn' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Learn
        </button>
        <button
          onClick={() => setActiveTab('snippets')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'snippets' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Drills
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'custom' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Custom
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'stats' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Stats
        </button>
      </div>
    </header>
  );
};

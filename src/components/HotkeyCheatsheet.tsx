import React, { useEffect, useState } from 'react';
import { X, Keyboard, Search, Sparkles, Command, ArrowRight } from 'lucide-react';

interface HotkeyCheatsheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'test' | 'learn' | 'snippets' | 'custom' | 'stats') => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Arena' | 'Navigation' | 'Segments' | 'Audio & Daily';
  action?: () => void;
}

export const HotkeyCheatsheet: React.FC<HotkeyCheatsheetProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    // Arena
    { keys: ['Esc'], description: 'Restart current test instantly', category: 'Arena' },
    { keys: ['Alt', 'C'], description: 'Open Custom Time duration picker', category: 'Arena' },
    { keys: ['Tab'], description: 'Indent code (2 spaces) or advance', category: 'Arena' },
    { keys: ['Enter'], description: 'New line in snippet & play word tune', category: 'Arena' },
    { keys: ['Space'], description: 'Complete current word & trigger harmony chord', category: 'Arena' },
    { keys: ['Backspace'], description: 'Delete previous typed character', category: 'Arena' },

    // Navigation
    { keys: ['Alt', '1'], description: 'Jump to Speed Test Arena', category: 'Navigation', action: () => onNavigateTab('test') },
    { keys: ['Alt', '2'], description: 'Jump to Learn Words Library', category: 'Navigation', action: () => onNavigateTab('learn') },
    { keys: ['Alt', '3'], description: 'Jump to Code Syntax Drills', category: 'Navigation', action: () => onNavigateTab('snippets') },
    { keys: ['Alt', '4'], description: 'Jump to Custom Code Practice', category: 'Navigation', action: () => onNavigateTab('custom') },
    { keys: ['Alt', '5'], description: 'Jump to Statistics & Streak History', category: 'Navigation', action: () => onNavigateTab('stats') },

    // Segments
    { keys: ['Alt', 'K'], description: 'Switch to Kids Coding (6–10 yrs · Easy Words)', category: 'Segments' },
    { keys: ['Alt', 'T'], description: 'Switch to Teens (10–18 yrs · Medium Words)', category: 'Segments' },
    { keys: ['Alt', 'P'], description: 'Switch to Professional Devs (18+ · Hard & Extreme)', category: 'Segments' },

    // Audio & Discovery
    { keys: ['Alt', 'S'], description: 'Cycle Sound Themes (Melodic, Mechanical, 8-Bit, Synth, Off)', category: 'Audio & Daily' },
    { keys: ['Alt', 'W'], description: 'Open Featured Word of the Day Modal', category: 'Audio & Daily' },
    { keys: ['?'], description: 'Toggle Hotkey Cheatsheet Drawer', category: 'Audio & Daily' },
    { keys: ['Ctrl', '/'], description: 'Alternative Hotkey Cheatsheet shortcut', category: 'Audio & Daily' },
  ];

  const filteredShortcuts = shortcuts.filter(
    (s) =>
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories: Array<'Arena' | 'Navigation' | 'Segments' | 'Audio & Daily'> = [
    'Arena',
    'Navigation',
    'Segments',
    'Audio & Daily',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 flex justify-end">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-full sm:max-w-md md:max-w-lg bg-[#0e1526] border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Hotkey Cheatsheet</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Global
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Speed shortcuts for arena management and instant navigation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside drawer */}
        <div className="p-4 border-b border-slate-800/60 bg-[#0b1120]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shortcuts (e.g. restart, sound, alt)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080d16] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Shortcuts list grouped by category */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {categories.map((category) => {
            const items = filteredShortcuts.filter((s) => s.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-2.5">
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{category} Shortcuts</span>
                </div>

                <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/90 transition-colors"
                    >
                      <span className="text-xs text-slate-300 font-medium">
                        {item.description}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-1 bg-[#0b101c] border border-slate-700/80 rounded text-[11px] font-mono text-cyan-300 shadow-sm font-semibold">
                              {k}
                            </kbd>
                            {kIdx < item.keys.length - 1 && (
                              <span className="text-[10px] text-slate-500">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No shortcuts found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Drawer Footer tip */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0b101c] text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">?</kbd> anywhere to toggle</span>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

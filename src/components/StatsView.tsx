import React, { useState } from 'react';
import { Trophy, Target, Zap, Clock, Trash2, ArrowUpRight, BarChart2 } from 'lucide-react';
import { UserStats, Language } from '../types';
import { clearUserStats } from '../utils/storage';

import { DailyStreakBanner } from './DailyStreakBanner';

interface StatsViewProps {
  stats: UserStats;
  onClearStats: () => void;
  onRetestLanguage?: (lang: Language) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  onClearStats,
  onRetestLanguage,
}) => {
  const [filterLang, setFilterLang] = useState<string>('all');
  const [confirmingClear, setConfirmingClear] = useState<boolean>(false);

  const filteredHistory = stats.history.filter((h) => {
    return filterLang === 'all' || h.language === filterLang;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Daily Practice Streak Banner */}
      {stats.streak && <DailyStreakBanner streak={stats.streak} />}

      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Personal Best</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-mono font-bold text-amber-400 tabular-nums">
              {stats.bestWpm}
            </div>
            <span className="text-xs text-slate-500 font-mono">WPM Record</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Average Speed</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-mono font-bold text-cyan-400 tabular-nums">
              {stats.avgWpm}
            </div>
            <span className="text-xs text-slate-500 font-mono">WPM Overall</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Mean Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
              {stats.avgAccuracy}%
            </div>
            <span className="text-xs text-slate-500 font-mono">Across all sessions</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Drills</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-mono font-bold text-indigo-400 tabular-nums">
              {stats.testsCompleted}
            </div>
            <span className="text-xs text-slate-500 font-mono">{stats.totalWordsTyped} words typed</span>
          </div>
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <span>Speed Test History &amp; Analytics</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your typing performance and syntax bottlenecks over time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-cyan-500 focus:outline-none"
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

            {stats.history.length > 0 && (
              confirmingClear ? (
                <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-800 rounded-lg px-2 py-1 text-xs">
                  <span className="text-rose-300 font-mono text-[11px]">Clear all stats?</span>
                  <button
                    onClick={() => {
                      onClearStats();
                      setConfirmingClear(false);
                    }}
                    className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[10px]"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmingClear(false)}
                    className="px-1.5 py-0.5 bg-slate-800 text-slate-300 hover:text-white rounded text-[10px]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingClear(true)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Clear Test History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3 font-medium">Date</th>
                  <th className="py-2.5 px-3 font-medium">Mode</th>
                  <th className="py-2.5 px-3 font-medium">Language</th>
                  <th className="py-2.5 px-3 font-medium text-right">WPM</th>
                  <th className="py-2.5 px-3 font-medium text-right">Accuracy</th>
                  <th className="py-2.5 px-3 font-medium text-right">Time</th>
                  <th className="py-2.5 px-3 font-medium text-right">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">{h.date}</td>
                    <td className="py-2.5 px-3 capitalize text-slate-300">{h.mode}</td>
                    <td className="py-2.5 px-3 capitalize text-cyan-400">{h.language}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white tabular-nums">
                      {h.wpm}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400">
                      {h.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                      {h.duration}s
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-rose-400">
                      {h.errorChars}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            No typing tests recorded yet. Complete your first drill to see analytics!
          </div>
        )}
      </div>
    </div>
  );
};

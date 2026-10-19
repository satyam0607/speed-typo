import React from 'react';
import { Flame, Trophy, CheckCircle, Calendar, Target, Sparkles } from 'lucide-react';
import { DailyStreakInfo } from '../types';
import { getTodayDateString } from '../utils/storage';

interface DailyStreakBannerProps {
  streak: DailyStreakInfo;
}

export const DailyStreakBanner: React.FC<DailyStreakBannerProps> = ({ streak }) => {
  const today = getTodayDateString();
  const goalMet = streak.todayTestsCount >= streak.dailyGoal;
  const progressPercent = Math.min(
    Math.round((streak.todayTestsCount / Math.max(streak.dailyGoal, 1)) * 100),
    100
  );

  // Generate last 7 days representation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
    const isCompleted = streak.historyDates.includes(dateStr);
    const isToday = dateStr === today;
    return { dateStr, dayLetter, isCompleted, isToday };
  });

  return (
    <div className="w-full bg-[#0d1424] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left: Streak Flame & Title */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-500 p-0.5 flex items-center justify-center shrink-0 shadow-lg shadow-rose-950/40">
          <div className="w-full h-full bg-[#0b101c] rounded-[10px] flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
              {streak.currentStreak}
            </span>
            <span className="text-sm font-bold text-amber-400">Day Practice Streak</span>
            {goalMet && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                Today Goal Met ✓
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>Personal Best: <strong className="text-white font-mono">{streak.bestStreak} days</strong></span>
            <span>·</span>
            <span>
              {goalMet
                ? 'Great job! Your daily practice streak is locked in.'
                : `${Math.max(streak.dailyGoal - streak.todayTestsCount, 1)} more drill needed today to advance streak`}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Today's Goal & 7-Day Calendar Dots */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
        {/* Progress bar towards daily goal */}
        <div className="w-full sm:w-36 space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Daily Goal</span>
            <span className="text-white font-bold tabular-nums">
              {streak.todayTestsCount} / {streak.dailyGoal}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                goalMet ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-cyan-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 7-Day mini streak calendar dots */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          {last7Days.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-slate-500">{day.dayLetter}</span>
              <div
                title={`${day.dateStr}: ${day.isCompleted ? 'Practiced' : 'No drills'}`}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition-colors ${
                  day.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : day.isToday
                    ? 'bg-slate-900 border border-cyan-500 text-cyan-400 animate-pulse'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}
              >
                {day.isCompleted ? '✓' : day.isToday ? '•' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

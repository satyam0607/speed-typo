import React from 'react';
import { RotateCcw, ArrowRight, Share2, Check, Award, AlertCircle } from 'lucide-react';
import { TestResult } from '../types';

interface ResultsModalProps {
  result: TestResult;
  onRestart: () => void;
  onNextSnippet?: () => void;
  onPracticeTroubleKeys?: (keys: string[]) => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onRestart,
  onNextSnippet,
  onPracticeTroubleKeys,
}) => {
  const [copied, setCopied] = React.useState(false);

  const troubleKeyEntries = Object.entries(result.troubleKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const troubleKeysList = troubleKeyEntries.map(([k]) => k);

  const handleShare = () => {
    const text = `💻 SyntaxType Speed Test Result:
⚡ ${result.wpm} WPM · 🎯 ${result.accuracy}% Accuracy · ⏱️ ${result.duration}s
Language/Mode: ${result.language.toUpperCase()} (${result.mode})
Improve your syntax speed with SyntaxType!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sparkline calculation for WPM graph
  const maxWpm = Math.max(...result.wpmHistory, 10);
  const minWpm = Math.min(...result.wpmHistory, 0);
  const range = Math.max(maxWpm - minWpm, 1);
  const graphWidth = 380;
  const graphHeight = 80;

  const points = result.wpmHistory.map((val, idx) => {
    const x = (idx / Math.max(result.wpmHistory.length - 1, 1)) * graphWidth;
    const y = graphHeight - ((val - minWpm) / range) * (graphHeight - 16) - 8;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Award className="w-4 h-4" />
              <span>TEST COMPLETE</span>
              <span>·</span>
              <span className="capitalize">{result.language}</span>
              <span>·</span>
              <span className="capitalize">{result.mode}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Typing Performance Report</h2>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-center">
            <span className="text-xs text-slate-400 block font-medium">Speed</span>
            <div className="text-3xl font-mono font-bold text-cyan-400 tabular-nums mt-0.5">
              {result.wpm}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">WPM</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-center">
            <span className="text-xs text-slate-400 block font-medium">Accuracy</span>
            <div className="text-3xl font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
              {result.accuracy}%
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{result.errorChars} errors</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-center">
            <span className="text-xs text-slate-400 block font-medium">Raw Speed</span>
            <div className="text-3xl font-mono font-bold text-slate-200 tabular-nums mt-0.5">
              {result.rawWpm}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Raw WPM</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-center">
            <span className="text-xs text-slate-400 block font-medium">Duration</span>
            <div className="text-3xl font-mono font-bold text-amber-400 tabular-nums mt-0.5">
              {result.duration}s
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{result.totalChars} chars</span>
          </div>
        </div>

        {/* WPM Trend Chart */}
        {result.wpmHistory.length > 2 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Speed Stability Curve</span>
              <span className="font-mono tabular-nums text-slate-500">
                Peak: {Math.max(...result.wpmHistory)} WPM
              </span>
            </div>
            <div className="w-full h-20 relative flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Baseline grid */}
                <line x1="0" y1={graphHeight - 1} x2={graphWidth} y2={graphHeight - 1} stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1={graphHeight / 2} x2={graphWidth} y2={graphHeight / 2} stroke="#1e293b" strokeDasharray="4 4" />
                {/* Area fill */}
                <polygon
                  points={`0,${graphHeight} ${points} ${graphWidth},${graphHeight}`}
                  fill="url(#wpmGradient)"
                />
                {/* Sparkline stroke */}
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Trouble Keys / Syntax Bottlenecks */}
        {troubleKeyEntries.length > 0 ? (
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Syntax Bottlenecks (Mistake Keys)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {troubleKeyEntries.map(([key, count]) => (
                <div
                  key={key}
                  className="px-2.5 py-1 bg-slate-900 border border-rose-900/50 rounded text-xs font-mono flex items-center gap-2"
                >
                  <span className="text-white font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                    {key === ' ' ? 'Space' : key}
                  </span>
                  <span className="text-rose-400 text-[11px] tabular-nums">{count} errors</span>
                </div>
              ))}
              {onPracticeTroubleKeys && (
                <button
                  onClick={() => onPracticeTroubleKeys(troubleKeysList)}
                  className="ml-auto text-xs font-medium text-rose-300 hover:text-white underline decoration-rose-500/50 hover:decoration-white"
                >
                  Drill these keys →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pristine syntax run! Zero symbol errors detected.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (Esc)</span>
          </button>
          
          {onNextSnippet && (
            <button
              onClick={onNextSnippet}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Next Snippet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

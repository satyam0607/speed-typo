import React from 'react';
import { Sparkles, Terminal, Flame, ShieldAlert, Baby, GraduationCap, Cpu } from 'lucide-react';
import { SegmentTier } from '../types';
import { SEGMENT_CONFIG } from '../data/syntaxDictionary';

interface SegmentSelectorProps {
  currentSegment: SegmentTier;
  onSelectSegment: (tier: SegmentTier) => void;
}

export const SegmentSelector: React.FC<SegmentSelectorProps> = ({
  currentSegment,
  onSelectSegment,
}) => {
  const tiers: SegmentTier[] = ['kids', 'teens', 'pro'];

  const getTierIcon = (tier: SegmentTier) => {
    switch (tier) {
      case 'kids':
        return <Baby className="w-4 h-4 text-emerald-400" />;
      case 'teens':
        return <GraduationCap className="w-4 h-4 text-cyan-400" />;
      case 'pro':
        return <Cpu className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
            Practice Level &amp; Audience
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Choose Your Word Speed Segment
          </h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Active: <span className="text-white font-bold">{SEGMENT_CONFIG[currentSegment].ageRange}</span>
        </div>
      </div>

      {/* Segment Cards / Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {tiers.map((tier) => {
          const config = SEGMENT_CONFIG[tier];
          const isSelected = currentSegment === tier;

          return (
            <button
              key={tier}
              onClick={() => onSelectSegment(tier)}
              className={`p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    {getTierIcon(tier)}
                    <span>{config.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      tier === 'kids'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                        : tier === 'teens'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                        : 'bg-purple-950 text-purple-300 border border-purple-800/80'
                    }`}
                  >
                    {config.difficultyLabel}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono mb-1.5">
                  Age: {config.ageRange}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {config.description}
                </p>
              </div>

              {/* Sample word pills */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex flex-wrap gap-1">
                {config.sampleWords.slice(0, 4).map((w) => (
                  <span
                    key={w}
                    className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-800/80 text-slate-300 rounded"
                  >
                    {w}
                  </span>
                ))}
                <span className="text-[10px] text-slate-500 font-mono self-center">
                  +{config.words.length - 4} words
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

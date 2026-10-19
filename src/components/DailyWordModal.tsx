import React, { useState } from 'react';
import { X, Sparkles, Play, Copy, Check, Lightbulb, Music } from 'lucide-react';
import { SyntaxWord } from '../types';
import { playWordTune } from '../utils/soundEffects';

interface DailyWordModalProps {
  word: SyntaxWord;
  isOpen: boolean;
  onClose: () => void;
  onPractice: (word: SyntaxWord) => void;
  onShuffle: () => void;
}

export const DailyWordModal: React.FC<DailyWordModalProps> = ({
  word,
  isOpen,
  onClose,
  onPractice,
  onShuffle,
}) => {
  const [copied, setCopied] = useState(false);
  const [playingTune, setPlayingTune] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(word.exampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTune = () => {
    setPlayingTune(true);
    playWordTune(word.term, 'melodic');
    setTimeout(() => setPlayingTune(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-5 sm:p-8 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono font-semibold text-cyan-300 bg-cyan-950 border border-cyan-800 rounded">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>LEARN &amp; PRACTICE</span>
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="capitalize">{word.language}</span>
              <span>·</span>
              <span className="capitalize">{word.category}</span>
              <span>·</span>
              <span className="capitalize">{word.difficulty}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-mono font-bold text-white tracking-tight">
              {word.term}
            </h2>
            <button
              onClick={handleTune}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-300 bg-slate-900 border border-cyan-800/80 rounded-md hover:border-cyan-500 transition-colors"
            >
              <Music className={`w-3.5 h-3.5 ${playingTune ? 'animate-bounce text-cyan-400' : ''}`} />
              <span>{playingTune ? 'Playing Tune...' : 'Word Tune ♪'}</span>
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {word.definition}
          </p>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed space-y-2">
          <p>{word.explanation}</p>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Pro Tip: </strong>
              {word.proTip}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Syntax Example:</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3.5 bg-[#080d16] border border-slate-800 rounded-lg font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
            {word.exampleSnippet}
          </pre>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <button
            onClick={onShuffle}
            className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            Show Another Word
          </button>

          <button
            onClick={() => {
              onClose();
              onPractice(word);
            }}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-950"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice This Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Code2, Play, Terminal, Zap, ShieldCheck } from 'lucide-react';
import { CodeSnippet, Language } from '../types';
import { CODE_SNIPPETS } from '../data/codeSnippets';

interface SyntaxDrillsProps {
  onSelectSnippet: (snippet: CodeSnippet) => void;
}

export const SyntaxDrills: React.FC<SyntaxDrillsProps> = ({ onSelectSnippet }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('all');
  const [selectedDiff, setSelectedDiff] = useState<string>('all');

  const filtered = CODE_SNIPPETS.filter((s) => {
    const matchesLang = selectedLang === 'all' || s.language === selectedLang;
    const matchesDiff = selectedDiff === 'all' || s.difficulty === selectedDiff;
    return matchesLang && matchesDiff;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Zap className="w-4 h-4" />
            <span>REAL CODE SPEED DRILLS</span>
          </div>
          <h2 className="text-xl font-bold text-white">Syntax &amp; Structural Typing Challenges</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Type realistic production patterns across multiple languages. Master brackets, arrows, pointers, indents, and semicolons without hesitating.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <span className="text-xs font-mono text-slate-400">
            {filtered.length} snippets ready
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1322] border border-slate-800/80 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 font-mono mr-1">Language:</span>
          {(['all', 'typescript', 'python', 'rust', 'go', 'sql', 'html-css', 'git-bash'] as Language[]).map(
            (lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                  selectedLang === lang
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lang === 'all' ? 'All' : lang}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-mono mr-1">Difficulty:</span>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDiff(diff)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors capitalize ${
                selectedDiff === diff
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets List */}
      <div className="space-y-4">
        {filtered.map((snippet) => (
          <div
            key={snippet.id}
            className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize font-mono text-cyan-400">{snippet.language}</span>
                  <span>·</span>
                  <span className="capitalize">{snippet.difficulty}</span>
                  <span>·</span>
                  <span className="font-mono">{snippet.code.split('\n').length} lines</span>
                </div>
                <h3 className="text-base font-semibold text-white mt-1">{snippet.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{snippet.description}</p>
              </div>

              <button
                onClick={() => onSelectSnippet(snippet)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-center shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Drill</span>
              </button>
            </div>

            {/* Code Box */}
            <pre className="p-3.5 bg-[#080d16] border border-slate-800/90 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              {snippet.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

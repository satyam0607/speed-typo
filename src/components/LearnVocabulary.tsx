import React, { useState } from 'react';
import { Search, Sparkles, Code, Play, Copy, Check, Lightbulb, BookOpen, Layers, Music, Volume2 } from 'lucide-react';
import { SyntaxWord, Language, Difficulty, SoundTheme, SegmentTier } from '../types';
import { SYNTAX_DICTIONARY } from '../data/syntaxDictionary';
import { playWordTune } from '../utils/soundEffects';

interface LearnVocabularyProps {
  onPracticeWord: (word: SyntaxWord) => void;
  featuredWord: SyntaxWord;
  onRefreshDailyWord: () => void;
  soundType: SoundTheme;
}

export const LearnVocabulary: React.FC<LearnVocabularyProps> = ({
  onPracticeWord,
  featuredWord,
  onRefreshDailyWord,
  soundType,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<'all' | SegmentTier>('all');
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [playingTuneId, setPlayingTuneId] = useState<string | null>(null);

  const handlePlayWordTune = (id: string, term: string) => {
    setPlayingTuneId(id);
    const activeTheme = soundType === 'off' ? 'melodic' : soundType;
    playWordTune(term, activeTheme);
    setTimeout(() => setPlayingTuneId(null), 1200);
  };

  const filteredWords = SYNTAX_DICTIONARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exampleSnippet.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = selectedLanguage === 'all' || item.language === selectedLanguage;
    const matchesDiff = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    let matchesSegment = true;
    if (selectedSegment === 'kids') {
      matchesSegment = item.tier === 'kids' || item.difficulty === 'beginner';
    } else if (selectedSegment === 'teens') {
      matchesSegment = item.tier === 'teens' || item.difficulty === 'beginner' || item.difficulty === 'intermediate';
    } else if (selectedSegment === 'pro') {
      matchesSegment = item.tier === 'pro' || item.difficulty === 'advanced';
    }

    return matchesSearch && matchesLang && matchesDiff && matchesSegment;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Featured Word of the Day Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0e1626] to-[#0a1120] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>WORD OF THE DAY</span>
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="capitalize">{featuredWord.language}</span>
                <span>·</span>
                <span className="capitalize">{featuredWord.category}</span>
                <span>·</span>
                <span className="capitalize">{featuredWord.difficulty}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {featuredWord.term}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {featuredWord.definition}
            </p>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Pro Tip: </strong>
                {featuredWord.proTip}
              </div>
            </div>
          </div>

          {/* Right action & snippet preview */}
          <div className="w-full lg:w-auto flex flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onPracticeWord(featuredWord)}
              className="w-full lg:w-auto px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Practice This Word Now</span>
            </button>

            <button
              onClick={() => handlePlayWordTune(featuredWord.id, featuredWord.term)}
              className="w-full lg:w-auto px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 border border-cyan-800/60"
            >
              <Music className={`w-3.5 h-3.5 ${playingTuneId === featuredWord.id ? 'animate-bounce text-cyan-400' : ''}`} />
              <span>{playingTuneId === featuredWord.id ? 'Playing Word Tune...' : 'Play Word Tune ♪'}</span>
            </button>

            <button
              onClick={onRefreshDailyWord}
              className="w-full lg:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors text-center border border-slate-700"
            >
              Shuffle Next Word
            </button>
          </div>
        </div>

        {/* Featured Code Snippet */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Syntax in Action:</span>
            <button
              onClick={() => handleCopyCode(featuredWord.id, featuredWord.exampleSnippet)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {copiedSnippetId === featuredWord.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-[#070b12] border border-slate-800 rounded-lg font-mono text-xs sm:text-sm text-cyan-200 overflow-x-auto leading-relaxed">
            {featuredWord.exampleSnippet}
          </pre>
        </div>
      </div>

      {/* Search & Filtering Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Coding Syntax &amp; Vocabulary Library</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore essential keywords, language idioms, and syntax structures with instant typing drills.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search keywords, syntax, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Audience / Segment filter buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 mt-2">
          <span className="text-xs text-slate-500 font-mono mr-1">Audience:</span>
          <button
            onClick={() => setSelectedSegment('all')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              selectedSegment === 'all'
                ? 'bg-slate-700 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Audiences
          </button>
          <button
            onClick={() => setSelectedSegment('kids')}
            className={`px-3 py-1 text-xs rounded-md transition-colors font-mono ${
              selectedSegment === 'kids'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-emerald-400 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            Kids (6-10) · Easy
          </button>
          <button
            onClick={() => setSelectedSegment('teens')}
            className={`px-3 py-1 text-xs rounded-md transition-colors font-mono ${
              selectedSegment === 'teens'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-cyan-400 hover:text-cyan-300 border border-slate-800'
            }`}
          >
            Teens (10-18) · Medium
          </button>
          <button
            onClick={() => setSelectedSegment('pro')}
            className={`px-3 py-1 text-xs rounded-md transition-colors font-mono ${
              selectedSegment === 'pro'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-purple-400 hover:text-purple-300 border border-slate-800'
            }`}
          >
            Pro (18+) · Hard &amp; Extreme
          </button>
        </div>

        {/* Filter tags (interactive button controls) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-mono mr-1">Language:</span>
          {(['all', 'javascript', 'typescript', 'python', 'rust', 'go', 'cpp', 'sql', 'html-css', 'git-bash'] as Language[]).map(
            (lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors whitespace-nowrap ${
                  selectedLanguage === lang
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lang === 'all' ? 'All' : lang}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono mr-1">Difficulty:</span>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 text-xs rounded-md transition-colors capitalize whitespace-nowrap ${
                selectedDifficulty === diff
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {diff}
            </button>
          ))}
          <span className="text-xs text-slate-500 font-mono ml-auto">
            {filteredWords.length} items found
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => {
          const isExpanded = expandedWordId === word.id;

          return (
            <div
              key={word.id}
              className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-3 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Metadata row */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="capitalize text-cyan-400 font-mono font-medium">{word.language}</span>
                    <span>·</span>
                    <span className="capitalize">{word.category}</span>
                    <span>·</span>
                    <span className="capitalize">{word.difficulty}</span>
                  </div>
                </div>

                {/* Term title & tune button */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-lg font-mono font-bold text-white tracking-tight">
                    {word.term}
                  </h4>
                  <button
                    onClick={() => handlePlayWordTune(word.id, word.term)}
                    title={`Listen to tune for ${word.term}`}
                    className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-800/80 rounded transition-colors"
                  >
                    <Music className={`w-3 h-3 ${playingTuneId === word.id ? 'animate-bounce text-cyan-300' : ''}`} />
                    <span>{playingTuneId === word.id ? 'Tune ♪' : 'Tune'}</span>
                  </button>
                </div>

                {/* Definition */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {word.definition}
                </p>

                {/* Expandable explanation */}
                {isExpanded && (
                  <div className="pt-2 space-y-2 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                    <p>{word.explanation}</p>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      <strong className="text-amber-300">Gotcha / Tip: </strong>
                      {word.proTip}
                    </div>
                  </div>
                )}
              </div>

              {/* Code snippet preview */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Syntax preview</span>
                  <button
                    onClick={() => handleCopyCode(word.id, word.exampleSnippet)}
                    className="hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    {copiedSnippetId === word.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippetId === word.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#080d16] border border-slate-800/90 rounded-md font-mono text-xs text-cyan-200 overflow-x-auto">
                  {word.exampleSnippet}
                </pre>

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                    className="text-xs text-slate-400 hover:text-white underline decoration-slate-700"
                  >
                    {isExpanded ? 'Hide Concept Details' : 'Read Full Concept'}
                  </button>

                  <button
                    onClick={() => onPracticeWord(word)}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice Word</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-16 bg-[#0f172a] border border-slate-800 rounded-xl space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-semibold text-white">No vocabulary found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing language filters to see all available syntax words.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('all');
              setSelectedDifficulty('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

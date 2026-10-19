import React, { useState, useEffect } from 'react';
import { Plus, Play, Trash2, Code, FileText, Check } from 'lucide-react';
import { CodeSnippet, Language } from '../types';
import { loadCustomSnippets, saveCustomSnippet, deleteCustomSnippet } from '../utils/storage';

interface CustomPracticeProps {
  onPracticeCustom: (snippet: CodeSnippet) => void;
}

export const CustomPractice: React.FC<CustomPracticeProps> = ({ onPracticeCustom }) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<Language>('typescript');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSnippets(loadCustomSnippets());
  }, []);

  const handleSaveAndPractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a snippet title');
      return;
    }
    if (!code.trim()) {
      setError('Please enter or paste the code/words to practice');
      return;
    }

    const newSnippet: CodeSnippet = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      language,
      difficulty: 'intermediate',
      description: 'Custom user code snippet',
      code: code.trim()
    };

    const updated = saveCustomSnippet(newSnippet);
    setSnippets(updated);
    setTitle('');
    setCode('');
    setError(null);

    onPracticeCustom(newSnippet);
  };

  const handleDelete = (id: string) => {
    const updated = deleteCustomSnippet(id);
    setSnippets(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Form Container */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Plus className="w-4 h-4" />
            <span>CUSTOM SYNTAX PRACTICE</span>
          </div>
          <h2 className="text-xl font-bold text-white">Paste Your Custom Code or Words</h2>
          <p className="text-xs text-slate-400 mt-1">
            Practice typing your actual project code, complex regex, algorithmic patterns, or specific syntax combinations you struggle with.
          </p>
        </div>

        <form onSubmit={handleSaveAndPractice} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Snippet Title</label>
              <input
                type="text"
                placeholder="e.g., React useEffect Cleanup, Regex Email Validator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="typescript">TypeScript / JS</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="cpp">C++</option>
                <option value="sql">SQL</option>
                <option value="html-css">HTML &amp; CSS</option>
                <option value="git-bash">Git / Shell</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Code or Words to Type (Multi-line supported)
            </label>
            <textarea
              rows={8}
              placeholder={`const validateToken = (token: string): boolean => {\n  if (!token) return false;\n  return token.startsWith("ey");\n};`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#080d16] border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-mono">
              {code.length} characters · {code.split(/\s+/).filter(Boolean).length} words
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-md shadow-cyan-950"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Save &amp; Practice Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* Previously Saved Snippets */}
      {snippets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white">Your Saved Custom Snippets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snippets.map((snip) => (
              <div
                key={snip.id}
                className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="capitalize text-cyan-400 font-mono">{snip.language}</span>
                    <button
                      onClick={() => handleDelete(snip.id)}
                      title="Delete Snippet"
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{snip.title}</h4>
                </div>

                <pre className="p-2.5 bg-[#080d16] border border-slate-800/90 rounded font-mono text-[11px] text-slate-300 max-h-24 overflow-y-auto">
                  {snip.code}
                </pre>

                <button
                  onClick={() => onPracticeCustom(snip)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Practice This</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

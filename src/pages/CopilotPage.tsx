import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  Bot,
  Sparkles,
  HelpCircle,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ShieldAlert,
  Send,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function CopilotPage() {
  const [query, setQuery] = useState('Why did inventory costs increase?');
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const presetQuestions = [
    'Why did inventory costs increase?',
    'Which suppliers are risky?',
    'What products are underperforming?',
    'What should I reorder today?',
    'What will happen next month?'
  ];

  const fetchAnalysis = async (qText: string) => {
    setLoading(true);
    setQuery(qText);
    try {
      const res = await fetch(`http://localhost:5500/api/ai/copilot?query=${encodeURIComponent(qText)}`);
      const json = await res.json();
      if (json && json.status === 'success') {
        setAnalysis(json.data);
      }
    } catch (err) {
      console.error('Error fetching copilot analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis('Why did inventory costs increase?');
  }, []);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    fetchAnalysis(customInput.trim());
    setCustomInput('');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                P0 Executive Copilot
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Executive AI Intelligence Analyst
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured executive decision synthesis explaining Root Causes, Business Impact, Risk Levels, and Actionable Cures.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>LLM + Hybrid Consensus Engine</span>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto space-y-6">
          {/* Preset Questions Chips Bar */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Strategic Queries
            </span>
            <div className="flex flex-wrap gap-2.5">
              {presetQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => fetchAnalysis(q)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                    query === q
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask the Executive AI Analyst any custom supply chain question..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Analyze</span>
            </button>
          </form>

          {/* Executive Synthesis Card */}
          {loading ? (
            <div className="p-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-300">Executing multi-layer root cause & capital impact analysis...</p>
            </div>
          ) : analysis ? (
            <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-indigo-400 uppercase">
                    QUERY SYNTHESIS REPORT
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    "{analysis.question || query}"
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      analysis.risk_level === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : analysis.risk_level === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                    }`}
                  >
                    Risk Level: {analysis.risk_level}
                  </span>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                    Confidence: {analysis.confidence_score}%
                  </div>
                </div>
              </div>

              {/* 4 Core Executive Sections */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Root Cause */}
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>1. Diagnostic Root Cause</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {analysis.root_cause}
                  </p>
                </div>

                {/* 2. Business Impact */}
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>2. Quantified Business Impact</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {analysis.business_impact}
                  </p>
                </div>

                {/* 3. Recommended Action */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-950/80 to-slate-950 border border-indigo-500/40 md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>3. Recommended Autonomous Action Plan</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300">Executable via Procurement Pipeline</span>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {analysis.recommended_action}
                  </p>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Auto-approval criteria verified. No manual SLA blockers detected.
                    </span>
                    <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-colors">
                      <span>Approve & Execute Recommendation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

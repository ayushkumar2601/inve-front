import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  Bot,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Apple Intelligence / ChatGPT Enterprise Header */}
        <header className="border-b border-[#E5E5E7] bg-white/90 backdrop-blur-xl sticky top-0 z-30 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold uppercase tracking-wider">
                Apple Intelligence • Executive Copilot
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Executive AI Decision Analyst
              </h1>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              Conversational synthesis of portfolio root causes, working capital efficiency, and automated supplier actions.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F]">
            <Sparkles className="w-4 h-4 text-[#0071E3]" />
            <span>Multi-Model Consensus 99.4%</span>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Conversational Prompt Suggestions */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
              Executive Strategic Queries
            </span>
            <div className="flex flex-wrap gap-3">
              {presetQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => fetchAnalysis(q)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2.5 ${
                    query === q
                      ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-md'
                      : 'bg-white text-[#48484A] border-[#E5E5E7] hover:border-[#1D1D1F] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Bot className={`w-3.5 h-3.5 ${query === q ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Large Conversational Input Box */}
          <form onSubmit={handleCustomSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Ask the Executive AI Analyst any supply chain or working capital question..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-white border border-[#E5E5E7] focus:border-[#0071E3] rounded-2xl px-5 py-4 text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none shadow-2xs transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-[#0071E3] hover:bg-[#0066CC] text-white font-medium text-sm flex items-center gap-2.5 shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Synthesize</span>
            </button>
          </form>

          {/* Structured Executive Response Card */}
          {loading ? (
            <div className="apple-card p-14 text-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#0071E3] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#6E6E73]">Synthesizing executive root cause and capital impact model...</p>
            </div>
          ) : analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-card overflow-hidden"
            >
              {/* Executive Summary Header */}
              <div className="p-8 border-b border-[#E5E5E7] bg-[#FAFAFA] flex items-start justify-between gap-6">
                <div>
                  <div className="text-xs font-mono font-semibold text-[#86868B] uppercase tracking-wider">
                    EXECUTIVE SYNTHESIS BRIEF
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1D1D1F] mt-1.5">
                    "{analysis.question || query}"
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase ${
                      analysis.risk_level === 'Critical'
                        ? 'bg-[#FF453A]/10 text-[#FF453A]'
                        : analysis.risk_level === 'High'
                        ? 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
                        : 'bg-[#0071E3]/10 text-[#0071E3]'
                    }`}
                  >
                    Risk Level: {analysis.risk_level}
                  </span>
                  <div className="px-3.5 py-1.5 rounded-full bg-[#34C759]/10 text-[#34C759] text-xs font-semibold">
                    Confidence: {analysis.confidence_score}%
                  </div>
                </div>
              </div>

              {/* 4 Core Executive Sections */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Diagnostic Root Cause */}
                <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-[#E5E5E7] space-y-3">
                  <div className="flex items-center gap-2 text-[#1D1D1F] text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-[#FF453A]" />
                    <span>1. Diagnostic Root Cause</span>
                  </div>
                  <p className="text-sm text-[#48484A] leading-relaxed">
                    {analysis.root_cause}
                  </p>
                </div>

                {/* 2. Quantified Business Impact */}
                <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-[#E5E5E7] space-y-3">
                  <div className="flex items-center gap-2 text-[#1D1D1F] text-xs font-semibold uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-[#0071E3]" />
                    <span>2. Quantified Business Impact</span>
                  </div>
                  <p className="text-sm text-[#48484A] leading-relaxed">
                    {analysis.business_impact}
                  </p>
                </div>

                {/* 3. Recommended Action Plan */}
                <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E7] md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1D1D1F] text-xs font-semibold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                      <span>3. Recommended Autonomous Action Plan</span>
                    </div>
                    <span className="text-xs text-[#86868B]">1-Click Execution via Procurement Pipeline</span>
                  </div>
                  <p className="text-base font-semibold text-[#1D1D1F]">
                    {analysis.recommended_action}
                  </p>
                  <div className="pt-4 border-t border-[#E5E5E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="text-xs text-[#6E6E73]">
                      Auto-approval criteria verified. EDI routing pre-authorized.
                    </span>
                    <button className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#0066CC] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs">
                      <span>Execute Action Safeguard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

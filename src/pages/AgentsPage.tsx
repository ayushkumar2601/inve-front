import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  Layers,
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  GitCommit,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAgents = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/ai/agents');
      const json = await res.json();
      if (json && json.status === 'success') {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching agents data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const agents = data?.agents || [
    {
      id: "agent-forecast",
      name: "Forecast Agent",
      role: "Predictive Demand & Seasonality Specialist",
      status: "Active",
      last_action: "Computed 30-day demand forecast for 100 SKUs",
      confidence: 94.8,
      tasks_completed: 1420,
      performance: "99.2% uptime"
    }
  ];

  const graphLinks = data?.communication_graph?.links || [
    { source: "Forecast Agent", target: "Risk Agent", message: "Imminent Stockout Warning (94% confidence)" },
    { source: "Risk Agent", target: "Procurement Agent", message: "Escalated $18,400 Revenue Risk Action" },
    { source: "Supplier Agent", target: "Procurement Agent", message: "Recommended Apex Electronics (7-day lead time)" },
    { source: "Procurement Agent", target: "Finance Agent", message: "Requesting $4,500 working capital allocation" },
    { source: "Finance Agent", target: "Procurement Agent", message: "Budget Approved (ROI +14.2%)" }
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
                P2 Multi-Agent Layer
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Autonomous Multi-Agent Collaboration Network
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Specialized autonomous AI agents orchestrating inventory intelligence, risk auditing, supplier scoring, and capital execution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAgents}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Network</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 Agents Active</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* 5 Autonomous Agent Scorecards */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Specialized Agent Registry</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {agents.map((agent: any) => (
                <div
                  key={agent.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-purple-400" />
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {agent.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm mt-3">{agent.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{agent.role}</p>

                    <div className="mt-3 p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="font-mono text-indigo-400">Action:</span> {agent.last_action}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Confidence</span>
                      <span className="font-mono font-bold text-emerald-400">{agent.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tasks Done</span>
                      <span className="font-mono font-bold text-white">{agent.tasks_completed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Communication Network Visualization */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Agent-to-Agent Message & Consensus Graph</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time protocol visualization depicting inter-agent task handshakes and consensus routing.
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
                Consensus Latency: 142 ms
              </span>
            </div>

            <div className="space-y-3">
              {graphLinks.map((link: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold font-mono">
                      {link.source}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono">
                      {link.target}
                    </span>
                  </div>

                  <div className="flex-1 px-4 text-xs font-medium text-slate-300 border-l border-slate-800 md:mx-4">
                    💬 <span className="text-indigo-300">{link.message}</span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    ACKNOWLEDGED • 200 OK
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

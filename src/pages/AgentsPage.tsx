import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  Layers,
  Bot,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Apple Mission Control Header */}
        <header className="border-b border-[#E5E5E7] bg-white/90 backdrop-blur-xl sticky top-0 z-30 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold uppercase tracking-wider">
                Apple Mission Control
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Autonomous Agent Orchestration Registry
              </h1>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              Specialized autonomous AI agents orchestrating inventory intelligence, risk auditing, supplier scoring, and capital execution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAgents}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E5E7] hover:bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] transition-all shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#86868B]" />
              <span>Refresh Network</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34C759]/10 text-[#34C759] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
              <span>5 Agents Active</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Minimal Apple Mission Control Agent Cards */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0071E3]" />
              <span>Specialized Agent Registry</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {agents.map((agent: any, index: number) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="apple-card p-5 flex flex-col justify-between space-y-5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-[#F5F5F7] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-[#1D1D1F]" />
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] text-[11px] font-semibold">
                        {agent.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-[#1D1D1F] text-sm mt-4">{agent.name}</h3>
                    <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">{agent.role}</p>

                    <div className="mt-4 p-3 rounded-xl bg-[#F5F5F7] text-xs text-[#48484A]">
                      <span className="font-semibold text-[#1D1D1F]">Action:</span> {agent.last_action}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0F0F2] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#86868B] block text-[11px]">Confidence</span>
                      <span className="font-mono font-semibold text-[#34C759]">{agent.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-[#86868B] block text-[11px]">Tasks Done</span>
                      <span className="font-mono font-semibold text-[#1D1D1F]">{agent.tasks_completed}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Apple-Style Agent Communication Network */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-[#1D1D1F] flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#0071E3]" />
                  <span>Inter-Agent Protocol Consensus Routing</span>
                </h3>
                <p className="text-xs text-[#6E6E73] mt-1">
                  Real-time communication topology showing inter-agent task handshakes and consensus routing.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] text-xs font-mono font-medium">
                Consensus Latency: 14.2 ms
              </span>
            </div>

            <div className="space-y-3">
              {graphLinks.map((link: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#1D1D1F] text-white text-xs font-semibold">
                      {link.source}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#86868B]" />
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
                      {link.target}
                    </span>
                  </div>

                  <div className="flex-1 px-4 text-xs font-medium text-[#48484A] md:mx-4">
                    💬 <span className="text-[#1D1D1F] font-medium">{link.message}</span>
                  </div>

                  <span className="text-[11px] font-mono text-[#34C759] uppercase tracking-wider font-semibold">
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

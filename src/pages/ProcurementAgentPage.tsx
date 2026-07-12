import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Zap,
  Truck,
  DollarSign,
  Activity
} from 'lucide-react';

export default function ProcurementAgentPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchProcurement = async () => {
    try {
      const res = await fetch('http://localhost:5500/api/ai/agents/procurement');
      const json = await res.json();
      if (json && json.status === 'success') {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurement();
  }, []);

  const workflows = data?.active_workflows || [];
  const timeline = data?.activity_timeline || [];
  const metrics = data?.metrics || {
    autonomous_pos_generated: 142,
    human_interventions_saved: 128,
    avg_procurement_speed_seconds: 3.4,
    supplier_sla_compliance: 97.8
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                P1 Autonomous Agent
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Autonomous Procurement Pipeline
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-stage AI agent chain forecasting demand, auditing risk, scoring suppliers, and generating purchase orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProcurement}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Pipeline</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Level 4 Autonomous Execution</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* KPI Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase">Auto-POs Generated</span>
              <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics.autonomous_pos_generated}</div>
              <p className="text-[11px] text-emerald-400 mt-1">+14% vs last month</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase">Human Reviews Saved</span>
              <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics.human_interventions_saved} hrs</div>
              <p className="text-[11px] text-indigo-400 mt-1">Direct PO EDI routing</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase">Avg Pipeline Latency</span>
              <div className="text-2xl font-bold text-white mt-1 font-mono">{metrics.avg_procurement_speed_seconds}s</div>
              <p className="text-[11px] text-cyan-400 mt-1">End-to-end consensus</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase">Supplier SLA Compliance</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{metrics.supplier_sla_compliance}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Continuous scoring</p>
            </div>
          </div>

          {/* Active Workflows & Pipeline Visualizer */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Active Multi-Agent Procurement Pipelines
            </h2>

            <div className="space-y-4">
              {workflows.map((wf: any) => (
                <div
                  key={wf.id}
                  className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-indigo-400">{wf.id}</span>
                        <span className="text-white font-bold text-base">{wf.product_name}</span>
                        <span className="text-xs text-slate-400 font-mono">({wf.sku})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Supplier: <span className="text-slate-300">{wf.supplier_name}</span> • Quantity: {wf.quantity} units • Total: ${wf.total_cost.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          wf.status === 'Auto-Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {wf.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual 4-Stage Workflow Step Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {wf.steps?.map((step: any, idx: number) => (
                      <div
                        key={step.agent}
                        className={`p-3 rounded-lg border flex flex-col justify-between ${
                          step.status === 'completed'
                            ? 'bg-slate-950/80 border-emerald-500/40'
                            : step.status === 'in_progress'
                            ? 'bg-indigo-950/40 border-indigo-500/60 animate-pulse'
                            : 'bg-slate-950/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold">{step.agent}</span>
                          {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {step.status === 'in_progress' && <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                        </div>
                        <p className="text-[11px] mt-1.5 text-slate-300">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Activity Timeline (100 demo events) */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Autonomous Agent Activity Timeline ({timeline.length} Events)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Continuous Telemetry Audit Log</span>
            </div>

            <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-800/60">
              {timeline.map((act: any) => (
                <div key={act.id} className="p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500 w-16">{act.timestamp}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                          {act.agent_name}
                        </span>
                        <span className="font-semibold text-sm text-white">{act.action_title}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">{act.metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

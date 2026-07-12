import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Apple Enterprise Mission Control Header */}
        <header className="border-b border-[#E5E5E7] bg-white/90 backdrop-blur-xl sticky top-0 z-30 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold uppercase tracking-wider">
                Autonomous Mission Control
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Procurement Agent Execution Network
              </h1>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              Level 4 Autonomous Multi-Agent chain forecasting demand, auditing SLA risk, and issuing EDI purchase orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProcurement}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E5E7] hover:bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] transition-all shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#86868B]" />
              <span>Sync Pipeline</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34C759]/10 text-[#34C759] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Level 4 Autonomous Execution</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Apple KPI Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="apple-card p-5">
              <span className="text-xs font-medium text-[#6E6E73]">Auto-POs Generated</span>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2 font-mono">{metrics.autonomous_pos_generated}</div>
              <p className="text-[11px] text-[#34C759] mt-1 font-medium">+14% automated routing</p>
            </div>

            <div className="apple-card p-5">
              <span className="text-xs font-medium text-[#6E6E73]">Human Reviews Saved</span>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2 font-mono">{metrics.human_interventions_saved} hrs</div>
              <p className="text-[11px] text-[#0071E3] mt-1 font-medium">Direct PO execution</p>
            </div>

            <div className="apple-card p-5">
              <span className="text-xs font-medium text-[#6E6E73]">Avg Pipeline Latency</span>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2 font-mono">{metrics.avg_procurement_speed_seconds}s</div>
              <p className="text-[11px] text-[#86868B] mt-1">End-to-end consensus</p>
            </div>

            <div className="apple-card p-5">
              <span className="text-xs font-medium text-[#6E6E73]">Supplier SLA Compliance</span>
              <div className="text-2xl font-semibold text-[#34C759] mt-2 font-mono">{metrics.supplier_sla_compliance}%</div>
              <p className="text-[11px] text-[#86868B] mt-1">Continuous scoring</p>
            </div>
          </div>

          {/* Active Workflows & Apple Pipeline Cards */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#1D1D1F]">
              Active Multi-Agent Procurement Workflows
            </h2>

            <div className="space-y-4">
              {workflows.map((wf: any) => (
                <div
                  key={wf.id}
                  className="apple-card p-6 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-[#0071E3]">{wf.id}</span>
                        <span className="text-[#1D1D1F] font-semibold text-base">{wf.product_name}</span>
                        <span className="text-xs text-[#86868B] font-mono">({wf.sku})</span>
                      </div>
                      <p className="text-xs text-[#6E6E73] mt-1">
                        Supplier: <span className="text-[#1D1D1F] font-medium">{wf.supplier_name}</span> • Quantity: {wf.quantity} units • Total: ${wf.total_cost.toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        wf.status === 'Auto-Approved'
                          ? 'bg-[#34C759]/10 text-[#34C759]'
                          : 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
                      }`}
                    >
                      {wf.status}
                    </span>
                  </div>

                  {/* 4-Stage Visual Step Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {wf.steps?.map((step: any) => (
                      <div
                        key={step.agent}
                        className={`p-4 rounded-xl border flex flex-col justify-between ${
                          step.status === 'completed'
                            ? 'bg-[#FAFAFA] border-[#34C759]/30'
                            : step.status === 'in_progress'
                            ? 'bg-[#0071E3]/5 border-[#0071E3]/40'
                            : 'bg-[#F5F5F7] border-[#E5E5E7] text-[#86868B]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#1D1D1F]">{step.agent}</span>
                          {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#34C759]" />}
                          {step.status === 'in_progress' && <Clock className="w-4 h-4 text-[#0071E3] animate-spin" />}
                        </div>
                        <p className="text-xs mt-2 text-[#6E6E73]">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Activity Timeline Table */}
          <div className="apple-card overflow-hidden">
            <div className="p-6 border-b border-[#E5E5E7] bg-[#FAFAFA] flex items-center justify-between">
              <h3 className="font-semibold text-base text-[#1D1D1F] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0071E3]" />
                <span>Autonomous Agent Audit Log ({timeline.length} Events)</span>
              </h3>
              <span className="text-xs text-[#86868B] font-mono">Real-Time Telemetry</span>
            </div>

            <div className="max-h-[480px] overflow-y-auto divide-y divide-[#F0F0F2]">
              {timeline.map((act: any) => (
                <div key={act.id} className="p-5 hover:bg-[#F5F5F7]/70 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#86868B] w-16">{act.timestamp}</span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-[11px] font-semibold">
                          {act.agent_name}
                        </span>
                        <span className="font-semibold text-sm text-[#1D1D1F]">{act.action_title}</span>
                      </div>
                      <p className="text-xs text-[#6E6E73] mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#34C759] shrink-0">{act.metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

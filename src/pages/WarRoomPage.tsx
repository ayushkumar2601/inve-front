import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  PackageX,
  Truck,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  RefreshCw
} from 'lucide-react';

interface WarRoomEvent {
  id: string;
  time: string;
  timestamp: string;
  event_type: string;
  product_id: string;
  product_name: string;
  impact: string;
  revenue_risk: number;
  recommendation: string;
  severity: string;
  confidence_score: number;
}

export default function WarRoomPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWarRoom = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('http://localhost:5500/api/ai/war-room');
      const json = await res.json();
      if (json && json.status === 'success') {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching war room data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWarRoom();
  }, []);

  const metrics = data?.summary_metrics || {
    revenue_at_risk: 378046.88,
    potential_stockouts: 6,
    critical_suppliers: 3,
    orders_requiring_attention: 7,
    ai_confidence_score: 94.8
  };

  const criticalRisks = data?.critical_risks || [
    {
      id: "RISK-1",
      product_name: "Industrial Sensor X200",
      sku: "ELEC-SEN-200",
      risk_type: "Imminent Stockout",
      days_until_stockout: 4,
      revenue_impact: 18400.0,
      supplier: "Apex Electronics Corp",
      recommended_action: "Execute auto-replenishment PO-1042 for 300 units"
    }
  ];

  const events: WarRoomEvent[] = data?.timeline_feed || [];
  const filteredEvents = filterSeverity === 'all'
    ? events
    : events.filter((e) => e.severity === filterSeverity);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                P0 War Room
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Real-Time AI Command Center
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous live intelligence feed detecting inventory stockouts, supplier bottlenecks, and revenue risks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchWarRoom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Core Connected</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* P0 KPI Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-900/80 border border-rose-500/30 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-rose-300 uppercase tracking-wider">Revenue at Risk</span>
                <DollarSign className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                ${metrics.revenue_at_risk.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-[11px] text-rose-400/80 mt-1">Across 6 critical SKUs</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Potential Stockouts</span>
                <PackageX className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                {metrics.potential_stockouts} SKUs
              </div>
              <p className="text-[11px] text-slate-400 mt-1">≤ 7 days buffer remaining</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Critical Suppliers</span>
                <Truck className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                {metrics.critical_suppliers} Suppliers
              </div>
              <p className="text-[11px] text-slate-400 mt-1">SLA delays detected</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Orders Attn Required</span>
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                {metrics.orders_requiring_attention} POs
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pending auto-approval</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/80 border border-indigo-500/30 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">AI Confidence Score</span>
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
                {metrics.ai_confidence_score}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Multi-model consensus</p>
            </div>
          </div>

          {/* Critical Risks Action Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Imminent Critical Inventory Risks
              </h2>
              <span className="text-xs text-slate-400 font-mono">Actionable AI Safeguards</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {criticalRisks.map((risk: any) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-sm">{risk.product_name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{risk.sku} • {risk.supplier}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase">
                        {risk.days_until_stockout}d to Stockout
                      </span>
                    </div>
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{risk.risk_type}</span>
                      <span className="font-mono font-bold text-rose-400">${risk.revenue_impact.toLocaleString()} At Risk</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-indigo-300 font-medium truncate flex-1">
                      💡 {risk.recommended_action}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shrink-0">
                      Execute AI PO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live AI Risk Feed (50+ demo events timeline) */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Live AI Risk Feed ({events.length} Telemetry Events)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Only</option>
                  <option value="medium">Medium Only</option>
                </select>
              </div>
            </div>

            <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-800/60">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">Loading telemetry feed...</div>
              ) : (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-xs font-mono text-slate-500 w-12 shrink-0">
                        {event.time}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              event.severity === 'critical'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : event.severity === 'high'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            }`}
                          >
                            {event.severity}
                          </span>
                          <span className="text-sm font-semibold text-white">{event.event_type}</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          <span className="font-bold text-indigo-300">Product: {event.product_name}</span> — Impact: {event.impact}
                        </p>
                        <p className="text-xs text-emerald-400 font-medium">
                          ⚡ AI Recommendation: {event.recommendation}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="text-xs font-mono font-bold text-rose-400">
                        ${event.revenue_risk?.toLocaleString()} Risk
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Conf: {event.confidence_score}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

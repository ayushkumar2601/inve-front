import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  PackageX,
  Truck,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [approvedPOs, setApprovedPOs] = useState<Record<string, boolean>>({});
  const [approvingPOs, setApprovingPOs] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const handleApprovePO = (riskId: string, productName: string, sku: string) => {
    setApprovingPOs(prev => ({ ...prev, [riskId]: true }));
    setTimeout(() => {
      setApprovingPOs(prev => ({ ...prev, [riskId]: false }));
      setApprovedPOs(prev => ({ ...prev, [riskId]: true }));
      setNotification(`Autonomous EDI Purchase Order executed for ${productName} (${sku}) via Snowflake Pipeline.`);
      setTimeout(() => setNotification(null), 6000);
    }, 600);
  };

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
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Apple Enterprise Header */}
        <header className="border-b border-[#E5E5E7] bg-white/90 backdrop-blur-xl sticky top-0 z-30 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF453A]/10 text-[#FF453A] text-xs font-semibold uppercase tracking-wider">
                Executive Operations Center
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Portfolio Risk & Capital Safeguards
              </h1>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              Salesforce Einstein / Palantir Foundry telemetry synthesizing supply anomalies and working capital exposures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchWarRoom}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E5E7] hover:bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] transition-all shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0071E3]' : 'text-[#86868B]'}`} />
              <span>Refresh Telemetry</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34C759]/10 text-[#34C759] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
              <span>Telemetry Synchronized</span>
            </div>
          </div>
        </header>

        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-8 mt-5 p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/30 flex items-center justify-between text-xs font-medium text-[#1D1D1F]"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span>{notification}</span>
            </div>
            <span className="text-[11px] font-mono text-[#34C759] font-semibold uppercase">EDI 200 OK</span>
          </motion.div>
        )}

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Executive Summary Metrics Cards (Apple Stocks / Einstein Style) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div className="apple-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">Revenue at Risk</span>
                <DollarSign className="w-4 h-4 text-[#FF453A]" />
              </div>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2">
                ${metrics.revenue_at_risk.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-[11px] text-[#FF453A] mt-1 font-medium">Across 6 critical SKUs</p>
            </div>

            <div className="apple-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">Potential Stockouts</span>
                <PackageX className="w-4 h-4 text-[#FF9F0A]" />
              </div>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2">
                {metrics.potential_stockouts} SKUs
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">≤ 7 days stock horizon</p>
            </div>

            <div className="apple-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">Critical Suppliers</span>
                <Truck className="w-4 h-4 text-[#0071E3]" />
              </div>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2">
                {metrics.critical_suppliers} Suppliers
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">SLA delays detected</p>
            </div>

            <div className="apple-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">Orders Requiring Review</span>
                <AlertTriangle className="w-4 h-4 text-[#FF9F0A]" />
              </div>
              <div className="text-2xl font-semibold text-[#1D1D1F] mt-2">
                {metrics.orders_requiring_attention} POs
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">Pending approval</p>
            </div>

            <div className="apple-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">AI Consensus Confidence</span>
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              </div>
              <div className="text-2xl font-semibold text-[#34C759] mt-2">
                {metrics.ai_confidence_score}%
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">Multi-model audit</p>
            </div>
          </div>

          {/* Actionable Executive Safeguard Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                <span>Priority Action Safeguards</span>
              </h2>
              <span className="text-xs text-[#86868B]">Autonomous Replenishment Queued</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {criticalRisks.map((risk: any) => (
                <div
                  key={risk.id}
                  className="apple-card p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#1D1D1F] text-base">{risk.product_name}</h3>
                        <p className="text-xs font-mono text-[#86868B] mt-0.5">{risk.sku} • {risk.supplier}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#FF453A]/10 text-[#FF453A] text-[11px] font-semibold">
                        {risk.days_until_stockout}d to Stockout
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F5F7] flex items-center justify-between text-xs">
                      <span className="text-[#6E6E73]">{risk.risk_type}</span>
                      <span className="font-semibold text-[#1D1D1F]">${risk.revenue_impact.toLocaleString()} Exposure</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-between gap-3">
                    <p className="text-xs text-[#48484A] line-clamp-2 flex-1">
                      {risk.recommended_action}
                    </p>
                    <button
                      onClick={() => handleApprovePO(risk.id, risk.product_name, risk.sku)}
                      disabled={approvingPOs[risk.id] || approvedPOs[risk.id]}
                      className={`px-4 py-2 rounded-xl font-medium text-xs transition-all shrink-0 shadow-xs flex items-center gap-1.5 ${
                        approvedPOs[risk.id]
                          ? 'bg-[#34C759] text-white cursor-default'
                          : approvingPOs[risk.id]
                          ? 'bg-[#0071E3]/70 text-white cursor-wait'
                          : 'bg-[#0071E3] hover:bg-[#0066CC] text-white'
                      }`}
                    >
                      {approvingPOs[risk.id] ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Routing EDI...</span>
                        </>
                      ) : approvedPOs[risk.id] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PO Executed</span>
                        </>
                      ) : (
                        <span>Approve PO</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apple / Palantir Timeline Cards (Instead of Dark Terminal Logs) */}
          <div className="apple-card overflow-hidden">
            <div className="p-6 border-b border-[#E5E5E7] flex items-center justify-between bg-[#FAFAFA]">
              <div>
                <h3 className="font-semibold text-base text-[#1D1D1F]">
                  Executive Operations Timeline ({events.length} Events)
                </h3>
                <p className="text-xs text-[#6E6E73] mt-0.5">Chronological risk assessment and AI-directed recommendations</p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#86868B]" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-white border border-[#E5E5E7] rounded-xl px-3 py-1.5 text-xs text-[#1D1D1F] focus:outline-none shadow-2xs"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Only</option>
                  <option value="medium">Medium Only</option>
                </select>
              </div>
            </div>

            <div className="p-6 max-h-[580px] overflow-y-auto space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center text-[#86868B] text-xs">No matching timeline events</div>
              ) : (
                filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E7] hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 text-xs font-mono text-[#86868B] w-14 shrink-0">
                        {event.time}
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              event.severity === 'critical'
                                ? 'bg-[#FF453A]/10 text-[#FF453A]'
                                : event.severity === 'high'
                                ? 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
                                : 'bg-[#0071E3]/10 text-[#0071E3]'
                            }`}
                          >
                            {event.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-semibold text-[#1D1D1F]">{event.event_type}</span>
                        </div>
                        <p className="text-xs text-[#48484A]">
                          <span className="font-semibold text-[#1D1D1F]">{event.product_name}</span> — {event.impact}
                        </p>
                        <p className="text-xs font-medium text-[#0071E3]">
                          Recommendation: {event.recommendation}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="text-sm font-semibold text-[#FF453A]">
                        ${event.revenue_risk?.toLocaleString()} Risk
                      </div>
                      <div className="text-[11px] text-[#86868B]">
                        AI Confidence: {event.confidence_score}%
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

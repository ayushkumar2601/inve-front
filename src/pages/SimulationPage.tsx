import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  Activity,
  Sliders,
  TrendingUp,
  DollarSign,
  PackageX,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function SimulationPage() {
  const [demandPct, setDemandPct] = useState(65);
  const [delayDays, setDelayDays] = useState(4);
  const [leadTime, setLeadTime] = useState(11);
  const [volatility, setVolatility] = useState(35);
  const [activeScenario, setActiveScenario] = useState('holiday_rush');
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const runSimulation = async (dPct: number, dDays: number, lTime: number, vol: number) => {
    setLoading(true);
    try {
      const url = `http://localhost:5500/api/ai/simulation?demand_increase_pct=${dPct}&supplier_delay_days=${dDays}&lead_time=${lTime}&market_volatility=${vol}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json && json.status === 'success') {
        setSimResult(json.data);
      }
    } catch (err) {
      console.error('Error running digital twin simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(demandPct, delayDays, leadTime, volatility);
  }, []);

  const handleSliderChange = (newDemand: number, newDelay: number, newLead: number, newVol: number) => {
    setDemandPct(newDemand);
    setDelayDays(newDelay);
    setLeadTime(newLead);
    setVolatility(newVol);
    setActiveScenario('custom');
    runSimulation(newDemand, newDelay, newLead, newVol);
  };

  const applyPreset = (key: string, preset: any) => {
    setActiveScenario(key);
    setDemandPct(preset.demand_increase_pct);
    setDelayDays(preset.supplier_delay_days);
    setLeadTime(preset.lead_time);
    setVolatility(preset.market_volatility);
    runSimulation(
      preset.demand_increase_pct,
      preset.supplier_delay_days,
      preset.lead_time,
      preset.market_volatility
    );
  };

  const output = simResult?.simulation_output || {
    revenue_impact: 51550.0,
    projected_revenue: 196550.0,
    stockouts: 7,
    inventory_cost: 48140.0,
    risk_score: 40,
    recommended_actions: [
      "Increase safety stock buffer by +26% across critical SKUs",
      "Pre-order 675 units to hedge against 4-day supplier delays"
    ]
  };

  const chartSeries = simResult?.chart_series || [];
  const scenarios = simResult?.scenarios || {
    holiday_rush: { name: "Holiday Rush", demand_increase_pct: 65, supplier_delay_days: 4, lead_time: 11, market_volatility: 35 },
    supplier_failure: { name: "Supplier Failure", demand_increase_pct: 10, supplier_delay_days: 18, lead_time: 25, market_volatility: 60 },
    market_expansion: { name: "Market Expansion", demand_increase_pct: 120, supplier_delay_days: 2, lead_time: 9, market_volatility: 25 },
    logistics_crisis: { name: "Logistics Crisis", demand_increase_pct: 0, supplier_delay_days: 14, lead_time: 21, market_volatility: 80 },
    product_launch: { name: "Product Launch", demand_increase_pct: 85, supplier_delay_days: 1, lead_time: 7, market_volatility: 40 }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Bloomberg Terminal / Apple Enterprise Header */}
        <header className="border-b border-[#E5E5E7] bg-white/90 backdrop-blur-xl sticky top-0 z-30 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF9F0A]/10 text-[#FF9F0A] text-xs font-semibold uppercase tracking-wider">
                Supply Chain Digital Twin
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Forward What-If Scenario Builder
              </h1>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              Monte Carlo stochastic simulation modeling market surge, supplier SLA drift, and portfolio capital requirements.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Stochastic Engine Synchronized</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Scenario Library Presets */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
              Scenario Preset Library
            </span>
            <div className="flex flex-wrap gap-3">
              {Object.entries(scenarios).map(([key, preset]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key, preset)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    activeScenario === key
                      ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm'
                      : 'bg-white text-[#48484A] border-[#E5E5E7] hover:border-[#1D1D1F] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders + Output Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: What-If Parameter Sliders */}
            <div className="apple-card p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E5E7] pb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1D1D1F] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#0071E3]" />
                  <span>Simulation Controls</span>
                </h2>
                <span className="text-xs font-mono text-[#0071E3] font-medium">Real-Time</span>
              </div>

              {/* Slider 1: Demand Surge */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#48484A]">Demand Surge Index</span>
                  <span className="text-[#0071E3] font-mono font-semibold">+{demandPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={demandPct}
                  onChange={(e) => handleSliderChange(Number(e.target.value), delayDays, leadTime, volatility)}
                  className="w-full accent-[#0071E3] cursor-pointer"
                />
              </div>

              {/* Slider 2: Supplier SLA Delay */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#48484A]">Supplier SLA Delay</span>
                  <span className="text-[#FF453A] font-mono font-semibold">+{delayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={delayDays}
                  onChange={(e) => handleSliderChange(demandPct, Number(e.target.value), leadTime, volatility)}
                  className="w-full accent-[#FF453A] cursor-pointer"
                />
              </div>

              {/* Slider 3: Base Lead Time */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#48484A]">Base Lead Time</span>
                  <span className="text-[#FF9F0A] font-mono font-semibold">{leadTime} Days</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={leadTime}
                  onChange={(e) => handleSliderChange(demandPct, delayDays, Number(e.target.value), volatility)}
                  className="w-full accent-[#FF9F0A] cursor-pointer"
                />
              </div>

              {/* Slider 4: Market Volatility Index */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#48484A]">Market Volatility</span>
                  <span className="text-[#1D1D1F] font-mono font-semibold">{volatility}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volatility}
                  onChange={(e) => handleSliderChange(demandPct, delayDays, leadTime, Number(e.target.value))}
                  className="w-full accent-[#1D1D1F] cursor-pointer"
                />
              </div>
            </div>

            {/* Right Column: Output Scorecards & Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Output Scorecards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="apple-card p-5">
                  <span className="text-xs text-[#6E6E73] font-medium">Revenue Delta</span>
                  <div className="text-xl font-semibold text-[#34C759] mt-2 font-mono">
                    +${output.revenue_impact?.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-[#86868B] mt-1">Projected horizon</p>
                </div>

                <div className="apple-card p-5">
                  <span className="text-xs text-[#6E6E73] font-medium">Projected Stockouts</span>
                  <div className="text-xl font-semibold text-[#FF453A] mt-2 font-mono">
                    {output.stockouts} SKUs
                  </div>
                  <p className="text-[11px] text-[#86868B] mt-1">Under simulated stress</p>
                </div>

                <div className="apple-card p-5">
                  <span className="text-xs text-[#6E6E73] font-medium">Capital Required</span>
                  <div className="text-xl font-semibold text-[#1D1D1F] mt-2 font-mono">
                    ${output.inventory_cost?.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-[#86868B] mt-1">Working reserve</p>
                </div>

                <div className="apple-card p-5">
                  <span className="text-xs text-[#6E6E73] font-medium">Composite Risk</span>
                  <div className="text-xl font-semibold text-[#FF9F0A] mt-2 font-mono">
                    {output.risk_score} / 100
                  </div>
                  <p className="text-[11px] text-[#86868B] mt-1">Stochastic index</p>
                </div>
              </div>

              {/* 12-Week Forward Digital Twin Recharts Projection */}
              <div className="apple-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base text-[#1D1D1F]">
                      12-Week Stochastic Forward Horizon
                    </h3>
                    <p className="text-xs text-[#6E6E73]">Demand trajectory vs available safety stock buffer</p>
                  </div>
                  <div className="flex items-center gap-5 text-xs font-medium">
                    <span className="flex items-center gap-2 text-[#0071E3]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" />
                      Simulated Demand
                    </span>
                    <span className="flex items-center gap-2 text-[#34C759]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
                      Available Buffer
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartSeries}>
                      <defs>
                        <linearGradient id="simDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0071E3" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#0071E3" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="simStock" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34C759" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E7" vertical={false} />
                      <XAxis dataKey="week" stroke="#86868B" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#86868B" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E7', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="projected_demand" stroke="#0071E3" strokeWidth={2} fillOpacity={1} fill="url(#simDemand)" />
                      <Area type="monotone" dataKey="available_stock" stroke="#34C759" strokeWidth={2} fillOpacity={1} fill="url(#simStock)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Executive Safeguard Recommendations */}
              <div className="apple-card p-6 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Executive Capital & Inventory Safeguards</span>
                </span>
                <div className="space-y-2">
                  {output.recommended_actions?.map((rec: string, idx: number) => (
                    <div key={idx} className="text-xs text-[#1D1D1F] flex items-center gap-2.5">
                      <span className="text-[#0071E3] font-mono">•</span>
                      <span className="font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

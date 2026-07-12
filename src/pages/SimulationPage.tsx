import React, { useState, useEffect } from 'react';
import { SidebarNav } from '../components/SidebarNav';
import {
  Activity,
  Play,
  TrendingUp,
  DollarSign,
  PackageX,
  ShieldAlert,
  Sliders,
  RefreshCw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                P1 Digital Twin
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Supply Chain Digital Twin What-If Simulator
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate market volatility, lead-time drift, and supplier disruptions across 12-week forward horizons.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Monte Carlo Stochastic Engine</span>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Scenario Preset Library Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Scenario Library Presets
            </span>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(scenarios).map(([key, preset]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key, preset)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    activeScenario === key
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders + Output Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Interactive Controls */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Simulation Parameters</span>
                </h2>
                <span className="text-xs font-mono text-indigo-400">Real-Time Recalc</span>
              </div>

              {/* Slider 1: Demand Increase */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Demand Surge</span>
                  <span className="text-indigo-400 font-mono font-bold">+{demandPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={demandPct}
                  onChange={(e) => handleSliderChange(Number(e.target.value), delayDays, leadTime, volatility)}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Slider 2: Supplier Delay Days */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Supplier SLA Delay</span>
                  <span className="text-rose-400 font-mono font-bold">+{delayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={delayDays}
                  onChange={(e) => handleSliderChange(demandPct, Number(e.target.value), leadTime, volatility)}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Slider 3: Lead Time */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Base Lead Time</span>
                  <span className="text-amber-400 font-mono font-bold">{leadTime} Days</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={leadTime}
                  onChange={(e) => handleSliderChange(demandPct, delayDays, Number(e.target.value), volatility)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Slider 4: Market Volatility */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Market Volatility Index</span>
                  <span className="text-cyan-400 font-mono font-bold">{volatility}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volatility}
                  onChange={(e) => handleSliderChange(demandPct, delayDays, leadTime, Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Column: Simulation Output Scorecards & Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Output Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase">Revenue Impact</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                    +${output.revenue_impact?.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-400">Projected delta</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase">Projected Stockouts</span>
                  <div className="text-xl font-bold text-rose-400 mt-1 font-mono">
                    {output.stockouts} SKUs
                  </div>
                  <p className="text-[10px] text-slate-400">Under simulated stress</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase">Inventory Cost</span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">
                    ${output.inventory_cost?.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-400">Working capital required</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase">Risk Score</span>
                  <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
                    {output.risk_score} / 100
                  </div>
                  <p className="text-[10px] text-slate-400">Composite vulnerability</p>
                </div>
              </div>

              {/* Interactive Chart */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    12-Week Forward Digital Twin Projection
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      Projected Demand
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Available Stock Buffer
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartSeries}>
                      <defs>
                        <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="projected_demand" stroke="#6366f1" fillOpacity={1} fill="url(#demandGrad)" />
                      <Area type="monotone" dataKey="available_stock" stroke="#10b981" fillOpacity={1} fill="url(#stockGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Action Safeguards */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Recommended Safeguards for this Simulation Scenario</span>
                </span>
                <div className="space-y-1.5">
                  {output.recommended_actions?.map((rec: string, idx: number) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-indigo-400 font-mono">•</span>
                      <span>{rec}</span>
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

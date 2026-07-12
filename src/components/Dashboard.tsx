import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  DollarSign,
  PackageCheck,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
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

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const kpis = [
    {
      title: 'Revenue at Risk',
      value: '$378,046',
      change: '-4.2% from last week',
      trend: 'positive',
      icon: AlertTriangle,
      color: 'text-[#FF453A]',
      badge: 'Immediate Action'
    },
    {
      title: 'Inventory Value',
      value: '$4,820,500',
      change: '+1.8% portfolio expansion',
      trend: 'positive',
      icon: DollarSign,
      color: 'text-[#1D1D1F]',
      badge: 'Optimized'
    },
    {
      title: 'Predicted Stockouts',
      value: '6 SKUs',
      change: 'within 7 days window',
      trend: 'warning',
      icon: TrendingUp,
      color: 'text-[#FF9F0A]',
      badge: 'Review POs'
    },
    {
      title: 'Procurement Efficiency',
      value: '98.4%',
      change: '+2.1% automated EDI',
      trend: 'positive',
      icon: PackageCheck,
      color: 'text-[#34C759]',
      badge: 'Autonomous'
    },
    {
      title: 'Forecast Accuracy',
      value: '96.2%',
      change: 'Multi-agent consensus',
      trend: 'positive',
      icon: ShieldCheck,
      color: 'text-[#0071E3]',
      badge: 'High Confidence'
    }
  ];

  const chartData = [
    { month: 'Jan', demand: 4200, actualStock: 4500 },
    { month: 'Feb', demand: 4600, actualStock: 4700 },
    { month: 'Mar', demand: 5100, actualStock: 5050 },
    { month: 'Apr', demand: 4900, actualStock: 5200 },
    { month: 'May', demand: 5600, actualStock: 5800 },
    { month: 'Jun', demand: 6100, actualStock: 6300 }
  ];

  const products = [
    { sku: 'ELEC-SEN-200', name: 'Industrial Sensor X200', category: 'Electronics', stock: 18, threshold: 25, unitCost: 140, value: 2520, status: 'Low Stock' },
    { sku: 'VALV-HYD-500', name: 'Hydraulic Valve V-500', category: 'Hydraulics', stock: 12, threshold: 20, unitCost: 310, value: 3720, status: 'Critical' },
    { sku: 'CHIP-ARM-900', name: 'ARM Processor M9', category: 'Semiconductors', stock: 450, threshold: 100, unitCost: 85, value: 38250, status: 'Healthy' },
    { sku: 'DISP-OLED-42', name: 'OLED Display Panel 42in', category: 'Displays', stock: 88, threshold: 50, unitCost: 220, value: 19360, status: 'Healthy' },
    { sku: 'BATT-LITH-100', name: 'Lithium Pack 100Wh', category: 'Energy', stock: 34, threshold: 40, unitCost: 190, value: 6460, status: 'Low Stock' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header: Good Morning / InventoryPulse AI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#86868B] tracking-wider uppercase">Good Morning</span>
          <h1 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight mt-1">InventoryPulse AI</h1>
          <p className="text-sm text-[#6E6E73] mt-1">Executive autonomous inventory intelligence & portfolio capital synthesis.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E5E7] text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0071E3]' : 'text-[#86868B]'}`} />
            <span>Sync Intelligence</span>
          </button>
          <div className="px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-medium shadow-sm">
            AI Operations Active
          </div>
        </div>
      </div>

      {/* Executive KPI Row (Apple Wallet / Stripe Analytics Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="apple-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">{kpi.title}</span>
                <span className="p-2 rounded-xl bg-[#F5F5F7]">
                  <Icon className="w-4 h-4 text-[#1D1D1F]" />
                </span>
              </div>

              <div>
                <div className={`text-2xl font-semibold tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </div>
                <p className="text-[11px] text-[#86868B] mt-1">{kpi.change}</p>
              </div>

              <div className="pt-2 border-t border-[#F0F0F2] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#0071E3]">{kpi.badge}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#86868B]" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Apple / Recharts Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="apple-card p-7 space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1D1D1F]">6-Month Demand & Stock Portfolio Horizon</h2>
            <p className="text-xs text-[#6E6E73] mt-0.5">Automated statistical demand regression vs working stock reserve</p>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-2 text-[#1D1D1F] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" />
              Projected Demand
            </span>
            <span className="flex items-center gap-2 text-[#6E6E73] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
              Actual Stock Buffer
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="appleBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071E3" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#0071E3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appleGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E7" vertical={false} />
              <XAxis dataKey="month" stroke="#86868B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#86868B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E5E7',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  color: '#1D1D1F'
                }}
              />
              <Area type="monotone" dataKey="demand" stroke="#0071E3" strokeWidth={2} fillOpacity={1} fill="url(#appleBlue)" />
              <Area type="monotone" dataKey="actualStock" stroke="#34C759" strokeWidth={2} fillOpacity={1} fill="url(#appleGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Apple-Style Enterprise Data Grid Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="apple-card overflow-hidden"
      >
        <div className="p-6 border-b border-[#E5E5E7] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1D1D1F]">Inventory Intelligence Directory</h2>
            <p className="text-xs text-[#6E6E73] mt-0.5">Real-time SKU valuation, replenishment thresholds, and risk scoring</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SKU or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] text-xs text-[#1D1D1F] focus:outline-none focus:bg-white transition-colors"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:outline-none border border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Semiconductors">Semiconductors</option>
              <option value="Displays">Displays</option>
              <option value="Energy">Energy</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E7] bg-[#FAFAFA] text-[11px] font-semibold text-[#86868B] uppercase tracking-wider sticky top-0">
                <th className="py-3.5 px-6">SKU Identifier</th>
                <th className="py-3.5 px-6">Product Name</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Current Stock</th>
                <th className="py-3.5 px-6 text-right">Valuation</th>
                <th className="py-3.5 px-6">Risk Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F2] text-xs">
              {filteredProducts.map((p) => (
                <tr key={p.sku} className="hover:bg-[#F5F5F7]/70 transition-colors">
                  <td className="py-4 px-6 font-mono text-[#6E6E73] font-medium">{p.sku}</td>
                  <td className="py-4 px-6 font-semibold text-[#1D1D1F]">{p.name}</td>
                  <td className="py-4 px-6 text-[#6E6E73]">{p.category}</td>
                  <td className="py-4 px-6 text-right font-medium text-[#1D1D1F]">
                    {p.stock} units
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-[#1D1D1F]">
                    ${p.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        p.status === 'Critical'
                          ? 'bg-[#FF453A]/10 text-[#FF453A]'
                          : p.status === 'Low Stock'
                          ? 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
                          : 'bg-[#34C759]/10 text-[#34C759]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[#0071E3] font-medium hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
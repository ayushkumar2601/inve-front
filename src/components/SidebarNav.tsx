import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Bot,
  GitBranch,
  Activity,
  Layers,
  LayoutDashboard,
  Search,
  Zap,
  Terminal,
  Cpu,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    {
      label: 'Platform Overview',
      path: '/',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      label: 'AI War Room',
      path: '/war-room',
      icon: ShieldAlert,
      badge: 'P0',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    {
      label: 'Executive Copilot',
      path: '/copilot',
      icon: Bot,
      badge: 'AI Analyst',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
    },
    {
      label: 'Procurement Agent',
      path: '/agents/procurement',
      icon: GitBranch,
      badge: 'Autonomous',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    },
    {
      label: 'Digital Twin Sim',
      path: '/simulation',
      icon: Activity,
      badge: 'What-If',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    {
      label: 'Multi-Agent Layer',
      path: '/agents',
      icon: Layers,
      badge: '5 Active',
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    }
  ];

  return (
    <>
      <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 backdrop-blur-xl flex flex-col h-screen sticky top-0 shrink-0 z-40 select-none">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white font-mono">INVENTORYPULSE</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono">AUTONOMOUS OPS v2.4</p>
            </div>
          </Link>
        </div>

        {/* Global Command Search Bar */}
        <div className="p-3 border-b border-slate-800/60">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span>Search Command...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">
            Operations Command
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Live System Health & Activity Feed Widget */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              AI Core Status
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">ALL SYSTEMS GO</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Latency</span>
              <span className="text-white font-mono">14.2 ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Active Agents</span>
              <span className="text-indigo-400 font-mono font-bold">5 / 5 Online</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Auto-POs Today</span>
              <span className="text-emerald-400 font-mono font-bold">142 Executed</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search products, SKUs, suppliers, AI agents, or war room events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
              >
                ESC
              </button>
            </div>
            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                    <span>Go to {item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.path}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

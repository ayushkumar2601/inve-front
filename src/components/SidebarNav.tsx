import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Bot,
  GitBranch,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidebarNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Operations Center', path: '/war-room', icon: ShieldAlert },
    { label: 'Executive Copilot', path: '/copilot', icon: Bot },
    { label: 'Procurement Agent', path: '/agents/procurement', icon: GitBranch },
    { label: 'Digital Twin Sim', path: '/simulation', icon: Activity },
    { label: 'Mission Control', path: '/agents', icon: Layers }
  ];

  // Listen for Cmd+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectNav = (path: string) => {
    setSearchOpen(false);
    navigate(path);
  };

  const filteredItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-[#E5E5E7] flex flex-col h-screen sticky top-0 shrink-0 z-40 select-none py-6 px-4">
        {/* Apple Brand Header */}
        <div className="px-2 pb-6 flex items-center justify-between border-b border-[#F0F0F2]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-[#000000] text-white flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm tracking-tight">IP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-[#1D1D1F] tracking-tight">InventoryPulse AI</span>
              </div>
              <p className="text-[11px] text-[#86868B]">Enterprise Operations</p>
            </div>
          </Link>
        </div>

        {/* Command Palette Trigger */}
        <div className="py-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] hover:bg-[#EAEAEA] text-[#86868B] text-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#86868B]" />
              <span className="font-medium">Search or Command</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E5E5E7] text-[10px] text-[#6E6E73] font-medium shadow-2xs">⌘K</kbd>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-[#86868B] px-3 py-2">
            INTELLIGENCE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#0071E3] font-semibold'
                    : 'text-[#48484A] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSideNav"
                    className="absolute inset-0 bg-[#0071E3]/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#0071E3] relative z-10" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Subtle Apple System Health Indicator */}
        <div className="pt-4 border-t border-[#F0F0F2] px-3 flex items-center justify-between text-xs text-[#6E6E73]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
            <span className="font-medium">System Normal</span>
          </div>
          <span className="text-[11px] text-[#86868B]">v2.4 Apple Enterprise</span>
        </div>
      </aside>

      {/* World-Class Apple / Linear Command Palette (⌘K) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000]/40 backdrop-blur-md z-50 flex items-start justify-center pt-24 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="w-full max-w-xl bg-white border border-[#E5E5E7] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[#F0F0F2] flex items-center gap-3">
                <Command className="w-4 h-4 text-[#86868B]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[#1D1D1F] text-sm focus:outline-none placeholder-[#86868B]"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="px-2 py-1 rounded bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] text-xs font-medium"
                >
                  ESC
                </button>
              </div>
              <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#86868B] uppercase">
                  Navigate Modules
                </div>
                {filteredItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelectNav(item.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F5F7] text-[#1D1D1F] text-left transition-colors"
                  >
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <item.icon className="w-4 h-4 text-[#0071E3]" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[11px] text-[#86868B]">{item.path}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

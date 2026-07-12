import React from 'react';
import Dashboard from "@/components/Dashboard";
import { SidebarNav } from "@/components/SidebarNav";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

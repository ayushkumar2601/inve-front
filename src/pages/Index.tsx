import React from 'react';
import Dashboard from "@/components/Dashboard";
import { SidebarNav } from "@/components/SidebarNav";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

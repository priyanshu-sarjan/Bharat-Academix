'use client';

import React from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { ViewTab } from '@/types/ayutrace';
import {
  Map,
  Activity,
  Truck,
  Zap,
  BarChart3,
  Search,
  User,
  Play,
  Pause,
  Flame,
  PlusCircle,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSimulating,
    toggleSimulating,
    simSpeed,
    setSimSpeed,
    triggerTempSpike,
    selectedTruckId,
    trucks,
    setAddClusterOpen,
    openLoginModal,
    user,
    searchQuery,
    setSearchQuery,
  } = useAyuTraceStore();

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'COMMAND_MAP', label: 'GIS Command Map', icon: <Map className="w-4 h-4" /> },
    { id: 'TELEMETRY_ANALYTICS', label: 'Cold-Chain IoT', icon: <Activity className="w-4 h-4" /> },
    { id: 'DISPATCH_ENGINE', label: 'Dispatch Engine', icon: <Truck className="w-4 h-4" /> },
    { id: 'FLASH_CLEARANCE', label: 'Flash Clearance', icon: <Zap className="w-4 h-4" /> },
    { id: 'IMPACT_REPORTS', label: 'Impact Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleSpikeClick = () => {
    const targetId = selectedTruckId || (trucks.length > 0 ? trucks[0].id : 'truck_1');
    triggerTempSpike(targetId);
  };

  return (
    <header className="sticky top-0 z-40 bg-obsidian-card/95 backdrop-blur-md border-b border-obsidian-border text-white shadow-xl">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-3 gap-4">
        {/* Brand Identity (Smart Crop + AyuTrace) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('COMMAND_MAP')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-harvest-500 p-0.5 shadow-lg shadow-agri-500/20">
            <div className="w-full h-full bg-obsidian rounded-[10px] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-agri-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white flex items-center">
                Smart<span className="text-harvest-400 ml-0.5">Crop</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-agri-500/20 text-agri-400 border border-agri-500/30 font-mono font-medium">
                AyuTrace v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-mono">
              Agri-Fresh & Spoilage 0% Intelligence Engine
            </p>
          </div>
        </div>

        {/* Center Simulation & Telemetry Live Controller */}
        <div className="flex items-center gap-2 bg-obsidian/80 border border-obsidian-border rounded-xl p-1.5 shadow-inner">
          {/* Live Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-obsidian-hover border border-obsidian-border text-xs">
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-agri-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="font-mono text-slate-300 font-medium">
              {isSimulating ? 'IoT Telemetry Live' : 'Simulation Paused'}
            </span>
          </div>

          {/* Play/Pause */}
          <button
            onClick={toggleSimulating}
            className="p-1.5 rounded-lg bg-obsidian-hover hover:bg-slate-700/60 text-slate-300 transition-colors"
            title={isSimulating ? 'Pause IoT Simulation' : 'Resume IoT Simulation'}
          >
            {isSimulating ? <Pause className="w-4 h-4 text-harvest-400" /> : <Play className="w-4 h-4 text-agri-400" />}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-obsidian rounded-lg p-0.5 text-xs font-mono">
            {[1, 5, 10].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  simSpeed === speed
                    ? 'bg-agri-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Emergency Temp Spike Button */}
          <button
            onClick={handleSpikeClick}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-alert-600/90 hover:bg-alert-500 text-white text-xs font-semibold shadow-lg shadow-alert-600/30 transition-all active:scale-95"
            title="Simulate heat-corridor temp failure (>8°C threshold)"
          >
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>Temp Spike (&gt;8°C)</span>
          </button>

          {/* Add Surplus Cluster Button */}
          <button
            onClick={() => setAddClusterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-agri-600 hover:bg-agri-500 text-white text-xs font-medium transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Farm Surplus</span>
          </button>
        </div>

        {/* Right Search & User Auth Button */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Crop, Cluster or Truck..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-9 pr-3 py-1.5 text-xs bg-obsidian border border-obsidian-border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-harvest-500 transition-all"
            />
          </div>

          {/* Sign In / Farmer Portal Button (Smart Crop Style) */}
          <button
            onClick={openLoginModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-harvest-500 to-amber-600 hover:from-harvest-400 hover:to-amber-500 text-obsidian font-bold text-xs shadow-md shadow-harvest-500/20 transition-all hover:scale-[1.02] active:scale-98"
          >
            <User className="w-4 h-4 text-obsidian" />
            <span>{user.isLoggedIn ? user.name : 'Sign In'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar Row */}
      <div className="bg-obsidian/90 border-t border-obsidian-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-agri-500/15 text-agri-400 border border-agri-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-hover'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-agri-400" />
            <span>Open GIS Standard (0% Proprietary License Fee)</span>
          </div>
        </div>
      </div>
    </header>
  );
};

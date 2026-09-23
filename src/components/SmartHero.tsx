'use client';

import React from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { Leaf, ArrowRight, ShieldAlert, Sparkles, TrendingUp, Cpu, Award } from 'lucide-react';

export const SmartHero: React.FC = () => {
  const { setActiveTab, setAddClusterOpen, openLoginModal } = useAyuTraceStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-obsidian via-obsidian-card to-obsidian border-b border-obsidian-border pt-8 pb-10">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-agri-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-harvest-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tagline Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-400 text-xs font-mono font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-harvest-400 animate-spin" />
            <span>100% Natural • Autonomous Cold-Chain Intelligence • Target 0% Transit Loss</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Smart Farmer <span className="text-transparent bg-clip-text bg-gradient-to-r from-harvest-400 via-amber-300 to-agri-400">Earn Smart Profit</span> With Spoilage 0% GIS Routing
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AyuTrace combines 50m spatial Turf.js deduplication, exponential thermal decay algorithms, and OSRM 2-opt TSP route optimization to eliminate agricultural transit loss across Indian cold-chain corridors.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('COMMAND_MAP')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-agri-500 to-emerald-600 hover:from-agri-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-agri-500/25 transition-all hover:scale-[1.03] active:scale-95"
            >
              <span>Explore GIS Command Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('FLASH_CLEARANCE')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-harvest-500 to-amber-600 hover:from-harvest-400 hover:to-amber-500 text-obsidian font-bold text-sm shadow-xl shadow-harvest-500/25 transition-all hover:scale-[1.03] active:scale-95"
            >
              <span>Rescue Flash Sale Portal</span>
            </button>

            <button
              onClick={openLoginModal}
              className="px-5 py-3 rounded-full bg-obsidian-hover hover:bg-slate-800 border border-obsidian-border text-slate-300 hover:text-white font-semibold text-sm transition-all"
            >
              Farmer Portal Access
            </button>
          </div>
        </div>

        {/* Feature Cards Grid (Matching reference image: 3 Feature Cards) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: GIS Spatial Clustering */}
          <div
            onClick={() => setActiveTab('COMMAND_MAP')}
            className="group cursor-pointer rounded-2xl bg-obsidian-card p-5 border border-obsidian-border hover:border-agri-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-agri-500/10 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4 border border-agri-500/30 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-agri-400 transition-colors">
              Spatial Surplus Clustering
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Deduplicates farm surplus points within a 50-meter radius using Turf.js, computing convex hull bounding polygons and volume aggregation for cooperative dispatch.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-agri-400 font-semibold font-mono">
              <span>View Active Clusters</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Predictive Spoilage Diagnostics */}
          <div
            onClick={() => setActiveTab('TELEMETRY_ANALYTICS')}
            className="group cursor-pointer rounded-2xl bg-obsidian-card p-5 border border-obsidian-border hover:border-harvest-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-harvest-500/10 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-harvest-500/20 text-harvest-400 flex items-center justify-center mb-4 border border-harvest-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-harvest-400 transition-colors">
              Predictive Spoilage Telemetry
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Monitors ambient core temperature, transit vibration, and humidity. Triggers exponential decay acceleration when temp exceeds 8°C threshold.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-harvest-400 font-semibold font-mono">
              <span>Inspect IoT Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Dynamic Clearance & 2-Opt TSP */}
          <div
            onClick={() => setActiveTab('DISPATCH_ENGINE')}
            className="group cursor-pointer rounded-2xl bg-obsidian-card p-5 border border-obsidian-border hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              2-Opt TSP Diesel Optimization
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Automates multi-stop pickup and Mandi rerouting using a 2-opt Traveling Salesperson algorithm, cutting diesel fuel consumption by ~35.8%.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400 font-semibold font-mono">
              <span>Launch Route Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

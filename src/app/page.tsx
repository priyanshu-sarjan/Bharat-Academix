'use client';

import React, { useEffect } from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { Header } from '@/components/Header';
import { ImpactRibbon } from '@/components/ImpactRibbon';
import { SmartHero } from '@/components/SmartHero';
import { GISCommandMap } from '@/components/GISCommandMap';
import { TelemetryPanel } from '@/components/TelemetryPanel';
import { DispatchEngine } from '@/components/DispatchEngine';
import { FlashClearancePortal } from '@/components/FlashClearancePortal';
import { ReserveModal } from '@/components/ReserveModal';
import { AddClusterModal } from '@/components/AddClusterModal';
import { LoginModal } from '@/components/LoginModal';
import { Leaf, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export default function Home() {
  const { activeTab, isSimulating, simSpeed, tickSimulation } = useAyuTraceStore();

  // Background IoT Simulation Ticker Loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(800, 3000 / simSpeed);
    const timer = setInterval(() => {
      tickSimulation();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, tickSimulation]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Smart Crop + AyuTrace Sticky Header */}
      <Header />

      {/* Main KPI Impact Ribbon */}
      <ImpactRibbon />

      {/* Smart Hero Banner (Displayed on Command Map view) */}
      {activeTab === 'COMMAND_MAP' && <SmartHero />}

      {/* Main Command Center Dashboard Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'COMMAND_MAP' && <GISCommandMap />}
        {activeTab === 'TELEMETRY_ANALYTICS' && <TelemetryPanel />}
        {activeTab === 'DISPATCH_ENGINE' && <DispatchEngine />}
        {activeTab === 'FLASH_CLEARANCE' && <FlashClearancePortal />}
        {activeTab === 'IMPACT_REPORTS' && (
          <div className="space-y-6">
            <div className="bg-obsidian-card p-6 rounded-2xl border border-obsidian-border shadow-2xl">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-harvest-400" />
                Comprehensive Agricultural Post-Harvest Transit Loss Report
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Verified impact metrics for cooperative networks, logistics fleets, and B2B buyers.
              </p>
            </div>
            <GISCommandMap />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-obsidian-card border-t border-obsidian-border py-6 mt-12 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-agri-400" />
            <span className="font-bold text-slate-200">AyuTrace</span>
            <span>– Smart Farmer Spoilage 0% Intelligence Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-agri-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Open GIS standard
            </span>
            <span>•</span>
            <span>OSRM 2-Opt TSP Engine</span>
            <span>•</span>
            <span>Turf.js 50m Spatial Deduplication</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ReserveModal />
      <AddClusterModal />
      <LoginModal />
    </div>
  );
}

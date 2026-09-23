'use client';

import React from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { ShieldCheck, TrendingDown, Fuel, DollarSign, Award, Leaf } from 'lucide-react';

export const ImpactRibbon: React.FC = () => {
  const { metrics } = useAyuTraceStore();

  return (
    <div className="bg-obsidian-card border-y border-obsidian-border py-3 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* KPI 1: Spoilage Prevented */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/60 border border-obsidian-border/80">
          <div className="p-2 rounded-lg bg-agri-500/20 text-agri-400 border border-agri-500/30">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono font-medium">
              Spoilage Prevented
            </div>
            <div className="text-base font-bold font-mono text-white flex items-baseline gap-1">
              <span>{metrics.spoilagePreventedTons}</span>
              <span className="text-xs text-agri-400 font-semibold">Tons ({metrics.spoilagePreventedPct}%)</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Fuel & Mileage Saved */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/60 border border-obsidian-border/80">
          <div className="p-2 rounded-lg bg-harvest-500/20 text-harvest-400 border border-harvest-500/30">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono font-medium">
              Transit Diesel Saved
            </div>
            <div className="text-base font-bold font-mono text-white flex items-baseline gap-1">
              <span className="text-harvest-400">-{metrics.fuelSavedPct}%</span>
              <span className="text-xs text-slate-400 font-normal">({metrics.mileageSavedKm.toLocaleString()} km)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: CO2 Emissions Reduced */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/60 border border-obsidian-border/80">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono font-medium">
              CO2 Avoided
            </div>
            <div className="text-base font-bold font-mono text-white flex items-baseline gap-1">
              <span>{(metrics.co2SavedKg / 1000).toFixed(1)}</span>
              <span className="text-xs text-cyan-400 font-semibold">Tons CO2</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Revenue Recovered */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/60 border border-obsidian-border/80">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono font-medium">
              Revenue Recovered
            </div>
            <div className="text-base font-bold font-mono text-white flex items-baseline gap-1">
              <span className="text-emerald-400">₹{(metrics.revenueRecoveredInr / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* KPI 5: GIS License Fee Avoided */}
        <div className="col-span-2 md:col-span-1 flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/60 border border-obsidian-border/80">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono font-medium">
              Open-GIS Savings
            </div>
            <div className="text-base font-bold font-mono text-white flex items-baseline gap-1">
              <span className="text-indigo-400">100%</span>
              <span className="text-xs text-slate-400 font-normal">Zero License Fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

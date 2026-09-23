'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { MapPin, Truck, Zap, Flame, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

const DynamicMapContent = dynamic(
  () => import('./DynamicMapContent').then((mod) => mod.DynamicMapContent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[620px] rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 text-agri-400 animate-spin" />
        <span className="font-mono text-xs text-slate-300">Loading Interactive Carto Dark GIS Map...</span>
      </div>
    ),
  }
);

export const GISCommandMap: React.FC = () => {
  const { clusters, trucks, selectedClusterId, setSelectedClusterId, triggerTempSpike, setActiveTab } = useAyuTraceStore();

  const selectedCluster = clusters.find((c) => c.id === selectedClusterId) || clusters[0];

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-obsidian-card p-4 rounded-2xl border border-obsidian-border shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-agri-400" />
            Interactive GIS Agricultural Corridor Command Center
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            50m Turf.js Spatial Clustering • OSRM 2-Opt TSP Rerouting • Real-Time IoT Thermal Telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('DISPATCH_ENGINE')}
            className="px-3 py-1.5 rounded-xl bg-agri-500/20 text-agri-400 border border-agri-500/30 text-xs font-semibold hover:bg-agri-500/30 transition-all"
          >
            Launch Dispatch Engine
          </button>
          <button
            onClick={() => setActiveTab('FLASH_CLEARANCE')}
            className="px-3 py-1.5 rounded-xl bg-harvest-500/20 text-harvest-400 border border-harvest-500/30 text-xs font-semibold hover:bg-harvest-500/30 transition-all"
          >
            Flash Clearance Portal
          </button>
        </div>
      </div>

      {/* Main Grid: GIS Map + Interactive Side Node Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Column */}
        <div className="lg:col-span-2">
          <DynamicMapContent />
        </div>

        {/* Side Node Detail Drawer */}
        <div className="space-y-4">
          {/* Selected Cluster Node Card */}
          {selectedCluster && (
            <div className="bg-obsidian-card rounded-2xl border border-obsidian-border p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-semibold">
                    Selected Node Card
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedCluster.locationName}</h3>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                    selectedCluster.tier === 'TIER_1'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : selectedCluster.tier === 'TIER_2'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {selectedCluster.tier.replace('_', ' ')}
                </span>
              </div>

              {/* Crop Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-obsidian border border-obsidian-border/80">
                  <div className="text-slate-400 text-[11px]">Crop Variety</div>
                  <div className="font-bold text-white text-sm mt-0.5">{selectedCluster.crop}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian border border-obsidian-border/80">
                  <div className="text-slate-400 text-[11px]">Surplus Margin</div>
                  <div className="font-mono font-bold text-harvest-400 text-sm mt-0.5">+{selectedCluster.surplusMarginPct}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian border border-obsidian-border/80">
                  <div className="text-slate-400 text-[11px]">Volume</div>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">{selectedCluster.volumeTons} Tons</div>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian border border-obsidian-border/80">
                  <div className="text-slate-400 text-[11px]">Est. Shelf-Life</div>
                  <div className="font-mono font-bold text-agri-400 text-sm mt-0.5">{selectedCluster.estShelfLifeHours}h</div>
                </div>
              </div>

              {/* Decay Score Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Thermal Decay Index:</span>
                  <span className={`font-bold ${selectedCluster.decayScore > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {selectedCluster.decayScore} / 100
                  </span>
                </div>
                <div className="w-full h-2 bg-obsidian rounded-full overflow-hidden border border-obsidian-border">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedCluster.decayScore > 60
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : selectedCluster.decayScore > 35
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedCluster.decayScore}%` }}
                  />
                </div>
              </div>

              {/* Farmer Info */}
              <div className="text-xs text-slate-300 bg-obsidian/60 p-3 rounded-xl border border-obsidian-border space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Farmer:</span>
                  <span className="text-white font-bold">{selectedCluster.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cooperative:</span>
                  <span className="text-slate-200">{selectedCluster.cooperativeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Mandi:</span>
                  <span className="text-agri-400 font-semibold truncate max-w-[150px]">{selectedCluster.nearestMandi}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setActiveTab('FLASH_CLEARANCE')}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-harvest-500 to-amber-600 hover:from-harvest-400 hover:to-amber-500 text-obsidian font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Rescue Clearance</span>
                </button>
                <button
                  onClick={() => setActiveTab('DISPATCH_ENGINE')}
                  className="py-2 px-3 bg-obsidian-hover hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-obsidian-border transition-all"
                >
                  Reroute TSP
                </button>
              </div>
            </div>
          )}

          {/* Active Fleet Quick Overview */}
          <div className="bg-obsidian-card rounded-2xl border border-obsidian-border p-4 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-agri-400" />
              <span>Cold-Chain Transit Vehicles ({trucks.length})</span>
            </h4>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {trucks.map((truck) => (
                <div
                  key={truck.id}
                  onClick={() => setSelectedClusterId(truck.assignedClusterId)}
                  className="p-2.5 rounded-xl bg-obsidian hover:bg-obsidian-hover border border-obsidian-border cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      <span>{truck.licensePlate}</span>
                      {truck.status === 'REROUTING_URGENT' && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{truck.targetDestination}</div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`font-bold ${truck.ambientTempCelsius > 8 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {truck.ambientTempCelsius}°C
                    </div>
                    <div className="text-[10px] text-slate-400">{truck.speedKmh} km/h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

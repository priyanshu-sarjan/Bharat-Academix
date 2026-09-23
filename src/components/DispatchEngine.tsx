'use client';

import React, { useState } from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { solve2OptTSP, TSPWaypoint } from '@/lib/gis/tspSolver';
import {
  Truck,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle,
  Fuel,
  TrendingDown,
  Layers,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';

export const DispatchEngine: React.FC = () => {
  const { clusters, trucks, rerouteTruck, triggerTempSpike, setActiveTab, openReserveModal, flashOffers } = useAyuTraceStore();

  const [activeTabTier, setActiveTabTier] = useState<'ALL' | 'TIER_1' | 'TIER_2' | 'TIER_3'>('ALL');
  const [selectedTruckForTSP, setSelectedTruckForTSP] = useState<string>(trucks[0]?.id || 'truck_1');

  const targetTruck = trucks.find((t) => t.id === selectedTruckForTSP) || trucks[0];
  const assignedCluster = clusters.find((c) => c.id === targetTruck.assignedClusterId);

  // Generate waypoints for TSP Solver demo
  const sampleWaypoints: TSPWaypoint[] = [
    { id: 'depot', name: `${targetTruck.licensePlate} (Current GPS)`, coordinates: targetTruck.currentLocation, isDepot: true },
    { id: 'cluster_pickup_1', name: assignedCluster ? assignedCluster.locationName : 'Farm Surplus Pickup Node A', coordinates: assignedCluster ? assignedCluster.coordinates : [20.0059, 73.7898] },
    { id: 'cluster_pickup_2', name: 'Regional Co-op Hub B', coordinates: [19.8800, 73.6500] },
    { id: 'mandi_dest', name: targetTruck.targetDestination, coordinates: [19.0760, 72.8777], isDestination: true },
  ];

  const tspResult = solve2OptTSP(sampleWaypoints);

  const tier1Clusters = clusters.filter((c) => c.tier === 'TIER_1');
  const tier2Clusters = clusters.filter((c) => c.tier === 'TIER_2');
  const tier3Clusters = clusters.filter((c) => c.tier === 'TIER_3');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-obsidian-card p-5 rounded-2xl border border-obsidian-border shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-agri-400" />
            Autonomous Multi-Tier Dispatch & 2-Opt TSP Routing Engine
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automatic Dispatch Tiering (&lt;24h, 24-72h, &gt;72h) • 2-Opt Edge-Swapping Optimization (-35.8% Diesel Cut)
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 bg-obsidian border border-obsidian-border rounded-xl p-1 text-xs font-mono">
          {(['ALL', 'TIER_1', 'TIER_2', 'TIER_3'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTabTier(tier)}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTabTier === tier
                  ? 'bg-agri-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Kanban Board: Tier 1, Tier 2, Tier 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1 Column */}
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400 animate-bounce" />
              <span className="font-bold text-white text-xs font-mono">Tier 1: Critical (&lt;24h)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold font-mono">
              {tier1Clusters.length}
            </span>
          </div>

          <div className="space-y-3">
            {tier1Clusters.map((cluster) => {
              const assignedTruck = trucks.find((t) => t.assignedClusterId === cluster.id);
              return (
                <div
                  key={cluster.id}
                  className="bg-obsidian-card rounded-2xl border border-red-500/40 p-4 shadow-xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-obsidian-border pb-2">
                    <span className="font-bold text-sm text-white">{cluster.locationName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/40">
                      Flash Rescue
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Crop / Volume:</span>
                      <span className="font-bold text-white">{cluster.crop} ({cluster.volumeTons}T)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Shelf-Life:</span>
                      <span className="font-bold text-red-400">{cluster.estShelfLifeHours}h remaining</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 font-mono bg-obsidian p-2 rounded-lg border border-obsidian-border">
                    <div className="text-[10px] text-slate-400">Assigned Transit:</div>
                    <div className="font-bold text-white flex items-center justify-between mt-0.5">
                      <span>{assignedTruck ? assignedTruck.licensePlate : 'Pending'}</span>
                      <span className="text-red-400">{assignedTruck ? `${assignedTruck.ambientTempCelsius}°C` : ''}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => assignedTruck && rerouteTruck(assignedTruck.id, cluster.nearestMandi)}
                      className="flex-1 py-1.5 bg-agri-600 hover:bg-agri-500 text-white font-bold text-xs rounded-xl transition-all shadow"
                    >
                      Emergency Reroute
                    </button>
                    <button
                      onClick={() => setActiveTab('FLASH_CLEARANCE')}
                      className="py-1.5 px-3 bg-harvest-500 hover:bg-harvest-400 text-obsidian font-bold text-xs rounded-xl transition-all shadow"
                    >
                      Flash Sale
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier 2 Column */}
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs font-mono">Tier 2: Moderate (24-72h)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold font-mono">
              {tier2Clusters.length}
            </span>
          </div>

          <div className="space-y-3">
            {tier2Clusters.map((cluster) => {
              const assignedTruck = trucks.find((t) => t.assignedClusterId === cluster.id);
              return (
                <div
                  key={cluster.id}
                  className="bg-obsidian-card rounded-2xl border border-amber-500/30 p-4 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-obsidian-border pb-2">
                    <span className="font-bold text-sm text-white">{cluster.locationName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold border border-amber-500/40">
                      Cold-Chain Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Crop / Volume:</span>
                      <span className="font-bold text-white">{cluster.crop} ({cluster.volumeTons}T)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Shelf-Life:</span>
                      <span className="font-bold text-amber-400">{cluster.estShelfLifeHours}h remaining</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => assignedTruck && rerouteTruck(assignedTruck.id, cluster.nearestMandi)}
                      className="w-full py-1.5 bg-obsidian-hover hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-obsidian-border transition-all"
                    >
                      Optimize Cold-Chain Dispatch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier 3 Column */}
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs font-mono">Tier 3: Standard (&gt;72h)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
              {tier3Clusters.length}
            </span>
          </div>

          <div className="space-y-3">
            {tier3Clusters.map((cluster) => (
              <div
                key={cluster.id}
                className="bg-obsidian-card rounded-2xl border border-emerald-500/30 p-4 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-obsidian-border pb-2">
                  <span className="font-bold text-sm text-white">{cluster.locationName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/40">
                    Standard Co-op
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Crop / Volume:</span>
                    <span className="font-bold text-white">{cluster.crop} ({cluster.volumeTons}T)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Shelf-Life:</span>
                    <span className="font-bold text-emerald-400">{cluster.estShelfLifeHours}h remaining</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono italic">
                  Standard warehouse storage active. Zero spoilage risk.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Opt TSP Solver Visualizer Card */}
      <div className="bg-obsidian-card rounded-2xl border border-obsidian-border p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-obsidian-border pb-4">
          <div>
            <span className="text-xs text-agri-400 font-mono font-semibold uppercase tracking-wider">
              Traveling Salesperson Problem (TSP) Engine
            </span>
            <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-harvest-400" />
              2-Opt Edge Swapping Route Distance & Fuel Optimization
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Simulate Vehicle:</span>
            <select
              value={selectedTruckForTSP}
              onChange={(e) => setSelectedTruckForTSP(e.target.value)}
              className="bg-obsidian border border-obsidian-border rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
            >
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.licensePlate}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TSP Result Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-obsidian border border-obsidian-border font-mono">
            <div className="text-[11px] text-slate-400">Original Distance</div>
            <div className="text-lg font-bold text-slate-300 mt-1">{tspResult.originalDistanceKm} km</div>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian border border-obsidian-border font-mono">
            <div className="text-[11px] text-slate-400">2-Opt Optimized</div>
            <div className="text-lg font-bold text-agri-400 mt-1">{tspResult.optimizedDistanceKm} km</div>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian border border-obsidian-border font-mono">
            <div className="text-[11px] text-slate-400">Diesel Fuel Reduction</div>
            <div className="text-lg font-bold text-harvest-400 mt-1">-{tspResult.fuelSavingsPct}% ({tspResult.fuelSavedLiters} L)</div>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian border border-obsidian-border font-mono">
            <div className="text-[11px] text-slate-400">CO2 Emissions Avoided</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">{tspResult.co2SavedKg} kg</div>
          </div>
        </div>

        {/* Waypoints Sequence Display */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 font-semibold">
            2-Opt Optimized Waypoint Stop Sequence:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tspResult.orderedWaypoints.map((wp, idx) => (
              <React.Fragment key={wp.id}>
                <div
                  className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    wp.isDepot
                      ? 'bg-agri-500/20 text-agri-400 border-agri-500/40 font-bold'
                      : wp.isDestination
                      ? 'bg-harvest-500/20 text-harvest-400 border-harvest-500/40 font-bold'
                      : 'bg-obsidian border-obsidian-border text-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    Stop #{idx + 1}: {wp.name}
                  </span>
                </div>
                {idx < tspResult.orderedWaypoints.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

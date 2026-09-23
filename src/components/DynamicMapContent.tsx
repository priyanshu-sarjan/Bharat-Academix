'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { FarmCluster, ColdChainTruck } from '@/types/ayutrace';
import { solve2OptTSP } from '@/lib/gis/tspSolver';
import {
  MapPin,
  Truck as TruckIcon,
  Flame,
  Zap,
  ArrowUpRight,
  Clock,
  Thermometer,
  Layers,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Create custom Leaflet DivIcons for Clusters and Trucks
function createClusterIcon(cluster: FarmCluster, isSelected: boolean) {
  const color = cluster.tier === 'TIER_1' ? '#EF4444' : cluster.tier === 'TIER_2' ? '#F59E0B' : '#10B981';
  const pulseClass = cluster.tier === 'TIER_1' ? 'animate-ping' : '';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
      <span class="absolute w-8 h-8 rounded-full opacity-40 ${pulseClass}" style="background-color: ${color}"></span>
      <div class="w-7 h-7 rounded-full border-2 border-white/80 shadow-lg flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-black/80" style="background-color: ${color}">
        ${cluster.volumeTons}T
      </div>
      <div class="absolute -bottom-4 bg-obsidian/90 text-slate-200 border border-obsidian-border text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold whitespace-nowrap shadow-md">
        ${cluster.crop}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cluster-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function createTruckIcon(truck: ColdChainTruck, isSelected: boolean) {
  const isUrgent = truck.status === 'REROUTING_URGENT';
  const ringColor = isUrgent ? '#EF4444' : '#10B981';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
      <span class="absolute w-9 h-9 rounded-full opacity-50 ${isUrgent ? 'animate-ping bg-red-500' : 'bg-emerald-500'}"></span>
      <div class="w-8 h-8 rounded-xl border-2 border-white shadow-xl flex items-center justify-center text-white font-bold" style="background-color: ${ringColor}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
      <div class="absolute -top-4 bg-obsidian-card text-slate-100 border border-obsidian-border text-[9px] px-1.5 py-0.2 rounded font-mono font-bold whitespace-nowrap shadow-md">
        ${truck.ambientTempCelsius}°C
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-truck-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

// Controller to auto-center map when selection changes
function MapCenterController({ selectedCoords }: { selectedCoords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 8, { duration: 1.2 });
    }
  }, [selectedCoords, map]);
  return null;
}

export const DynamicMapContent: React.FC = () => {
  const {
    clusters,
    trucks,
    selectedClusterId,
    setSelectedClusterId,
    selectedTruckId,
    setSelectedTruckId,
    triggerTempSpike,
    rerouteTruck,
    openReserveModal,
    flashOffers,
    setActiveTab,
  } = useAyuTraceStore();

  const selectedCluster = clusters.find((c) => c.id === selectedClusterId);
  const selectedTruck = trucks.find((t) => t.id === selectedTruckId);

  const activeCenter: [number, number] = selectedCluster
    ? selectedCluster.coordinates
    : selectedTruck
    ? selectedTruck.currentLocation
    : [20.5937, 78.9629]; // India center

  // Build TSP Route polylines
  const tspPolylines = trucks.map((truck) => {
    const cluster = clusters.find((c) => c.id === truck.assignedClusterId);
    if (!cluster) return null;

    const tsp = solve2OptTSP([
      { id: truck.id, name: truck.licensePlate, coordinates: truck.currentLocation, isDepot: true },
      { id: cluster.id, name: cluster.locationName, coordinates: cluster.coordinates },
    ]);

    const color = truck.status === 'REROUTING_URGENT' ? '#EF4444' : '#10B981';

    return {
      truckId: truck.id,
      polyline: tsp.routePolyline,
      color,
    };
  }).filter(Boolean);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-obsidian-border shadow-2xl bg-obsidian">
      <MapContainer
        center={[21.0000, 78.0000]}
        zoom={5}
        style={{ width: '100%', height: '100%', backgroundColor: '#0B0F17' }}
        zoomControl={false}
      >
        <MapCenterController selectedCoords={selectedCluster ? selectedCluster.coordinates : null} />

        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Convex Hull Polygons for Farm Clusters */}
        {clusters.map((cluster) => {
          if (!cluster.convexHullPoints) return null;
          const hullColor = cluster.tier === 'TIER_1' ? '#EF4444' : cluster.tier === 'TIER_2' ? '#F59E0B' : '#10B981';
          return (
            <Polygon
              key={`hull_${cluster.id}`}
              positions={cluster.convexHullPoints}
              pathOptions={{
                color: hullColor,
                fillColor: hullColor,
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: '4, 4',
              }}
            />
          );
        })}

        {/* TSP Transit Route Polylines */}
        {tspPolylines.map((route) => {
          if (!route) return null;
          return (
            <Polyline
              key={`route_${route.truckId}`}
              positions={route.polyline}
              pathOptions={{
                color: route.color,
                weight: 3,
                opacity: 0.8,
                dashArray: route.color === '#EF4444' ? '6, 6' : undefined,
              }}
            />
          );
        })}

        {/* Cluster Surplus Markers */}
        {clusters.map((cluster) => {
          const isSelected = cluster.id === selectedClusterId;
          return (
            <Marker
              key={cluster.id}
              position={cluster.coordinates}
              icon={createClusterIcon(cluster, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedClusterId(cluster.id);
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 bg-obsidian-card text-white rounded-xl border border-obsidian-border max-w-xs shadow-xl">
                  <div className="flex items-center justify-between gap-2 border-b border-obsidian-border pb-2 mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-agri-400" />
                      {cluster.locationName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        cluster.tier === 'TIER_1'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : cluster.tier === 'TIER_2'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {cluster.tier.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Crop Type:</span>
                      <span className="font-bold text-white">{cluster.crop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Surplus Margin:</span>
                      <span className="font-mono font-bold text-harvest-400">+{cluster.surplusMarginPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Volume:</span>
                      <span className="font-mono font-bold text-white">{cluster.volumeTons} Tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Farmer Co-op:</span>
                      <span className="text-slate-200 text-right truncate max-w-[140px]">{cluster.cooperativeName}</span>
                    </div>

                    {/* Decay Score Progress Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-slate-400">Decay Score:</span>
                        <span className={`font-bold ${cluster.decayScore > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {cluster.decayScore}/100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-obsidian rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            cluster.decayScore > 60
                              ? 'bg-red-500'
                              : cluster.decayScore > 35
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${cluster.decayScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions inside popup */}
                  <div className="mt-3 pt-2 border-t border-obsidian-border flex gap-2">
                    <button
                      onClick={() => setActiveTab('FLASH_CLEARANCE')}
                      className="flex-1 py-1.5 px-2 bg-harvest-500 hover:bg-harvest-400 text-obsidian font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Rescue Flash</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('TELEMETRY_ANALYTICS')}
                      className="py-1.5 px-2 bg-obsidian-hover hover:bg-slate-700 text-slate-200 font-medium text-[11px] rounded-lg border border-obsidian-border transition-all"
                    >
                      IoT Log
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Fleet Trucks Markers */}
        {trucks.map((truck) => {
          const isSelected = truck.id === selectedTruckId;
          return (
            <Marker
              key={truck.id}
              position={truck.currentLocation}
              icon={createTruckIcon(truck, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedTruckId(truck.id);
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3 bg-obsidian-card text-white rounded-xl border border-obsidian-border max-w-xs shadow-xl">
                  <div className="flex items-center justify-between gap-2 border-b border-obsidian-border pb-2 mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <TruckIcon className="w-3.5 h-3.5 text-harvest-400" />
                      {truck.licensePlate}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        truck.status === 'REROUTING_URGENT'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {truck.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver:</span>
                      <span className="font-bold text-white">{truck.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Core Temp:</span>
                      <span className={`font-mono font-bold ${truck.ambientTempCelsius > 8 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {truck.ambientTempCelsius}°C (Threshold {truck.tempThresholdMax}°C)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed:</span>
                      <span className="font-mono text-slate-200">{truck.speedKmh} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Mandi:</span>
                      <span className="text-slate-200 truncate max-w-[130px]">{truck.targetDestination}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-obsidian-border flex gap-2">
                    <button
                      onClick={() => triggerTempSpike(truck.id)}
                      className="flex-1 py-1 px-2 bg-alert-600/90 hover:bg-alert-500 text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Trigger Spike</span>
                    </button>
                    <button
                      onClick={() => rerouteTruck(truck.id, 'Vashi Wholesale Mandi, Navi Mumbai')}
                      className="flex-1 py-1 px-2 bg-agri-600 hover:bg-agri-500 text-white font-bold text-[10px] rounded-lg transition-all"
                    >
                      Auto Reroute
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay Card */}
      <div className="absolute top-4 left-4 z-[400] bg-obsidian-card/90 backdrop-blur-md p-3 rounded-xl border border-obsidian-border shadow-xl text-xs space-y-2 max-w-xs">
        <div className="font-bold text-white flex items-center gap-1.5 border-b border-obsidian-border pb-1">
          <Layers className="w-3.5 h-3.5 text-harvest-400" />
          <span>GIS Layers & Status Legend</span>
        </div>
        <div className="space-y-1 text-slate-300 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block" />
            <span>Tier 1 Surplus (&lt;24h Shelf Life / Critical)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Tier 2 Surplus (24-72h Shelf Life)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Tier 3 Surplus (&gt;72h Standard Transit)</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-obsidian-border/50">
            <span className="w-4 h-0.5 bg-emerald-500 inline-block" />
            <span>2-Opt TSP Optimized Polyline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { calculateDecayVelocity } from '@/lib/simulator/decayCalculator';
import {
  Activity,
  Thermometer,
  Wind,
  Vibrate,
  Clock,
  AlertTriangle,
  Flame,
  LineChart as LineChartIcon,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export const TelemetryPanel: React.FC = () => {
  const { trucks, selectedTruckId, setSelectedTruckId, telemetryLogs, triggerTempSpike, clusters } = useAyuTraceStore();

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || trucks[0];
  const assignedCluster = clusters.find((c) => c.id === selectedTruck.assignedClusterId);

  const currentDecayVelocity = calculateDecayVelocity(selectedTruck.ambientTempCelsius);

  // Generate mock telemetry historical chart data points for the selected truck
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const timeLabel = `${12 - i}h ago`;
    const tempBase = selectedTruck.ambientTempCelsius > 8 ? 4.0 + i * 0.5 : 2.5 + (Math.random() - 0.5) * 0.8;
    const temp = Math.max(1.5, Math.min(13.5, Number(tempBase.toFixed(1))));
    const decayVelocity = calculateDecayVelocity(temp);
    const projDecay = Math.min(98, Math.round(15 + i * decayVelocity * 3));

    return {
      time: timeLabel,
      temp,
      decayScore: projDecay,
      safeThreshold: 4.0,
      criticalThreshold: 8.0,
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-obsidian-card p-5 rounded-2xl border border-obsidian-border shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-harvest-400" />
            Predictive Cold-Chain IoT Diagnostic & Telemetry Engine
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time Ambient Sensor Streams • Temperature Threshold Variance • Dynamic Thermal Decay Acceleration
          </p>
        </div>

        {/* Truck Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Active Truck:</span>
          <select
            value={selectedTruck.id}
            onChange={(e) => setSelectedTruckId(e.target.value)}
            className="bg-obsidian border border-obsidian-border rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-harvest-500"
          >
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.licensePlate} ({t.ambientTempCelsius}°C)
              </option>
            ))}
          </select>

          <button
            onClick={() => triggerTempSpike(selectedTruck.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-alert-600 hover:bg-alert-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-alert-600/30 transition-all active:scale-95"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Spike Temp</span>
          </button>
        </div>
      </div>

      {/* Sensor Readout Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Temperature Card */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Ambient Core Temp</span>
            <Thermometer className={`w-4 h-4 ${selectedTruck.ambientTempCelsius > 8 ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${selectedTruck.ambientTempCelsius > 8 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {selectedTruck.ambientTempCelsius}°C
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Safe: &lt;{selectedTruck.tempThresholdMax}°C
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Status: {selectedTruck.ambientTempCelsius > 8 ? 'Critical Thermal Spike' : 'Optimal Refrigeration'}
          </div>
        </div>

        {/* Humidity Sensor */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Relative Humidity</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {selectedTruck.humidityPct}%
            </span>
            <span className="text-[11px] font-mono text-slate-400">Target: 60-80%</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Sensors operational</div>
        </div>

        {/* Vibration / Transit Health */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Transit Vibration</span>
            <Vibrate className="w-4 h-4 text-harvest-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-harvest-400">
              {selectedTruck.vibrationHealth} <span className="text-xs font-normal">m/s²</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Pothole Index</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Smooth highway corridor</div>
        </div>

        {/* Decay Velocity & Shelf Life */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider">Decay Velocity</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">
              +{currentDecayVelocity.toFixed(2)} <span className="text-xs font-normal">pts/h</span>
            </span>
            <span className="text-[11px] font-mono text-agri-400 font-bold">
              {assignedCluster ? `${assignedCluster.estShelfLifeHours}h left` : '72h'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Formula: {selectedTruck.ambientTempCelsius > 8 ? 'Exponential Acceleration' : 'Linear Base'}
          </div>
        </div>
      </div>

      {/* Recharts Graphical Telemetry Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature History Chart */}
        <div className="bg-obsidian-card rounded-2xl border border-obsidian-border p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <LineChartIcon className="w-4 h-4 text-harvest-400" />
              <span>Ambient Temperature Stream vs 4°C Safe Threshold</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{selectedTruck.licensePlate}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 15]} unit="°C" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131927', borderColor: '#1E293B', borderRadius: '12px' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <ReferenceLine y={4.0} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Safe 4°C', fill: '#10B981', fontSize: 10 }} />
                <ReferenceLine y={8.0} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Critical 8°C', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Decay Curve Chart */}
        <div className="bg-obsidian-card rounded-2xl border border-obsidian-border p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Projected Crop Thermal Decay Acceleration (0-100)</span>
            </h3>
            <span className="text-xs font-mono text-agri-400">
              {assignedCluster ? assignedCluster.crop : 'Tomato'}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131927', borderColor: '#1E293B', borderRadius: '12px' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <ReferenceLine y={65} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Tier 1 Trigger (65)', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="decayScore" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Telemetry Event Stream Log Ticker */}
      <div className="bg-obsidian-card rounded-2xl border border-obsidian-border p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <Zap className="w-4 h-4 text-agri-400" />
            <span>Live IoT Telemetry Audit Event Stream</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Last 20 Events</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {telemetryLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-3 transition-all ${
                log.alertLevel === 'CRITICAL'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : log.alertLevel === 'MODERATE'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-obsidian border-obsidian-border text-slate-300'
              }`}
            >
              <span className="text-[10px] px-2 py-0.5 rounded bg-obsidian border border-obsidian-border text-slate-400 font-bold shrink-0">
                {log.timestamp}
              </span>
              <span className="font-bold shrink-0">{log.truckPlate}:</span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { CropType } from '@/types/ayutrace';
import { X, PlusCircle, MapPin, Leaf } from 'lucide-react';

export const AddClusterModal: React.FC = () => {
  const { isAddClusterOpen, setAddClusterOpen, addFarmCluster } = useAyuTraceStore();

  const [locationName, setLocationName] = useState('Gwalior Organic Valley');
  const [crop, setCrop] = useState<CropType>('Tomato');
  const [surplusMarginPct, setSurplusMarginPct] = useState(105);
  const [volumeTons, setVolumeTons] = useState(16.5);
  const [nearestMandi, setNearestMandi] = useState('Gwalior Central Wholesale Mandi');
  const [farmerName, setFarmerName] = useState('Ramnath Yadav');
  const [cooperativeName, setCooperativeName] = useState('Gwalior Kisan Producer Co.');
  const [lat, setLat] = useState(26.2183);
  const [lng, setLng] = useState(78.1828);

  if (!isAddClusterOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFarmCluster({
      locationName,
      coordinates: [lat, lng],
      crop,
      surplusMarginPct,
      volumeTons,
      nearestMandi,
      farmerName,
      cooperativeName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-card rounded-3xl border border-obsidian-border shadow-2xl p-6 space-y-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-agri-400" />
            <h3 className="text-lg font-bold text-white">Register Farm Surplus Cluster (GIS Node)</h3>
          </div>
          <button
            onClick={() => setAddClusterOpen(false)}
            className="p-1.5 rounded-lg bg-obsidian hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Cluster Location Name:</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Crop Type:</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value as CropType)}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
              >
                <option value="Tomato">Tomato</option>
                <option value="Mango">Mango</option>
                <option value="Leafy Greens">Leafy Greens</option>
                <option value="Onion">Onion</option>
                <option value="Wheat">Wheat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Surplus Margin (+%):</label>
              <input
                type="number"
                value={surplusMarginPct}
                onChange={(e) => setSurplusMarginPct(Number(e.target.value))}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Volume (Tons):</label>
              <input
                type="number"
                step="0.1"
                value={volumeTons}
                onChange={(e) => setVolumeTons(Number(e.target.value))}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Target Mandi Destination:</label>
            <input
              type="text"
              value={nearestMandi}
              onChange={(e) => setNearestMandi(e.target.value)}
              className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Lead Farmer Name:</label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Cooperative Name:</label>
              <input
                type="text"
                value={cooperativeName}
                onChange={(e) => setCooperativeName(e.target.value)}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Latitude (Lat):</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Longitude (Lng):</label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-agri-500"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setAddClusterOpen(false)}
              className="flex-1 py-2.5 bg-obsidian hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-obsidian-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-agri-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Add Cluster to GIS Engine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

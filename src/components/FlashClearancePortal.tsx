'use client';

import React, { useState } from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { FlashDiscountOffer, CropType } from '@/types/ayutrace';
import {
  Zap,
  Tag,
  Clock,
  MapPin,
  CheckCircle,
  Filter,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react';

export const FlashClearancePortal: React.FC = () => {
  const { flashOffers, openReserveModal, clusters } = useAyuTraceStore();

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');

  const activeOffers = flashOffers.filter((offer) => offer.status === 'ACTIVE');

  const filteredOffers = activeOffers.filter((offer) => {
    if (selectedCropFilter !== 'ALL' && offer.crop !== selectedCropFilter) return false;
    return true;
  });

  // Helper crop thumbnails
  const cropThumbnails: Record<string, string> = {
    Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    Mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
    'Leafy Greens': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
  };

  return (
    <div className="space-y-6">
      {/* Portal Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-obsidian-card via-obsidian-hover to-obsidian-card p-6 rounded-2xl border border-harvest-500/30 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-harvest-500/20 text-harvest-400 text-xs font-mono font-bold border border-harvest-500/40 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Emergency B2B Mandi Wholesale Rescue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Rescue Flash Clearance Portal (Smart Farmer Catalog)
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl">
            Dynamic wholesale discounts slashes wholesale rates as crop decay index increases. 1-Click reserve locks in volume with verified QR delivery manifests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-obsidian border border-obsidian-border rounded-xl p-1.5 text-xs font-mono">
          {['ALL', 'Tomato', 'Leafy Greens', 'Mango', 'Onion', 'Wheat'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCropFilter === crop
                  ? 'bg-gradient-to-r from-harvest-500 to-amber-600 text-obsidian font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Product / Offer Grid (Smart Crop Grid Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => {
          const cluster = clusters.find((c) => c.id === offer.clusterId);
          const bgImg = cropThumbnails[offer.crop] || cropThumbnails['Tomato'];

          return (
            <div
              key={offer.id}
              className="group rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-harvest-500/50 transition-all duration-300 shadow-xl hover:shadow-harvest-500/10 overflow-hidden flex flex-col justify-between"
            >
              {/* Top Image & Badge Header */}
              <div className="relative h-44 w-full overflow-hidden bg-obsidian">
                <img
                  src={bgImg}
                  alt={offer.crop}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-card via-transparent to-black/40" />

                {/* Discount Tag Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-harvest-500 to-amber-600 text-obsidian font-black font-mono text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{offer.discountPercentage}% FLASH DISCOUNT</span>
                </div>

                {/* Timer Badge */}
                <div className="absolute top-3 right-3 bg-obsidian/90 backdrop-blur-md border border-obsidian-border text-red-400 font-mono font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Expires in {offer.expiresInMinutes}m</span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-semibold flex items-center gap-1.5 truncate bg-obsidian/80 backdrop-blur-md p-2 rounded-xl border border-obsidian-border/80">
                  <MapPin className="w-4 h-4 text-agri-400 shrink-0" />
                  <span className="truncate">{offer.targetMandi}</span>
                </div>
              </div>

              {/* Offer Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-white group-hover:text-harvest-400 transition-colors">
                      {offer.crop} Batch (#{offer.id.slice(-4)})
                    </h3>
                    <span className="text-xs font-mono font-bold text-agri-400 bg-agri-500/10 px-2 py-0.5 rounded border border-agri-500/20">
                      {offer.availableTons} Tons
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 font-mono leading-relaxed line-clamp-2">
                    {offer.urgentReason}
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="bg-obsidian/80 p-3 rounded-xl border border-obsidian-border space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-mono">Wholesale Price:</span>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xs text-slate-500 line-through">₹{offer.originalPricePerKg}/kg</span>
                      <span className="text-xl font-bold text-harvest-400">₹{offer.discountedPricePerKg}/kg</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1 border-t border-obsidian-border/50">
                    <span>Est Total Batch Value:</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{((offer.discountedPricePerKg * offer.availableTons * 1000) / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                </div>

                {/* Reserve Action Button */}
                <button
                  onClick={() => openReserveModal(offer)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-agri-500 to-emerald-600 hover:from-agri-400 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-agri-500/20 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>1-Click Reserve Wholesale Batch</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12 bg-obsidian-card rounded-2xl border border-obsidian-border text-slate-400 font-mono text-xs">
          No active flash sale offers for selected crop category.
        </div>
      )}
    </div>
  );
};

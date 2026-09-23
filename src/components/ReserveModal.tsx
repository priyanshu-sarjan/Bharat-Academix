'use client';

import React, { useState } from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import confetti from 'canvas-confetti';
import { X, CheckCircle, ShieldCheck, QrCode, ShoppingBag, Download, ArrowRight } from 'lucide-react';

export const ReserveModal: React.FC = () => {
  const { isReserveModalOpen, closeReserveModal, activeReserveOffer, claimFlashOffer } = useAyuTraceStore();

  const [buyerName, setBuyerName] = useState('Vashi Fresh Wholesale Traders');
  const [buyerPhone, setBuyerPhone] = useState('+91 98201 55410');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isReserveModalOpen || !activeReserveOffer) return null;

  const totalValueInr = Math.round(activeReserveOffer.discountedPricePerKg * activeReserveOffer.availableTons * 1000);
  const manifestId = `AYU-MANIFEST-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleConfirm = () => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    claimFlashOffer(activeReserveOffer.id, buyerName);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-card rounded-2xl border border-obsidian-border shadow-2xl p-6 space-y-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-harvest-400" />
            <h3 className="text-lg font-extrabold text-white">
              {isSuccess ? 'Digital Delivery Manifest Issued' : 'Reserve Wholesale Crop Batch'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsSuccess(false);
              closeReserveModal();
            }}
            className="p-1.5 rounded-lg bg-obsidian hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="space-y-4">
            {/* Offer Summary Box */}
            <div className="p-4 rounded-xl bg-obsidian border border-obsidian-border space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Crop Batch:</span>
                <span className="font-bold text-white text-sm">{activeReserveOffer.crop} ({activeReserveOffer.availableTons} Tons)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Mandi:</span>
                <span className="text-agri-400 font-semibold">{activeReserveOffer.targetMandi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flash Discount:</span>
                <span className="text-harvest-400 font-bold">{activeReserveOffer.discountPercentage}% Off</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-obsidian-border/50 text-sm">
                <span className="text-slate-300 font-bold">Total Batch Cost:</span>
                <span className="text-emerald-400 font-extrabold text-base">₹{(totalValueInr / 100000).toFixed(2)} Lakhs</span>
              </div>
            </div>

            {/* Buyer Details Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-mono font-medium mb-1">Wholesale Buyer / Trader Name:</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-harvest-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono font-medium mb-1">Contact Phone Number:</label>
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full bg-obsidian border border-obsidian-border rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-harvest-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={closeReserveModal}
                className="flex-1 py-2.5 bg-obsidian hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-obsidian-border"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-gradient-to-r from-agri-500 to-emerald-600 hover:from-agri-400 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-agri-500/20"
              >
                Confirm & Issue Manifest
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-agri-500/20 text-agri-400 flex items-center justify-center mx-auto border border-agri-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Wholesale Batch Lock Verified!</h4>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Manifest Code: <span className="text-harvest-400 font-bold">{manifestId}</span>
              </p>
            </div>

            {/* Simulated Digital QR Manifest */}
            <div className="p-4 rounded-xl bg-obsidian border border-obsidian-border space-y-3 max-w-xs mx-auto">
              <div className="w-32 h-32 bg-white rounded-lg p-2 mx-auto flex items-center justify-center shadow-inner">
                <QrCode className="w-28 h-28 text-obsidian" />
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Present QR code at Mandi Cold-Store Gate to release produce.
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                closeReserveModal();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-harvest-500 to-amber-600 text-obsidian font-bold text-xs rounded-xl shadow-md"
            >
              Done & Return to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

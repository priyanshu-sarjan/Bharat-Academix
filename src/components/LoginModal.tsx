'use client';

import React, { useState } from 'react';
import { useAyuTraceStore } from '@/store/useAyuTraceStore';
import { X, User, Lock, Mail, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginUser } = useAyuTraceStore();

  const [email, setEmail] = useState('farmer.admin@smartcrop.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'COOPERATIVE_ADMIN' | 'COLD_CHAIN_LOGISTICS' | 'WHOLESALE_BUYER'>('COOPERATIVE_ADMIN');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email.split('@')[0] || 'Smart Farmer', role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-obsidian-card rounded-3xl border border-obsidian-border shadow-2xl p-6 sm:p-8 space-y-6 text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-obsidian hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot / Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-500 via-harvest-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-agri-500/20">
            <div className="w-full h-full bg-obsidian rounded-[14px] flex items-center justify-center">
              <Leaf className="w-7 h-7 text-harvest-400" />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1">
              Welcome to <span className="text-harvest-400">Smart Crop</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Please sign-in to your farmer portal account & cold-chain engine
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex rounded-xl bg-obsidian border border-obsidian-border p-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setRole('COOPERATIVE_ADMIN')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              role === 'COOPERATIVE_ADMIN'
                ? 'bg-gradient-to-r from-harvest-500 to-amber-600 text-obsidian font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Co-op Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('COLD_CHAIN_LOGISTICS')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              role === 'COLD_CHAIN_LOGISTICS'
                ? 'bg-gradient-to-r from-harvest-500 to-amber-600 text-obsidian font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Logistics Fleet
          </button>
          <button
            type="button"
            onClick={() => setRole('WHOLESALE_BUYER')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              role === 'WHOLESALE_BUYER'
                ? 'bg-gradient-to-r from-harvest-500 to-amber-600 text-obsidian font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            B2B Mandi
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="w-full bg-obsidian border border-obsidian-border rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-harvest-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-obsidian border border-obsidian-border rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-harvest-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-obsidian border-obsidian-border text-harvest-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-harvest-400 hover:underline">Forgot Password?</a>
          </div>

          {/* Action Submit Button (Smart Crop Yellow Button) */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-harvest-500 via-amber-500 to-harvest-600 hover:from-harvest-400 hover:to-amber-400 text-obsidian font-black text-sm rounded-full shadow-xl shadow-harvest-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 mt-2"
          >
            <span>SIGN IN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

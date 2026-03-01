import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

export const Subscription = ({ currentUser }) => (
  <div className="space-y-6 max-w-5xl">
    <div className="flex items-center gap-2 mb-2">
      <Zap className="text-orange-500" size={24} />
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Plans & Pricing</h3>
    </div>
    
    {/* pt-10 added here so the badge doesn't clip! */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-10">
      
      {/* Basic Plan */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow">
        <h4 className="text-xl font-black text-slate-900 tracking-tight">Basic Flow</h4>
        <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-black text-slate-900">₹999</span><span className="text-slate-500 font-semibold">/mo</span></div>
        <ul className="mt-8 space-y-4 mb-8">
          {['Single Pump Management', 'Daily Sales & Closing', 'Credit Ledger', 'Expense Tracking'].map(feature => (
            <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-600"><CheckCircle2 size={18} className="text-blue-500"/> {feature}</li>
          ))}
        </ul>
        <button className="w-full py-4 bg-slate-50 text-slate-800 font-black rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs">Get Basic</button>
      </div>

      {/* Pro Plan */}
      <div className="relative bg-blue-600 rounded-[2rem] p-8 shadow-2xl shadow-blue-600/30 text-white border-4 border-blue-500/50">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-10">Most Popular</div>
        <div className="flex justify-between items-start">
          <h4 className="text-xl font-black tracking-tight">Pro Manager</h4>
          <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12}/> Active</span>
        </div>
        <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-black">₹1,999</span><span className="text-blue-200 font-semibold">/mo</span></div>
        <ul className="mt-8 space-y-4 mb-8">
          {['Everything in Basic', 'Staff Attendance & Master', 'Indent & Density Logs', 'Multi-Pump Ready', 'Premium Support'].map(feature => (
            <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-blue-50"><CheckCircle2 size={18} className="text-green-400"/> {feature}</li>
          ))}
        </ul>
        <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl transition-colors uppercase tracking-widest text-xs border border-white/20">Current Plan</button>
      </div>

    </div>
  </div>
);
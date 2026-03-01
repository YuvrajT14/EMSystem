import React, { useState } from 'react';
import { Fuel, Truck } from 'lucide-react';
import { Card } from '../components/Shared';

export const IndentTab = ({ indents, activeDate, showAlert, onPlaceIndent, onReceiveIndent }) => {
  const [loading, setLoading] = useState(false);

  const handlePlaceIndent = async (e) => {
    e.preventDefault(); setLoading(true);
    await onPlaceIndent({ datePlaced: activeDate, product: e.target.product.value, volumeKL: Number(e.target.volume.value), status: 'Pending', cost: null, dateReceived: null, timestamp: Date.now() });
    e.target.reset(); setLoading(false);
    showAlert("Indent Placed in Cloud Database!", "success");
  };

  const handleReceive = async (e, id, volumeKL) => {
    e.preventDefault();
    const rate = Number(e.target.rate.value);
    const recvDate = e.target.recvDate.value;
    await onReceiveIndent(id, { status: 'Received', cost: (volumeKL * 1000) * rate, dateReceived: recvDate });
    showAlert("Stock marked as received in Database.", "success");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
      <Card className="p-6 h-fit">
        <div className="flex items-center gap-2 mb-6"><Fuel className="text-blue-600" size={24}/><h3 className="text-2xl font-black text-slate-900 tracking-tight">New Indent</h3></div>
        <form onSubmit={handlePlaceIndent} className="space-y-4">
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Type</label><select name="product" className="w-full p-3.5 mt-1.5 border border-slate-200 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800 transition-all"><option value="Petrol (MS)">Petrol (MS)</option><option value="Diesel (HSD)">Diesel (HSD)</option><option value="Both (Mixed)">Mixed Load</option></select></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Volume in KL</label><input type="number" step="0.1" name="volume" required className="w-full p-3.5 mt-1.5 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-800 transition-all" placeholder="e.g. 12" /></div>
          <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-md">{loading ? 'Placing...' : 'Submit Indent'}</button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6"><Truck className="text-emerald-600" size={24}/><h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Indents</h3></div>
        <div className="space-y-4">
          {indents.length === 0 ? <p className="text-sm text-slate-400 italic font-medium p-4 text-center border border-dashed rounded-xl border-slate-200 bg-slate-50">No indents placed recently.</p> : indents.map(ind => (
            <div key={ind.id} className={`p-5 border rounded-2xl transition-all ${ind.status === 'Pending' ? 'bg-orange-50/50 border-orange-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <div><p className="font-bold text-slate-900 text-base">{ind.product}</p><p className="text-[11px] font-semibold text-slate-500 mt-0.5">Placed: {ind.datePlaced}</p></div>
                <div className="text-right"><p className="font-black text-xl text-slate-800">{ind.volumeKL} KL</p><span className={`inline-block mt-1 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${ind.status === 'Pending' ? 'bg-orange-200 text-orange-800' : 'bg-emerald-200 text-emerald-800'}`}>{ind.status}</span></div>
              </div>
              {ind.status === 'Pending' && (
                <form onSubmit={(e) => handleReceive(e, ind.id, ind.volumeKL)} className="mt-5 space-y-3 border-t border-orange-100 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                     <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Arrival Date</label><input type="date" name="recvDate" defaultValue={activeDate} required className="w-full p-2.5 mt-1 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" /></div>
                     <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Rate/L (₹)</label><input type="number" step="0.01" name="rate" required placeholder="e.g. 96.50" className="w-full p-2.5 mt-1 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" /></div>
                  </div>
                  <button className="w-full bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-black hover:bg-emerald-700 shadow-md">Mark Received & Calculate</button>
                </form>
              )}
              {ind.status === 'Received' && (<div className="mt-4 pt-4 border-t border-emerald-200 flex justify-between items-center"><div><p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Total Invoice Cost:</p><p className="text-[10px] text-slate-500 font-semibold mt-0.5">Received on: {ind.dateReceived}</p></div><p className="font-black text-emerald-700 text-xl">₹ {ind.cost.toLocaleString()}</p></div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
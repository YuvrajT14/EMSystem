import React, { useState } from 'react';
import { Pencil, Lock, TrendingUp } from 'lucide-react';
import { NozzleRow } from '../components/Shared';

export const SalesTab = ({ fuelPrices, setFuelPrices, hardware, openings, setOpenings, closings, setClosings, salesRecords, onSaveSales, activeDate, currentUser, showAlert }) => {
  const [editOpen, setEditOpen] = useState({});

  const getSale = (o, c) => Math.max(0, Number(c || 0) - Number(o || 0));
  let totalMS = 0; let totalHSD = 0; let allFilled = true;

  hardware.forEach(du => {
    du.nozzles.forEach(n => {
      const key = `${du.id}_${n.id}`;
      const sale = getSale(openings[key], closings[key]);
      if (n.type.includes('Petrol')) totalMS += sale;
      if (n.type.includes('Diesel')) totalHSD += sale;
      if (closings[key] === '' || closings[key] === undefined) allFilled = false;
    });
  });

  const totalVal = totalMS * Number(fuelPrices.petrol) + totalHSD * Number(fuelPrices.diesel);
  const isAlreadySaved = salesRecords.some(r => r.date === activeDate);

  const syncDailySales = () => {
    if (isAlreadySaved) return;
    const record = { msLiters: totalMS, hsdLiters: totalHSD, totalAmount: totalVal, petrolRate: fuelPrices.petrol, dieselRate: fuelPrices.diesel };
    onSaveSales(record);
  };

  return (
    <div className="space-y-6 w-full">
      {/* RESPONSIVE GRID FIXED HERE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full">
          <div className="flex justify-between mb-1">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Petrol Rate</p>
            {!fuelPrices.isEditing && currentUser.role === 'Admin' && <button onClick={() => setFuelPrices(p => ({ ...p, isEditing: true }))} className="text-slate-300 hover:text-blue-500 p-1"><Pencil size={11} /></button>}
          </div>
          {fuelPrices.isEditing ? <input type="number" value={fuelPrices.petrol} onChange={(e) => setFuelPrices(p => ({ ...p, petrol: e.target.value }))} className="w-full p-2.5 border-2 border-orange-300 rounded-lg text-sm font-bold outline-none" /> : <p className="text-2xl font-black text-slate-800 tracking-tight">₹{fuelPrices.petrol}</p>}
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full">
          <div className="flex justify-between mb-1">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Diesel Rate</p>
            {!fuelPrices.isEditing && currentUser.role === 'Admin' && <button onClick={() => setFuelPrices(p => ({ ...p, isEditing: true }))} className="text-slate-300 hover:text-blue-500 p-1"><Pencil size={11} /></button>}
          </div>
          {fuelPrices.isEditing ? <input type="number" value={fuelPrices.diesel} onChange={(e) => setFuelPrices(p => ({ ...p, diesel: e.target.value }))} className="w-full p-2.5 border-2 border-blue-300 rounded-lg text-sm font-bold outline-none" /> : <p className="text-2xl font-black text-slate-800 tracking-tight">₹{fuelPrices.diesel}</p>}
        </div>
        
        {fuelPrices.isEditing ? (
          <div className="sm:col-span-2 flex items-center">
            <button onClick={() => setFuelPrices(p => ({ ...p, isEditing: false }))} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-md hover:bg-blue-700">Save Daily Rates</button>
          </div>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Volume Sold</p>
              <p className="text-sm font-black text-orange-600">{totalMS.toFixed(1)} L MS</p>
              <p className="text-sm font-black text-blue-600 mt-0.5">{totalHSD.toFixed(1)} L HSD</p>
            </div>
            <div className="rounded-2xl p-4 flex flex-col justify-center w-full" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
              <div className="flex items-center gap-1.5 mb-1"><TrendingUp size={14} className="text-green-400" /><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Sales</p></div>
              <p className="text-2xl font-black text-green-400 tracking-tight">₹{totalVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
          </>
        )}
      </div>

      {isAlreadySaved && <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm font-semibold text-green-700 w-full"><Lock size={18} className="text-green-500" /> Sales record for {activeDate} is locked in Database.</div>}

      {/* DYNAMIC UNITS RESPONSIVE GRID */}
      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 w-full ${isAlreadySaved ? 'opacity-50 pointer-events-none' : ''}`}>
        {hardware.map((du) => (
          <div key={du.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
            <div className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white" style={{ background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)' }}>{du.name}</div>
            <div className="divide-y divide-slate-100">
              {du.nozzles.map((nozzle) => {
                const key = `${du.id}_${nozzle.id}`;
                return (
                  <NozzleRow key={key} title={nozzle.title || `${nozzle.type}`} color={nozzle.color} openVal={openings[key]} closeVal={closings[key]} isEditingOpen={editOpen[key]} toggleEditOpen={() => currentUser.role === 'Admin' ? setEditOpen(p => ({ ...p, [key]: !p[key] })) : showAlert('Admins only', 'error')} onOpenChange={(v) => setOpenings(p => ({ ...p, [key]: v }))} onCloseChange={(v) => setClosings(p => ({ ...p, [key]: v }))} />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={syncDailySales} disabled={!allFilled || isAlreadySaved} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex justify-center items-center gap-2.5 transition-all ${(!allFilled || isAlreadySaved) ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'text-white shadow-xl hover:shadow-blue-600/25'}`} style={(!allFilled || isAlreadySaved) ? {} : { background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 100%)' }}>
        <Lock size={17} />{isAlreadySaved ? 'Shift Saved to Cloud' : allFilled ? 'Save Shift to Database' : 'Fill All Readings to Continue'}
      </button>
    </div>
  );
};
import React, { useState } from 'react';
import { Droplet, Save } from 'lucide-react';
import { Card } from '../components/Shared';

export const DensityTab = ({ activeDate, showAlert, onAddDensity, densityRecords }) => {
  const [msDensity, setMsDensity] = useState(''); const [msTemp, setMsTemp] = useState('');
  const [hsdDensity, setHsdDensity] = useState(''); const [hsdTemp, setHsdTemp] = useState('');

  const handleDensitySave = async (e) => {
    e.preventDefault();
    await onAddDensity({ date: activeDate, msDensity, msTemp, hsdDensity, hsdTemp });
    showAlert("Density Saved to Database!", "success");
    setMsDensity(''); setMsTemp(''); setHsdDensity(''); setHsdTemp('');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Card className="p-6">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Droplet className="text-blue-600" size={20}/> Record Daily Density</h3>
        <form onSubmit={handleDensitySave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100"><h4 className="font-black text-orange-600 uppercase tracking-widest text-xs mb-4">Petrol (MS)</h4><div className="space-y-4"><div><label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">Density (kg/m³)</label><input type="number" step="0.0001" required value={msDensity} onChange={e=>setMsDensity(e.target.value)} className="w-full p-3 mt-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-50 bg-white" placeholder="e.g. 745.2" /></div><div><label className="text-[10px] font-bold text-slate-500 uppercase">Temp (°C)</label><input type="number" step="0.1" required value={msTemp} onChange={e=>setMsTemp(e.target.value)} className="w-full p-3 mt-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-50 bg-white" placeholder="e.g. 28.5" /></div></div></div>
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100"><h4 className="font-black text-blue-600 uppercase tracking-widest text-xs mb-4">Diesel (HSD)</h4><div className="space-y-4"><div><label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">Density (kg/m³)</label><input type="number" step="0.0001" required value={hsdDensity} onChange={e=>setHsdDensity(e.target.value)} className="w-full p-3 mt-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 bg-white" placeholder="e.g. 830.5" /></div><div><label className="text-[10px] font-bold text-slate-500 uppercase">Temp (°C)</label><input type="number" step="0.1" required value={hsdTemp} onChange={e=>setHsdTemp(e.target.value)} className="w-full p-3 mt-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 bg-white" placeholder="e.g. 29.0" /></div></div></div>
          <button type="submit" className="md:col-span-2 bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2 hover:bg-blue-600 transition-all shadow-md mt-2"><Save size={18}/> Save Density Log</button>
        </form>
      </Card>
      <Card className="p-6">
        <h3 className="font-black text-slate-800 uppercase tracking-wide mb-4 text-sm">Past Records</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 font-bold uppercase tracking-wider text-[10px] text-slate-500 border-b border-slate-200"><tr><th className="px-5 py-4">Date</th><th className="px-5 py-4">MS Density</th><th className="px-5 py-4">MS Temp</th><th className="px-5 py-4">HSD Density</th><th className="px-5 py-4">HSD Temp</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{densityRecords.map(r=>(<tr key={r.id} className="hover:bg-slate-50/50"><td className="px-5 py-4 font-bold">{r.date}</td><td className="px-5 py-4 text-orange-600 font-black">{r.msDensity}</td><td className="px-5 py-4 font-semibold">{r.msTemp}°C</td><td className="px-5 py-4 text-blue-600 font-black">{r.hsdDensity}</td><td className="px-5 py-4 font-semibold">{r.hsdTemp}°C</td></tr>))}</tbody></table></div>
      </Card>
    </div>
  );
};
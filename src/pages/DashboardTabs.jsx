import React from 'react';
import { Pencil, ClipboardCheck, Search, Plus, Trash2, Info, PlusCircle, MinusCircle, History, ReceiptText, ShieldCheck } from 'lucide-react';
import { NozzleRow } from '../components/Shared';

export const SalesTab = ({ fuelPrices, setFuelPrices, openings, setOpenings, closings, setClosings, syncDailySales, isAlreadySaved, activeDate, currentUser, showAlert }) => {
  const [editOpen, setEditOpen] = React.useState({ du1_ms: false, du1_hsd: false, du2_ms: false, du2_hsd: false });

  const getSale = (o, c) => (Number(c) > Number(o) ? Number(c) - Number(o) : 0);
  const totalMS = getSale(openings.du1_ms, closings.du1_ms) + getSale(openings.du2_ms, closings.du2_ms);
  const totalHSD = getSale(openings.du1_hsd, closings.du1_hsd) + getSale(openings.du2_hsd, closings.du2_hsd);
  const totalVal = (totalMS * fuelPrices.petrol) + (totalHSD * fuelPrices.diesel);
  const allFilled = closings.du1_ms && closings.du1_hsd && closings.du2_ms && closings.du2_hsd;

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="space-y-1"><label className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-2">Petrol Rate {(!fuelPrices.isEditing && currentUser.role === 'Admin') && <button onClick={()=>setFuelPrices(p=>({...p, isEditing: true}))}><Pencil size={12}/></button>}</label>{fuelPrices.isEditing ? <input type="number" value={fuelPrices.petrol} onChange={(e)=>setFuelPrices({...fuelPrices, petrol: e.target.value})} className="w-full p-2 border rounded text-xs font-bold" /> : <p className="text-lg font-black text-slate-800">₹{fuelPrices.petrol}</p>}</div>
        <div className="space-y-1"><label className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2">Diesel Rate {(!fuelPrices.isEditing && currentUser.role === 'Admin') && <button onClick={()=>setFuelPrices(p=>({...p, isEditing: true}))}><Pencil size={12}/></button>}</label>{fuelPrices.isEditing ? <input type="number" value={fuelPrices.diesel} onChange={(e)=>setFuelPrices({...fuelPrices, diesel: e.target.value})} className="w-full p-2 border rounded text-xs font-bold" /> : <p className="text-lg font-black text-slate-800">₹{fuelPrices.diesel}</p>}</div>
        {fuelPrices.isEditing && <div className="col-span-2 flex items-end"><button onClick={()=>setFuelPrices(p=>({...p, isEditing: false}))} className="bg-blue-600 text-white w-full py-2 rounded font-bold text-xs">Save</button></div>}
        {!fuelPrices.isEditing && (<><div className="p-2 bg-white border rounded-lg flex flex-col justify-center"><p className="text-[9px] font-bold text-slate-400 uppercase">Volume</p><p className="text-xs font-black italic text-slate-700">{totalMS.toFixed(2)}L MS | {totalHSD.toFixed(2)}L HSD</p></div><div className="p-2 bg-[#0F172A] rounded-lg flex flex-col justify-center"><p className="text-[9px] font-bold text-slate-400 uppercase">Total Sales</p><p className="text-sm font-black italic text-green-400">₹ {totalVal.toLocaleString()}</p></div></>)}
      </div>

      {isAlreadySaved && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2"><ClipboardCheck size={18}/> Record locked for {activeDate}.</div>}

      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${isAlreadySaved ? 'opacity-50 pointer-events-none' : ''}`}>
        {[1, 2].map(u => (
          <div key={u} className="border rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest italic">Unit {u}</div>
            <NozzleRow title="Nozzle 1 (Petrol)" color="orange" openVal={openings[`du${u}_ms`]} closeVal={closings[`du${u}_ms`]} isEditingOpen={editOpen[`du${u}_ms`]} toggleEditOpen={() => currentUser.role === 'Admin' ? setEditOpen(p => ({...p, [`du${u}_ms`]: !p[`du${u}_ms`]})) : showAlert('Only Admin can edit', 'error')} onOpenChange={(v) => setOpenings(p => ({...p, [`du${u}_ms`]: v}))} onCloseChange={(v) => setClosings(p => ({...p, [`du${u}_ms`]: v}))} />
            <div className="border-t border-slate-100"></div>
            <NozzleRow title="Nozzle 2 (Diesel)" color="blue" openVal={openings[`du${u}_hsd`]} closeVal={closings[`du${u}_hsd`]} isEditingOpen={editOpen[`du${u}_hsd`]} toggleEditOpen={() => currentUser.role === 'Admin' ? setEditOpen(p => ({...p, [`du${u}_hsd`]: !p[`du${u}_hsd`]})) : showAlert('Only Admin can edit', 'error')} onOpenChange={(v) => setOpenings(p => ({...p, [`du${u}_hsd`]: v}))} onCloseChange={(v) => setClosings(p => ({...p, [`du${u}_hsd`]: v}))} />
          </div>
        ))}
      </div>
      <button onClick={syncDailySales} disabled={!allFilled || isAlreadySaved} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex justify-center items-center gap-2 shadow-xl transition-all ${(!allFilled || isAlreadySaved) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#0F172A] text-white hover:bg-blue-600'}`}><ClipboardCheck size={18}/> {isAlreadySaved ? 'Already Locked' : "Lock Sales & Advance Date"}</button>
    </div>
  );
};

export const StaffMaster = ({ employees, searchTerm, setSearchTerm, setShowAddEmployee, confirmDelete }) => (
  <div className="p-4 md:p-6 space-y-6">
    <div className="flex gap-4 justify-between"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={16} /><input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" onChange={(e)=>setSearchTerm(e.target.value)} /></div><button onClick={() => setShowAddEmployee(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2"><Plus size={16}/> Add Emp</button></div>
    <div className="border rounded-xl overflow-x-auto w-full"><table className="w-full text-left text-xs whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-bold border-b uppercase"><tr><th className="px-4 py-4">Name</th><th className="px-4 py-4">Details</th><th className="px-4 py-4">Salary</th><th className="px-4 py-4">Action</th></tr></thead>
      <tbody className="divide-y">{employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (<tr key={emp.id} className="hover:bg-slate-50"><td className="px-4 py-4 font-bold text-slate-700">{emp.name}</td><td className="px-4 py-4 text-slate-500">{emp.phone}</td><td className="px-4 py-4 font-black text-green-600">₹ {emp.salary.toLocaleString()}</td><td className="px-4 py-4"><button onClick={() => confirmDelete('employee', emp.id, emp.name)} className="p-2 text-red-400 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td></tr>))}</tbody></table></div>
  </div>
);

// BAAKI TABS (Attendance, Udhaar, Expenses, etc.) hum App.jsx mein import karke dikhayenge. 
// For exact modularity, you can extract them similarly.
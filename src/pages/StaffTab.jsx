import React, { useState } from 'react';
import { Search, Plus, Trash2, Calendar } from 'lucide-react';
import { Card } from '../components/Shared';

// ─── 1. STAFF MASTER ───
export const StaffMaster = ({ employees, onAddEmployee, confirmDelete, showAlert }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [doj, setDoj] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhone = (e) => { const val = e.target.value.replace(/\D/g, ''); if (val.length <= 10) setPhone(val); };

  const handleAdd = async (e) => {
    e.preventDefault(); 
    if (phone.length !== 10) return showAlert("Phone number must be exactly 10 digits.", "error");

    setLoading(true);
    await onAddEmployee({ name, phone, salary: Number(salary), doj: doj || 'Not Added' });
    setName(''); setPhone(''); setSalary(''); setDoj(''); setLoading(false);
    showAlert('Staff Saved Successfully!', 'success'); // CLEAN MESSAGE
  };
  
  return (
    <div className="space-y-6 max-w-5xl w-full">
      <Card className="p-6">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Plus className="text-blue-600"/> Add New Employee</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required className="p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
          <input type="text" placeholder="Phone (10 Digits)" value={phone} onChange={handlePhone} required className="p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
          <input type="number" placeholder="Salary (₹)" value={salary} onChange={e=>setSalary(e.target.value)} required className="p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
          <input type="date" value={doj} onChange={e=>setDoj(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 outline-none focus:border-blue-500" />
          <button disabled={loading} className="md:col-span-4 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-all">{loading ? 'Saving...' : 'Add Staff'}</button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="relative flex-1 max-w-md mb-6"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search employee..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500" onChange={(e)=>setSearchTerm(e.target.value)} /></div>
        <div className="border border-slate-200 rounded-xl overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">DOJ</th><th className="px-5 py-4">Salary</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700 font-medium">{employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (<tr key={emp.id} className="hover:bg-slate-50 transition-colors"><td className="px-5 py-4 font-bold text-slate-900">{emp.name}</td><td className="px-5 py-4 text-slate-600">{emp.phone}</td><td className="px-5 py-4 text-slate-600 flex items-center gap-2"><Calendar size={14}/> {emp.doj || '-'}</td><td className="px-5 py-4 font-black text-emerald-600">₹ {emp.salary?.toLocaleString()}</td><td className="px-5 py-4 text-right"><button onClick={() => confirmDelete(emp.id, emp.name)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16}/></button></td></tr>))}</tbody></table></div>
      </Card>
    </div>
  );
};

// ─── 2. DAILY ATTENDANCE ───
export const DailyAttendance = ({ employees, dailyAttendance, setDailyAttendance, onLockAttendance, activeDate, showAlert }) => {
  const toggleShift = (id) => setDailyAttendance(p => ({ ...p, [id]: { ...p[id], hasShift: !p[id]?.hasShift, status: !p[id]?.hasShift ? 'P' : null } }));
  const markStatus = (id, s) => { if(!dailyAttendance[id]?.hasShift) return showAlert("Enable shift first!", "error"); setDailyAttendance(p => ({ ...p, [id]: { ...p[id], status: s } })); };
  const handleLock = async () => { const records = employees.filter(e => dailyAttendance[e.id]?.hasShift).map(e => ({ id: e.id, name: e.name, status: dailyAttendance[e.id]?.status || 'P' })); if(records.length === 0) return showAlert("No shifts!", "error"); await onLockAttendance({ records }); setDailyAttendance({}); showAlert(`Attendance Locked!`, "success"); };

  return (
    <Card className="p-6 max-w-5xl w-full">
      <div className="flex justify-between items-center mb-6"><h3 className="font-black text-slate-800 tracking-tight text-lg">Daily Attendance</h3><button onClick={handleLock} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-blue-600 shadow-md">Lock Today</button></div>
      <div className="border border-slate-200 rounded-xl overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]"><tr><th className="px-5 py-4">Employee</th><th className="px-5 py-4 text-center">Shift</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{employees.map(emp => { const hasShift = dailyAttendance[emp.id]?.hasShift; const status = dailyAttendance[emp.id]?.status; return (<tr key={emp.id} className="hover:bg-slate-50 transition-colors"><td className="px-5 py-4"><p className="font-bold text-slate-900">{emp.name}</p></td><td className="px-5 py-4 text-center"><button onClick={() => toggleShift(emp.id)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all border ${hasShift ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>{hasShift ? 'ON DUTY' : 'OFF DUTY'}</button></td><td className="px-5 py-4"><div className="flex justify-end items-center gap-2">{hasShift ? (<><button onClick={() => markStatus(emp.id, 'P')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${status === 'P' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200'}`}>P</button><button onClick={() => markStatus(emp.id, 'A')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${status === 'A' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-500 border-slate-200'}`}>A</button></>) : (<span className="text-slate-400 font-semibold italic text-xs mr-4">--</span>)}</div></td></tr>);})}</tbody></table></div>
    </Card>
  );
};
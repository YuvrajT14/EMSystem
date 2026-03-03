import React, { useState } from 'react';
import { Search, Plus, Trash2, Calendar } from 'lucide-react';
import { Card } from '../components/Shared';

export const StaffMaster = ({ employees, onAddEmployee, confirmDelete, showAlert }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [doj, setDoj] = useState('');
  const [loading, setLoading] = useState(false);

  // Strict Phone Input
  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) setPhone(val);
  };

  const handleAdd = async (e) => {
    e.preventDefault(); 
    if (phone.length !== 10) return showAlert("Phone number must be exactly 10 digits.", "error");

    setLoading(true);
    await onAddEmployee({ name, phone, salary: Number(salary), doj: doj || 'Not Added' });
    setName(''); setPhone(''); setSalary(''); setDoj(''); setLoading(false);
    showAlert('Employee Added to Cloud!', 'success');
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
        <div className="border border-slate-200 rounded-xl overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Date of Joining</th><th className="px-5 py-4">Salary</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700 font-medium">{employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (<tr key={emp.id} className="hover:bg-slate-50 transition-colors"><td className="px-5 py-4 font-bold text-slate-900">{emp.name}</td><td className="px-5 py-4 text-slate-600">{emp.phone}</td><td className="px-5 py-4 text-slate-600 flex items-center gap-2"><Calendar size={14}/> {emp.doj || '-'}</td><td className="px-5 py-4 font-black text-emerald-600">₹ {emp.salary?.toLocaleString()}</td><td className="px-5 py-4 text-right"><button onClick={() => confirmDelete(emp.id, emp.name)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16}/></button></td></tr>))}</tbody></table></div>
      </Card>
    </div>
  );
};
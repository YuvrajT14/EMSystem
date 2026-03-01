import React, { useState } from 'react';
import { Truck, Search, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/Shared';

export const UdhaarTab = ({ customers, setCustomers, activeDate, showAlert, confirmDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if(!name || !mobile) return;
    setCustomers([{ id: Date.now(), name, mobile, totalUdhaar: 0, transactions: [] }, ...customers]);
    setName(''); setMobile('');
    showAlert('Customer Added Successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Card className="p-6">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="text-blue-600"/> Add New Client
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Firm/Customer Name" value={name} onChange={e=>setName(e.target.value)} required className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none" />
          <input type="number" placeholder="Mobile Number" value={mobile} onChange={e=>setMobile(e.target.value)} required className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none" />
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-all">Add Client</button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search customer..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" onChange={(e)=>setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4 text-right">Due Amount</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 uppercase">{cust.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400">{cust.mobile}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-black text-red-600">₹ {cust.totalUdhaar.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right">
                     <button onClick={() => confirmDelete('customer', cust.id, cust.name)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
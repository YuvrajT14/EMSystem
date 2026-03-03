import React, { useState } from 'react';
import { Truck, Search, Plus, Trash2, ArrowLeft, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';
import { Card } from '../components/Shared';

export const UdhaarTab = ({ customers, onAddCustomer, onUpdateCustomer, activeDate, showAlert, confirmDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState(null);

  // HANDLE PHONE INPUT (Strict 10 Digits Only)
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Remove non-numbers
    if (val.length <= 10) setMobile(val);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) return showAlert("Phone number must be exactly 10 digits", "error");
    if (!name.trim()) return showAlert("Client name is required", "error");

    setLoading(true);
    try {
      await onAddCustomer({ name, mobile, totalUdhaar: 0, transactions: [] });
      setName(''); setMobile(''); 
      showAlert('Client Added Securely!', 'success');
    } catch (err) {
      console.error(err);
      showAlert('Failed to save client. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (e, type) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);
    const desc = e.target.desc.value;
    const customer = customers.find(c => c.id === selectedCustId);

    if (!customer) return;
    if (amount <= 0) return showAlert("Amount must be valid", "error");

    const newTxn = { id: Date.now().toString(), date: activeDate, type, amount, desc: desc || (type === 'GIVEN' ? 'Fuel Credit' : 'Payment Received'), timestamp: Date.now() };
    const updatedTxns = [newTxn, ...(customer.transactions || [])];
    const newTotal = type === 'GIVEN' ? (customer.totalUdhaar || 0) + amount : (customer.totalUdhaar || 0) - amount;

    await onUpdateCustomer(customer.id, { transactions: updatedTxns, totalUdhaar: newTotal });
    e.target.reset();
    showAlert('Transaction Recorded!', 'success');
  };

  if (selectedCustId) {
    const customer = customers.find(c => c.id === selectedCustId);
    if (!customer) { setSelectedCustId(null); return null; }
    return (
      <div className="space-y-6 max-w-5xl w-full animate-in fade-in duration-200">
        <button onClick={() => setSelectedCustId(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 w-fit shadow-sm"><ArrowLeft size={16} /> Back to List</button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden flex flex-col justify-center min-h-[200px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Total Due Amount</p>
            <h2 className="text-4xl font-black tracking-tight mb-4">₹ {customer.totalUdhaar?.toLocaleString() || 0}</h2>
            <div><p className="font-bold text-lg leading-tight">{customer.name}</p><p className="text-blue-200 font-medium text-sm">+91 {customer.mobile}</p></div>
          </div>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">Log Transaction</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form onSubmit={(e) => handleTransaction(e, 'GIVEN')} className="bg-red-50/50 border border-red-100 p-4 rounded-2xl space-y-3"><p className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={14}/> Credit Given</p><input type="number" name="amount" required placeholder="Amount (₹)" className="w-full p-2.5 rounded-xl border border-red-200 text-sm font-bold outline-none focus:border-red-500 bg-white" /><input type="text" name="desc" placeholder="Details (e.g. Bill No)" className="w-full p-2.5 rounded-xl border border-red-200 text-xs font-semibold outline-none focus:border-red-500 bg-white" /><button className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-black transition-all">Add Udhaar</button></form>
              <form onSubmit={(e) => handleTransaction(e, 'RECEIVED')} className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-3"><p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><ArrowDownRight size={14}/> Payment Received</p><input type="number" name="amount" required placeholder="Amount (₹)" className="w-full p-2.5 rounded-xl border border-emerald-200 text-sm font-bold outline-none focus:border-emerald-500 bg-white" /><input type="text" name="desc" placeholder="Details (e.g. Cash/UPI)" className="w-full p-2.5 rounded-xl border border-emerald-200 text-xs font-semibold outline-none focus:border-emerald-500 bg-white" /><button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-black transition-all">Record Payment</button></form>
            </div>
          </Card>
        </div>
        <Card className="p-6"><h3 className="font-black text-slate-800 uppercase tracking-wide mb-4 text-sm flex items-center gap-2"><History size={16} className="text-blue-600"/> Transaction Log</h3><div className="border border-slate-200 rounded-xl overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]"><tr><th className="px-5 py-4">Date</th><th className="px-5 py-4">Details</th><th className="px-5 py-4 text-right">Credit</th><th className="px-5 py-4 text-right">Payment</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{(!customer.transactions || customer.transactions.length === 0) ? (<tr><td colSpan="4" className="p-6 text-center text-slate-400 italic font-medium">No transactions recorded yet.</td></tr>) : (customer.transactions.map(txn => (<tr key={txn.id} className="hover:bg-slate-50 transition-colors"><td className="px-5 py-4 font-bold text-slate-900">{txn.date}</td><td className="px-5 py-4 text-xs font-semibold text-slate-500">{txn.desc}</td><td className="px-5 py-4 text-right font-black text-red-600">{txn.type === 'GIVEN' ? `₹ ${txn.amount.toLocaleString()}` : '-'}</td><td className="px-5 py-4 text-right font-black text-emerald-600">{txn.type === 'RECEIVED' ? `₹ ${txn.amount.toLocaleString()}` : '-'}</td></tr>)))}</tbody></table></div></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl w-full">
      <Card className="p-6">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Plus className="text-blue-600"/> Add New Client</h3>
        <form onSubmit={handleAddCustomer} className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Firm/Customer Name" value={name} onChange={e=>setName(e.target.value)} required className="flex-[2] p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" />
          <input type="number" placeholder="Mobile Number (10 Digits)" value={mobile} onChange={handlePhoneChange} required className="flex-[2] p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" />
          <button disabled={loading} className="flex-1 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-all disabled:opacity-50">{loading ? 'Adding...' : 'Add Client'}</button>
        </form>
      </Card>
      <Card className="p-6">
        <div className="relative flex-1 max-w-md mb-6"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search customer by name..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" onChange={(e)=>setSearchTerm(e.target.value)} /></div>
        <div className="border border-slate-200 rounded-xl overflow-x-auto"><table className="w-full text-left text-sm whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]"><tr><th className="px-5 py-4">Customer Details</th><th className="px-5 py-4 text-right">Total Due Amount</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700 font-medium">{customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cust => (<tr key={cust.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedCustId(cust.id)}><td className="px-5 py-4"><p className="font-bold text-slate-900 uppercase group-hover:text-blue-700 transition-colors">{cust.name}</p><p className="text-[10px] font-semibold text-slate-400 mt-0.5">{cust.mobile}</p></td><td className="px-5 py-4 text-right font-black text-red-600 text-base">₹ {cust.totalUdhaar?.toLocaleString() || 0}</td><td className="px-5 py-4 text-right"><button onClick={(e) => { e.stopPropagation(); confirmDelete(cust.id, cust.name); }} className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16}/></button></td></tr>))}{customers.length === 0 && (<tr><td colSpan="3" className="p-6 text-center text-slate-400 font-medium">No clients added yet.</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
};
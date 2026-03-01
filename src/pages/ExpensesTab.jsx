import React, { useState } from 'react';
import { IndianRupee, Trash2, Plus } from 'lucide-react';
import { Card } from '../components/Shared';

export const ExpensesTab = ({ expenses, activeDate, confirmDelete, showAlert, onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAddExpense({ date: activeDate, title, amount: Number(amount), timestamp: Date.now() });
    setTitle(''); setAmount(''); setLoading(false);
    showAlert('Expense logged to Cloud securely!', 'success');
  };

  const totalExpenseAmount = expenses.filter(e => e.date === activeDate).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Today's Kharcha</p>
          <p className="text-4xl font-black text-red-600 tracking-tighter mt-2">₹ {totalExpenseAmount.toLocaleString()}</p>
        </div>
        <Card className="md:col-span-2 p-6">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Plus className="text-blue-600"/> Log New Expense</h3>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <input type="text" placeholder="Expense description" value={title} onChange={e=>setTitle(e.target.value)} required className="flex-[2] p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" />
            <input type="number" placeholder="Amount (₹)" value={amount} onChange={e=>setAmount(e.target.value)} required className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" />
            <button disabled={loading} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-red-600 transition-all">{loading ? 'Saving...' : 'Add'}</button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
         <h3 className="font-black text-slate-800 uppercase tracking-wide mb-4 text-sm">Expense Log</h3>
         <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr><th className="px-5 py-4">Date</th><th className="px-5 py-4">Description</th><th className="px-5 py-4 text-right">Amount (₹)</th><th className="px-5 py-4 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {expenses.length === 0 ? <tr><td colSpan="4" className="text-center p-4 text-slate-400">No expenses logged.</td></tr> : expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-bold">{exp.date}</td>
                  <td className="px-5 py-4 font-bold text-slate-900 capitalize">{exp.title}</td>
                  <td className="px-5 py-4 text-right font-black text-red-600">₹ {exp.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right"><button onClick={() => confirmDelete('expense', exp.id, exp.title)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
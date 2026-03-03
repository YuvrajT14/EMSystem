import React, { useState } from 'react';
import { IndianRupee, Trash2, Plus, TrendingDown } from 'lucide-react';
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
    showAlert('Expense logged securely!', 'success');
  };

  const totalExpenseAmount = expenses.filter(e => e.date === activeDate).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl w-full">
      {/* PROFESSIONAL SUMMARY STRIP */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
            <TrendingDown className="text-red-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Expense Today</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">₹ {totalExpenseAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* COMPACT ADD FORM */}
      <Card className="p-5">
        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide"><Plus size={16} className="text-blue-600"/> Log New Expense</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input type="text" placeholder="Expense description (e.g. Tea, Repairs)" value={title} onChange={e=>setTitle(e.target.value)} required className="flex-[3] p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" />
          <input type="number" placeholder="₹ Amount" value={amount} onChange={e=>setAmount(e.target.value)} required className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:border-blue-500 outline-none" />
          <button disabled={loading} className="px-6 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-red-600 transition-all">{loading ? '...' : 'Add'}</button>
        </form>
      </Card>

      {/* CLEAN LIST VIEW */}
      <Card className="overflow-hidden">
         <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Recent Expenses</h3></div>
         <div className="divide-y divide-slate-100">
          {expenses.length === 0 ? <p className="text-center p-6 text-slate-400 text-sm font-medium italic">No expenses recorded for today.</p> : expenses.map(exp => (
            <div key={exp.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-900 text-sm capitalize">{exp.title}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{exp.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-black text-red-600">₹ {exp.amount.toLocaleString()}</p>
                <button onClick={() => confirmDelete(exp.id, exp.title)} className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
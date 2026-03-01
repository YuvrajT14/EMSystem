import React from 'react';
import { Card } from '../components/Shared';
import { Info } from 'lucide-react';

export const SalesHistory = ({ salesRecords }) => (
  <Card className="p-6">
    <h3 className="font-black text-slate-800 uppercase italic mb-6">Sales Log</h3>
    <div className="border border-slate-100 rounded-xl overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 font-bold uppercase tracking-wider text-[10px] text-slate-500 border-b">
          <tr><th className="p-4">Date</th><th className="p-4">MS (L)</th><th className="p-4">HSD (L)</th><th className="p-4 text-right">Value (₹)</th></tr>
        </thead>
        <tbody className="divide-y text-slate-800">
          {salesRecords.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-slate-400 italic">No sales data found in database.</td></tr> : salesRecords.map(rec => (
            <tr key={rec.id} className="hover:bg-slate-50">
              <td className="p-4 font-bold">{rec.date}</td>
              <td className="p-4 text-orange-600 font-bold">{rec.msLiters?.toFixed(2)}</td>
              <td className="p-4 text-blue-600 font-bold">{rec.hsdLiters?.toFixed(2)}</td>
              <td className="p-4 text-right font-black text-green-600">₹{rec.totalAmount?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

export const CreditHistory = ({ customers }) => (
  <Card className="p-6">
    <h3 className="font-black text-slate-800 uppercase italic mb-6">Credit Ledger</h3>
    <div className="text-slate-500 text-sm italic">Select a customer from the Credit Ledger tab to view their specific history.</div>
  </Card>
);

export const AttendanceHistory = ({ attendanceRecords }) => (
  <Card className="p-6">
    <h3 className="font-black text-slate-800 uppercase italic mb-6">Attendance Log</h3>
    <div className="space-y-4">
      {attendanceRecords.length === 0 ? <p className="text-sm text-slate-400 italic">No attendance data found.</p> : attendanceRecords.map(log => (
        <div key={log.id} className="border border-slate-100 rounded-xl p-5 bg-slate-50">
          <p className="font-black text-sm mb-3 text-slate-800">Date: {log.date}</p>
          <div className="flex flex-wrap gap-2">
            {log.records.map(r => (
              <span key={r.id} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border ${r.status==='P'?'bg-green-100 text-green-800 border-green-200':'bg-red-100 text-red-800 border-red-200'}`}>
                {r.name}: {r.status}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const ExpenseHistory = ({ expenses }) => (
  <Card className="p-6">
    <h3 className="font-black text-slate-800 uppercase italic mb-6">Expense Log</h3>
    <div className="border border-slate-100 rounded-xl overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 font-bold uppercase tracking-wider text-[10px] text-slate-500 border-b">
          <tr><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4 text-right">Amount (₹)</th></tr>
        </thead>
        <tbody className="divide-y text-slate-800">
          {expenses.length === 0 ? <tr><td colSpan="3" className="p-4 text-center text-slate-400 italic">No expenses recorded.</td></tr> : expenses.map(exp => (
            <tr key={exp.id} className="hover:bg-slate-50">
              <td className="p-4 font-bold">{exp.date}</td>
              <td className="p-4 font-semibold capitalize">{exp.title}</td>
              <td className="p-4 text-right font-black text-red-600">₹{exp.amount?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
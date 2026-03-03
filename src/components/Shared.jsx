import React from 'react';
import { X, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

// Common Card Component
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

// Common Modal Component
export const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black text-lg text-slate-800 tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
          <X size={20} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// FIXED: Delete Modal now shows clean Name instead of ID
export const ConfirmDeleteModal = ({ name, type, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Delete this {type}?</h3>
      <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
        Are you sure you want to remove <span className="font-bold text-slate-800">"{name}"</span>?
        <br/>This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-colors">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// Alert Toast
export const AlertToast = ({ msg, type }) => (
  <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-5 duration-300 border-2 ${type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
    {type === 'error' ? <AlertTriangle size={20} className="shrink-0"/> : <CheckCircle2 size={20} className="shrink-0"/>}
    <p className="font-bold text-sm pr-2">{msg}</p>
  </div>
);

// Nozzle Row Component (For Sales Tab)
export const NozzleRow = ({ title, color, openVal, closeVal, isEditingOpen, toggleEditOpen, onOpenChange, onCloseChange }) => {
  const diff = (Number(closeVal) - Number(openVal)).toFixed(2);
  const isSold = Number(diff) > 0;

  return (
    <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-slate-50 transition-colors group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-8 rounded-full ${color === 'orange' ? 'bg-orange-500' : 'bg-blue-600'}`}></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            {isSold && <p className="text-sm font-black text-slate-800 mt-0.5">{diff} Liters Sold</p>}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex-1 md:w-32">
          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Opening</label>
          <div className="relative">
            <input 
              type="number" 
              value={openVal} 
              disabled={!isEditingOpen}
              onChange={(e) => onOpenChange(e.target.value)}
              className={`w-full p-2.5 rounded-xl border-2 text-sm font-bold outline-none transition-all ${isEditingOpen ? 'bg-white border-blue-400 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
            />
            {!isEditingOpen && <button onClick={toggleEditOpen} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 p-1">✎</button>}
          </div>
        </div>
        
        <div className="flex-1 md:w-32">
          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Closing</label>
          <input 
            type="number" 
            value={closeVal} 
            onChange={(e) => onCloseChange(e.target.value)}
            placeholder="0.00"
            className="w-full p-2.5 bg-white border-2 border-slate-200 focus:border-blue-500 rounded-xl text-sm font-black text-slate-800 outline-none shadow-sm focus:ring-4 focus:ring-blue-50 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
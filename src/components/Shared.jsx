import React from 'react';
import { X, AlertCircle, CheckCircle2, Pencil } from 'lucide-react';

// ── Alert Toast ────────────────────────────────────────────────────────────────
export const AlertToast = ({ msg, type }) => (
  <div
    className={`fixed top-5 left-1/2 z-[200] px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2.5`}
    style={{
      transform: 'translateX(-50%)',
      background: type === 'error' ? '#dc2626' : '#059669',
      color: 'white',
      animation: 'slideDown 0.25s ease',
      whiteSpace: 'nowrap',
    }}
  >
    {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
    {msg}
    <style>{`@keyframes slideDown { from { opacity:0; transform: translateX(-50%) translateY(-12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
  </div>
);

// ── Modal ──────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children, wide = false }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className={`bg-white rounded-2xl shadow-2xl ${wide ? 'max-w-lg' : 'max-w-sm'} w-full p-6`}
      style={{ animation: 'popIn 0.2s ease' }}
    >
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">{title}</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <X size={16} />
        </button>
      </div>
      {children}
    </div>
    <style>{`@keyframes popIn { from { opacity:0; transform: scale(0.94) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
  </div>
);

// ── Confirm Delete Modal ───────────────────────────────────────────────────────
export const ConfirmDeleteModal = ({ name, type, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center"
      style={{ animation: 'popIn 0.2s ease' }}>
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={26} className="text-red-500" />
      </div>
      <h3 className="text-lg font-black text-slate-900">Delete permanently?</h3>
      <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
        You are about to delete <span className="font-bold text-red-600">"{name}"</span>.
        {type === 'employee' && ' All attendance history will also be removed.'}
        {' '}This action cannot be undone.
      </p>
      <div className="flex gap-3 mt-6">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-colors">
          Delete
        </button>
      </div>
    </div>
    <style>{`@keyframes popIn { from { opacity:0; transform: scale(0.94); } to { opacity:1; transform: scale(1); } }`}</style>
  </div>
);

// ── Nozzle Row ─────────────────────────────────────────────────────────────────
export const NozzleRow = ({ title, color, openVal, closeVal, isEditingOpen, toggleEditOpen, onOpenChange, onCloseChange }) => {
  const sale = Math.max(0, Number(closeVal) - Number(openVal));
  return (
    <div className="p-4 space-y-3 bg-white">
      <div className={`text-xs font-black uppercase tracking-widest ${color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`}>
        {title}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opening</p>
            <button onClick={toggleEditOpen}
              className="text-slate-300 hover:text-blue-500 transition-colors p-0.5">
              <Pencil size={9} />
            </button>
          </div>
          <input
            type="number" value={openVal} onChange={(e) => onOpenChange(e.target.value)}
            readOnly={!isEditingOpen}
            className={`w-full p-2.5 border rounded-xl text-xs font-bold outline-none transition-all
              ${isEditingOpen
                ? 'border-blue-400 bg-white ring-2 ring-blue-50 text-slate-800'
                : 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'}`}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Closing</p>
          <input
            type="number" value={closeVal} onChange={(e) => onCloseChange(e.target.value)}
            placeholder="0.00"
            className="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all bg-white text-slate-800"
          />
        </div>
      </div>
      {sale > 0 && (
        <div className="flex justify-end">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
            Net Sale: {sale.toFixed(2)} L
          </span>
        </div>
      )}
    </div>
  );
};

// ── Empty State ────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center px-4">
    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-3">
      {icon}
    </div>
    <p className="font-black text-slate-500 text-sm">{title}</p>
    {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
  </div>
);

// ── Card Wrapper ───────────────────────────────────────────────────────────────
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, icon, action }) => (
  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
      {icon} {title}
    </h3>
    {action}
  </div>
);

// ── Section Title ──────────────────────────────────────────────────────────────
export const SectionTitle = ({ title, icon, subtitle }) => (
  <div className="mb-6">
    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
      {icon} {title}
    </h3>
    {subtitle && <p className="text-xs font-semibold text-slate-500 mt-1">{subtitle}</p>}
  </div>
);
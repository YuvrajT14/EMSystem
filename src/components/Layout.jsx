import React, { useState } from 'react';
import { Gauge, Users, Truck, IndianRupee, ShieldCheck, Droplet, Fuel, CreditCard, Archive, ChevronDown, ChevronRight, LogOut, Building2, Flame, Settings, Menu, X } from 'lucide-react';

export const Layout = ({ currentUser, activeTab, setActiveTab, onLogout, children, recordsOpen, setRecordsOpen, userPumps, activePump, setActivePumpId, onTriggerAddPump }) => {
  const [showPumpDropdown, setShowPumpDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW: Mobile drawer state

  const handleTabSwitch = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false); // Close mobile menu on tab click
  };

  const NavItem = ({ id, label, icon, badge, disabled }) => {
    const isActive = activeTab === id;
    return (
      <button onClick={() => !disabled && handleTabSwitch(id)} className={`w-full flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-sm font-semibold transition-all duration-100 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : disabled ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        <span className={`${isActive ? 'text-white' : disabled ? 'text-slate-600' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>{icon}</span>
        <span className="truncate">{label}</span>
        {badge && <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'}`}>{badge}</span>}
      </button>
    );
  };

  const SubItem = ({ id, label }) => (
    <button onClick={() => handleTabSwitch(id)} className={`w-full text-left pl-10 pr-3 py-2.5 md:py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === id ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>{label}</button>
  );

  return (
    <div className="min-h-screen flex bg-[#f1f5f9] font-sans w-full overflow-x-hidden">
      
      {/* ── MOBILE OVERLAY ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ── RESPONSIVE SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 w-64 md:w-64 flex flex-col z-[100] transform transition-transform duration-300 ease-in-out border-r border-white/5 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`} style={{ background: 'linear-gradient(180deg, #0c1427 0%, #0f1a2e 100%)' }}>
        <div className="px-5 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0"><Fuel size={18} className="text-white" /></div>
              <div><p className="text-white font-black text-base tracking-tight leading-none">FuelDesk</p><p className="text-slate-500 text-[10px] font-semibold mt-0.5">by Ekta Management</p></div>
            </div>
            {/* Close button for mobile */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1 bg-white/10 rounded-lg"><X size={18}/></button>
          </div>

          <div className="relative mt-2">
            <button onClick={() => setShowPumpDropdown(!showPumpDropdown)} className="w-full bg-white/5 border border-white/8 hover:bg-white/10 rounded-2xl p-3.5 flex justify-between items-center transition-all text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Building2 size={14} className="text-blue-400" /></div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate leading-tight" title={activePump?.name}>{activePump?.name || currentUser?.pumpName || "Loading..."}</p>
                  <p className="text-slate-400 text-[11px] font-semibold mt-1 truncate">{currentUser.name} • {activePump?.role || currentUser.role}</p>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            </button>
            {showPumpDropdown && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                {userPumps.map(pump => (
                  <button key={pump.id} onClick={() => { setActivePumpId(pump.id); setShowPumpDropdown(false); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2">
                    <Building2 size={14} className="text-slate-500" /> {pump.name}
                  </button>
                ))}
                {currentUser.role === 'Admin' && (
                  <button onClick={() => { onTriggerAddPump(); setShowPumpDropdown(false); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-blue-400 hover:bg-slate-700 transition-all border-t border-slate-700">+ Add New Pump</button>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="px-3.5 pt-5 pb-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Operations</p>
          <NavItem id="sales" label="Sales & Shift" icon={<Gauge size={16} />} />
          <NavItem id="density" label="Daily Density" icon={<Droplet size={16} />} />
          <NavItem id="indent" label="Indent & Stock" icon={<Fuel size={16} />} />
          <NavItem id="cng" label="CNG Sales" icon={<Flame size={16} />} badge="SOON" disabled={true} />

          <p className="px-3.5 pt-5 pb-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Management</p>
          <NavItem id="attendance" label="Attendance" icon={<Users size={16} />} />
          {(currentUser?.role === 'Admin' || activePump?.role === 'Admin') && <NavItem id="manage_staff" label="Staff Master" icon={<Users size={16} />} />}
          <NavItem id="credit_ledger" label="Credit Ledger" icon={<Truck size={16} />} />
          <NavItem id="expenses" label="Expenses" icon={<IndianRupee size={16} />} />

          <p className="px-3.5 pt-5 pb-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">System</p>
          <NavItem id="subscription" label="Profile & Plan" icon={<CreditCard size={16} />} />
          {(currentUser?.role === 'Admin' || activePump?.role === 'Admin') && <NavItem id="pump_settings" label="Hardware Settings" icon={<Settings size={16} />} />}
          {(currentUser?.role === 'Admin' || activePump?.role === 'Admin') && <NavItem id="app_users" label="App Users" icon={<ShieldCheck size={16} />} />}

          <div className="mt-2">
            <button onClick={() => setRecordsOpen(p => !p)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Archive size={16} className="text-slate-500 shrink-0" /><span>History Logs</span><span className="ml-auto">{recordsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</span>
            </button>
            {recordsOpen && (
              <div className="pl-1 space-y-0.5 pb-1 mt-1">
                <SubItem id="record_sales" label="Sales History" />
                <SubItem id="record_credit" label="Credit Log" />
                <SubItem id="record_attendance" label="Attendance Log" />
                <SubItem id="record_expenses" label="Expense History" />
              </div>
            )}
          </div>
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 md:py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all border border-transparent"><LogOut size={14} /> Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-screen w-full min-w-0">
        {/* MOBILE TOP HEADER (With Menu Button) */}
        <div className="md:hidden sticky top-0 z-40 border-b border-slate-800 px-4 py-3.5 flex items-center justify-between shadow-md" style={{ background: '#0c1427' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Fuel size={16} className="text-white" /></div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm tracking-tight leading-none">FuelDesk</span>
              <span className="text-slate-400 text-[10px] font-semibold truncate max-w-[140px] mt-0.5">{activePump?.name || currentUser?.pumpName}</span>
            </div>
          </div>
          {/* Hamburger Icon */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors">
            <Menu size={22} />
          </button>
        </div>
        
        <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV (Quick Links) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 flex justify-around items-center py-2 z-30 bg-[#0c1427] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {[{ id: 'sales', icon: <Gauge size={20} />, label: 'Sales' }, { id: 'attendance', icon: <Users size={20} />, label: 'Staff' }, { id: 'credit_ledger', icon: <Truck size={20} />, label: 'Credit' }, { id: 'expenses', icon: <IndianRupee size={20} />, label: 'Expense' }].map(btn => (
          <button key={btn.id} onClick={() => setActiveTab(btn.id)} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all" style={{ color: activeTab === btn.id ? '#3b82f6' : '#64748b' }}>{btn.icon}<span className="text-[9px] font-bold uppercase tracking-wide">{btn.label}</span></button>
        ))}
      </div>
    </div>
  );
};
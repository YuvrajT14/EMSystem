import React, { useState } from 'react';
import { Fuel, Lock, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Extra spaces hatao
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();

    // 2. Strict Phone Validation (Exactly 10 numbers)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('Phone number bilkul 10 digits ka hona chahiye!');
      return;
    }

    // 3. Strict Password Validation (Min 6 chars)
    if (cleanPass.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye!');
      return;
    }

    // 4. Dummy Authentication (Jab tak Firebase nahi lagta)
    if (cleanPhone === '9999999999' && cleanPass === 'admin123') {
      onLogin({ name: 'Yuvraj', role: 'Admin', pumpName: 'Ekta Petroleum', pumpId: 'PUMP_001' });
    } else if (cleanPhone === '8888888888' && cleanPass === 'manager123') {
      onLogin({ name: 'Ramesh', role: 'Manager', pumpName: 'Ekta Petroleum', pumpId: 'PUMP_001' });
    } else {
      setError('Galat Phone Number ya Password. Kripya dobara check karein.');
    }
  };

  // Phone input handler (only allows numbers and max 10 digits)
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      {/* BRANDING */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-blue-600 p-4 rounded-2xl inline-block shadow-lg mb-4 shadow-blue-600/30">
          <Fuel size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Pump<span className="text-blue-600">Flow</span> ERP</h1>
        <p className="text-sm font-bold text-slate-500 mt-2 tracking-widest uppercase">Smart Management System</p>
      </div>

      {/* LOGIN BOX */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-500 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-sm text-slate-500 mb-6 font-medium">Please enter your credentials to continue.</p>

        {/* ERROR ALERT */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-xs font-bold mb-6 flex items-center gap-2">
            <AlertCircle size={16}/> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* PHONE INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" // text use kiya hai taaki e, +, - type na ho sake
                value={phone} 
                onChange={handlePhoneInput} 
                required 
                placeholder="Enter 10-digit number" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 focus:bg-white" 
              />
            </div>
            <p className="text-[9px] font-bold text-slate-400 text-right">{phone.length}/10</p>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
                minLength={6}
                placeholder="Enter your password" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 focus:bg-white" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex justify-center items-center gap-2 group mt-4">
            Secure Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">Trusted by Petrol Pumps across India 🇮🇳</p>
    </div>
  );
};
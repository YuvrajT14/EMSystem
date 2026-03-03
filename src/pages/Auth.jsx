import React, { useState } from 'react';
import { Lock, Phone, ArrowRight, User, Building2, AlertCircle, Eye, EyeOff, Fuel, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

const InputField = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, suffix }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative flex items-center">
      <div className="absolute left-4 flex items-center justify-center pointer-events-none"><Icon className="text-slate-400" size={18} /></div>
      <input type={type} value={value} onChange={onChange} required placeholder={placeholder} className="w-full pl-12 pr-14 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all" />
      {suffix && <div className="absolute right-4 flex items-center justify-center">{suffix}</div>}
    </div>
  </div>
);

export const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ phone: '', password: '', confirmPass: '', ownerName: '', pumpName: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));
  const handlePhoneInput = (e) => { const val = e.target.value.replace(/\D/g, ''); if (val.length <= 10) setFormData(p => ({ ...p, phone: val })); };

  const handleAuth = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { phone, password, confirmPass, ownerName, pumpName } = formData;

    if (phone.length !== 10) { setError('Phone number must be exactly 10 digits.'); setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }

    const pseudoEmail = `${phone}@emsystems.com`;

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, pseudoEmail, password);
        const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // CHECK IF USER IS ACTIVE
          if (userData.isActive === false) {
             setError("Your account has been deactivated by Admin.");
             auth.signOut();
          } else {
             onLogin(userData);
          }
        } else {
          setError('User profile not found in database.');
        }
      } else {
        if (!ownerName.trim() || !pumpName.trim()) { setError('All fields are required.'); setLoading(false); return; }
        if (password !== confirmPass) { setError('Passwords do not match.'); setLoading(false); return; }

        const userCred = await createUserWithEmailAndPassword(auth, pseudoEmail, password);
        const uid = userCred.user.uid;
        const tenantId = uid;

        await setDoc(doc(db, "tenants", tenantId), { ownerName: ownerName.trim(), plan: 'Pro Trial', createdAt: Date.now() });
        const newPumpRef = await addDoc(collection(db, "pumps"), {
          tenantId: tenantId, name: pumpName.trim(), createdAt: Date.now(),
          hardware: [{ id: 'du1', name: 'Dispensing Unit 1', nozzles: [{ id: 'ms', type: 'Petrol (MS)', color: 'orange' }, { id: 'hsd', type: 'Diesel (HSD)', color: 'blue' }] }]
        });
        const newUserData = { uid, name: ownerName.trim(), phone, role: 'Admin', tenantId, accessiblePumps: [newPumpRef.id], pumpName: pumpName.trim(), isActive: true };
        await setDoc(doc(db, "users", uid), newUserData);
        onLogin(newUserData);
      }
    } catch (err) {
      if(err.code === 'auth/invalid-credential') setError("Incorrect phone number or password.");
      else if(err.code === 'auth/email-already-in-use') setError("This number is already registered.");
      else setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        <div className="relative z-10 flex items-center gap-3"><div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Fuel size={24} className="text-white" /></div><div><p className="text-white font-black text-2xl tracking-tight">FuelDesk ERP</p><p className="text-blue-400 text-xs font-bold tracking-widest uppercase mt-0.5">by Ekta Management</p></div></div>
        <div className="relative z-10"><h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">The complete <br /><span className="text-blue-500">petrol pump</span> <br />management suite.</h2><div className="grid grid-cols-2 gap-4 max-w-lg">{['Daily Sales & Shifts', 'Indent & Stock', 'Staff Attendance', 'Credit Ledger', 'Density Logs', 'Multi-Pump Ready'].map(f => (<div key={f} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"><CheckCircle2 size={16} className="text-blue-400" /><span className="text-white/80 text-sm font-semibold">{f}</span></div>))}</div></div>
        <p className="relative z-10 text-white/40 text-sm font-medium">© 2026 Ekta Management Systems</p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto"><div className="w-full max-w-md"><div className="lg:hidden flex items-center gap-3 mb-10"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md"><Fuel size={20} className="text-white" /></div><span className="text-2xl font-black text-slate-900 tracking-tight">FuelDesk ERP</span></div><div className="mb-8"><h2 className="text-3xl font-black text-slate-900 tracking-tight">{isLogin ? 'Welcome back' : 'Get started'}</h2></div>
          {error && <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold mb-6"><AlertCircle size={18} className="shrink-0 text-red-500" />{error}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (<><InputField label="Pump Name" icon={Building2} placeholder="e.g. Shree Ram Petroleum" onChange={set('pumpName')} /><InputField label="Owner Name" icon={User} placeholder="Your full name" onChange={set('ownerName')} /></>)}
            <InputField label="Phone Number" icon={Phone} placeholder="Enter 10-digit number" value={formData.phone} onChange={handlePhoneInput} suffix={<span className={`text-xs font-black ${formData.phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>{formData.phone.length}/10</span>} />
            <InputField label="Password" icon={Lock} type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters" value={formData.password} onChange={set('password')} suffix={<button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-700">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
            {!isLogin && <InputField label="Confirm Password" icon={Lock} type="password" placeholder="Re-enter password" onChange={set('confirmPass')} />}
            <div className="pt-4"><button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed">{loading ? 'Processing...' : (isLogin ? 'Secure Login' : 'Create Account')} {!loading && <ArrowRight size={18} />}</button></div>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">{isLogin ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-600 font-bold ml-2 hover:underline">{isLogin ? 'Register your pump' : 'Sign in'}</button></p>
      </div></div>
    </div>
  );
};
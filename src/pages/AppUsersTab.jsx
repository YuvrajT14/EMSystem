import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/Shared';
import { secondaryAuth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export const AppUsersTab = ({ appUsers, userPumps, currentUser, showAlert }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Manager');
  const [assignedPump, setAssignedPump] = useState(userPumps[0]?.id || '');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) return showAlert("Must be a 10-digit valid phone number.", "error");
    if (password.length < 6) return showAlert("Password must be at least 6 characters.", "error");
    if (!assignedPump && role === 'Manager') return showAlert("Please assign a pump to the manager.", "error");
    
    setLoading(true);
    const pseudoEmail = `${phone}@emsystems.com`;

    try {
      // 1. Create User using Secondary Auth (won't log out Admin)
      const userCred = await createUserWithEmailAndPassword(secondaryAuth, pseudoEmail, password);
      
      // 2. Save User to Main Database under this Tenant
      await setDoc(doc(db, "users", userCred.user.uid), {
        name, phone, role, tenantId: currentUser.tenantId, 
        accessiblePumps: role === 'Admin' ? userPumps.map(p=>p.id) : [assignedPump],
        createdAt: Date.now()
      });

      setName(''); setPhone(''); setPassword('');
      showAlert("User successfully created and granted access!", "success");
    } catch (err) {
      if(err.code === 'auth/email-already-in-use') showAlert("Phone number already registered!", "error");
      else showAlert(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try { await deleteDoc(doc(db, "users", id)); showAlert("User Access Revoked!", "success"); } 
    catch (e) { showAlert(e.message, "error"); }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Card className="p-6">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><ShieldCheck className="text-blue-600"/> Create Secure User Access</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
          <input type="number" placeholder="Phone (Login ID)" value={phone} onChange={e=>setPhone(e.target.value)} required className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
          <input type="text" placeholder="Set Password" value={password} onChange={e=>setPassword(e.target.value)} required className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
          
          <select value={role} onChange={e=>setRole(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 bg-slate-50">
            <option value="Manager">Manager (Restricted Access)</option>
            <option value="Admin">Admin (Full Access)</option>
          </select>
          
          {role === 'Manager' && (
            <select value={assignedPump} onChange={e=>setAssignedPump(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 bg-slate-50">
              {userPumps.map(p => <option key={p.id} value={p.id}>Assign: {p.name}</option>)}
            </select>
          )}

          <button disabled={loading} className={`md:col-span-${role === 'Manager' ? '1' : '2'} bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-all`}>
            {loading ? 'Creating...' : 'Grant Access'}
          </button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-black text-slate-800 uppercase tracking-wide mb-4 text-sm">Authorized Users Network</h3>
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Login Phone</th><th className="px-5 py-4">Role</th><th className="px-5 py-4 text-right">Revoke</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {appUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">{u.name}</td>
                  <td className="px-5 py-4 font-black">{u.phone}</td>
                  <td className="px-5 py-4"><span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase ${u.role==='Admin'?'bg-blue-100 text-blue-700':'bg-purple-100 text-purple-700'}`}>{u.role}</span></td>
                  <td className="px-5 py-4 text-right">
                    {u.id !== currentUser.uid && (
                      <button onClick={()=>removeUser(u.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16}/></button>
                    )}
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
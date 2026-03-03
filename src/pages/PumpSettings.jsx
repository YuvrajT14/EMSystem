import React, { useState } from 'react';
import { Card } from '../components/Shared';
import { Settings, Plus, Trash2, Fuel, Edit2, Check, X } from 'lucide-react';

export const PumpSettings = ({ hardware, setHardware, showAlert }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

  // ─── 1. ADD NEW DU ───
  const addDU = () => {
    const nextNum = hardware.length + 1;
    const newDU = {
      id: `du_${Date.now()}`,
      name: `Dispensing Unit ${nextNum}`,
      nozzles: [
        { id: 'n1', type: 'Petrol (MS)', color: 'orange' }, // Default 2 nozzles
        { id: 'n2', type: 'Diesel (HSD)', color: 'blue' }
      ]
    };
    setHardware([...hardware, newDU]);
    showAlert("New Machine Added", "success");
  };

  // ─── 2. REMOVE DU & AUTO SEQUENCE ───
  const removeDU = (indexToRemove) => {
    if (hardware.length <= 1) return showAlert("At least one unit is required.", "error");
    
    // Filter out the deleted DU
    const filtered = hardware.filter((_, index) => index !== indexToRemove);

    // Auto-rename remaining DUs if they have default names
    const resequenced = filtered.map((du, i) => {
      // Check if name matches "Dispensing Unit X" pattern
      if (du.name.match(/^Dispensing Unit \d+$/)) {
        return { ...du, name: `Dispensing Unit ${i + 1}` };
      }
      return du;
    });

    setHardware(resequenced);
    showAlert("Unit Removed & Sequence Updated", "success");
  };

  // ─── 3. RENAME DU ───
  const startEditing = (du) => { setEditingId(du.id); setTempName(du.name); };
  const saveName = (index) => {
    const updated = [...hardware];
    updated[index].name = tempName;
    setHardware(updated);
    setEditingId(null);
  };

  // ─── 4. MANAGE NOZZLES ───
  const addNozzle = (duIndex) => {
    const updated = [...hardware];
    const nozzleCount = updated[duIndex].nozzles.length + 1;
    updated[duIndex].nozzles.push({
      id: `n${Date.now()}`,
      type: 'Diesel (HSD)', // Default type
      color: 'blue'
    });
    setHardware(updated);
  };

  const removeNozzle = (duIndex, nozzleIndex) => {
    const updated = [...hardware];
    if (updated[duIndex].nozzles.length <= 1) return showAlert("A machine must have at least 1 nozzle.", "error");
    updated[duIndex].nozzles.splice(nozzleIndex, 1);
    setHardware(updated);
  };

  const updateNozzleType = (duIndex, nozzleIndex, type) => {
    const updated = [...hardware];
    const isPetrol = type === 'Petrol (MS)';
    updated[duIndex].nozzles[nozzleIndex] = {
      ...updated[duIndex].nozzles[nozzleIndex],
      type: type,
      color: isPetrol ? 'orange' : 'blue'
    };
    setHardware(updated);
  };

  return (
    <div className="max-w-5xl space-y-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-slate-500" size={24} />
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Hardware Configuration</h3>
        </div>
        <button onClick={addDU} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18}/> Add New DU
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hardware.map((du, index) => (
          <Card key={du.id} className="p-5 relative overflow-visible border-2 border-slate-100 hover:border-blue-100 transition-colors">
            
            {/* Header: Name & Delete */}
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
              <div className="flex-1">
                {editingId === du.id ? (
                  <div className="flex items-center gap-2">
                    <input autoFocus value={tempName} onChange={e=>setTempName(e.target.value)} className="font-black text-lg text-slate-900 border-b-2 border-blue-500 outline-none w-full bg-transparent" />
                    <button onClick={() => saveName(index)} className="p-1 bg-green-100 text-green-700 rounded"><Check size={14}/></button>
                    <button onClick={() => setEditingId(null)} className="p-1 bg-red-100 text-red-700 rounded"><X size={14}/></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h4 className="font-black text-lg text-slate-900">{du.name}</h4>
                    <button onClick={() => startEditing(du)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-opacity"><Edit2 size={14}/></button>
                  </div>
                )}
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Machine ID: {index + 1}</p>
              </div>
              <button onClick={() => removeDU(index)} className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                <Trash2 size={18}/>
              </button>
            </div>
            
            {/* Nozzles List */}
            <div className="space-y-3">
              {du.nozzles.map((nz, nIndex) => (
                <div key={nIndex} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${nz.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Fuel size={16}/>
                  </div>
                  
                  <select 
                    value={nz.type} 
                    onChange={(e) => updateNozzleType(index, nIndex, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="Petrol (MS)">Petrol (MS)</option>
                    <option value="Diesel (HSD)">Diesel (HSD)</option>
                  </select>

                  <button onClick={() => removeNozzle(index, nIndex)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>
                </div>
              ))}
            </div>

            {/* Add Nozzle Button */}
            <button onClick={() => addNozzle(index)} className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2">
              <Plus size={14}/> Add Nozzle
            </button>

          </Card>
        ))}
      </div>
    </div>
  );
};
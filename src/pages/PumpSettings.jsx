import React from 'react';
import { Card } from '../components/Shared';
import { Settings, Plus, Trash2, Fuel } from 'lucide-react';

export const PumpSettings = ({ hardware, setHardware, showAlert }) => {
  
  const addDU = () => {
    const newId = `du${hardware.length + 1}`;
    setHardware([...hardware, {
      id: newId,
      name: `Dispensing Unit ${hardware.length + 1}`,
      nozzles: [
        { id: 'ms', type: 'Petrol (MS)', color: 'orange' },
        { id: 'hsd', type: 'Diesel (HSD)', color: 'blue' }
      ]
    }]);
    showAlert("New Dispensing Unit Added!", "success");
  };

  const removeDU = (id) => {
    if (hardware.length <= 1) return showAlert("You must have at least one DU.", "error");
    setHardware(hardware.filter(du => du.id !== id));
    showAlert("Dispensing Unit Removed", "success");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-2">
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
          <Card key={du.id} className="p-5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-lg text-slate-900">{du.name}</h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Machine ID: {du.id.toUpperCase()}</p>
              </div>
              <button onClick={() => removeDU(du.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16}/>
              </button>
            </div>
            
            <div className="space-y-2">
              {du.nozzles.map((nz, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${nz.color === 'orange' ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                  <Fuel size={16}/>
                  <span className="text-sm font-black tracking-wide">Nozzle {i + 1} — {nz.type}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
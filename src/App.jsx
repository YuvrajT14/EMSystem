import React, { useState, useCallback, useEffect } from 'react';
import { Auth } from './pages/Auth';
import { Layout } from './components/Layout';
import { SalesTab } from './pages/SalesTab';
import { DensityTab } from './pages/DensityTab';
import { IndentTab } from './pages/IndentTab';
import { StaffMaster, DailyAttendance } from './pages/StaffTab';
import { UdhaarTab } from './pages/UdhaarTab';
import { ExpensesTab } from './pages/ExpensesTab';
import { Subscription } from './pages/Subscription';
import { AppUsersTab } from './pages/AppUsersTab';
import { PumpSettings } from './pages/PumpSettings';
import { SalesHistory, AttendanceHistory, ExpenseHistory, CreditHistory } from './pages/HistoryViews';
import { AlertToast, ConfirmDeleteModal, Modal } from './components/Shared';

// FIREBASE IMPORTS
import { db, auth } from './firebase'; // Make sure auth is exported from firebase.js
import { onAuthStateChanged } from 'firebase/auth'; // NEW: For session persistence
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, setDoc, query, where, getDoc } from 'firebase/firestore';

const MainApp = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('sales');
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);

  // INITIALIZE PUMP STATE
  const fallbackPumpId = currentUser?.accessiblePumps?.[0] || 'p1';
  const [userPumps, setUserPumps] = useState([{ id: fallbackPumpId, name: currentUser?.pumpName || 'Connecting...', role: currentUser?.role || 'Admin' }]);
  const [activePumpId, setActivePumpId] = useState(fallbackPumpId);
  
  const activePump = userPumps.find(p => p.id === activePumpId) || userPumps[0];
  const [hardware, setHardware] = useState(activePump?.hardware || [
    { id: 'du1', name: 'Dispensing Unit 1', nozzles: [{ id: 'ms', type: 'Petrol (MS)', color: 'orange' }, { id: 'hsd', type: 'Diesel (HSD)', color: 'blue' }] }
  ]);

  const [alert, setAlert] = useState(null);
  const showAlert = useCallback((msg, type = 'success') => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3000); }, []);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showAddPumpModal, setShowAddPumpModal] = useState(false);

  // CLOUD DATA STATES
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [indents, setIndents] = useState([]);
  const [densityRecords, setDensityRecords] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [appUsers, setAppUsers] = useState([]);

  // 1. FETCH AUTHORIZED PUMPS
  useEffect(() => {
    if (!currentUser?.tenantId) return;
    const unsub = onSnapshot(collection(db, "pumps"), (snap) => {
      let pumps = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.tenantId === currentUser.tenantId);
      if (currentUser.role !== 'Admin') {
        pumps = pumps.filter(p => currentUser.accessiblePumps?.includes(p.id));
      }
      if (pumps.length > 0) {
        setUserPumps(pumps);
        if (!pumps.find(p => p.id === activePumpId)) setActivePumpId(pumps[0].id);
        const currentActive = pumps.find(p => p.id === (activePumpId || pumps[0].id));
        if (currentActive?.hardware) setHardware(currentActive.hardware);
      }
    });
    return () => unsub();
  }, [currentUser, activePumpId]);

  // 2. FETCH DATA GLOBALLY
  useEffect(() => {
    if (!activePumpId || !currentUser?.tenantId) return;
    const fetchCol = (colName, setter) => {
      return onSnapshot(query(collection(db, colName), where('orgId', '==', activePumpId)), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => b.createdAt - a.createdAt);
        setter(data);
      });
    };

    const unsubs = [
      fetchCol('sales', setSalesRecords),
      fetchCol('density', setDensityRecords),
      fetchCol('indents', setIndents),
      fetchCol('staff', setEmployees),
      fetchCol('customers', setCustomers),
      fetchCol('expenses', setExpenses),
      fetchCol('attendance', setAttendanceRecords),
      onSnapshot(query(collection(db, 'users'), where('tenantId', '==', currentUser.tenantId)), snap => {
        setAppUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      })
    ];
    return () => unsubs.forEach(unsub => unsub());
  }, [activePumpId, currentUser]);

  // DB WRITE FUNCTIONS
  const getBaseDoc = () => ({ tenantId: currentUser.tenantId, orgId: activePumpId, createdAt: Date.now() });

  const addDbRecord = async (colName, data) => await addDoc(collection(db, colName), { ...data, ...getBaseDoc() });
  const updateDbRecord = async (colName, id, data) => await updateDoc(doc(db, colName, id), data);
  
  const setUniqueDailyRecord = async (colName, data) => {
    const docId = `${activePumpId}_${activeDate}`;
    await setDoc(doc(db, colName, docId), { ...data, date: activeDate, ...getBaseDoc() });
  };

  const deleteDbRecord = async () => {
    if (!deleteModal) return;
    try {
      await deleteDoc(doc(db, deleteModal.type, deleteModal.id));
      showAlert('Deleted successfully!', 'success');
    } catch (e) { showAlert(e.message, 'error'); }
    setDeleteModal(null);
  };
  const confirmDelete = (type, id, name) => setDeleteModal({ type, id, name });

  // ADD NEW PUMP
  const handleAddNewPump = async (e) => {
    e.preventDefault();
    const pumpName = e.target.pumpName.value.trim();
    if(!pumpName) return;
    const newPumpRef = await addDoc(collection(db, "pumps"), {
      tenantId: currentUser.tenantId, name: pumpName, createdAt: Date.now(),
      hardware: [{ id: 'du1', name: 'Dispensing Unit 1', nozzles: [{ id: 'ms', type: 'Petrol (MS)', color: 'orange' }] }]
    });
    const updatedPumps = [...(currentUser.accessiblePumps || []), newPumpRef.id];
    await updateDoc(doc(db, "users", currentUser.uid), { accessiblePumps: updatedPumps });
    currentUser.accessiblePumps = updatedPumps; 
    setShowAddPumpModal(false);
    showAlert("New Pump Added!", "success");
    setActivePumpId(newPumpRef.id);
  };

  // UI STATES
  const [fuelPrices, setFuelPrices] = useState({ petrol: 96.72, diesel: 89.62, isEditing: false });
  const [openings, setOpenings] = useState({});
  const [closings, setClosings] = useState({});
  const [dailyAttendance, setDailyAttendance] = useState({});

  const syncDailySales = async (record) => {
    await setUniqueDailyRecord('sales', record);
    const newOpenings = { ...openings };
    hardware.forEach(du => du.nozzles.forEach(n => { newOpenings[`${du.id}_${n.id}`] = closings[`${du.id}_${n.id}`] }));
    setOpenings(newOpenings); setClosings({});
    const tmrw = new Date(activeDate); tmrw.setDate(tmrw.getDate() + 1);
    setActiveDate(tmrw.toISOString().split('T')[0]);
    showAlert('Sales logged. Date advanced.', 'success');
  };

  const updateHardware = async (newHardware) => {
    setHardware(newHardware);
    await updateDoc(doc(db, "pumps", activePumpId), { hardware: newHardware });
    showAlert('Hardware Configuration Updated!', 'success');
  };

  const tabTitles = { sales: 'Sales & Shift', density: 'Daily Density Log', indent: 'Indent & Stock', attendance: 'Daily Attendance', manage_staff: 'Employee Master', credit_ledger: 'Credit Ledger', expenses: 'Expenses', subscription: 'Pump Profile & Plan', pump_settings: 'Hardware Configuration', app_users: 'App Users Access', record_sales: 'Sales History' };

  if (!currentUser?.tenantId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f5f9] p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🔄</span></div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">System Updated</h2>
          <p className="text-sm text-slate-500 font-semibold mb-8">Session expired or pump not found. Please log in again.</p>
          <button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/30 transition-all">Log Out</button>
        </div>
      </div>
    );
  }

  return (
    <Layout currentUser={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} recordsOpen={recordsOpen} setRecordsOpen={setRecordsOpen} userPumps={userPumps} activePump={activePump} setActivePumpId={setActivePumpId} onTriggerAddPump={() => setShowAddPumpModal(true)}>
      
      {alert && <AlertToast msg={alert.msg} type={alert.type} />}
      {deleteModal && <ConfirmDeleteModal name={deleteModal.name} type={deleteModal.type} onConfirm={deleteDbRecord} onCancel={() => setDeleteModal(null)} />}
      
      {showAddPumpModal && (
        <Modal title="Add New Pump" onClose={() => setShowAddPumpModal(false)}>
          <form onSubmit={handleAddNewPump} className="space-y-4">
            <input type="text" name="pumpName" required placeholder="New Pump Name" className="w-full p-3.5 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
            <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/30">Initialize Pump</button>
          </form>
        </Modal>
      )}

      <div className="mb-6 px-1">
        <h2 className="text-2xl font-black text-slate-800 capitalize italic tracking-tight">{tabTitles[activeTab] || activeTab.replace(/_/g, ' ')}</h2>
        <p className="text-xs font-bold text-slate-400 mt-1">Active Date: <span className="text-blue-600">{activeDate}</span></p>
      </div>

      <div className="w-full max-w-7xl">
        {activeTab === 'sales' && <SalesTab fuelPrices={fuelPrices} setFuelPrices={setFuelPrices} hardware={hardware} openings={openings} setOpenings={setOpenings} closings={closings} setClosings={setClosings} salesRecords={salesRecords} onSaveSales={syncDailySales} activeDate={activeDate} currentUser={currentUser} showAlert={showAlert} />}
        {activeTab === 'density' && <DensityTab densityRecords={densityRecords} onAddDensity={(data) => setUniqueDailyRecord('density', data)} activeDate={activeDate} showAlert={showAlert} />}
        {activeTab === 'indent' && <IndentTab indents={indents} onPlaceIndent={(data) => addDbRecord('indents', data)} onReceiveIndent={(id, data) => updateDbRecord('indents', id, data)} activeDate={activeDate} showAlert={showAlert} />}
        {activeTab === 'attendance' && <DailyAttendance employees={employees} dailyAttendance={dailyAttendance} setDailyAttendance={setDailyAttendance} onLockAttendance={(data) => setUniqueDailyRecord('attendance', data)} activeDate={activeDate} showAlert={showAlert} />}
        {activeTab === 'manage_staff' && <StaffMaster employees={employees} onAddEmployee={(data) => addDbRecord('staff', data)} confirmDelete={(id, name) => confirmDelete('staff', id, name)} showAlert={showAlert} />}
        {/* FIXED: UdhaarTab now correctly receives onAddCustomer */}
        {activeTab === 'credit_ledger' && <UdhaarTab customers={customers} onAddCustomer={(data) => addDbRecord('customers', data)} onUpdateCustomer={(id, data) => updateDbRecord('customers', id, data)} activeDate={activeDate} showAlert={showAlert} confirmDelete={(id, name) => confirmDelete('customers', id, name)} />}
        {activeTab === 'expenses' && <ExpensesTab expenses={expenses} onAddExpense={(data) => addDbRecord('expenses', data)} activeDate={activeDate} confirmDelete={(id, name) => confirmDelete('expenses', id, name)} showAlert={showAlert} />}
        {activeTab === 'subscription' && <Subscription currentUser={currentUser} />}
        {activeTab === 'pump_settings' && <PumpSettings hardware={hardware} setHardware={updateHardware} showAlert={showAlert} />}
        {activeTab === 'app_users' && <AppUsersTab appUsers={appUsers} userPumps={userPumps} currentUser={currentUser} showAlert={showAlert} />}
        
        {activeTab === 'record_sales' && <SalesHistory salesRecords={salesRecords} />}
        {activeTab === 'record_credit' && <CreditHistory customers={customers} />}
        {activeTab === 'record_attendance' && <AttendanceHistory attendanceRecords={attendanceRecords} />}
        {activeTab === 'record_expenses' && <ExpenseHistory expenses={expenses} />}
      </div>
    </Layout>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW: Loading state for auth persistence

  // NEW: PERSISTENCE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User found, fetch data from DB
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold tracking-widest uppercase">Restoring Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Auth onLogin={setCurrentUser} />;
  return <MainApp currentUser={currentUser} onLogout={() => { auth.signOut(); setCurrentUser(null); }} />;
}
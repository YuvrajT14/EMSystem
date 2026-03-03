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
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, setDoc, query, where, getDoc } from 'firebase/firestore';

const MainApp = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('sales');
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);

  const fallbackPumpId = currentUser?.accessiblePumps?.[0] || 'p1';
  const [userPumps, setUserPumps] = useState([{ id: fallbackPumpId, name: currentUser?.pumpName || 'Loading...', role: currentUser?.role || 'Admin' }]);
  const [activePumpId, setActivePumpId] = useState(fallbackPumpId);
  const activePump = userPumps.find(p => p.id === activePumpId) || userPumps[0];
  const [hardware, setHardware] = useState(activePump?.hardware || []);

  const [alert, setAlert] = useState(null);
  const showAlert = useCallback((msg, type = 'success') => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3000); }, []);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showAddPumpModal, setShowAddPumpModal] = useState(false);

  // DATA STATES
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [indents, setIndents] = useState([]);
  const [densityRecords, setDensityRecords] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [appUsers, setAppUsers] = useState([]);

  // FETCH DATA
  useEffect(() => {
    if (!currentUser?.tenantId) return;
    const unsubPumps = onSnapshot(collection(db, "pumps"), (snap) => {
      let pumps = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.tenantId === currentUser.tenantId);
      if (currentUser.role !== 'Admin') pumps = pumps.filter(p => currentUser.accessiblePumps?.includes(p.id));
      if (pumps.length > 0) {
        setUserPumps(pumps);
        if (!pumps.find(p => p.id === activePumpId)) setActivePumpId(pumps[0].id);
        const currentActive = pumps.find(p => p.id === (activePumpId || pumps[0].id));
        if (currentActive?.hardware) setHardware(currentActive.hardware);
      }
    });

    if (!activePumpId) return;
    const fetchCol = (colName, setter) => {
      return onSnapshot(query(collection(db, colName), where('orgId', '==', activePumpId)), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => b.createdAt - a.createdAt);
        setter(data);
      });
    };

    const unsubs = [
      unsubPumps,
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
    return () => unsubs.forEach(u => u && u());
  }, [activePumpId, currentUser]);

  // DB OPERATIONS
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
      showAlert('Deleted Successfully.', 'success'); // CLEAN MESSAGE
    } catch (e) { showAlert(e.message, 'error'); }
    setDeleteModal(null);
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try { await updateDoc(doc(db, "users", id), { isActive: !currentStatus }); showAlert(`User Status Updated!`, 'success'); } 
    catch (e) { showAlert(e.message, 'error'); }
  };

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
    setShowAddPumpModal(false); showAlert("Pump Added!", "success"); setActivePumpId(newPumpRef.id);
  };

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
    showAlert('Shift Saved.', 'success');
  };

  const updateHardware = async (newHardware) => {
    setHardware(newHardware);
    await updateDoc(doc(db, "pumps", activePumpId), { hardware: newHardware });
    showAlert('Config Updated.', 'success');
  };

  return (
    <Layout currentUser={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} recordsOpen={recordsOpen} setRecordsOpen={setRecordsOpen} userPumps={userPumps} activePump={activePump} setActivePumpId={setActivePumpId} onTriggerAddPump={() => setShowAddPumpModal(true)}>
      {alert && <AlertToast msg={alert.msg} type={alert.type} />}
      {deleteModal && <ConfirmDeleteModal name={deleteModal.name} type={deleteModal.type} onConfirm={deleteDbRecord} onCancel={() => setDeleteModal(null)} />}
      
      {showAddPumpModal && (
        <Modal title="Add New Pump" onClose={() => setShowAddPumpModal(false)}>
          <form onSubmit={handleAddNewPump} className="space-y-4">
            <input type="text" name="pumpName" required placeholder="New Pump Name" className="w-full p-3.5 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
            <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-blue-700">Initialize Pump</button>
          </form>
        </Modal>
      )}

      <div className="w-full max-w-7xl mx-auto">
        {activeTab === 'sales' && <SalesTab fuelPrices={fuelPrices} setFuelPrices={setFuelPrices} hardware={hardware} openings={openings} setOpenings={setOpenings} closings={closings} setClosings={setClosings} salesRecords={salesRecords} onSaveSales={syncDailySales} activeDate={activeDate} currentUser={currentUser} showAlert={showAlert} />}
        {activeTab === 'density' && <DensityTab densityRecords={densityRecords} onAddDensity={(data) => setUniqueDailyRecord('density', data)} activeDate={activeDate} showAlert={showAlert} />}
        {activeTab === 'indent' && <IndentTab indents={indents} onPlaceIndent={(data) => addDbRecord('indents', data)} onReceiveIndent={(id, data) => updateDbRecord('indents', id, data)} activeDate={activeDate} showAlert={showAlert} />}
        {activeTab === 'attendance' && <DailyAttendance employees={employees} dailyAttendance={dailyAttendance} setDailyAttendance={setDailyAttendance} onLockAttendance={(data) => setUniqueDailyRecord('attendance', data)} activeDate={activeDate} showAlert={showAlert} />}
        {/* FIXED: Passing confirmDelete properly */}
        {activeTab === 'manage_staff' && <StaffMaster employees={employees} onAddEmployee={(data) => addDbRecord('staff', data)} confirmDelete={(id, name) => setDeleteModal({ type: 'staff', id, name })} showAlert={showAlert} />}
        {activeTab === 'credit_ledger' && <UdhaarTab customers={customers} onAddCustomer={(data) => addDbRecord('customers', data)} onUpdateCustomer={(id, data) => updateDbRecord('customers', id, data)} activeDate={activeDate} showAlert={showAlert} confirmDelete={(id, name) => setDeleteModal({ type: 'customers', id, name })} />}
        {activeTab === 'expenses' && <ExpensesTab expenses={expenses} onAddExpense={(data) => addDbRecord('expenses', data)} activeDate={activeDate} confirmDelete={(id, name) => setDeleteModal({ type: 'expenses', id, name })} showAlert={showAlert} />}
        {activeTab === 'subscription' && <Subscription currentUser={currentUser} />}
        {activeTab === 'pump_settings' && <PumpSettings hardware={hardware} setHardware={updateHardware} showAlert={showAlert} />}
        {activeTab === 'app_users' && <AppUsersTab appUsers={appUsers} userPumps={userPumps} currentUser={currentUser} showAlert={showAlert} onToggleStatus={toggleUserStatus} />}
        
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Resuming Session...</div>;
  if (!currentUser) return <Auth onLogin={setCurrentUser} />;
  return <MainApp currentUser={currentUser} onLogout={() => { auth.signOut(); setCurrentUser(null); }} />;
}
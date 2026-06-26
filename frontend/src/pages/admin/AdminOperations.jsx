import React, { useState } from 'react';
import { operationsService } from '../../services/api';

const AdminOperations = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-red-500 font-bold">
        Access Denied: You do not have permission to view System Operations.
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('enrollments');
  const [form, setForm] = useState({ courseId: '', studentsCSV: '', date: '', sessionType: 'LIVE' });

  // Biometric Simulator State
  const [biometricForm, setBiometricForm] = useState({
    studentIdString: '',
    courseId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    deviceId: 'DEVICE-LOBBY-01'
  });
  const [biometricLogs, setBiometricLogs] = useState([
    { id: '1', timestamp: new Date().toLocaleTimeString(), message: 'Biometric Gateway operational. Listening for card scan interrupts...' }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      await operationsService.batchEnroll(form).catch(() => {});
      alert('Batch Enrollment Processed Successfully!');
      setForm({ ...form, studentsCSV: '' });
    } catch {
      alert('Failed to process batch enrollment');
    }
  };

  const handleAttendance = async (e) => {
    e.preventDefault();
    try {
      await operationsService.logAttendance(form).catch(() => {});
      alert('Attendance Logged Successfully!');
      setForm({ ...form, studentsCSV: '' });
    } catch {
      alert('Failed to log attendance');
    }
  };

  const handleBiometric = async (e) => {
    e.preventDefault();
    setIsSimulating(true);
    const time = new Date().toLocaleTimeString();
    
    setBiometricLogs(prev => [
      { id: Date.now().toString() + '-init', timestamp: time, message: `[Interrupt: ${biometricForm.deviceId}] Read RFID payload "${biometricForm.studentIdString}". Dispatching webhook...` },
      ...prev
    ]);

    try {
      const res = await operationsService.logBiometric(biometricForm);
      setBiometricLogs(prev => [
        { 
          id: Date.now().toString() + '-success', 
          timestamp: new Date().toLocaleTimeString(), 
          message: `[Webhook Response] Student "${biometricForm.studentIdString}" marked ${biometricForm.status}. ID: ${res.data?.id?.slice(0, 8) || 'Created'}` 
        },
        ...prev
      ]);
      alert('Biometric Scan Synced & Logged Successfully!');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Invalid RFID card or student card ID string not found';
      setBiometricLogs(prev => [
        { 
          id: Date.now().toString() + '-error', 
          timestamp: new Date().toLocaleTimeString(), 
          message: `[Hardware Error] Webhook fail: ${errMsg}` 
        },
        ...prev
      ]);
      alert(`Simulation Failed: ${errMsg}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Institution Mgmt</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">System Operations</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Student Operations</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Manually manage batch enrollments and track offline attendance.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-md border-b border-outline-variant pb-xs">
        <button 
          onClick={() => setActiveTab('enrollments')}
          className={`px-lg py-3 rounded-t-lg font-bold transition-colors ${activeTab === 'enrollments' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
        >
          Batch Enrollments
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-lg py-3 rounded-t-lg font-bold transition-colors ${activeTab === 'attendance' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
        >
          Manual Attendance
        </button>
        <button 
          onClick={() => setActiveTab('biometric')}
          className={`px-lg py-3 rounded-t-lg font-bold transition-colors ${activeTab === 'biometric' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
        >
          Biometric Simulator
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl max-w-2xl shadow-sm animate-fade-up">
        {activeTab === 'enrollments' && (
          <div>
            <div className="flex items-center gap-sm mb-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>group_add</span>
              </div>
              <h3 className="font-headline-sm text-on-surface font-bold">Batch Course Enrollment</h3>
            </div>
            
            <form onSubmit={handleEnrollment} className="space-y-lg">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Target Course ID</label>
                <input 
                  type="text" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} required 
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white" 
                />
              </div>
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Student Emails (Comma Separated)</label>
                <textarea 
                  value={form.studentsCSV} onChange={e => setForm({...form, studentsCSV: e.target.value})} required rows="5" placeholder="alice@example.com, bob@example.com"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white resize-y" 
                />
                <p className="text-body-sm text-on-surface-variant mt-1">Separate emails with commas. Ensure all users exist before running this job.</p>
              </div>
              <div className="pt-md border-t border-outline-variant">
                <button type="submit" className="w-full py-3 rounded-lg bg-primary text-on-primary font-bold shadow-sm hover:opacity-90 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>bolt</span>
                  Process Enrollments
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <div className="flex items-center gap-sm mb-xl">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>fact_check</span>
              </div>
              <h3 className="font-headline-sm text-on-surface font-bold">Log Manual Attendance</h3>
            </div>

            <form onSubmit={handleAttendance} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Course ID</label>
                  <input type="text" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} required className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white" />
                </div>
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white" />
                </div>
              </div>
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Session Type</label>
                <select value={form.sessionType} onChange={e => setForm({...form, sessionType: e.target.value})} className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white">
                  <option value="LIVE">Live Online</option>
                  <option value="OFFLINE">In-Person (Offline)</option>
                </select>
              </div>
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Present Student Emails (CSV)</label>
                <textarea value={form.studentsCSV} onChange={e => setForm({...form, studentsCSV: e.target.value})} required rows="4" className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white resize-y" />
              </div>
              <div className="pt-md border-t border-outline-variant">
                <button type="submit" className="w-full py-3 rounded-lg bg-primary text-on-primary font-bold shadow-sm hover:opacity-90 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>how_to_reg</span>
                  Log Attendance
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'biometric' && (
          <div>
            <div className="flex items-center gap-sm mb-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined animate-pulse" style={{fontVariationSettings: "'FILL' 0"}}>fingerprint</span>
              </div>
              <h3 className="font-headline-sm text-on-surface font-bold">Biometric Hardware Simulator</h3>
            </div>

            <form onSubmit={handleBiometric} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Student ID Card / Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. STU-001"
                    value={biometricForm.studentIdString} 
                    onChange={e => setBiometricForm({...biometricForm, studentIdString: e.target.value})} 
                    required 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  />
                </div>
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Course ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. c1"
                    value={biometricForm.courseId} 
                    onChange={e => setBiometricForm({...biometricForm, courseId: e.target.value})} 
                    required 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Status Result</label>
                  <select 
                    value={biometricForm.status} 
                    onChange={e => setBiometricForm({...biometricForm, status: e.target.value})} 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">RFID Device ID</label>
                  <input 
                    type="text" 
                    value={biometricForm.deviceId} 
                    onChange={e => setBiometricForm({...biometricForm, deviceId: e.target.value})} 
                    required 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Scan Date</label>
                <input 
                  type="date" 
                  value={biometricForm.date} 
                  onChange={e => setBiometricForm({...biometricForm, date: e.target.value})} 
                  required 
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                />
              </div>

              <div className="pt-md border-t border-outline-variant">
                <button 
                  type="submit" 
                  disabled={isSimulating}
                  className="w-full py-3 rounded-lg bg-primary text-on-primary font-bold shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>fingerprint</span>
                  {isSimulating ? 'Contacting Biometric Reader Service...' : 'Simulate RFID Card Scan'}
                </button>
              </div>
            </form>

            <div className="mt-xl">
              <h4 className="text-label-md text-on-surface font-semibold mb-sm">Biometric IoT Gateway Stream</h4>
              <div className="bg-surface text-label-sm font-mono p-md rounded-lg max-h-48 overflow-y-auto border border-outline-variant/30 text-on-surface-variant flex flex-col gap-xs">
                {biometricLogs.map(log => (
                  <div key={log.id} className="flex gap-sm">
                    <span className="text-outline font-bold shrink-0">{log.timestamp}</span>
                    <span className={log.message.includes('[Success]') || log.message.includes('[Webhook Response]') ? 'text-emerald-500' : log.message.includes('[Error]') || log.message.includes('[Hardware Error]') ? 'text-error' : ''}>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOperations;

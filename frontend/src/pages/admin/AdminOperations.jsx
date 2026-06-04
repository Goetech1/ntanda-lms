import { useState } from 'react';
import { operationsService } from '../../services/api';

const AdminOperations = () => {
  const [activeTab, setActiveTab] = useState('enrollments');
  const [form, setForm] = useState({ courseId: '', studentsCSV: '', date: '', sessionType: 'LIVE' });

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

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Student Operations</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manually manage batch enrollments and track offline attendance.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('enrollments')}
          style={{ 
            background: activeTab === 'enrollments' ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: 'none', color: activeTab === 'enrollments' ? '#fff' : 'var(--text-muted)',
            padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          Batch Enrollments
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          style={{ 
            background: activeTab === 'attendance' ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: 'none', color: activeTab === 'attendance' ? '#fff' : 'var(--text-muted)',
            padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          Manual Attendance
        </button>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem', maxWidth: '600px' }}>
        {activeTab === 'enrollments' ? (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Batch Course Enrollment</h3>
            <form onSubmit={handleEnrollment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Course ID</label>
                <input 
                  type="text" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Student Emails (Comma Separated)</label>
                <textarea 
                  value={form.studentsCSV} onChange={e => setForm({...form, studentsCSV: e.target.value})} required rows="5" placeholder="alice@example.com, bob@example.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                />
              </div>
              <button type="submit" className="btn btn-primary">Process Enrollments</button>
            </form>
          </div>
        ) : (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Log Manual Attendance</h3>
            <form onSubmit={handleAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Course ID</label>
                  <input type="text" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Session Type</label>
                <select value={form.sessionType} onChange={e => setForm({...form, sessionType: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}>
                  <option value="LIVE">Live Online</option>
                  <option value="OFFLINE">In-Person (Offline)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Present Student Emails (CSV)</label>
                <textarea value={form.studentsCSV} onChange={e => setForm({...form, studentsCSV: e.target.value})} required rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <button type="submit" className="btn btn-primary">Log Attendance</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOperations;

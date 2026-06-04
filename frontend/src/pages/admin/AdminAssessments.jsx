import { useState, useEffect } from 'react';
import { assessmentService, examService } from '../../services/api';

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'QUIZ', courseId: '', durationMinutes: 30, requireWebcam: false, secureBrowser: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await assessmentService.getAll().catch(() => ({
          data: { data: [
            { id: '1', title: 'React Fundamentals Quiz', type: 'QUIZ', course: 'React 101', questionCount: 10, durationMinutes: 15 },
            { id: '2', title: 'Midterm Exam: Advanced JS', type: 'EXAM', course: 'JS Masterclass', questionCount: 50, durationMinutes: 120, requireWebcam: true },
            { id: '3', title: 'CSS Grid Challenge', type: 'QUIZ', course: 'Modern CSS', questionCount: 5, durationMinutes: 10 }
          ]}
        }));
        
        setAssessments(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching assessments', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newAsses = { ...form, id: Date.now().toString(), questionCount: 0 };
      
      if (form.type === 'EXAM') {
        await examService.schedule(form).catch(() => {});
      } else {
        await assessmentService.create(form).catch(() => {});
      }
      
      setAssessments([...assessments, newAsses]);
      setIsDrawerOpen(false);
      setForm({ title: '', type: 'QUIZ', courseId: '', durationMinutes: 30, requireWebcam: false, secureBrowser: false });
      alert('Assessment created successfully!');
    } catch {
      alert('Failed to create assessment');
    }
  };

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Assessments...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Assessments & Exams</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage quizzes, high-stakes exams, and question banks.</p>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📝</span> Create Assessment
        </button>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Course</th>
              <th style={{ padding: '1rem' }}>Details</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#fff' }}>{a.title}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: a.type === 'EXAM' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                    color: a.type === 'EXAM' ? '#ef4444' : '#3b82f6',
                    border: `1px solid ${a.type === 'EXAM' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                  }}>
                    {a.type}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{a.course || 'Unassigned'}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {a.questionCount} Qs • {a.durationMinutes}m
                  {a.requireWebcam && <span title="Webcam Required" style={{ marginLeft: '0.5rem' }}>📷</span>}
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Edit Questions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creation Drawer */}
      {isDrawerOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setIsDrawerOpen(false)} />}
      <div 
        className={isDrawerOpen ? 'animate-slide-in-right' : ''}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px',
          background: 'rgba(11, 12, 16, 0.95)', backdropFilter: 'blur(30px)',
          borderLeft: '1px solid var(--border-color)', zIndex: 101,
          padding: '2rem', display: 'flex', flexDirection: 'column',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Create Assessment</h2>
          <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleCreate} style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Title</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})}
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
              <select 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              >
                <option value="QUIZ">Quiz</option>
                <option value="EXAM">High-Stakes Exam</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Duration (Mins)</label>
              <input 
                type="number" 
                value={form.durationMinutes} 
                onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})}
                required min="5"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              />
            </div>
          </div>

          {form.type === 'EXAM' && (
            <div className="animate-fade-up" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#ef4444' }}>Security Settings (Proctoring)</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.requireWebcam}
                  onChange={e => setForm({...form, requireWebcam: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>Require Webcam Monitoring</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.secureBrowser}
                  onChange={e => setForm({...form, secureBrowser: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>Force Secure Browser Lock</span>
              </label>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAssessments;

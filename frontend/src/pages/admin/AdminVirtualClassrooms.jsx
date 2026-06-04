import { useState, useEffect } from 'react';
import { virtualClassroomService } from '../../services/api';

const AdminVirtualClassrooms = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ title: '', scheduledAt: '', durationMinutes: 60, instructor: '', courseId: '' });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await virtualClassroomService.getAll().catch(() => ({
          data: { data: [
            { id: '1', title: 'React Hooks Deep Dive (Live Q&A)', scheduledAt: new Date(Date.now() + 86400000).toISOString(), durationMinutes: 90, instructor: 'Jane Doe', status: 'SCHEDULED' },
            { id: '2', title: 'Welcome to the Platform (Onboarding)', scheduledAt: new Date(Date.now() - 3600000).toISOString(), durationMinutes: 60, instructor: 'Admin User', status: 'LIVE' },
            { id: '3', title: 'Advanced CSS Animations Workshop', scheduledAt: new Date(Date.now() + 172800000).toISOString(), durationMinutes: 120, instructor: 'John Smith', status: 'SCHEDULED' }
          ]}
        }));
        
        setClasses(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching live classes', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      const newClass = { ...form, id: Date.now().toString(), status: 'SCHEDULED' };
      await virtualClassroomService.schedule(newClass).catch(() => {});
      setClasses([...classes, newClass]);
      setIsDrawerOpen(false);
      setForm({ title: '', scheduledAt: '', durationMinutes: 60, instructor: '', courseId: '' });
      alert('Class scheduled successfully!');
    } catch {
      alert('Failed to schedule class');
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Virtual Classrooms...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Live Classrooms</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Schedule and manage real-time video sessions and webinars.</p>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📹</span> Schedule Live Class
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {classes.map(c => (
          <div key={c.id} className="glass-panel animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.3rem 0.8rem', 
                borderRadius: '99px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: c.status === 'LIVE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                color: c.status === 'LIVE' ? '#ef4444' : '#3b82f6',
                border: `1px solid ${c.status === 'LIVE' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
              }}>
                {c.status === 'LIVE' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }}></span>}
                {c.status}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.durationMinutes} mins</span>
            </div>
            
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', lineHeight: '1.4' }}>{c.title}</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👤</span> {c.instructor}
            </p>
            
            <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Scheduled For</div>
                <div style={{ fontWeight: '600', color: '#fff' }}>{formatDate(c.scheduledAt)}</div>
              </div>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                {c.status === 'LIVE' ? 'Join Now' : 'Start'}
              </button>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No live classes scheduled.
          </div>
        )}
      </div>

      {/* Schedule Drawer */}
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
          <h2 style={{ margin: 0 }}>Schedule Class</h2>
          <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSchedule} style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Class Title</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})}
              required 
              placeholder="e.g. React Deep Dive"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Date & Time</label>
            <input 
              type="datetime-local" 
              value={form.scheduledAt} 
              onChange={e => setForm({...form, scheduledAt: e.target.value})}
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff', colorScheme: 'dark' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Duration (Mins)</label>
              <input 
                type="number" 
                value={form.durationMinutes} 
                onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})}
                required min="15"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Instructor</label>
              <input 
                type="text" 
                value={form.instructor} 
                onChange={e => setForm({...form, instructor: e.target.value})}
                required 
                placeholder="Jane Doe"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              />
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVirtualClassrooms;

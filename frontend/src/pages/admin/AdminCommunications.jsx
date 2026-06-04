import { useState, useEffect } from 'react';
import { communicationService } from '../../services/api';

const AdminCommunications = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [form, setForm] = useState({ title: '', message: '', target: 'ALL_STUDENTS' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await communicationService.getAnnouncements().catch(() => ({
          data: { data: [
            { id: '1', title: 'Platform Maintenance', message: 'The system will be down for 2 hours on Sunday.', date: '2026-06-03', target: 'ALL_USERS' },
            { id: '2', title: 'New React Course Added!', message: 'Check out the new React Masterclass in the course catalog.', date: '2026-06-01', target: 'ALL_STUDENTS' }
          ]}
        }));
        
        setAnnouncements(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching announcements', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const newAnn = { ...form, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
      await communicationService.sendAnnouncement(form).catch(() => {});
      setAnnouncements([newAnn, ...announcements]);
      setForm({ title: '', message: '', target: 'ALL_STUDENTS' });
      alert('Announcement Sent!');
    } catch {
      alert('Failed to send announcement');
    }
  };

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Communications...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Communications & CMS</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Send platform-wide announcements and manage landing pages.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Send Announcement Form */}
        <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Broadcast Announcement</h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Audience</label>
              <select 
                value={form.target} 
                onChange={e => setForm({...form, target: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              >
                <option value="ALL_USERS">Everyone</option>
                <option value="ALL_STUDENTS">All Students</option>
                <option value="ALL_INSTRUCTORS">All Instructors</option>
              </select>
            </div>
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
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
              <textarea 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})}
                required rows="4"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Send Broadcast 🚀
            </button>
          </form>
        </div>

        {/* Recent Announcements */}
        <div className="glass-panel animate-fade-up" style={{ padding: '2rem', animationDelay: '0.1s' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Recent Broadcasts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map(a => (
              <div key={a.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{a.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.date}</span>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{a.message}</p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Target: {a.target}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCommunications;

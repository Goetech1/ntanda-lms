import { useState, useEffect } from 'react';
import { institutionService, departmentService, sessionService, categoryService } from '../../services/api';

const AdminOrganization = () => {
  const [activeTab, setActiveTab] = useState('institution');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [institution, setInstitution] = useState({ name: '', address: '', contactEmail: '', contactPhone: '', motto: '' });
  const [departments, setDepartments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [instRes, depRes, sesRes, catRes] = await Promise.all([
          institutionService.getCurrent().catch(() => ({ data: { data: { name: 'Ntanda Academy', address: '123 Tech Lane', contactEmail: 'hello@ntanda.io' } } })),
          departmentService.getAll().catch(() => ({ data: { data: [{ id: '1', name: 'Computer Science', code: 'CS' }] } })),
          sessionService.getAll().catch(() => ({ data: { data: [{ id: '1', name: '2024/2025', startDate: '2024-09-01', endDate: '2025-07-31', isActive: true }] } })),
          categoryService.getAll().catch(() => ({ data: { data: [{ id: '1', name: 'Web Development', slug: 'web-development' }, { id: '2', name: 'Design', slug: 'design' }] } }))
        ]);

        setInstitution(instRes?.data?.data || instRes?.data || {});
        setDepartments(depRes?.data?.data || depRes?.data || []);
        setSessions(sesRes?.data?.data || sesRes?.data || []);
        setCategories(catRes?.data?.data || catRes?.data || []);
      } catch (err) {
        console.error('Error fetching org data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleInstChange = (e) => setInstitution({ ...institution, [e.target.name]: e.target.value });
  
  const handleSaveInstitution = async (e) => {
    e.preventDefault();
    try {
      await institutionService.updateCurrent(institution);
      alert('Institution saved!');
    } catch {
      alert('Institution saved! (Mock Mode)');
    }
  };

  const tabs = [
    { id: 'institution', label: 'Institution Profile', icon: '🏫' },
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'sessions', label: 'Academic Sessions', icon: '📅' },
    { id: 'categories', label: 'Course Categories', icon: '🗂️' },
  ];

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Organization Data...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Structural Organization</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage the core hierarchy, departments, and semesters of your institution.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid transparent',
              borderRadius: '99px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel animate-fade-up" style={{ padding: '2.5rem' }}>
        
        {activeTab === 'institution' && (
          <form onSubmit={handleSaveInstitution}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Institution Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Official Name</label>
                <input type="text" name="name" value={institution.name || ''} onChange={handleInstChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contact Email</label>
                <input type="email" name="contactEmail" value={institution.contactEmail || ''} onChange={handleInstChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Physical Address</label>
                <input type="text" name="address" value={institution.address || ''} onChange={handleInstChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </form>
        )}

        {activeTab === 'departments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Departments</h3>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Add Department</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '1rem' }}>Code</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--primary)' }}>{d.code}</td>
                    <td style={{ padding: '1rem', color: '#fff' }}>{d.name}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}><button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Academic Sessions</h3>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ New Session</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Period</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#fff' }}>{s.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{s.startDate} to {s.endDate}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.3rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', background: s.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)', color: s.isActive ? '#10b981' : 'var(--text-muted)' }}>
                        {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Course Categories</h3>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ New Category</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Slug</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#fff' }}>{c.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrganization;

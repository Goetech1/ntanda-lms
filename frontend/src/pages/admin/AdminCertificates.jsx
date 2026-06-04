import { useState, useEffect } from 'react';
import { certificateService } from '../../services/api';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Designer State
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await certificateService.getAll().catch(() => ({
          data: { data: [
            { id: '1', student: 'Alice Johnson', course: 'React 101', issuedAt: '2026-06-01', status: 'ISSUED' },
            { id: '2', student: 'Bob Smith', course: 'JS Masterclass', issuedAt: '2026-06-03', status: 'PENDING' }
          ]}
        }));
        
        setCertificates(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching certificates', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Certificates...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Certificates Engine</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Design templates and issue course completion certificates.</p>
        </div>
        <button onClick={() => setIsDesignerOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎨</span> Certificate Designer
        </button>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Student Name</th>
              <th style={{ padding: '1rem' }}>Course Completed</th>
              <th style={{ padding: '1rem' }}>Date Issued</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#fff' }}>{c.student}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{c.course}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{c.issuedAt}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: c.status === 'ISSUED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                    color: c.status === 'ISSUED' ? '#10b981' : '#f59e0b',
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Designer Drawer */}
      {isDesignerOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setIsDesignerOpen(false)} />}
      <div 
        className={isDesignerOpen ? 'animate-slide-in-right' : ''}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px',
          background: 'rgba(11, 12, 16, 0.95)', backdropFilter: 'blur(30px)',
          borderLeft: '1px solid var(--border-color)', zIndex: 101,
          padding: '2rem', display: 'flex', flexDirection: 'column',
          transform: isDesignerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Certificate Designer</h2>
          <button onClick={() => setIsDesignerOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ width: '100%', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</span>
            <span>Upload Certificate Template Image</span>
          </div>

          <div>
            <h4 style={{ margin: '0 0 1rem 0' }}>Dynamic Variables Map</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '120px', color: 'var(--text-muted)' }}>Student Name:</span>
                <input type="text" placeholder="X, Y Coordinates" style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '120px', color: 'var(--text-muted)' }}>Course Name:</span>
                <input type="text" placeholder="X, Y Coordinates" style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '120px', color: 'var(--text-muted)' }}>Date Issued:</span>
                <input type="text" placeholder="X, Y Coordinates" style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>Save Template</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;

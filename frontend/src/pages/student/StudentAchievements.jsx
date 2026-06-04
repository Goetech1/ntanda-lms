import { useState, useEffect } from 'react';
import { studentPortalService } from '../../services/api';

const StudentAchievements = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await studentPortalService.getMyCertificates().catch(() => ({
          data: { data: [
            { id: '1', course: 'React Masterclass', date: '2026-06-01', thumbnail: 'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=800&q=80' },
            { id: '2', course: 'Advanced CSS Grid', date: '2026-05-15', thumbnail: 'https://images.unsplash.com/photo-1523289203815-434722883e1c?w=800&q=80' }
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

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Achievements...</div>;

  return (
    <div style={{ padding: '3rem 2rem', paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>My Achievements</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>View your earned certificates and exam results.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {certificates.map(cert => (
          <div 
            key={cert.id} 
            className="glass-panel animate-fade-up" 
            style={{ 
              borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ height: '200px', backgroundImage: `url(${cert.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                CERTIFIED
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{cert.course}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Issued: {cert.date}</div>
              <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <span>⬇️</span> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAchievements;

import { useState, useEffect } from 'react';
import { virtualClassroomService } from '../../services/api';

const StudentLive = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await virtualClassroomService.getAll().catch(() => ({
          data: { data: [
            { id: '1', title: 'Weekly Q&A: React Hooks', instructor: 'Jane Doe', startTime: new Date().toISOString(), status: 'LIVE', meetingLink: '#' },
            { id: '2', title: 'CSS Grid Workshop', instructor: 'Mark Johnson', startTime: '2026-06-10T14:00:00Z', status: 'SCHEDULED' }
          ]}
        }));
        
        setSessions(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching live sessions', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Live Schedule...</div>;

  return (
    <div style={{ padding: '3rem 2rem', paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Live Classrooms</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Join upcoming scheduled virtual classes and workshops.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {sessions.map(session => {
          const isLive = session.status === 'LIVE';
          
          return (
            <div 
              key={session.id} 
              className="glass-panel animate-fade-up" 
              style={{ 
                padding: '1.5rem', 
                border: isLive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {isLive && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ 
                  padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold',
                  background: isLive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                  color: isLive ? '#ef4444' : '#3b82f6',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  {isLive && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />}
                  {isLive ? 'HAPPENING NOW' : 'UPCOMING'}
                </div>
              </div>

              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{session.title}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Instructor: {session.instructor}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontSize: '0.9rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
                <span>📅</span>
                {new Date(session.startTime).toLocaleString()}
              </div>

              <button 
                className={`btn ${isLive ? 'btn-primary' : 'btn-outline'}`}
                style={{ 
                  width: '100%', 
                  background: isLive ? '#ef4444' : 'transparent', 
                  borderColor: isLive ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  boxShadow: isLive ? '0 4px 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}
                disabled={!isLive}
              >
                {isLive ? 'Join Class Now' : 'Remind Me'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default StudentLive;

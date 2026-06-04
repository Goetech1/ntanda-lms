import { useState, useEffect } from 'react';
import { instructorPortalService } from '../../services/api';

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorPortalService.getMyStudents().catch(() => ({
          data: { data: [
            { id: '1', name: 'Alice Johnson', email: 'alice@example.com', course: 'React Masterclass', progress: 85, lastActive: '2 hours ago' },
            { id: '2', name: 'Bob Smith', email: 'bob@example.com', course: 'React Masterclass', progress: 12, lastActive: '3 days ago' },
            { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', course: 'Advanced Next.js', progress: 45, lastActive: 'Yesterday' }
          ]}
        }));
        setStudents(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching students', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Students...</div>;

  return (
    <div style={{ maxWidth: '1200px', position: 'relative', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>My Students</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Track progress of students enrolled in your courses.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search students..." 
            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', width: '250px' }}
          />
        </div>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Student Name</th>
              <th style={{ padding: '1rem' }}>Enrolled Course</th>
              <th style={{ padding: '1rem' }}>Progress</th>
              <th style={{ padding: '1rem' }}>Last Active</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.8rem' }}>
                      {s.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{s.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{s.course}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: s.progress > 80 ? '#10b981' : 'var(--primary)' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{s.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{s.lastActive}</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorStudents;

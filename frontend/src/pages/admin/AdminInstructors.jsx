import { useState, useEffect } from 'react';
import { instructorService } from '../../services/api';

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorService.getAll().catch(() => ({
          data: { data: [
            { id: '1', name: 'Dr. Jane Smith', email: 'jane.smith@example.com', activeCourses: 4, revenueShare: '70%', totalEarnings: 4500.00 },
            { id: '2', name: 'Mark Johnson', email: 'mark.j@example.com', activeCourses: 2, revenueShare: '60%', totalEarnings: 1200.50 },
            { id: '3', name: 'Sarah Lee', email: 'sarah.lee@example.com', activeCourses: 7, revenueShare: '80%', totalEarnings: 12400.00 }
          ]}
        }));
        
        setInstructors(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching instructors', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Instructors...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Instructor Hub</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage your teaching staff, revenue shares, and payouts.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🧑‍🏫</span> Invite Instructor
        </button>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Instructor Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Active Courses</th>
              <th style={{ padding: '1rem' }}>Revenue Share</th>
              <th style={{ padding: '1rem' }}>Total Earnings</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map(i => (
              <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.8rem' }}>
                    {i.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{i.name}</span>
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{i.email}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{i.activeCourses}</td>
                <td style={{ padding: '1.25rem 1rem', color: '#fff' }}>{i.revenueShare}</td>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#10b981' }}>${i.totalEarnings.toFixed(2)}</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Process Payout</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInstructors;

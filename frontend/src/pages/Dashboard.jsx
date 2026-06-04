import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mock authentication check
    const mockUser = localStorage.getItem('mock_user');
    if (!mockUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mock_user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Ntanda LMS</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{user.email}</span>
          <span style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#818CF8', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {user.role}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem', flex: 1 }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Dashboard Layout</h3>
          <p>Welcome back! This is an empty shell for the dashboard. Features will be implemented here once the backend connects.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <h4>My Courses</h4>
              <p style={{ fontSize: '0.875rem' }}>No courses enrolled yet.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <h4>Recent Activity</h4>
              <p style={{ fontSize: '0.875rem' }}>No recent activity to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

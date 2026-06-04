import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Read the stored user object from Login
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Proceed to clear state anyway if the server request fails
    } finally {
      // Clear user data completely and redirect
      localStorage.removeItem('user');
      navigate('/login');
    }
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
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem', flex: 1 }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Welcome, {user.fullName || user.email}!</h3>
          <p>Your tenant ID is: <code style={{ color: 'var(--text-muted)' }}>{user.tenantId}</code></p>
          <p>This is an empty shell for the dashboard. Features will be implemented here.</p>
          
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

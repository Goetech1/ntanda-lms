import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN') {
      // Redirect non-admins to the standard dashboard
      navigate('/dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: '📊' },
    { name: 'Courses', path: '/admin/courses', icon: '📚' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: 'var(--card-bg)', 
        borderRight: '1px solid var(--border-color)', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50
      }} className="desktop-only-flex">
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
          <img src="/ntanda-logo.jpeg" alt="Ntanda LMS" style={{ height: '40px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => navigate('/')} />
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
            Admin Menu
          </div>
          
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', 
                  padding: '0.875rem 1rem', borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.fullName || 'Admin User'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Topbar */}
        <header style={{ 
          height: '70px', 
          background: 'rgba(15, 15, 20, 0.9)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Workspace</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <input type="text" placeholder="Search..." style={{ padding: '0.5rem 1rem', borderRadius: '999px', background: 'rgba(0,0,0,0.5)', width: '250px' }} />
            </div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>🔔</button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="animate-fade-in" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>&copy; {new Date().getFullYear()} Ntanda LMS</span>
          <span>Version 1.0.0</span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

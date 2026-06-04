import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { tenantService } from '../services/api';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState({ name: 'Ntanda LMS', logoUrl: '/ntanda-logo.jpeg' });

  useEffect(() => {
    tenantService.getTenantProfile()
      .then(res => {
        const data = res?.data?.data || res?.data;
        if (data) {
          setTenant({
            name: data.name || 'Ntanda LMS',
            logoUrl: data.branding?.logoUrl || '/ntanda-logo.jpeg'
          });
        }
      })
      .catch(() => null);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/admin', icon: '📊' },
    { name: 'Organization', path: '/admin/organization', icon: '🏢' },
    { name: 'Courses', path: '/admin/courses', icon: '📚' },
    { name: 'Live Classes', path: '/admin/live-classes', icon: '📹' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Security', path: '/admin/security', icon: '🔒' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* Floating Sidebar (Apple/Stripe Style) */}
      <div style={{ 
        width: '280px', 
        padding: '1.5rem', 
        position: 'fixed', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div className="glass-panel" style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Logo Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
            <img src={tenant.logoUrl} alt="Logo" style={{ height: '45px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>
              {tenant.name}
            </h2>
          </div>

          {/* Nav Links */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', borderRadius: '14px',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    background: isActive ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ 
                    fontSize: '1.2rem', 
                    filter: isActive ? 'drop-shadow(0 0 8px var(--primary-glow))' : 'grayscale(100%) opacity(0.7)'
                  }}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button 
              onClick={handleLogout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                padding: '1rem 1.25rem', borderRadius: '14px', cursor: 'pointer',
                textAlign: 'left', fontWeight: '500', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Frosted Topbar */}
        <header style={{ 
          height: '80px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          padding: '0 3rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(11, 12, 16, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
              🔔
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>Admin User</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Platform Admin</div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 10px var(--primary-glow)' }}>
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="animate-fade-up" style={{ flex: 1, padding: '3rem' }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const InstructorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/instructor', icon: '📊' },
    { name: 'My Courses', path: '/instructor/courses', icon: '📚' },
    { name: 'My Students', path: '/instructor/students', icon: '👥' },
    { name: 'Earnings', path: '/instructor/earnings', icon: '💰' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar Navigation */}
      <div style={{ width: '260px', padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: 'rgba(11,12,16,0.95)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <img src="/ntanda-logo.jpeg" alt="Logo" style={{ height: '35px', borderRadius: '8px' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Instructor Hub</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/instructor' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem', borderRadius: '12px',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  textDecoration: 'none', transition: 'all 0.2s',
                  boxShadow: isActive ? 'inset 4px 0 0 var(--primary)' : 'none'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              TS
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>Tom Smith</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'} onClick={() => navigate('/login')}>Sign Out</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;

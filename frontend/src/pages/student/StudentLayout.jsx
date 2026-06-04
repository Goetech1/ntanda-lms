import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', path: '/student', icon: '🏠' },
    { name: 'Catalog', path: '/student/catalog', icon: '🔍' },
    { name: 'Live', path: '/student/live', icon: '📹' },
    { name: 'Achievements', path: '/student/achievements', icon: '🏅' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ width: '250px', padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: 'rgba(11,12,16,0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <img src="/ntanda-logo.jpeg" alt="Logo" style={{ height: '35px', borderRadius: '8px' }} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Ntanda</h2>
          </div>

          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
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
                    textDecoration: 'none', transition: 'all 0.2s'
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                JD
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>Jane Doe</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign Out</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: isMobile ? '80px' : '0' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (PWA Style) */}
      {isMobile && (
        <div style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          height: '70px', background: 'rgba(11,12,16,0.95)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 1000
        }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', color: isActive ? '#fff' : 'var(--text-muted)' }}>
                <span style={{ fontSize: '1.5rem', filter: isActive ? 'drop-shadow(0 0 5px var(--primary))' : 'none' }}>{item.icon}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 'bold' : 'normal' }}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentLayout;

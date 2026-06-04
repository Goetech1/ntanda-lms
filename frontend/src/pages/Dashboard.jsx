import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, enrollmentService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Read the stored user object
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }

    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentService.getMyEnrollments();
        setEnrollments(response.data.data || response.data);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
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
          <Link to="/courses" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Browse Courses</Link>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Welcome, {user.fullName || user.email}!</h1>
            <p style={{ color: 'var(--text-muted)' }}>Here are your active course enrollments.</p>
          </div>
        </div>
        
        {isLoading ? (
          <p>Loading your courses...</p>
        ) : enrollments.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3>No Active Enrollments</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: '150px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  {enrollment.course?.thumbnailUrl ? (
                    <img src={enrollment.course.thumbnailUrl} alt={enrollment.course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No Image Available
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{enrollment.course?.title || 'Unknown Course'}</h3>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span>Progress</span>
                      <span>{enrollment.progressPercentage || 0}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${enrollment.progressPercentage || 0}%`, background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                    </div>
                    
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

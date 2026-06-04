import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentPortalService } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mocking responses if backend is disconnected
        const myCourses = await studentPortalService.getMyEnrollments().catch(() => ({
          data: { data: [
            { id: '1', course: { id: 'c1', title: 'React Masterclass', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', instructor: 'Jane Smith' }, progress: 45, lastAccessed: 'Lesson 4: Hooks' },
            { id: '2', course: { id: 'c2', title: 'Advanced CSS Grid', thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80', instructor: 'Mark Johnson' }, progress: 12, lastAccessed: 'Lesson 2: Subgrid' }
          ]}
        }));

        const allCourses = await studentPortalService.getCourseCatalog().catch(() => ({
          data: { data: [
            { id: 'c3', title: 'Python for Beginners', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80', rating: 4.8 },
            { id: 'c4', title: 'Figma UI Design', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', rating: 4.9 },
            { id: 'c5', title: 'Node.js Backend Dev', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', rating: 4.7 }
          ]}
        }));

        setEnrollments(myCourses?.data?.data || myCourses?.data || []);
        setCatalog(allCourses?.data?.data || allCourses?.data || []);
      } catch (err) {
        console.error('Error fetching student dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading your learning hub...</div>;

  const lastActive = enrollments[0];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      
      {/* Netflix-Style Hero Banner */}
      {lastActive && (
        <div style={{ 
          position: 'relative', width: '100%', height: '50vh', minHeight: '400px', 
          backgroundImage: `url(${lastActive.course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center',
          display: 'flex', alignItems: 'flex-end'
        }}>
          {/* Gradient Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, rgba(11,12,16,0.6) 50%, rgba(11,12,16,0.2) 100%)' }} />
          
          <div className="animate-fade-up" style={{ position: 'relative', zIndex: 10, padding: '3rem', width: '100%', maxWidth: '800px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Continue Learning</div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{lastActive.course.title}</h1>
            <p style={{ color: '#ccc', fontSize: '1.2rem', margin: '0 0 1.5rem 0' }}>Up next: {lastActive.lastAccessed}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button 
                onClick={() => navigate(`/student/player/${lastActive.course.id}`)}
                className="btn" 
                style={{ background: '#fff', color: '#000', padding: '0.75rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '4px' }}
              >
                <span>▶️</span> Resume
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '300px' }}>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${lastActive.progress}%`, height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }} />
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{lastActive.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '0 2rem', marginTop: '-2rem', position: 'relative', zIndex: 20 }}>
        
        {/* Enrolled Courses Carousel */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My Courses</h2>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
            {enrollments.map(e => (
              <div 
                key={e.id} 
                onClick={() => navigate(`/student/player/${e.course.id}`)}
                style={{ 
                  minWidth: '280px', width: '280px', borderRadius: '8px', overflow: 'hidden', 
                  background: 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'transform 0.2s',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={ev => ev.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={ev => ev.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ height: '150px', backgroundImage: `url(${e.course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course.title}</h4>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                    <div style={{ width: `${e.progress}%`, height: '100%', background: 'var(--primary)' }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e.progress}% Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses Carousel */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recommended For You</h2>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
            {catalog.map(c => (
              <div 
                key={c.id} 
                style={{ 
                  minWidth: '220px', width: '220px', borderRadius: '8px', overflow: 'hidden', 
                  background: 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'transform 0.2s'
                }}
                onMouseEnter={ev => ev.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={ev => ev.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ height: '300px', backgroundImage: `url(${c.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>{c.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold' }}>
                      ⭐ {c.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;

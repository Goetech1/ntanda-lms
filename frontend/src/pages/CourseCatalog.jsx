import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        // Assuming response.data is an array or response.data.data is the array
        setCourses(response.data.data || response.data);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Ntanda LMS</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Dashboard</Link>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Course Catalog</h2>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No courses are currently available.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {courses.map(course => (
              <div key={course.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: '180px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No Image Available
                    </div>
                  )}
                  {course.price > 0 ? (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      ${course.price}
                    </div>
                  ) : (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      Free
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                  <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseCatalog;

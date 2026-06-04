import { useState, useEffect } from 'react';
import { instructorPortalService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorPortalService.getMyCourses().catch(() => ({
          data: { data: [
            { id: '1', title: 'React Masterclass', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', status: 'PUBLISHED', enrollments: 850, rating: 4.8 },
            { id: '2', title: 'Advanced Next.js', thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80', status: 'DRAFT', enrollments: 0, rating: 0 }
          ]}
        }));
        setCourses(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching courses', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading your courses...</div>;

  return (
    <div style={{ maxWidth: '1200px', position: 'relative', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>My Courses</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage your published courses and drafts.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✨</span> Create Course
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-panel animate-fade-up" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: course.status === 'PUBLISHED' ? '#10b981' : '#f59e0b', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {course.status}
              </div>
            </div>
            
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{course.title}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <span>👥 {course.enrollments} Students</span>
              <span>⭐ {course.rating > 0 ? course.rating : 'N/A'}</span>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                onClick={() => navigate(`/admin/courses/${course.id}/curriculum`)} // Reusing the powerful admin curriculum builder!
              >
                Edit Content
              </button>
              <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>Settings</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;

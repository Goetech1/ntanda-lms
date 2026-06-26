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

  if (isLoading) return <div className="p-xl text-center text-primary font-bold">Loading your courses...</div>;

  return (
    <div className="max-w-max-width mx-auto relative pb-xl animate-fade-up">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md mb-xl">
        <div>
          <h1 className="font-headline-md text-display-lg-mobile md:text-headline-md text-primary tracking-tight mb-xs">My Courses</h1>
          <p className="text-on-surface-variant text-body-lg">Manage your published courses and drafts.</p>
        </div>
        <button className="btn btn-primary flex items-center justify-center gap-xs py-xs w-full sm:w-auto">
          <span>✨</span> Create Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {courses.map(course => (
          <div key={course.id} className="glass-panel p-md flex flex-col">
            <div className="relative h-[180px] rounded-lg overflow-hidden mb-md">
              <div style={{ backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0 }} />
              <div className={`absolute top-4 right-4 text-white px-2 py-0.5 rounded text-[10px] font-bold ${course.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                {course.status}
              </div>
            </div>
            
            <h3 className="font-headline-sm text-headline-sm mb-xs text-on-surface">{course.title}</h3>
            
            <div className="flex justify-between text-on-surface-variant text-body-sm mb-lg">
              <span>👥 {course.enrollments} Students</span>
              <span>⭐ {course.rating > 0 ? course.rating : 'N/A'}</span>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex gap-2">
                <button 
                  className="btn btn-outline flex-1 py-xs text-body-sm bg-white border-slate-300 text-slate-700 hover:text-[var(--primary)] hover:border-[var(--primary)]"
                  onClick={() => navigate(`/instructor/courses/${course.id}/curriculum`)}
                >
                  Curriculum
                </button>
                <button 
                  className="btn btn-outline flex-1 py-xs text-body-sm bg-white border-slate-300 text-slate-700 hover:text-[var(--primary)] hover:border-[var(--primary)]"
                  onClick={() => navigate(`/instructor/courses/${course.id}/gradebook`)}
                >
                  Gradebook
                </button>
              </div>
              <button className="btn btn-outline w-full py-xs text-body-sm bg-white border-slate-300 text-slate-700 hover:text-white">Settings</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;

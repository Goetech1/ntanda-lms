import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, BookOpen, Loader2 } from 'lucide-react';
import api from '../../services/api';

const StudentForums = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/enrollments/my-enrollments');
        const courseData = response.data?.data || response.data || [];
        setCourses(Array.isArray(courseData) ? courseData : []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-[var(--primary)]" />
            Discussion Forums
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Join the conversation with your peers in your enrolled courses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((enrollment) => {
          const course = enrollment.course || enrollment;
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
              <div className="h-32 w-full relative">
                <img 
                  src={course.thumbnail_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=0D8ABC&color=fff&size=400`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white text-sm font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Course Forum
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-2 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {course.description || "Discuss topics, ask questions, and collaborate with your peers."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-500 font-bold"><Users className="w-4 h-4"/></div>
                  </div>
                  <button 
                    onClick={() => navigate(`/student/player/${course.id}?tab=discussion`)}
                    className="text-[var(--primary)] font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    Enter Forum
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {courses.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500 bg-white">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No Forums Available</h3>
            <p>You need to enroll in a course to access its discussion forum.</p>
            <button 
              onClick={() => navigate('/student/catalog')}
              className="mt-6 px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-colors"
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentForums;

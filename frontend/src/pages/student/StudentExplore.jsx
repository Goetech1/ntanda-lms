import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List, BookOpen, MapPin, Loader2, PlayCircle } from 'lucide-react';
import { learningPathService } from '../../services/api';
import api from '../../services/api';

const StudentExplore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [paths, setPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, pathsRes] = await Promise.all([
          api.get('/courses').catch(() => ({ data: { data: [] } })), // Mocking for now as student courses API might be different, using admin for demo
          learningPathService.getAll().catch(() => ({ data: { data: [] } }))
        ]);
        setCourses(coursesRes.data?.data || [
          { id: 'c1', title: 'Advanced Full-Stack Web Architecture', instructor: 'Dr. Sarah Jenkins', price: '$89.99', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
          { id: 'c2', title: 'Digital Business Strategy', instructor: 'Mark Thompson', price: 'Free', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' }
        ]);
        setPaths(pathsRes.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <main className="max-w-6xl mx-auto space-y-8 animate-fade-up pb-12">
      {/* Hero Search Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-6">Explore Your Future.</h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-[var(--primary)] transition-colors" />
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all text-white placeholder:text-slate-500 outline-none shadow-inner" 
              placeholder="Search courses, learning paths, or instructors..." 
              type="text"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`pb-4 px-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'courses' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
        >
          <BookOpen className="w-4 h-4" /> Individual Courses
        </button>
        <button 
          onClick={() => setActiveTab('paths')}
          className={`pb-4 px-2 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'paths' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
        >
          <MapPin className="w-4 h-4" /> Learning Paths
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
        </div>
      ) : activeTab === 'courses' ? (
        /* Course Grid */
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recommended for You</h2>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-slate-800"><Grid className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-slate-800"><List className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <article key={course.id} className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  {course.thumbnail_url || course.thumbnail ? (
                    <img alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" src={course.thumbnail_url || course.thumbnail} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600"><BookOpen className="w-12 h-12" /></div>
                  )}
                  {course.price === 'Free' && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">FREE</div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      {course.instructor ? course.instructor.charAt(0) : 'I'}
                    </div>
                    <span className="text-slate-400 text-sm">{course.instructor || 'Instructor'}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <span className="font-bold text-slate-200">{course.price || '$49.99'}</span>
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary)] transition-colors">View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        /* Learning Paths Grid */
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Curated Tracks</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paths.length > 0 ? paths.map(path => (
              <div key={path.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-[var(--primary)]/50 transition-colors cursor-pointer group" onClick={() => navigate(`/paths/${path.id}`)}>
                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{path.description || 'A curated track of courses to master a specific skill.'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5" /> {path.course_count} Courses in Track
                      </span>
                      <span className="text-[var(--primary)] text-sm font-medium group-hover:underline">Start Path &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-16 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No learning paths have been published yet.</p>
              </div>
            )}
          </div>
        </section>
      )}

    </main>
  );
};

export default StudentExplore;

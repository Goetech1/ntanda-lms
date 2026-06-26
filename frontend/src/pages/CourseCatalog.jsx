import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Filter, BookOpen, Clock, PlayCircle, GraduationCap, ChevronLeft } from 'lucide-react';
import { useTenantBranding } from '../components/TenantBrandingProvider';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { tenant } = useTenantBranding();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        setCourses(response.data?.data || response.data || []);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[var(--primary)] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--primary)] opacity-[0.03] blur-[100px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--secondary)] opacity-[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="h-20 px-6 lg:px-12 flex items-center justify-between border-b border-slate-200/60 bg-slate-50/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {tenant?.branding?.logoUrl ? (
            <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-10 w-10 rounded-xl object-cover cursor-pointer" onClick={() => navigate('/dashboard')} />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg cursor-pointer" onClick={() => navigate('/dashboard')}>
              <span className="text-lg font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight cursor-pointer hidden sm:block" onClick={() => navigate('/dashboard')}>
            {tenant?.name || "Ntanda"}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-slate-800">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 relative z-10">
        
        {/* Page Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-3">Course Catalog</h2>
            <p className="text-slate-600 text-lg max-w-2xl">Expand your knowledge with our curated selection of expert-led courses designed for your growth.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[var(--primary)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-500 outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/10"
              />
            </div>
            <Button variant="secondary" className="shrink-0 bg-white hover:bg-slate-100 border-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3">
            <div className="p-1 bg-red-500/20 rounded-lg shrink-0 mt-0.5">
              <span className="block w-4 h-4 text-center leading-4 font-bold">!</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="mt-12">
            <EmptyState 
              icon={<Search className="h-12 w-12 text-slate-600" />}
              title={searchQuery ? "No matching courses found" : "No courses available"}
              description={searchQuery ? `We couldn't find any courses matching "${searchQuery}". Try adjusting your search.` : "There are currently no courses available in the catalog. Please check back later."}
              action={searchQuery ? {
                label: "Clear Search",
                onClick: () => setSearchQuery('')
              } : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} className="group overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-[0_0_30px_-10px_var(--primary)] transition-all duration-300 flex flex-col h-full">
                <div className="h-48 w-full bg-white relative overflow-hidden shrink-0">
                  {course.thumbnailUrl ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-100/30">
                      <GraduationCap className="h-12 w-12 mb-3 opacity-20" />
                    </div>
                  )}
                  {/* Price Tag Overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    {course.price > 0 ? (
                      <span className="bg-slate-50/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-slate-300">
                        ${course.price}
                      </span>
                    ) : (
                      <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/20">
                        Free
                      </span>
                    )}
                  </div>
                  {/* Category/Level Badge (Optional/Placeholder) */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="bg-[var(--primary)] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      {course.category || 'Course'}
                    </span>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60"></div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">
                    {course.description}
                  </p>
                  
                  {/* Course Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{course.modulesCount || 12} Modules</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration || '4h 30m'}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-200/60">
                    <Button 
                      className="w-full justify-between group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300" 
                      variant="secondary"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      View Details
                      <PlayCircle className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseCatalog;

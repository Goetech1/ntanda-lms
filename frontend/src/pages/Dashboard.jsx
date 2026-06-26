import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, enrollmentService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { LogOut, BookOpen, PlayCircle, Trophy } from 'lucide-react';
import { useTenantBranding } from '../components/TenantBrandingProvider';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tenant } = useTenantBranding();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }

    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentService.getMyEnrollments();
        setEnrollments(response.data?.data || response.data || []);
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
            <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-10 w-10 rounded-xl object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight">{tenant?.name || "Ntanda"}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 bg-white/50 px-4 py-2 rounded-full border border-slate-200">
            <span className="text-sm text-slate-700 font-medium">{user.email}</span>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            isLoading={isLoggingOut}
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            {!isLoggingOut && <LogOut className="h-4 w-4 mr-2" />}
            Log out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user.fullName || user.email.split('@')[0]}!</h2>
            <p className="text-slate-600 text-lg">Pick up where you left off or discover something new.</p>
          </div>
          <Button onClick={() => navigate('/courses')} className="shadow-lg shadow-[var(--primary)]/20">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Catalog
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="mt-12 max-w-2xl mx-auto">
            <EmptyState 
              icon={<BookOpen className="h-12 w-12 text-[var(--primary)]" />}
              title="No active enrollments"
              description="You haven't enrolled in any courses yet. Explore our catalog to find your next learning adventure."
              action={{
                label: "Explore Catalog",
                onClick: () => navigate('/courses')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(enrollment => (
              <Card key={enrollment.id} className="group overflow-hidden hover:border-slate-300 transition-all duration-300">
                <div className="h-48 w-full bg-white relative overflow-hidden">
                  {enrollment.course?.thumbnailUrl ? (
                    <img 
                      src={enrollment.course.thumbnailUrl} 
                      alt={enrollment.course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-100/50">
                      <PlayCircle className="h-10 w-10 mb-2 opacity-50" />
                    </div>
                  )}
                  {/* Progress Overlay */}
                  <div className="absolute top-4 right-4 bg-slate-50/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2">
                    <Trophy className="h-3 w-3 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{enrollment.progressPercentage || 0}%</span>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {enrollment.course?.title || 'Unknown Course'}
                  </h3>
                  
                  <div className="mt-auto pt-6">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${enrollment.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                    
                    <Button variant="secondary" className="w-full group-hover:bg-slate-100">
                      Continue Learning
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

export default Dashboard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, enrollmentService, paymentService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  ChevronLeft, PlayCircle, Clock, BookOpen, CheckCircle, 
  GraduationCap, AlertCircle, CreditCard, ShieldCheck 
} from 'lucide-react';
import { useTenantBranding } from '../components/TenantBrandingProvider';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenantBranding();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseById(id);
        setCourse(response.data?.data || response.data);
      } catch (err) {
        setError('Failed to load course details. It may have been removed.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleStripeCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await paymentService.createStripeCheckout(id, course.price);
      const checkoutUrl = response.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('No checkout URL received from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      await enrollmentService.manualEnroll(user.id, id);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Manual enrollment failed. You may already be enrolled.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="h-20 px-6 lg:px-12 flex items-center border-b border-slate-200/60 bg-slate-50/50 sticky top-0 z-40">
          <Skeleton className="h-10 w-10 rounded-xl mr-3" />
          <Skeleton className="h-6 w-32" />
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
          <Skeleton className="h-80 w-full rounded-2xl mb-8" />
          <div className="flex gap-12">
            <div className="flex-1">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-8" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="w-80 shrink-0">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans items-center justify-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-6 opacity-80" />
        <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md text-center">{error}</p>
        <Button onClick={() => navigate('/courses')}>Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[var(--primary)] selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--primary)] opacity-[0.03] blur-[120px]" />
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
        
        <Button variant="ghost" onClick={() => navigate('/courses')} className="text-slate-600 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16 relative z-10">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden mb-12 shadow-2xl border border-slate-200">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-white">
              <GraduationCap className="h-24 w-24 mb-4 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <span className="inline-block bg-[var(--primary)] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-[var(--primary)]/20">
              {course.category?.name || 'General Category'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl leading-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[var(--primary)]" />
                <span>{course.modules?.length || 12} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--primary)]" />
                <span>{course.duration || 'Self-paced'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Description & Content */}
          <div className="flex-1 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <PlayCircle className="h-6 w-6 text-[var(--primary)]" />
                About This Course
              </h2>
              <div className="prose prose-invert max-w-none text-slate-700">
                <p className="whitespace-pre-line leading-relaxed text-lg">{course.description}</p>
              </div>
            </section>

            {course.modules && course.modules.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-[var(--primary)]" />
                  Course Content
                </h2>
                <div className="space-y-3">
                  {course.modules.map((mod, index) => (
                    <div 
                      key={mod.id || index} 
                      className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm mr-4 group-hover:bg-[var(--primary)]/20 group-hover:text-[var(--primary)] transition-colors shrink-0">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-800 group-hover:text-white transition-colors">
                        {mod.title}
                      </span>
                      <PlayCircle className="h-5 w-5 ml-auto text-slate-600 group-hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Pricing & Actions */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-28">
              <Card className="border-[var(--primary)]/20 shadow-2xl shadow-[var(--primary)]/5">
                <CardContent className="p-8">
                  <div className="mb-8 text-center">
                    <span className="block text-slate-600 text-sm font-medium mb-2 uppercase tracking-widest">Enrollment Fee</span>
                    <div className="text-5xl font-extrabold text-white flex items-center justify-center">
                      {course.price > 0 ? (
                        <>
                          <span className="text-2xl text-slate-600 mr-1">$</span>
                          {course.price}
                        </>
                      ) : (
                        <span className="text-emerald-400">Free</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      className="w-full h-14 text-lg font-bold shadow-lg shadow-[var(--primary)]/20" 
                      onClick={handleStripeCheckout} 
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Enroll Now
                    </Button>
                    
                    {user?.role === 'SUPER_ADMIN' || user?.role === 'TENANT_ADMIN' ? (
                      <Button 
                        variant="secondary" 
                        className="w-full" 
                        onClick={handleManualEnroll} 
                        disabled={isProcessing}
                      >
                        (Admin) Manual Enroll
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-8 space-y-4 border-t border-slate-200/60 pt-6">
                    <h4 className="font-semibold text-slate-800 mb-4">This course includes:</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-[var(--primary)]" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-[var(--primary)]" />
                      <span>Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-[var(--primary)]" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default CourseDetails;

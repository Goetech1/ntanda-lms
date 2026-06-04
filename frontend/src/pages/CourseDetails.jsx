import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, enrollmentService, paymentService } from '../services/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        setCourse(response.data.data || response.data);
      } catch (err) {
        setError('Failed to load course details.');
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
      // Expected: { sessionId, gateway, url }
      const checkoutUrl = response.data.url;
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
      navigate('/dashboard'); // Navigate back to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Manual enrollment failed. You may already be enrolled.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="page-wrapper"><p>Loading course details...</p></div>;
  }

  if (!course) {
    return (
      <div className="page-wrapper">
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Course Not Found</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/courses')}>Back to Catalog</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem 2rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/ntanda-logo.jpeg" alt="Ntanda LMS" style={{ height: '60px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/courses" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Back to Catalog</Link>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem', flex: 1, maxWidth: '900px' }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ height: '300px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No Image Available
              </div>
            )}
          </div>
          
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ marginBottom: '1rem' }}>{course.title}</h1>
                <span style={{ display: 'inline-block', background: 'rgba(79, 70, 229, 0.2)', color: '#818CF8', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {course.category?.name || 'General Category'}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
                  {course.price > 0 ? `$${course.price}` : 'Free'}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleStripeCheckout} 
                    disabled={isProcessing}
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    {isProcessing ? 'Processing...' : 'Enroll with Stripe'}
                  </button>
                  
                  {/* Both options included as requested */}
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleManualEnroll} 
                    disabled={isProcessing}
                    style={{ fontSize: '0.875rem' }}
                  >
                    (Admin) Manual Enroll
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <h3>About This Course</h3>
              <p style={{ whiteSpace: 'pre-line', color: 'var(--text-muted)' }}>{course.description}</p>
            </div>
            
            {course.modules && course.modules.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <h3>Course Content</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  {course.modules.map((mod, index) => (
                    <div key={mod.id || index} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <strong>{mod.title}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;

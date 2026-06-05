import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, setAccessToken } from '../services/api';
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      const { access_token, user } = response.data.data;
      
      setAccessToken(access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'SUPER_ADMIN' || user.role === 'TENANT_ADMIN') {
        navigate('/admin');
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role = 'STUDENT') => {
    const demoUser = {
      id: "demo-uuid-1234",
      email: role === 'ADMIN' ? "admin@ntanda.io" : "student@ntanda.io",
      fullName: role === 'ADMIN' ? "Demo Admin" : "Demo Student",
      role: role,
      tenantId: "123e4567-e89b-12d3-a456-426614174000"
    };
    
    setAccessToken("fake-jwt-token-for-demo");
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#050505'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)', zIndex: 0,
        animation: 'float 10s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(255,51,102,0.1) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)', zIndex: 0,
        animation: 'float 15s ease-in-out infinite reverse'
      }} />

      {/* Main Glass Container */}
      <div className="glass-panel animate-fade-up" style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        minHeight: '700px',
        margin: '2rem',
        padding: '0',
        zIndex: 1,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
        position: 'relative'
      }}>
        
        {/* Left Side - Brand & Graphics */}
        <div style={{ 
          flex: '1', 
          position: 'relative',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(20,20,25,0.8), rgba(10,10,12,0.9))',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }} className="desktop-only-flex">
          
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '4rem' }}>
              <img src="/ntanda-logo.jpeg" alt="Ntanda LMS" style={{ height: '50px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }} />
            </Link>
            
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              background: 'linear-gradient(to right, #fff, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              Master Your <br/>
              <span style={{ 
                background: 'linear-gradient(to right, #00e5ff, #0088ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Craft Today.</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              maxWidth: '85%',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Join the next generation of digital pioneers. Access world-class courses, live mentorship, and real-world projects.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              width: '48px', height: '48px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#00e5ff'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>Secure Enterprise LMS</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bank-grade encryption & data privacy.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{ 
          flex: '1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '4rem',
          background: 'rgba(10,12,16,0.5)'
        }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(0,229,255,0.1)', color: '#00e5ff', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                <Sparkles size={16} /> Welcome Back
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Sign in.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Enter your credentials to access your portal.</p>
            </div>
            
            {error && (
              <div className="animate-slide-in-right" style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                borderLeft: '4px solid #ef4444', 
                color: '#fca5a5', 
                padding: '1rem', 
                borderRadius: '0 8px 8px 0', 
                marginBottom: '2rem', 
                fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>Password</label>
                  <a href="#" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '500', textDecoration: 'none' }}>Forgot password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, var(--primary), #0088ff)',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 25px -5px rgba(0,229,255,0.4)',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1
              }}>
                {isLoading ? 'Authenticating...' : 'Sign In'} 
                {!isLoading && <ArrowRight size={18} />}
              </button>
              
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Or quick access for testing:</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => handleDemoLogin('STUDENT')} style={{
                    flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}>Demo Student</button>
                  <button type="button" onClick={() => handleDemoLogin('ADMIN')} style={{
                    flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}>Demo Admin</button>
                </div>
              </div>

              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/register" style={{ color: '#fff', fontWeight: '500', textDecoration: 'none', borderBottom: '1px solid var(--primary)' }}>Create one</Link>
              </p>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

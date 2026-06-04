import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, setAccessToken } from '../services/api';

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
      
      navigate('/dashboard');
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
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      
      {/* Left Side - Educational Graphic */}
      <div style={{ 
        flex: '1 1 50%', 
        position: 'relative',
        background: `url('https://images.unsplash.com/photo-1531545514251-b159ce8bf590?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat`
      }} className="desktop-only-flex">
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(10,10,10,0.9), rgba(16, 185, 129, 0.2))' }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, padding: '4rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <Link to="/">
            <img src="/ntanda-logo.jpeg" alt="Ntanda LMS" style={{ height: '45px', borderRadius: '8px' }} />
          </Link>

          <div>
            <h2 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>Unlock Your <br/><span style={{ color: 'var(--primary)' }}>Potential.</span></h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '400px' }}>
              Join thousands of learners discovering new skills and building the future of Africa.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-color)' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>
          
          <Link to="/" className="mobile-only-flex" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
            <img src="/ntanda-logo.jpeg" alt="Ntanda LMS" style={{ height: '45px', borderRadius: '8px' }} />
          </Link>

          <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Please enter your details to sign in.</p>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <a href="#" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none' }}>Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1.5rem', left: '0', right: '0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>— OR FOR TESTING —</div>
              <button type="button" className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }} onClick={() => handleDemoLogin('STUDENT')}>
                Demo Student
              </button>
              <button type="button" className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }} onClick={() => handleDemoLogin('ADMIN')}>
                Demo Admin
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

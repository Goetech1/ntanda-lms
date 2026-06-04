import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    if (!minLength) return 'Password must be at least 8 characters';
    if (!hasUpper) return 'Password must contain 1 uppercase letter';
    if (!hasNumber) return 'Password must contain 1 number';
    if (!hasSpecial) return 'Password must contain 1 special character';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(name, email, password);
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: 'var(--copper-glow)' }}></div>
            Ntanda LMS
          </Link>

          <div>
            <h2 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>Shape Your <br/><span style={{ color: 'var(--primary)' }}>Future.</span></h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '400px' }}>
              Create an account today and take the first step towards mastering your craft.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-color)' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>
          
          {/* Mobile Logo */}
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: '800', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', justifyContent: 'center' }} className="mobile-only-flex">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
            Ntanda LMS
          </Link>

          <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Please enter your details to register.</p>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

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
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Min 8 chars, 1 uppercase, 1 number, 1 special char
              </small>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }} disabled={isLoading || success !== ''}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

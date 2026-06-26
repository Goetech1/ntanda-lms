import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Compass, ShieldCheck, Users, Globe2 } from 'lucide-react';
import { authService } from '../services/api';
import { useTenantBranding } from '../components/TenantBrandingProvider';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const Register = () => {
  const { tenant } = useTenantBranding();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Password strength calculation
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    setPasswordStrength(score);
  }, [password]);

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pass)) return 'Password must contain 1 uppercase letter';
    if (!/\d/.test(pass)) return 'Password must contain 1 number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return 'Password must contain 1 special character';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-[#2563EB] selection:text-white">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative z-10 min-h-screen lg:min-h-0 order-2 lg:order-1">
        <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center mb-8">
            {tenant?.branding?.logoUrl ? (
              <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-12 w-12 rounded-xl object-cover shadow-sm mb-4" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-sm mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{tenant?.name || "Ntanda LMS"}</h1>
          </div>

          <Card className="w-full bg-[#FFFFFF] shadow-[0_12px_32px_rgba(0,0,0,0.08)] rounded-[16px] border-0">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900">Create an account</CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Enter your details to start your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center font-medium animate-in shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm flex items-center font-medium animate-in slide-in-from-top-2">
                  {success}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input 
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 !bg-white border-[#D1D5DB] focus-visible:border-[#2563EB] focus-visible:ring-[4px] focus-visible:ring-[#2563EB]/15 text-slate-900 h-12"
                      disabled={isLoading || !!success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="email">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 !bg-white border-[#D1D5DB] focus-visible:border-[#2563EB] focus-visible:ring-[4px] focus-visible:ring-[#2563EB]/15 text-slate-900 h-12"
                      disabled={isLoading || !!success}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900" htmlFor="password">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input 
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 !bg-white border-[#D1D5DB] focus-visible:border-[#2563EB] focus-visible:ring-[4px] focus-visible:ring-[#2563EB]/15 text-slate-900 h-12"
                        disabled={isLoading || !!success}
                      />
                    </div>
                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                              passwordStrength >= level 
                                ? (passwordStrength <= 2 ? 'bg-amber-500' : passwordStrength === 3 ? 'bg-blue-500' : 'bg-emerald-500') 
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`pl-10 !bg-white focus-visible:ring-[4px] text-slate-900 h-12 ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/15' 
                            : 'border-[#D1D5DB] focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/15'
                        }`}
                        disabled={isLoading || !!success}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-8 bg-[#2563EB] hover:bg-[#1D4ED8] hover:scale-[1.01] transition-all text-white h-12 rounded-[10px] text-base font-semibold" 
                  isLoading={isLoading}
                  disabled={!!success}
                >
                  {success ? 'Account Created' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-slate-100 mt-2 text-center">
              <div className="text-sm text-slate-600 w-full">
                Already have an account?{' '}
                <Link to="/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-bold">
                  Sign in here
                </Link>
              </div>
              <div className="text-xs text-slate-500 w-full font-medium">
                Are you an administrator?{' '}
                <Link to="/register-institution" className="text-[#2563EB] hover:underline">
                  Onboard your school
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <footer className="mt-8 text-center text-xs text-slate-500 w-full px-4 font-medium">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </footer>
      </div>

      {/* Right Side: Hero Section */}
      <div className="w-full lg:w-1/2 relative bg-slate-900 overflow-hidden flex items-center justify-center min-h-[40vh] lg:min-h-screen order-1 lg:order-2">
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop" 
          alt="Students learning" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55))' }} />
        
        <div className="z-20 w-full max-w-xl p-8 lg:p-12 text-left animate-in fade-in duration-1000 delay-150">
          <div className="hidden lg:flex h-16 w-16 bg-[#2563EB] rounded-2xl items-center justify-center mb-8 shadow-lg">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-[36px] lg:text-[52px] font-bold text-white mb-6 leading-tight">
            Expand Your Horizons
          </h2>
          <p className="text-slate-200 text-lg lg:text-xl leading-relaxed max-w-md font-medium mb-10">
            Gain access to world-class courses, expert instructors, and a community of eager learners.
          </p>

          <div className="hidden lg:flex flex-col space-y-6">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Globe2 className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Global Platform</h4>
                <p className="text-slate-300 text-sm">Join millions of learners worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <ShieldCheck className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Secure & Private</h4>
                <p className="text-slate-300 text-sm">Enterprise-grade security standards</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Expert Community</h4>
                <p className="text-slate-300 text-sm">Learn directly from industry leaders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

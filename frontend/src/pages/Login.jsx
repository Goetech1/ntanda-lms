import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authService, setAccessToken } from '../services/api';
import { useTenantBranding } from '../components/TenantBrandingProvider';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const Login = () => {
  const { tenant } = useTenantBranding();
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
      
      if (user.role === 'SUPER_ADMIN' || user.role === 'TENANT_ADMIN' || user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row selection:bg-[#2563EB] selection:text-white">
      {/* Left Side: Form */}
      <div className="w-full md:w-[60%] lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-8 lg:p-12 relative z-10 min-h-screen md:min-h-0">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center mb-8">
            {tenant?.branding?.logoUrl ? (
              <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-12 w-12 rounded-xl object-cover shadow-sm mb-4" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-sm mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{tenant?.name || "Ntanda LMS"}</h1>
          </div>

          <Card className="w-full bg-[#FFFFFF] shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[16px] border-0">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900">Welcome back</CardTitle>
              <CardDescription className="text-slate-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-center animate-in shake font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-900" htmlFor="password">Password</label>
                    <Link to="/forgot-password" className="text-sm text-[#2563EB] hover:underline hover:text-[#1D4ED8] transition-colors font-medium">
                      Forgot password?
                    </Link>
                  </div>
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
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-12 rounded-[10px]" isLoading={isLoading}>
                  Sign in
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-slate-100 mt-2">
              <div className="text-sm text-slate-600 text-center w-full">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#2563EB] hover:underline font-semibold">
                  Request access
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <footer className="absolute bottom-6 text-center text-xs text-slate-500 w-full px-4 font-medium">
          © {new Date().getFullYear()} Ntanda LMS. Empowering education through technology.
        </footer>
      </div>

      {/* Right Side: Branding */}
      <div className="hidden md:flex md:w-[40%] lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop" 
          alt="Students learning" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45 z-10" />
        
        <div className="z-20 w-full max-w-xl p-8 lg:p-12 text-left animate-in fade-in duration-1000">
          <div className="h-16 w-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-[48px] font-bold text-white mb-6 leading-tight">
            Your Learning Journey Starts Here
          </h2>
          <p className="text-slate-200 text-xl leading-relaxed max-w-md font-medium">
            Join thousands of students and instructors in a seamless, premium learning experience powered by Ntanda LMS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

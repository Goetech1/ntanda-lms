import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTenantBranding } from '../components/TenantBrandingProvider';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const ForgotPassword = () => {
  const { tenant } = useTenantBranding();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-[var(--primary)] selection:text-white">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center mb-8">
            {tenant?.branding?.logoUrl ? (
              <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-12 w-12 rounded-xl object-cover shadow-lg mb-4" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-lg mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
              </div>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-white">{tenant?.name || "Ntanda LMS"}</h1>
          </div>

          <Card className="w-full shadow-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-2xl">Reset password</CardTitle>
              <CardDescription>
                Enter your email address and we will send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in zoom-in-95 duration-300">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-white mb-1">Check your email</h3>
                    <p className="text-sm text-slate-600">
                      We sent a recovery link to <span className="text-white font-medium">{email}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="name@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                    Send reset link
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-slate-200/60 mt-2">
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-[var(--primary)] transition-colors w-full"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <footer className="absolute bottom-6 text-center text-xs text-slate-500 w-full px-4">
          © {new Date().getFullYear()} Ntanda LMS. Empowering education through technology.
        </footer>
      </div>

      {/* Right Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-white overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 to-[var(--primary)]/30 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=2000&auto=format&fit=crop" 
          alt="Security and Recovery" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[20%]"
        />
        <div className="z-20 max-w-lg p-12 text-center backdrop-blur-md bg-slate-50/40 border border-slate-200/50 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-1000 delay-150">
          <div className="h-16 w-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--primary)]/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Secure Account Recovery</h2>
          <p className="text-slate-700 text-lg leading-relaxed">
            Get back into your account quickly and securely to continue your learning journey without missing a beat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

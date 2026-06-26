import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Compass, ShieldCheck, Users, Globe2, Building } from 'lucide-react';
import { authService } from '../services/api';
import { useTenantBranding } from '../components/TenantBrandingProvider';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { PasswordInput } from '../components/ui/PasswordInput';
import { SuccessScreen } from '../components/ui/SuccessScreen';
import { useFormValidation } from '../hooks/useFormValidation';

const Register = () => {
  const { tenant } = useTenantBranding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState('');
  
  const submittingRef = useRef(false);
  const navigate = useNavigate();

  const {
    values,
    getFieldError,
    getFieldProps,
    validateAll,
    setServerErrors
  } = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      name: { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } },
      email: { required: 'Email address is required', email: true },
      password: { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } },
      confirmPassword: { 
        required: 'Please confirm your password',
        match: { field: 'password', message: 'Passwords do not match' }
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    
    if (!validateAll()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setGlobalError('');

    try {
      // The API service splits name into firstName/lastName internally
      await authService.register(values.name, values.email, values.password);
      setIsSuccess(true);
      // Wait for success screen animation to finish, then navigate
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const response = err.response;
      if (response?.status === 409) {
        setGlobalError(response.data?.message || 'An account with this email already exists.');
      } else if (response?.status === 422) {
        setServerErrors(response.data.errors);
      } else {
        setGlobalError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ob-bg)] flex flex-col lg:flex-row selection:bg-[#2563EB] selection:text-white relative">
      
      {/* Decorative background for left side */}
      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50 opacity-40 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-50 opacity-40 blur-3xl" />
      </div>

      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative z-10 min-h-screen lg:min-h-0 order-2 lg:order-1">
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[440px]"
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-8 text-center">
                {tenant?.branding?.logoUrl ? (
                  <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-12 w-12 rounded-xl object-cover shadow-sm mb-4 bg-white p-1 border border-gray-100" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-sm mb-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
                  </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ob-text-primary)' }}>
                  Create an account
                </h1>
                <p className="text-[var(--ob-text-secondary)] mt-2">
                  Enter your details to start your learning journey
                </p>
              </div>

              <div className="bg-white rounded-[var(--ob-radius-lg)] shadow-[var(--ob-shadow-md)] p-8 border border-[var(--ob-border)] relative overflow-hidden">
                
                {globalError && (
                  <div className="mb-6 p-4 rounded-[var(--ob-radius-sm)] border border-[var(--ob-error-border)] bg-[var(--ob-error-light)] text-[var(--ob-error)] text-sm font-medium" role="alert">
                    {globalError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <FormField label="Full Name" name="name" error={getFieldError('name')} required>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <User className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
                      </div>
                      <Input 
                        id="name"
                        placeholder="Jane Doe"
                        autoComplete="name"
                        {...getFieldProps('name')}
                        className="pl-10 h-12 border-[#E2E8F0] hover:border-[#CBD5E1] focus-visible:border-[#2563EB]"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>

                  <FormField label="Email address" name="email" error={getFieldError('email')} required>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Mail className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
                      </div>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="name@university.edu"
                        autoComplete="email"
                        {...getFieldProps('email')}
                        className="pl-10 h-12 border-[#E2E8F0] hover:border-[#CBD5E1] focus-visible:border-[#2563EB]"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>
                  
                  <FormField label="Password" name="password" error={getFieldError('password')} required>
                    <PasswordInput 
                      id="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      showStrength
                      error={!!getFieldError('password')}
                      {...getFieldProps('password')}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField label="Confirm Password" name="confirmPassword" error={getFieldError('confirmPassword')} required>
                    <PasswordInput 
                      id="confirmPassword"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      error={!!getFieldError('confirmPassword')}
                      {...getFieldProps('confirmPassword')}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] hover:shadow-md transition-all text-white h-12 rounded-[10px] text-base font-semibold" 
                      isLoading={isSubmitting}
                    >
                      Create Account
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--ob-border)] text-center space-y-3">
                  <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors">
                      Sign in here
                    </Link>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-center items-center gap-1.5">
                    <Building className="h-3.5 w-3.5" />
                    Are you an administrator?{' '}
                    <Link to="/register-institution" className="text-[#2563EB] hover:underline font-medium">
                      Onboard your school
                    </Link>
                  </div>
                </div>
              </div>
              
              <footer className="mt-8 text-center text-xs text-gray-400 font-medium max-w-xs mx-auto">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </footer>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              className="w-full max-w-[440px] bg-white rounded-[var(--ob-radius-lg)] shadow-[var(--ob-shadow-md)] border border-[var(--ob-border)] p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SuccessScreen
                heading="Account Created!"
                description="Your account has been successfully created. Redirecting you to login..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side: Hero Section */}
      <div className="w-full lg:w-1/2 relative bg-[#0B0F19] overflow-hidden flex flex-col justify-center min-h-[40vh] lg:min-h-screen order-1 lg:order-2">
        {/* Abstract shapes replacing external image */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
        
        <div className="z-20 w-full max-w-xl p-8 lg:p-16 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="hidden lg:flex h-16 w-16 bg-white/10 rounded-2xl items-center justify-center mb-8 backdrop-blur-md border border-white/10">
              <Compass className="h-8 w-8 text-blue-400" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.15] font-['Outfit']">
              Expand Your<br/>Horizons
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md font-medium mb-12">
              Gain access to world-class courses, expert instructors, and a community of eager learners.
            </p>

            <div className="hidden lg:grid grid-cols-1 gap-8">
              {[
                { icon: Globe2, title: 'Global Platform', desc: 'Join millions of learners worldwide' },
                { icon: ShieldCheck, title: 'Secure & Private', desc: 'Enterprise-grade security standards' },
                { icon: Users, title: 'Expert Community', desc: 'Learn directly from industry leaders' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-5 group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                >
                  <div className="bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white mb-0.5">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Globe, CreditCard, User, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';
import { useTenantBranding } from '../components/TenantBrandingProvider';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const RegisterInstitution = () => {
  const { tenant } = useTenantBranding();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institutionName: '',
    subdomain: '',
    domain: '',
    institutionEmail: '',
    phone: '',
    address: '',
    institutionType: 'university',
    websiteUrl: '',
    subscriptionPackage: 'BASIC',
    logoUrl: '',
    adminFullName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSubdomain = (sub) => {
    return /^[a-z0-9\-]+$/.test(sub);
  };

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pass)) return 'Password must contain 1 uppercase letter';
    if (!/[0-9]/.test(pass)) return 'Password must contain 1 number';
    if (!/[^a-zA-Z0-9]/.test(pass)) return 'Password must contain 1 special character';
    return null;
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.institutionName || !formData.institutionEmail || !formData.phone) {
        setError('Please fill in all required fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.subdomain) {
        setError('Subdomain is required.');
        return;
      }
      if (!validateSubdomain(formData.subdomain)) {
        setError('Subdomain must be lowercase alphanumeric and dashes only.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.registerInstitution({
        institutionName: formData.institutionName,
        subdomain: formData.subdomain,
        domain: formData.domain,
        institutionEmail: formData.institutionEmail,
        phone: formData.phone,
        address: formData.address,
        institutionType: formData.institutionType,
        websiteUrl: formData.websiteUrl,
        subscriptionPackage: formData.subscriptionPackage,
        logoUrl: formData.logoUrl,
        adminFullName: formData.adminFullName,
        adminEmail: formData.adminEmail,
        password: formData.password,
      });

      setSuccess('Institution registered successfully! Redirecting you to your portal...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Institution onboarding failed. Subdomain may already be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-[var(--primary)] selection:text-white">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-12 relative z-10">
        <div className="w-full max-w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-lg mb-4 flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Onboard Your School</h1>
            <p className="text-slate-600 mt-2 text-center">Create your branded learning environment in minutes</p>
          </div>

          <Card className="w-full shadow-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex w-full h-1 bg-slate-100">
            <div 
              className="h-full bg-[var(--primary)] transition-all duration-500 ease-out" 
              style={{ width: `${(step / 4) * 100}%` }} 
            />
          </div>

          <CardHeader className="bg-white/50 pb-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {step === 1 && 'Institution Profile'}
                  {step === 2 && 'Portal Settings'}
                  {step === 3 && 'Subscription Package'}
                  {step === 4 && 'Admin Credentials'}
                </CardTitle>
                <CardDescription className="mt-1">
                  Step {step} of 4
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-[var(--primary)] ring-4 ring-[var(--primary)]/20' : i < step ? 'bg-[var(--primary)]/50' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center animate-in shake">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-emerald-400 font-medium">Success!</h4>
                  <p className="text-emerald-500/80 text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
              
              {/* STEP 1: Profile */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Institution Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-slate-500" />
                      </div>
                      <Input 
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        placeholder="e.g. Paclent Institute of Tech"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                      <Input 
                        type="email"
                        name="institutionEmail"
                        value={formData.institutionEmail}
                        onChange={handleInputChange}
                        placeholder="contact@institution.edu"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Contact Phone <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+260 971 234 567"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Institution Type</label>
                      <select
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleInputChange}
                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white/50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-transparent"
                      >
                        <option value="school">Primary/Secondary School</option>
                        <option value="college">College</option>
                        <option value="university">University</option>
                        <option value="academy">Academy / Training Center</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Portal */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Preferred Subdomain <span className="text-red-400">*</span></label>
                    <div className="flex rounded-lg shadow-sm">
                      <div className="relative flex-grow focus-within:z-10">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          type="text"
                          name="subdomain"
                          value={formData.subdomain}
                          onChange={handleInputChange}
                          placeholder="e.g. my-school"
                          className="flex h-11 w-full rounded-none rounded-l-lg border border-slate-300 border-r-0 bg-white/50 pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        />
                      </div>
                      <span className="inline-flex items-center rounded-r-lg border border-slate-300 border-l-0 bg-slate-100 px-3 text-sm text-slate-600">
                        .{window.location.hostname.replace(/^www\./, '')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Lowercase letters, numbers, and hyphens only.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Custom Domain (Optional)</label>
                    <Input 
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      placeholder="e.g. elearning.myschool.edu"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Logo URL (Optional)</label>
                    <Input 
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                      placeholder="https://myschool.edu/logo.png"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Billing */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'BASIC', name: 'Basic', price: '$29/mo', desc: 'Up to 500 students' },
                      { id: 'PREMIUM', name: 'Premium', price: '$79/mo', desc: 'Up to 5000 students' },
                      { id: 'ENTERPRISE', name: 'Enterprise', price: 'Custom', desc: 'Unlimited scalability' }
                    ].map((pkg) => (
                      <div 
                        key={pkg.id}
                        onClick={() => setFormData((prev) => ({ ...prev, subscriptionPackage: pkg.id }))}
                        className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                          formData.subscriptionPackage === pkg.id 
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]' 
                            : 'border-slate-200 bg-white/30 hover:border-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        {formData.subscriptionPackage === pkg.id && (
                          <div className="absolute -top-2 -right-2 h-5 w-5 bg-[var(--primary)] rounded-full flex items-center justify-center animate-in zoom-in">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <h3 className={`font-semibold text-sm ${formData.subscriptionPackage === pkg.id ? 'text-[var(--primary)]' : 'text-slate-800'}`}>{pkg.name}</h3>
                        <div className="mt-2 text-lg font-bold text-white">{pkg.price}</div>
                        <div className="mt-1 text-xs text-slate-600">{pkg.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20 p-4">
                    <div className="flex items-center gap-2 text-[var(--primary)] font-medium mb-2">
                      <CreditCard className="h-5 w-5" />
                      <h4>Flexible Payment Methods</h4>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Ntanda LMS supports mobile money, bank transfers, and standard card processing. 
                      Your subscription activates upon manual verification of your chosen transaction method.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: Admin */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Administrator Full Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <Input 
                        name="adminFullName"
                        value={formData.adminFullName}
                        onChange={handleInputChange}
                        placeholder="Dr. John Banda"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Admin Login Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                      <Input 
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        placeholder="admin@institution.edu"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input 
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Confirm Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input 
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                {step > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="flex-1"
                    disabled={isLoading || !!success}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-1"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="flex-1"
                    isLoading={isLoading}
                    disabled={!!success}
                  >
                    {success ? 'Registered!' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an institution portal?{' '}
            <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      </div>
      
      {/* Right Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-white overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/80 to-[var(--primary)]/30 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop" 
          alt="University Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[20%]"
        />
        <div className="z-20 max-w-lg p-12 text-center backdrop-blur-md bg-slate-50/40 border border-slate-200/50 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-1000 delay-150">
          <div className="h-16 w-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--primary)]/20">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Digital Transformation</h2>
          <p className="text-slate-700 text-lg leading-relaxed">
            Bring your entire institution online with a fully branded, scalable, and intuitive learning management system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstitution;

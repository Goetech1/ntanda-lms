import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Mail, Globe, ArrowLeft, ArrowRight, CheckSquare, Edit3 } from 'lucide-react';
import { authService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { PasswordInput } from '../components/ui/PasswordInput';
import { StepIndicator } from '../components/ui/StepIndicator';
import { SuccessScreen } from '../components/ui/SuccessScreen';
import { useFormValidation } from '../hooks/useFormValidation';

const STEPS = [
  { label: 'Institution' },
  { label: 'Admin Account' },
  { label: 'Review' },
];

const RegisterInstitution = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
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
    validateField,
    setServerErrors,
    hasErrors,
    setFieldTouched
  } = useFormValidation(
    {
      institutionName: '',
      subdomain: '',
      institutionType: 'University',
      websiteUrl: '',
      adminFullName: '',
      adminEmail: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    {
      institutionName: { required: 'Institution name is required' },
      subdomain: { 
        required: 'Subdomain is required', 
        pattern: { value: /^[a-z0-9][a-z0-9-]*$/, message: 'Only lowercase letters, numbers, and hyphens allowed' }
      },
      adminFullName: { required: 'Admin full name is required' },
      adminEmail: { required: 'Admin email is required', email: true },
      password: { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } },
      confirmPassword: { 
        required: 'Please confirm your password',
        match: { field: 'password', message: 'Passwords do not match' }
      },
      termsAccepted: {
        custom: (val) => val === true ? null : 'You must accept the terms to continue'
      }
    }
  );

  const handleNext = () => {
    // Validate current step fields
    let fieldsToValidate = [];
    if (currentStep === 0) {
      fieldsToValidate = ['institutionName', 'subdomain'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['adminFullName', 'adminEmail', 'password', 'confirmPassword'];
    }

    let isValid = true;
    fieldsToValidate.forEach(field => {
      setFieldTouched(field);
      const err = validateField(field);
      if (err) isValid = false;
    });

    if (isValid) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setGlobalError('');
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
    setGlobalError('');
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    
    setFieldTouched('termsAccepted');
    if (validateField('termsAccepted')) return;

    if (!validateAll()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setGlobalError('');

    try {
      await authService.registerInstitution({
        institutionName: values.institutionName,
        subdomain: values.subdomain,
        adminFullName: values.adminFullName,
        adminEmail: values.adminEmail,
        password: values.password,
        institutionType: values.institutionType,
        websiteUrl: values.websiteUrl
      });
      setIsSuccess(true);
    } catch (err) {
      const response = err.response;
      if (response?.status === 409) {
        setGlobalError(response.data?.message || 'An institution with this subdomain already exists.');
        setDirection(-1);
        setCurrentStep(0);
      } else if (response?.status === 422) {
        setServerErrors(response.data.errors);
        setGlobalError('Please fix the validation errors before continuing.');
      } else {
        setGlobalError('Unable to connect. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--ob-bg)' }}>
        <div className="w-full max-w-md bg-white rounded-[var(--ob-radius-lg)] shadow-[var(--ob-shadow-lg)] p-8">
          <SuccessScreen
            heading="Your institution is ready!"
            description={
              <span>
                Your learning platform has been successfully created at<br/>
                <strong className="text-blue-600">https://{values.subdomain}.ntandaapp.com</strong>
              </span>
            }
            ctaLabel="Go to Admin Dashboard"
            onCtaClick={() => navigate('/admin')}
            secondaryCtaLabel="Back to Home"
            onSecondaryCtaClick={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--ob-bg)' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100 opacity-50 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-violet-100 opacity-50 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-sm mb-4 flex items-center justify-center">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ob-text-primary)' }}>Onboard your Institution</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ob-text-secondary)' }}>Set up your workspace in minutes.</p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-[var(--ob-radius-lg)] shadow-[var(--ob-shadow-md)] overflow-hidden border border-[var(--ob-border)]">
          <div className="px-6 py-6 border-b border-[var(--ob-border)] bg-gray-50/50">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>

          <div className="p-6 sm:p-8">
            {globalError && (
              <div className="mb-6 p-4 rounded-[var(--ob-radius-sm)] border border-[var(--ob-error-border)] bg-[var(--ob-error-light)] text-[var(--ob-error)] text-sm font-medium" role="alert">
                {globalError}
              </div>
            )}

            <div className="relative min-h-[380px] overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full"
                >
                  {/* STEP 1: Institution Details */}
                  {currentStep === 0 && (
                    <fieldset className="space-y-5">
                      <legend className="sr-only">Institution Details</legend>
                      
                      <FormField label="Institution Name" name="institutionName" error={getFieldError('institutionName')} required>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Building2 className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
                          </div>
                          <Input
                            {...getFieldProps('institutionName')}
                            placeholder="e.g. Acme University"
                            className="pl-10 h-12"
                            autoFocus
                          />
                        </div>
                      </FormField>

                      <FormField 
                        label="Subdomain" 
                        name="subdomain" 
                        error={getFieldError('subdomain')} 
                        required
                        helperText="This will be your dedicated login URL."
                      >
                        <div className="flex">
                          <Input
                            {...getFieldProps('subdomain')}
                            placeholder="my-school"
                            className="h-12 rounded-r-none border-r-0 text-right focus-visible:z-10"
                            onChange={(e) => getFieldProps('subdomain').onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          />
                          <div className="h-12 flex items-center px-4 bg-gray-50 border border-l-0 border-[var(--ob-border)] rounded-r-md text-sm whitespace-nowrap text-gray-500 select-none">
                            .ntandaapp.com
                          </div>
                        </div>
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="Institution Type" name="institutionType" error={getFieldError('institutionType')}>
                          <select
                            {...getFieldProps('institutionType')}
                            className="flex h-12 w-full rounded-md border border-[var(--ob-border)] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-[var(--ob-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--ob-focus-ring)]"
                            style={{ color: 'var(--ob-text-primary)' }}
                          >
                            <option value="University">University</option>
                            <option value="K-12 School">K-12 School</option>
                            <option value="Corporate Training">Corporate Training</option>
                            <option value="Non-Profit">Non-Profit</option>
                            <option value="Other">Other</option>
                          </select>
                        </FormField>

                        <FormField label="Website URL (Optional)" name="websiteUrl" error={getFieldError('websiteUrl')}>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                              <Globe className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
                            </div>
                            <Input
                              {...getFieldProps('websiteUrl')}
                              placeholder="https://example.com"
                              className="pl-10 h-12"
                              type="url"
                            />
                          </div>
                        </FormField>
                      </div>
                    </fieldset>
                  )}

                  {/* STEP 2: Admin Account */}
                  {currentStep === 1 && (
                    <fieldset className="space-y-5">
                      <legend className="sr-only">Admin Account</legend>
                      
                      <FormField label="Admin Full Name" name="adminFullName" error={getFieldError('adminFullName')} required>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <User className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
                          </div>
                          <Input
                            {...getFieldProps('adminFullName')}
                            placeholder="Jane Doe"
                            className="pl-10 h-12"
                            autoFocus
                          />
                        </div>
                      </FormField>

                      <FormField label="Admin Email" name="adminEmail" error={getFieldError('adminEmail')} required>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Mail className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
                          </div>
                          <Input
                            {...getFieldProps('adminEmail')}
                            placeholder="jane@university.edu"
                            type="email"
                            className="pl-10 h-12"
                          />
                        </div>
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="Password" name="password" error={getFieldError('password')} required>
                          <PasswordInput
                            {...getFieldProps('password')}
                            showStrength
                            error={!!getFieldError('password')}
                            id="password"
                          />
                        </FormField>

                        <FormField label="Confirm Password" name="confirmPassword" error={getFieldError('confirmPassword')} required>
                          <PasswordInput
                            {...getFieldProps('confirmPassword')}
                            error={!!getFieldError('confirmPassword')}
                            id="confirmPassword"
                          />
                        </FormField>
                      </div>
                    </fieldset>
                  )}

                  {/* STEP 3: Review */}
                  {currentStep === 2 && (
                    <fieldset className="space-y-6">
                      <legend className="sr-only">Review and Submit</legend>
                      
                      <div className="bg-gray-50 rounded-xl p-5 border border-[var(--ob-border)]">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-900">Institution Details</h3>
                          <button onClick={() => { setDirection(-1); setCurrentStep(0); }} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium transition-colors">
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                          <div>
                            <dt className="text-gray-500 mb-1">Name</dt>
                            <dd className="font-medium text-gray-900">{values.institutionName || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 mb-1">URL</dt>
                            <dd className="font-medium text-blue-600 break-all">{values.subdomain ? `${values.subdomain}.ntandaapp.com` : '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 mb-1">Type</dt>
                            <dd className="font-medium text-gray-900">{values.institutionType}</dd>
                          </div>
                        </dl>

                        <div className="h-px bg-[var(--ob-border)] my-5" />

                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-900">Admin Account</h3>
                          <button onClick={() => { setDirection(-1); setCurrentStep(1); }} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium transition-colors">
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                          <div>
                            <dt className="text-gray-500 mb-1">Full Name</dt>
                            <dd className="font-medium text-gray-900">{values.adminFullName || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 mb-1">Email</dt>
                            <dd className="font-medium text-gray-900 break-all">{values.adminEmail || '-'}</dd>
                          </div>
                        </dl>
                      </div>

                      <FormField 
                        label="" 
                        name="termsAccepted" 
                        error={getFieldError('termsAccepted')}
                      >
                        <div className="flex items-start gap-3 p-1">
                          <div className="flex items-center h-5 mt-0.5">
                            <input
                              id="terms"
                              type="checkbox"
                              checked={values.termsAccepted}
                              onChange={(e) => getFieldProps('termsAccepted').onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                          </div>
                          <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                          </label>
                        </div>
                      </FormField>

                    </fieldset>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Actions */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-[var(--ob-border)]">
              {currentStep > 0 ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="font-medium text-gray-600 hover:bg-gray-100 h-11 px-5"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Link to="/register" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 hover:bg-gray-100 rounded-md">
                  Student sign up?
                </Link>
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11 px-6 rounded-[8px] font-semibold transition-all shadow-sm ml-auto"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11 px-8 rounded-[8px] font-semibold transition-all shadow-sm ml-auto"
                >
                  Create Institution
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm" style={{ color: 'var(--ob-text-muted)' }}>
          Already have an institution? <Link to="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstitution;

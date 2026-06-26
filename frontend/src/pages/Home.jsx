import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenantBranding } from '../components/TenantBrandingProvider';

const Home = () => {
  const { tenant } = useTenantBranding();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Top Utility Bar - Optional SaaS Bar */}
      <div className="bg-purple-900 text-white py-2 px-4 md:px-8 text-xs font-medium flex justify-between items-center z-50 relative">
        <div className="flex gap-4">
          <span className="hidden sm:inline opacity-90">🚀 Launch your branded LMS platform in minutes.</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="hover:underline opacity-90 hover:opacity-100 transition-opacity">Client Login</Link>
          <span className="opacity-40">|</span>
          <a href="#demo" className="hover:underline opacity-90 hover:opacity-100 transition-opacity font-bold text-white">Book a Demo</a>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center px-4 md:px-8 h-20 max-w-7xl mx-auto">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl text-blue-950 tracking-tight leading-none">
                Ntanda
              </span>
              <span className="text-[9px] tracking-widest font-bold text-purple-600 uppercase mt-1 leading-none">
                Enterprise LMS
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 font-medium hover:text-purple-700 transition-colors duration-200">Solutions</a>
            <a href="#audience" className="text-gray-600 font-medium hover:text-purple-700 transition-colors duration-200">Use Cases</a>
            <a href="#pricing" className="text-gray-600 font-medium hover:text-purple-700 transition-colors duration-200">Pricing</a>
            <a href="#resources" className="text-gray-600 font-medium hover:text-purple-700 transition-colors duration-200">Resources</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-blue-950 font-medium hover:text-purple-700 px-4 py-2 transition-all duration-200">
              Sign In
            </Link>
            <Link to="/register-institution" className="bg-purple-700 text-white hover:bg-purple-800 font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-purple-200">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-blue-950"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2 hover:text-purple-700 border-b border-gray-50">Solutions</a>
            <a href="#audience" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2 hover:text-purple-700 border-b border-gray-50">Use Cases</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2 hover:text-purple-700 border-b border-gray-50">Pricing</a>
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center border-2 border-blue-950 text-blue-950 font-bold py-2 rounded-lg">Sign In</Link>
              <Link to="/register-institution" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-purple-700 text-white font-bold py-2 rounded-lg">Start Free Trial</Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center bg-blue-950 overflow-hidden pt-10 pb-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/95 to-purple-900/60 z-10"></div>
            <img 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
              alt="Modern university dashboard background" 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2070"
            />
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-20 max-w-7xl">
            <div className="max-w-2xl text-white">
              <div className="inline-block bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                <span className="text-purple-200 text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Ntanda LMS v2.0 is Live
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                The Ultimate White-Label LMS for Modern Institutions.
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                Launch your fully branded learning platform in minutes. Built for universities, corporate training, and online academies that demand excellence and scalability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/register-institution" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-full text-center transition-all shadow-lg shadow-purple-900/50 flex justify-center items-center gap-2">
                  Start Free Trial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <a href="#demo" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-full text-center transition-all flex justify-center items-center">
                  Book a Demo
                </a>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium text-blue-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-blue-950" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <p>Trusted by 50+ Institutions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-blue-50 py-8 border-b border-blue-100 relative -mt-6 z-30 mx-4 md:mx-8 rounded-2xl shadow-xl max-w-7xl lg:mx-auto">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-blue-200/50">
              
              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-950">Multi-Tenant Architecture</h4>
                  <p className="text-sm text-gray-500">Isolated, secure environments for every client.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-950">100% White-Labeled</h4>
                  <p className="text-sm text-gray-500">Your logo, your domain, your brand colors.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-950">Enterprise Security</h4>
                  <p className="text-sm text-gray-500">Bank-level encryption and data privacy.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Target Audience / "Who is it for" */}
        <section id="audience" className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-extrabold text-blue-950 mb-4">Built for Every Educational Need</h2>
                <p className="text-gray-600 text-lg">Whether you're training employees or running a full university, Ntanda adapts to your organizational structure.</p>
              </div>
              <Link to="/features" className="text-purple-600 font-bold flex items-center gap-2 hover:text-purple-800 transition-colors mt-4 md:mt-0">
                Explore all features <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-3">For Universities</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Manage thousands of students, multiple faculties, advanced grading, and automated certifications all in one central hub.</p>
                <Link to="/register-institution" className="text-blue-600 font-semibold group-hover:text-blue-800 flex items-center gap-1">
                  Learn More <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-3">Corporate Academies</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Streamline employee onboarding, compliance training, and professional development with detailed progress tracking.</p>
                <Link to="/register-institution" className="text-purple-600 font-semibold group-hover:text-purple-800 flex items-center gap-1">
                  Learn More <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-3">Course Creators</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">Monetize your expertise. Build beautiful courses and accept payments globally or locally via Mobile Money integration.</p>
                <Link to="/register-institution" className="text-blue-600 font-semibold group-hover:text-blue-800 flex items-center gap-1">
                  Learn More <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Experience / Platform Capabilities */}
        <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Image Collage */}
              <div className="relative">
                <div className="absolute -inset-4 bg-purple-200/50 rounded-full blur-3xl -z-10"></div>
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Students" className="rounded-2xl shadow-lg mt-8" />
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Collaboration" className="rounded-2xl shadow-lg mb-8" />
                </div>
                {/* Floating Stat Card */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">System Uptime</p>
                      <p className="text-2xl font-extrabold text-blue-950">99.9%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 mb-6 leading-tight">
                  Powerful Tools to Scale Your Education Business!
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Ntanda provides an engaging, instructor-led and self-paced content delivery system for people everywhere, without the hassle of managing infrastructure.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-950 mb-1">Automated Workflows</h4>
                      <p className="text-gray-600">Automate enrollments, payments, grading, and certificate generation so you can focus on teaching.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-950 mb-1">Advanced Analytics</h4>
                      <p className="text-gray-600">Track student engagement, revenue metrics, and course completion rates from an intuitive dashboard.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Link to="/register-institution" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-md">
                    Explore Platform Capabilities &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Strip */}
        <section className="bg-purple-800 text-white py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-around items-center text-center gap-8">
              <div>
                <p className="text-5xl font-extrabold text-purple-200 mb-2">1M+</p>
                <p className="text-lg font-medium text-purple-100">Active Learners</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-purple-600"></div>
              <div>
                <p className="text-5xl font-extrabold text-purple-200 mb-2">5,000+</p>
                <p className="text-lg font-medium text-purple-100">Courses Published</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-purple-600"></div>
              <div>
                <p className="text-5xl font-extrabold text-purple-200 mb-2">100%</p>
                <p className="text-lg font-medium text-purple-100">Custom Branding</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations / Pricing CTA */}
        <section id="pricing" className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
            <h2 className="text-4xl font-extrabold text-blue-950 mb-6">Seamless Integrations & Simple Pricing</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Connect your favorite tools. From Zoom to Stripe and local Mobile Money, Ntanda fits right into your existing workflow.</p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-16 opacity-70">
              {/* Fake Logos for Integrations */}
              <div className="px-6 py-3 border border-gray-200 rounded-lg font-bold text-gray-500 flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full"></div> Zoom</div>
              <div className="px-6 py-3 border border-gray-200 rounded-lg font-bold text-gray-500 flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded"></div> Stripe</div>
              <div className="px-6 py-3 border border-gray-200 rounded-lg font-bold text-gray-500 flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded-full"></div> Mobile Money</div>
              <div className="px-6 py-3 border border-gray-200 rounded-lg font-bold text-gray-500 flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm transform rotate-45"></div> LTI 1.3</div>
            </div>

            <div className="bg-blue-50 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <h3 className="text-3xl font-bold text-blue-950 mb-4">Start your SaaS journey today</h3>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">Join dozens of institutions that have upgraded their digital learning infrastructure with Ntanda.</p>
              <Link to="/register-institution" className="inline-block bg-blue-950 hover:bg-blue-900 text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl shadow-blue-900/30 transition-transform hover:scale-105">
                Create Your Tenant Instance
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white pt-20 pb-10 border-t-4 border-purple-600">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white font-bold shadow-md">
                  N
                </div>
                <span className="font-extrabold text-2xl text-white tracking-tight">
                  Ntanda SaaS
                </span>
              </div>
              <p className="text-blue-200 mb-6 max-w-sm leading-relaxed">
                The ultimate white-label Learning Management System empowering educators and organizations globally.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Solutions</h4>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">For Universities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Corporate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Creators</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-blue-900 text-center text-blue-300 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 Ntanda LMS SaaS. All rights reserved.</p>
            <p className="flex items-center gap-1">Designed with <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> for global educators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

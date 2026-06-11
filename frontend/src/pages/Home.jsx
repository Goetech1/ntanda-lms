import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenantBranding } from '../components/TenantBrandingProvider';

const Home = () => {
  const { tenant } = useTenantBranding();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="academic-theme min-h-screen bg-[#FAF9F6] text-[#1E1E1E] selection:bg-[#A51C30] selection:text-white">
      {/* Top Utility Bar */}
      <div className="bg-[#A51C30] text-white py-2 px-margin-mobile md:px-margin-desktop text-xs font-medium border-b border-white/10 flex justify-between items-center z-50 relative">
        <div className="flex gap-md">
          <span className="hidden sm:inline opacity-90">Official Learning Platform for Zambian Institutions</span>
        </div>
        <div className="flex gap-lg items-center">
          <Link to="/login" className="hover:underline opacity-90 hover:opacity-100 transition-opacity">Student Portal</Link>
          <span className="opacity-40">|</span>
          <Link to="/register" className="hover:underline opacity-90 hover:opacity-100 transition-opacity font-bold text-[#D4AF37]">Apply Now</Link>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 w-full z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#A51C30]/20 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-24 max-w-7xl mx-auto">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-md">
            <img 
              src={tenant?.branding?.logoUrl || "/ntanda-logo.jpeg"} 
              alt={tenant?.name || "Ntanda LMS"} 
              className="h-12 w-12 rounded-none border border-[#A51C30] object-cover" 
            />
            <div className="flex flex-col">
              <span className="font-serif-academic text-2xl md:text-3xl font-extrabold text-[#A51C30] tracking-tight leading-none">
                {tenant?.name || "Ntanda"}
              </span>
              <span className="text-[10px] tracking-[0.2em] font-sans font-bold text-[#C49A45] uppercase mt-1 leading-none">
                {tenant ? "Institutional Portal" : "Learning Management System"}
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-xl">
            <Link to="/courses" className="text-[#1E1E1E] font-serif-academic font-medium hover:text-[#A51C30] transition-colors duration-200 text-lg">
              Browse Programs
            </Link>
            <Link to="/courses" className="text-[#1E1E1E] font-serif-academic font-medium hover:text-[#A51C30] transition-colors duration-200 text-lg">
              Schools &amp; Faculty
            </Link>
            <Link to="/courses" className="text-[#1E1E1E] font-serif-academic font-medium hover:text-[#A51C30] transition-colors duration-200 text-lg">
              Research &amp; Innovation
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-md">
            <Link to="/login" className="text-[#A51C30] border border-[#A51C30] hover:bg-[#A51C30] hover:text-white font-serif-academic font-bold px-lg py-sm transition-all duration-200 text-base">
              Sign In
            </Link>
            <Link to="/register" className="bg-[#A51C30] text-white hover:bg-[#801424] font-serif-academic font-bold px-lg py-sm transition-all duration-200 text-base shadow-sm border border-[#A51C30]">
              Register
            </Link>
          </div>

          {/* Mobile Navigation Menu Button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-12 h-12 flex items-center justify-center border border-[#A51C30]/30 hover:bg-[#A51C30]/5 text-[#A51C30] transition-all"
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#A51C30]/20 bg-[#FAF9F6] px-margin-mobile py-lg flex flex-col gap-md shadow-lg animate-fade-up">
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1E1E1E] font-serif-academic text-lg py-xs hover:text-[#A51C30] border-b border-neutral-200 pb-2">Browse Programs</Link>
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1E1E1E] font-serif-academic text-lg py-xs hover:text-[#A51C30] border-b border-neutral-200 pb-2">Schools &amp; Faculty</Link>
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1E1E1E] font-serif-academic text-lg py-xs hover:text-[#A51C30] border-b border-neutral-200 pb-2">Research</Link>
            <div className="flex gap-sm mt-md">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center border border-[#A51C30] text-[#A51C30] font-serif-academic font-bold py-sm hover:bg-[#A51C30]/5">Sign In</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center bg-[#A51C30] text-white font-serif-academic font-bold py-sm hover:bg-[#801424]">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[550px] md:min-h-[700px] flex items-center bg-[#1E1E1E] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              className="w-full h-full object-cover" 
              alt="A focused Zambian university student working in a library" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkLnompLl2jscFPOGzyhfFfw82-qcR0ZXnB1U-oAenfhxqbneKs-aUN9hHMDhoV4YpxmooRqMrPRr1qvGB9l5ZbyofbHgPnvv01WjMAYdx_IgzT0x4_D3pFjODkULPl7Udtk1geocjgqoWS4cQzrvWpa6k8nIjDOSQPAXV54zZeoCophWp8dirU4MK1_-SvFSNGA4avimdTMmuh8ysW3g-KXbmTC2GudUYs0TmvH3dGIy18ZEFuJnyuS91GXvNoTCwT55i2j31W_Y"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/80 to-transparent"></div>
          </div>
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 py-xl max-w-7xl">
            <div className="max-w-3xl bg-[#FAF9F6] border-t-8 border-[#A51C30] p-lg md:p-2xl shadow-2xl relative">
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#C49A45]">EXCELLENCE IN EDUCATION</span>
              <h1 className="font-serif-academic text-4xl md:text-6xl font-extrabold text-[#1E1E1E] mt-md mb-md leading-tight">
                Educating Leaders Who Shape the Future of Zambia.
              </h1>
              <p className="font-sans text-lg text-[#4A4A4A] mb-xl leading-relaxed">
                Empowering the next generation with world-class, multi-tenant learning spaces built for modern schools, business academies, and government institutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-md">
                <Link to="/register" className="bg-[#A51C30] hover:bg-[#801424] text-white font-serif-academic font-bold px-xl py-md text-center transition-colors duration-200">
                  Apply Online
                </Link>
                <Link to="/courses" className="border border-[#A51C30] text-[#A51C30] hover:bg-[#A51C30]/5 font-serif-academic font-bold px-xl py-md text-center transition-colors duration-200">
                  Explore Schools &amp; Programs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Harvard-Style Spotlight Banner */}
        <section className="bg-[#FAF9F6] py-20 border-b border-[#A51C30]/10">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
              <div className="lg:col-span-5 flex flex-col justify-center border-l-4 border-[#A51C30] pl-lg">
                <h2 className="font-serif-academic text-3xl md:text-5xl font-extrabold text-[#1E1E1E] mb-md leading-tight">
                  Academic Spotlight
                </h2>
                <p className="text-lg text-[#4A4A4A] leading-relaxed mb-lg">
                  Designed specifically for the African context, Ntanda brings world-class educational tools to institutions of all sizes. Learn anywhere with specialized data-lite architecture.
                </p>
                <Link to="/courses" className="text-[#A51C30] hover:text-[#801424] font-serif-academic font-bold text-lg flex items-center gap-sm group">
                  Learn about our learning model
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="bg-white p-lg border border-neutral-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-[#C49A45]">TECHNOLOGY</span>
                    <h3 className="font-serif-academic text-xl font-bold text-[#1E1E1E] mt-sm mb-sm">Learn Anywhere</h3>
                    <p className="text-[#4A4A4A] text-sm leading-relaxed">
                      Optimized for low-bandwidth environments. Access high-quality lectures on any mobile device, anywhere in Zambia.
                    </p>
                  </div>
                  <Link to="/courses" className="text-[#A51C30] text-sm font-bold font-serif-academic mt-lg hover:underline block">Read More &gt;</Link>
                </div>
                <div className="bg-white p-lg border border-neutral-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-[#C49A45]">ACADEMICS</span>
                    <h3 className="font-serif-academic text-xl font-bold text-[#1E1E1E] mt-sm mb-sm">Interactive Exams</h3>
                    <p className="text-[#4A4A4A] text-sm leading-relaxed">
                      Proctored exams and quizzes with instant auto-grading feedback to track your learning progress in real-time.
                    </p>
                  </div>
                  <Link to="/courses" className="text-[#A51C30] text-sm font-bold font-serif-academic mt-lg hover:underline block">Read More &gt;</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Schools / Programs */}
        <section className="py-24 bg-[#F3F1EC]">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-2xl border-b border-[#A51C30]/20 pb-md">
              <h2 className="font-serif-academic text-3xl md:text-5xl font-extrabold text-[#1E1E1E]">
                Featured Schools &amp; Programs
              </h2>
              <Link to="/courses" className="text-[#A51C30] hover:text-[#801424] font-serif-academic font-bold text-lg hover:underline mt-sm md:mt-0">
                View all faculties &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {/* Program 1 */}
              <article className="bg-white border-t-4 border-[#A51C30] shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="h-56 bg-neutral-200 overflow-hidden relative">
                  <div className="absolute top-md left-md bg-[#A51C30] text-white font-serif-academic font-bold px-sm py-[2px] text-xs uppercase">
                    School of Computer Science
                  </div>
                  <div className="h-full w-full bg-[#A51C30]/10 flex items-center justify-center text-[#A51C30]">
                    <span className="material-symbols-outlined text-6xl">code</span>
                  </div>
                </div>
                <div className="p-lg flex flex-col flex-grow">
                  <h3 className="font-serif-academic text-2xl font-bold text-[#1E1E1E] mb-xs">
                    Full-Stack Web Development
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-xl text-base">
                    Master modern web technologies from frontend to backend with hands-on projects, ready for top tech hubs.
                  </p>
                  <div className="mt-auto pt-md border-t border-neutral-100 flex justify-between items-center">
                    <span className="font-serif-academic font-bold text-[#C49A45]">$49</span>
                    <Link to="/courses" className="bg-[#A51C30] text-white hover:bg-[#801424] font-serif-academic font-bold px-lg py-xs text-sm transition-colors">
                      Enroll
                    </Link>
                  </div>
                </div>
              </article>

              {/* Program 2 */}
              <article className="bg-white border-t-4 border-[#A51C30] shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="h-56 bg-neutral-200 overflow-hidden relative">
                  <div className="absolute top-md left-md bg-[#A51C30] text-white font-serif-academic font-bold px-sm py-[2px] text-xs uppercase">
                    School of Business &amp; Marketing
                  </div>
                  <div className="h-full w-full bg-[#A51C30]/10 flex items-center justify-center text-[#A51C30]">
                    <span className="material-symbols-outlined text-6xl">campaign</span>
                  </div>
                </div>
                <div className="p-lg flex flex-col flex-grow">
                  <h3 className="font-serif-academic text-2xl font-bold text-[#1E1E1E] mb-xs">
                    Digital Marketing Foundations
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-xl text-base">
                    Learn core concepts of SEO, content strategy, and digital campaigns tailored for businesses.
                  </p>
                  <div className="mt-auto pt-md border-t border-neutral-100 flex justify-between items-center">
                    <span className="font-serif-academic font-bold text-[#C49A45]">Free</span>
                    <Link to="/courses" className="bg-[#A51C30] text-white hover:bg-[#801424] font-serif-academic font-bold px-lg py-xs text-sm transition-colors">
                      Enroll
                    </Link>
                  </div>
                </div>
              </article>

              {/* Program 3 */}
              <article className="bg-white border-t-4 border-[#A51C30] shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="h-56 bg-neutral-200 overflow-hidden relative">
                  <div className="absolute top-md left-md bg-[#A51C30] text-white font-serif-academic font-bold px-sm py-[2px] text-xs uppercase">
                    School of Engineering &amp; Data
                  </div>
                  <div className="h-full w-full bg-[#A51C30]/10 flex items-center justify-center text-[#A51C30]">
                    <span className="material-symbols-outlined text-6xl">bar_chart</span>
                  </div>
                </div>
                <div className="p-lg flex flex-col flex-grow">
                  <h3 className="font-serif-academic text-2xl font-bold text-[#1E1E1E] mb-xs">
                    Data Science with Python
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-xl text-base">
                    Comprehensive introduction to data visualization, predictive analytics, and machine learning models.
                  </p>
                  <div className="mt-auto pt-md border-t border-neutral-100 flex justify-between items-center">
                    <span className="font-serif-academic font-bold text-[#C49A45]">$79</span>
                    <Link to="/courses" className="bg-[#A51C30] text-white hover:bg-[#801424] font-serif-academic font-bold px-lg py-xs text-sm transition-colors">
                      Enroll
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Global Impact / Facts section */}
        <section className="bg-[#A51C30] text-white py-24">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl text-center">
            <h2 className="font-serif-academic text-3xl md:text-5xl font-extrabold mb-16">
              Ntanda by the Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              <div className="flex flex-col items-center">
                <span className="text-[#D4AF37] font-serif-academic text-5xl md:text-7xl font-extrabold">50+</span>
                <span className="font-sans text-sm uppercase tracking-[0.2em] mt-sm text-white/85">Active Institutions</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#D4AF37] font-serif-academic text-5xl md:text-7xl font-extrabold">10k+</span>
                <span className="font-sans text-sm uppercase tracking-[0.2em] mt-sm text-white/85">Learners Enrolled</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#D4AF37] font-serif-academic text-5xl md:text-7xl font-extrabold">98%</span>
                <span className="font-sans text-sm uppercase tracking-[0.2em] mt-sm text-white/85">Accreditation Success</span>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-24 bg-[#FAF9F6]">
          <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl">
            <h2 className="font-serif-academic text-3xl md:text-5xl font-extrabold text-center text-[#1E1E1E] mb-2xl">
              Alumni Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
              <div className="bg-white p-xl border-l-4 border-[#A51C30] shadow-sm flex flex-col justify-between">
                <p className="font-serif-academic text-lg text-[#4A4A4A] mb-xl italic leading-relaxed">
                  "Ntanda LMS provided me with the structured learning path I needed. The certificates were recognized immediately by my current employer in Lusaka."
                </p>
                <div className="flex items-center gap-md">
                  <div className="w-14 h-14 rounded-full bg-neutral-200 overflow-hidden border border-[#A51C30]">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Chanda M." 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0c3aCas4CRLlHvxW39jAswYNBcUIxD5pb6oKWI7SJp5afXsOnc53TLehaC-ZZCwlDZDG2jRi3hu4ydEzctMBDyrEcywkp_bJqDyGBEGTkv_HPNqQR0V8Y0s2NdL07Bezt6J8CGO7bKgEl5hr-X1fT7855F7-RgLdWmlzjqh_1CMZF1aqclaHKy9hRN5dVroazcdSpinu7mHMJQ4NB_453k9GBwt5-gS6xy1nONkaYsTiLjr6KDICgrIpsvL0hmoweJevbOmZ8hSg"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif-academic font-bold text-[#1E1E1E] text-lg">Chanda M.</h5>
                    <p className="text-[#C49A45] font-sans text-xs uppercase tracking-wider font-bold">Software Developer, Lusaka</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-xl border-l-4 border-[#A51C30] shadow-sm flex flex-col justify-between">
                <p className="font-serif-academic text-lg text-[#4A4A4A] mb-xl italic leading-relaxed">
                  "The offline access features were a lifesaver. I could study even with unpredictable internet, and the interactive quizzes made learning truly engaging."
                </p>
                <div className="flex items-center gap-md">
                  <div className="w-14 h-14 rounded-full bg-neutral-200 overflow-hidden border border-[#A51C30]">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Sarah T." 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbuo69R9DhyO9FAclZuUEjZroQYLEXFp6YIudBZ-C1oMkSLR-rxUkEZLs6Xuu6WpqJOTq7mp6477n3PIWIkEr8UTXQBbVqn0SWA6iwyQ4cO72aSdQoRcA_aBqVWI2xiegd4uaMkU3-yrN6Q5348fJizJXTF-tRchAcOsKE_bVXOGHl80NJ0FrQmW4iOUDRNYCIyRJ0tXVuz86KPjww87IQfeWl1tJq9ZsvEF096T1Q8j9AwAmZiA9OWU06wqIccnO6tlLvDIWORS0"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif-academic font-bold text-[#1E1E1E] text-lg">Sarah T.</h5>
                    <p className="text-[#C49A45] font-sans text-xs uppercase tracking-wider font-bold">Marketing Analyst, Kitwe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-[#FAF9F6] border-t-8 border-[#A51C30]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl px-margin-mobile md:px-margin-desktop py-2xl max-w-7xl mx-auto">
          <div className="flex flex-col gap-md">
            <span className="font-serif-academic text-3xl font-extrabold text-[#FAF9F6]">{tenant?.name || "Ntanda"}</span>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Empowering Africa through traditional excellence in education and modern technical learning platforms.
            </p>
          </div>
          <div>
            <h5 className="text-[#D4AF37] font-serif-academic font-bold text-lg mb-md">Academic Divisions</h5>
            <ul className="flex flex-col gap-xs text-sm text-neutral-400">
              <li><Link to="/courses" className="hover:text-white transition-colors">Computer Science &amp; IT</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Business &amp; Leadership</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Engineering &amp; Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#D4AF37] font-serif-academic font-bold text-lg mb-md">University Support</h5>
            <ul className="flex flex-col gap-xs text-sm text-neutral-400">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center &amp; Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy &amp; Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#D4AF37] font-serif-academic font-bold text-lg mb-md">Connect</h5>
            <ul className="flex flex-col gap-xs text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Academic Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube Channel</a></li>
            </ul>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop py-lg border-t border-neutral-800 text-center text-xs text-neutral-500 max-w-7xl mx-auto">
          <p>Built for Zambia. Powered and developed by Zambian cloud programmer X Goe Tech. © 2026 Ntanda LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

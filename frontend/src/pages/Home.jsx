import { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: 'var(--copper-glow)' }}></div>
          Ntanda LMS
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/courses" className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }}>Browse Courses</Link>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {/* 1. Hero Section */}
        <section className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh', position: 'relative', paddingTop: '2rem', paddingBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 500px', zIndex: 2, paddingRight: '2rem' }} className="animate-fade-in">
            <span style={{ color: 'var(--secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
              The Future of African Education
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: '1.1', marginBottom: '1.5rem' }}>
              Empowering <br />
              <span style={{ color: 'var(--primary)' }}>Zambia's</span> Next <br />
              Generation.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px' }}>
              A world-class, multi-tenant learning platform built for modern institutions. Master new skills with verified certificates and expert instructors.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Explore Courses
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Join for Free
              </Link>
            </div>
            
            <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>50+</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Institutions</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>10k+</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Students Enrolled</div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animate-fade-in">
            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', top: '10%', right: '20%' }}></div>
            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', bottom: '10%', left: '10%' }}></div>
            
            <div className="glass-panel animate-float" style={{ padding: '1rem', borderRadius: '24px', position: 'relative', zIndex: 2, width: '100%', maxWidth: '550px', height: '550px', overflow: 'hidden' }}>
              <img src={heroImage} alt="Modern Zambian Tech Student" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            
            <div className="glass-panel animate-float" style={{ position: 'absolute', bottom: '15%', left: '-5%', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 3, animationDelay: '1s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>✓</div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Verified Certificates</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Globally Recognized</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Core Features */}
        <section style={{ background: 'rgba(10, 10, 10, 0.8)', padding: '6rem 0', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem' }}>Why Choose Ntanda?</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Designed specifically for the African context, bringing world-class educational tools to institutions of all sizes.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(217, 119, 54, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📱</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Learn Anywhere</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Optimized for low-bandwidth environments. Access your courses on any device, anytime.</p>
              </div>
              <div className="glass-panel" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Interactive Exams</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Take proctored examinations and quizzes with instant auto-grading feedback.</p>
              </div>
              <div className="glass-panel" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🏢</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Multi-Tenant Ready</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Institutions get their own isolated, branded environments within the platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem' }}>Your Journey to Success</h2>
              <p style={{ color: 'var(--text-muted)' }}>Three simple steps to advance your career.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', position: 'relative' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(217, 119, 54, 0.1)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>1</div>
                <h3>Create an Account</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign up for free and gain access to thousands of courses across multiple disciplines.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>2</div>
                <h3>Learn & Practice</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Engage with video lectures, interactive quizzes, and downloadable resources.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>3</div>
                <h3>Get Certified</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Pass the final assessment and receive a verifiable certificate to boost your CV.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Popular Courses Preview */}
        <section style={{ background: 'rgba(10, 10, 10, 0.5)', padding: '6rem 0', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Featured Programs</h2>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: '0.5rem' }}>Explore our most highly-rated courses.</p>
              </div>
              <Link to="/courses" className="btn btn-secondary">View All Courses →</Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                { title: 'Full-Stack Web Development', price: '$49', bg: 'rgba(217, 119, 54, 0.2)' },
                { title: 'Digital Marketing Fundamentals', price: 'Free', bg: 'rgba(16, 185, 129, 0.2)' },
                { title: 'Data Science with Python', price: '$79', bg: 'rgba(59, 130, 246, 0.2)' }
              ].map((course, idx) => (
                <div key={idx} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', background: course.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem', opacity: 0.5 }}>📖</span>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1 }}>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{course.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Master the core concepts with hands-on projects and expert guidance.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: course.price === 'Free' ? 'var(--secondary)' : 'var(--primary)' }}>{course.price}</span>
                      <Link to="/register" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.875rem' }}>Enroll Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Testimonials */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Student Success Stories</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>"The platform is incredibly fast even on my mobile connection. I secured a junior dev role just two months after completing the web development track."</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Chanda M.</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Software Developer</div>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>"Ntanda LMS provides the most intuitive learning experience I've ever used. The quizzes and instant feedback kept me highly motivated."</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Sarah T.</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Marketing Analyst</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Top Instructors */}
        <section style={{ background: 'rgba(217, 119, 54, 0.03)', padding: '6rem 0', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Learn from Industry Experts</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-panel" style={{ padding: '2rem' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🧑‍🏫</div>
                  <h4 style={{ marginBottom: '0.25rem' }}>Expert Tutor {i}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Senior Professional</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: "Is the platform mobile-friendly?", a: "Yes, Ntanda LMS is designed to be fully responsive and optimized for mobile devices, even on slower connections." },
                { q: "How do I get my certificate?", a: "Upon successfully completing all modules and passing the final assessment of a course, your verifiable certificate is automatically generated in your dashboard." },
                { q: "Can my institution use Ntanda LMS?", a: "Absolutely! We support a multi-tenant architecture, meaning your institution can have its own branded, isolated environment on our platform." },
                { q: "What payment methods are accepted?", a: "We support Stripe for international payments, and will soon support local mobile money providers for seamless transactions." }
              ].map((faq, index) => (
                <div key={index} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => toggleFaq(index)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                    {faq.q}
                    <span style={{ color: 'var(--primary)' }}>{activeFaq === index ? '−' : '+'}</span>
                  </div>
                  {activeFaq === index && (
                    <div style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', animation: 'fadeIn 0.3s ease' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ maxWidth: '300px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                Ntanda LMS
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Empowering African institutions with next-generation learning management solutions.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <Link to="/courses" style={{ color: 'inherit', textDecoration: 'none' }}>Courses</Link>
                  <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
                  <Link to="/institutions" style={{ color: 'inherit', textDecoration: 'none' }}>For Institutions</Link>
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '1rem' }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} Ntanda LMS. Built for Zambia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

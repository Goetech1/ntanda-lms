import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const Home = () => {
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

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh', position: 'relative', paddingTop: '2rem', paddingBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* Text Content */}
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

          {/* Image Content */}
          <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animate-fade-in">
            {/* Decorative background blur */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', top: '10%', right: '20%' }}></div>
            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', bottom: '10%', left: '10%' }}></div>
            
            <div className="glass-panel animate-float" style={{ padding: '1rem', borderRadius: '24px', position: 'relative', zIndex: 2, width: '100%', maxWidth: '550px', height: '550px', overflow: 'hidden' }}>
              <img 
                src={heroImage} 
                alt="Modern Zambian Tech Student" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} 
              />
            </div>
            
            {/* Floating Stats Badge */}
            <div className="glass-panel animate-float" style={{ position: 'absolute', bottom: '15%', left: '-5%', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 3, animationDelay: '1s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                ✓
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Verified Certificates</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Globally Recognized</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ background: 'rgba(10, 10, 10, 0.8)', padding: '6rem 0', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem' }}>Why Choose Ntanda?</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Designed specifically for the African context, bringing world-class educational tools to institutions of all sizes.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Feature 1 */}
              <div className="glass-panel" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(217, 119, 54, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  📱
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Learn Anywhere</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Optimized for low-bandwidth environments. Access your courses on any device, anytime.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-panel" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  🎯
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Interactive Exams</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Take proctored examinations and quizzes with instant auto-grading feedback.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-panel" style={{ padding: '2.5rem', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  🏢
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Multi-Tenant Ready</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Institutions get their own isolated, branded environments within the platform.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} Ntanda LMS. Built for Zambia.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

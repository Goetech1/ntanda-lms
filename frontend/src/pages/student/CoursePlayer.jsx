import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const course = {
    title: 'React Masterclass',
    instructor: 'Jane Doe',
    modules: [
      {
        title: 'Module 1: Getting Started',
        lessons: [
          { id: 'l1', title: 'Introduction to React', duration: '5:30', isPlaying: false, completed: true },
          { id: 'l2', title: 'Setting up the Environment', duration: '12:45', isPlaying: true, completed: false },
          { id: 'l3', title: 'JSX Fundamentals', duration: '18:20', isPlaying: false, completed: false }
        ]
      },
      {
        title: 'Module 2: State & Props',
        lessons: [
          { id: 'l4', title: 'Understanding State', duration: '20:15', isPlaying: false, completed: false },
          { id: 'l5', title: 'Passing Props', duration: '15:10', isPlaying: false, completed: false }
        ]
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Main Player Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
          <button onClick={() => navigate('/student')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#64748b' }}>←</button>
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{course.title}</h1>
        </div>

        {/* Video Player Placeholder */}
        <div style={{ width: '100%', background: '#000', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', cursor: 'pointer', boxShadow: '0 0 20px var(--primary-glow)' }}>
            ▶
          </div>
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: '#fff', fontWeight: 'bold' }}>Setting up the Environment</div>
        </div>

        {/* Tabs Below Player */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', padding: '0 1.5rem' }}>
          {['overview', 'q&a', 'notes', 'resources'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                padding: '1rem 1.5rem', fontWeight: activeTab === tab ? 'bold' : 'normal', color: activeTab === tab ? 'var(--primary)' : '#64748b',
                cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem 1.5rem', flex: 1, background: '#f8fafc' }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ marginTop: 0 }}>About this Lesson</h2>
              <p style={{ color: '#475569', lineHeight: 1.6 }}>In this lesson, we will install Node.js, set up Vite, and prepare our development environment for building modern React applications. Make sure to download the attached resources.</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#cbd5e1' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Instructor: {course.instructor}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Senior React Developer</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'q&a' && <div style={{ color: '#64748b' }}>Search past questions or ask a new one...</div>}
        </div>

      </div>

      {/* Sidebar: Curriculum */}
      <div style={{ width: isMobile ? '100%' : '350px', background: '#fff', borderLeft: isMobile ? 'none' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : '100vh', position: isMobile ? 'static' : 'sticky', top: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Course Content</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {course.modules.map((mod, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ padding: '1rem 1.5rem', background: '#f1f5f9', fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>
                {mod.title}
              </div>
              <div>
                {mod.lessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    style={{ 
                      padding: '1rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', 
                      background: lesson.isPlaying ? '#eff6ff' : '#fff', cursor: 'pointer',
                      borderLeft: lesson.isPlaying ? '3px solid var(--primary)' : '3px solid transparent'
                    }}
                  >
                    <div style={{ color: lesson.completed ? '#10b981' : '#cbd5e1', fontSize: '1.2rem', marginTop: '-2px' }}>
                      {lesson.completed ? '✓' : '○'}
                    </div>
                    <div>
                      <div style={{ color: lesson.isPlaying ? 'var(--primary)' : '#1e293b', fontWeight: lesson.isPlaying ? 'bold' : 'normal', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {lesson.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>▶️</span> {lesson.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CoursePlayer;

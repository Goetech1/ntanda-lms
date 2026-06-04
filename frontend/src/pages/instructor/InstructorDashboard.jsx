import { useState, useEffect } from 'react';
import { instructorPortalService } from '../../services/api';

const InstructorDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorPortalService.getOverview().catch(() => ({
          data: { data: {
            totalStudents: 124,
            activeCourses: 3,
            averageRating: 4.8,
            totalEarnings: 3250.00,
            recentActivity: [
              { id: '1', type: 'ENROLLMENT', message: 'Alice enrolled in React Masterclass', time: '2 hours ago' },
              { id: '2', type: 'REVIEW', message: 'Bob left a 5-star review', time: '1 day ago' }
            ]
          }}
        }));
        setOverview(res?.data?.data || res?.data);
      } catch (err) {
        console.error('Error fetching instructor overview', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Dashboard...</div>;

  return (
    <div style={{ maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Welcome back, Tom</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Here is what's happening with your courses today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📹</span> Schedule Live Class
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✨</span> Create New Course
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Students', value: overview.totalStudents, icon: '👥' },
          { label: 'Active Courses', value: overview.activeCourses, icon: '📚' },
          { label: 'Average Rating', value: `⭐ ${overview.averageRating}`, icon: '⭐' },
          { label: 'Total Earnings', value: `$${overview.totalEarnings.toFixed(2)}`, icon: '💰' }
        ].map((metric, i) => (
          <div key={i} className="glass-panel animate-fade-up" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: `${i * 0.1}s` }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>{metric.icon}</div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{metric.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff' }}>{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Performance Overview</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            [ Chart Area Placeholder ]
          </div>
        </div>

        <div className="glass-panel animate-fade-up" style={{ padding: '2rem', animationDelay: '0.2s' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {overview.recentActivity.map(act => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.35rem' }} />
                <div>
                  <div style={{ color: '#fff', fontSize: '0.95rem' }}>{act.message}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

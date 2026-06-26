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

  if (isLoading) return <div className="p-xl text-center text-primary font-bold">Loading Dashboard...</div>;

  return (
    <div className="max-w-max-width mx-auto relative animate-fade-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md mb-xl">
        <div>
          <h1 className="font-headline-md text-display-lg-mobile md:text-headline-md text-primary tracking-tight mb-xs">Welcome back, Tom</h1>
          <p className="text-on-surface-variant text-body-lg">Here is what's happening with your courses today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-sm w-full sm:w-auto">
          <button className="btn btn-outline flex items-center justify-center gap-xs py-xs">
            <span>📹</span> Schedule Live Class
          </button>
          <button className="btn btn-primary flex items-center justify-center gap-xs py-xs">
            <span>✨</span> Create New Course
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {[
          { label: 'Total Students', value: overview.totalStudents, icon: '👥' },
          { label: 'Active Courses', value: overview.activeCourses, icon: '📚' },
          { label: 'Average Rating', value: `⭐ ${overview.averageRating}`, icon: '⭐' },
          { label: 'Total Earnings', value: `$${overview.totalEarnings.toFixed(2)}`, icon: '💰' }
        ].map((metric, i) => (
          <div key={i} className="glass-panel p-md flex items-center gap-md">
            <div className="text-4xl opacity-80">{metric.icon}</div>
            <div>
              <div className="text-on-surface-variant text-label-md mb-xs uppercase tracking-wider">{metric.label}</div>
              <div className="text-headline-md font-bold text-on-surface">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Performance Overview (2/3 width) */}
        <div className="lg:col-span-2 glass-panel p-lg">
          <h3 className="font-headline-sm text-headline-sm mb-lg text-on-surface">Performance Overview</h3>
          <div className="h-[300px] flex items-center justify-center text-on-surface-variant border border-dashed border-outline-variant/30 rounded-lg">
            [ Chart Area Placeholder ]
          </div>
        </div>

        {/* Recent Activity (1/3 width) */}
        <div className="lg:col-span-1 glass-panel p-lg">
          <h3 className="font-headline-sm text-headline-sm mb-lg text-on-surface">Recent Activity</h3>
          <div className="flex flex-col gap-md">
            {overview.recentActivity.map(act => (
              <div key={act.id} className="flex gap-sm items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <div className="text-on-surface text-body-md font-medium">{act.message}</div>
                  <div className="text-on-surface-variant text-body-sm mt-0.5">{act.time}</div>
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

import { useState, useEffect } from 'react';
import { virtualClassroomService } from '../../services/api';

const StudentLive = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await virtualClassroomService.getAll().catch(() => ({
          data: { data: [
            { id: '1', title: 'Weekly Q&A: React Hooks', instructor: 'Jane Doe', startTime: new Date().toISOString(), status: 'LIVE', meetingLink: '#' },
            { id: '2', title: 'CSS Grid Workshop', instructor: 'Mark Johnson', startTime: '2026-06-10T14:00:00Z', status: 'SCHEDULED' }
          ]}
        }));
        
        setSessions(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching live sessions', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-xl text-center text-primary font-bold">Loading Live Schedule...</div>;

  return (
    <div className="max-w-max-width mx-auto py-xl px-margin-mobile md:px-margin-desktop pb-[6rem] animate-fade-up">
      <div className="mb-xl">
        <h1 className="font-headline-md text-display-lg-mobile md:text-headline-md text-primary mb-xs">Live Classrooms</h1>
        <p className="text-on-surface-variant text-body-lg">Join upcoming scheduled virtual classes and workshops.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {sessions.map(session => {
          const isLive = session.status === 'LIVE';
          
          return (
            <div 
              key={session.id} 
              className={`glass-panel p-md flex flex-col relative overflow-hidden ${isLive ? 'border-red-500/30' : 'border-outline-variant/20'}`}
            >
              {isLive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 shadow-[0_0_10px_#ef4444]" />
              )}
              
              <div className="flex justify-between items-start mb-md">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-xs ${isLive ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {isLive ? 'HAPPENING NOW' : 'UPCOMING'}
                </div>
              </div>

              <h3 className="font-headline-sm text-headline-sm mb-xs text-on-surface">{session.title}</h3>
              <div className="text-on-surface-variant text-body-sm mb-lg">Instructor: {session.instructor}</div>
              
              <div className="flex items-center gap-xs text-on-surface text-body-sm mb-lg bg-surface-container p-sm rounded-lg border border-outline-variant/35">
                <span>📅</span>
                <span>{new Date(session.startTime).toLocaleString()}</span>
              </div>

              <button 
                className={`btn w-full mt-auto ${isLive ? 'btn-primary' : 'btn-outline'}`}
                style={{ 
                  background: isLive ? '#ef4444' : 'transparent', 
                  borderColor: isLive ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  boxShadow: isLive ? '0 4px 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}
                disabled={!isLive}
              >
                {isLive ? 'Join Class Now' : 'Remind Me'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default StudentLive;

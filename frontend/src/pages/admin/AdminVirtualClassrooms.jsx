import React, { useState, useEffect } from 'react';
import { virtualClassroomService, courseService } from '../../services/api';

const AdminVirtualClassrooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    date: '',
    time: '',
    durationMinutes: 60,
    provider: 'zoom'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vClassRes, coursesRes] = await Promise.all([
        virtualClassroomService.getAll().catch(() => ({ data: [] })),
        courseService.getAllCourses().catch(() => ({ data: { data: [] } }))
      ]);

      const fetchedClasses = vClassRes?.data?.data || vClassRes?.data || [];
      const fetchedCourses = coursesRes?.data?.data || coursesRes?.data || [];

      setClasses((Array.isArray(fetchedClasses) ? fetchedClasses : []).map(cls => ({
        ...cls,
        scheduledAt: cls.start_time || cls.scheduledAt,
        durationMinutes: cls.duration_minutes || cls.durationMinutes,
        provider: cls.provider || 'custom',
        instructorName: cls.course?.instructor?.full_name || 'Unassigned',
        registeredCount: cls.registered_count || 0,
        capacity: cls.capacity || 0,
      })));

      setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
    } catch (err) {
      console.error('Failed to fetch virtual classrooms data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      await virtualClassroomService.schedule({
        title: formData.title,
        courseId: formData.courseId,
        provider: formData.provider,
        durationMinutes: Number(formData.durationMinutes),
        scheduledAt,
        description: 'Scheduled via Admin Console'
      });
      setIsModalOpen(false);
      setFormData({ title: '', courseId: '', date: '', time: '', durationMinutes: 60, provider: 'zoom' });
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Failed to schedule class:', err);
      alert('Failed to schedule class.');
    }
  };

  const getPercentage = (reg, cap) => Math.min(100, Math.round((reg / cap) * 100)) || 0;
  const todayCount = classes.filter((cls) => {
    if (!cls.scheduledAt) return false;
    return new Date(cls.scheduledAt).toDateString() === new Date().toDateString();
  }).length;

  return (
    <div className="flex-1 min-h-screen bg-surface-bright p-xl font-body-md relative">
      <div className="max-w-max-width mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex justify-between items-end mb-xl">
          <div>
            <nav className="flex items-center gap-xs text-on-surface-variant font-label-md mb-xs">
              <span>Academic Operations</span>
              <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
              <span className="text-primary">Virtual Classrooms</span>
            </nav>
            <h3 className="font-headline-md text-headline-md text-on-surface">Scheduling Module</h3>
          </div>
          <button 
            className="bg-primary text-on-primary px-lg py-sm rounded-lg font-semibold flex items-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>add_circle</span>
            Schedule New Class
          </button>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-12 gap-lg mb-3xl">
          {/* Quick Stats */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-xs">
              <span className="text-on-surface-variant font-label-md">LIVE CLASSES</span>
              <span className="text-display-lg font-display-lg text-primary">{classes.length}</span>
              <div className="flex items-center gap-xs text-primary font-body-sm mt-xs">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 0"}}>trending_up</span>
                <span>Active</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-xs">
              <span className="text-on-surface-variant font-label-md">SCHEDULED TODAY</span>
              <span className="text-display-lg font-display-lg text-secondary">{todayCount}</span>
              <div className="flex items-center gap-xs text-secondary font-body-sm mt-xs">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 0"}}>calendar_month</span>
                <span>Across courses</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col gap-xs">
              <span className="text-on-surface-variant font-label-md">AVG. ATTENDANCE</span>
              <span className="text-display-lg font-display-lg text-tertiary">0%</span>
              <div className="flex items-center gap-xs text-tertiary font-body-sm mt-xs">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 0"}}>group</span>
                <span>From attendance records</span>
              </div>
            </div>
          </div>

          {/* Calendar Mini-View (Featured) */}
          <div className="col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container p-xl rounded-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-md">
                <h4 className="font-headline-sm">Today's Focus</h4>
                <span className="bg-white/20 px-sm py-xs rounded-lg text-label-sm uppercase">Priority</span>
              </div>
              <p className="font-body-md opacity-90">{todayCount > 0 ? `${todayCount} live session${todayCount === 1 ? '' : 's'} scheduled today.` : 'No live sessions scheduled today.'}</p>
            </div>
            <div className="relative z-10 flex items-center gap-sm mt-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>schedule</span>
              <span className="font-label-md">{new Date().toLocaleDateString()}</span>
            </div>
            {/* Decorative Graphic */}
            <div className="absolute -right-12 -bottom-12 opacity-10 scale-150 pointer-events-none">
              <span className="material-symbols-outlined text-[120px]" style={{fontVariationSettings: "'FILL' 1"}}>calendar_today</span>
            </div>
          </div>
        </div>

        {/* List View (Table Layout) */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
            <div className="flex items-center gap-lg">
              <button className="font-semibold text-primary border-b-2 border-primary pb-base px-base">List View</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 text-label-md text-on-surface-variant border-b border-outline-variant">
                  <th className="px-xl py-md font-semibold">CLASS TITLE</th>
                  <th className="px-xl py-md font-semibold">INSTRUCTOR</th>
                  <th className="px-xl py-md font-semibold">DATE & TIME</th>
                  <th className="px-xl py-md font-semibold">COURSE MAPPING</th>
                  <th className="px-xl py-md font-semibold">REGISTRATION</th>
                  <th className="px-xl py-md font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-xl py-lg text-center text-on-surface-variant">Loading schedules...</td>
                  </tr>
                ) : classes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-xl py-lg text-center text-on-surface-variant">No classes scheduled.</td>
                  </tr>
                ) : classes.map((cls) => {
                  const p = getPercentage(cls.registeredCount || 0, cls.capacity || 0);
                  const dt = new Date(cls.scheduledAt);
                  
                  return (
                  <tr key={cls.id} className="hover:bg-surface-container-lowest transition-colors bg-white group">
                    <td className="px-xl py-lg">
                      <div className="flex items-center gap-md">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cls.colorClass || 'bg-primary/10 text-primary'}`}>
                          <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 0"}}>{cls.provider === 'zoom' ? 'videocam' : 'hub'}</span>
                        </div>
                        <span className="font-semibold text-on-surface">{cls.title}</span>
                      </div>
                    </td>
                    <td className="px-xl py-lg">
                      <div className="flex items-center gap-sm">
                        <span className="text-body-sm">{cls.instructorName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-xl py-lg">
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium">{dt.toLocaleDateString()}</span>
                        <span className="text-xs text-on-surface-variant">{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.durationMinutes} min)</span>
                      </div>
                    </td>
                    <td className="px-xl py-lg">
                      <span className="bg-secondary/10 text-secondary px-sm py-xs rounded-full text-xs font-semibold">{cls.course?.title || 'Standalone'}</span>
                    </td>
                    <td className="px-xl py-lg">
                      <div className="flex flex-col gap-xs w-32">
                        <div className={`flex justify-between text-xs ${p >= 100 ? 'text-error font-medium' : ''}`}>
                          <span>{cls.registeredCount || 0}/{cls.capacity || 0}</span>
                          <span>{p}%</span>
                        </div>
                        <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${p >= 100 ? 'bg-error w-full' : 'bg-primary'}`} 
                            style={{ width: `${p}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-xl py-lg text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-error/10 rounded-full text-error" title="Delete">
                          <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal: Schedule New Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface">Schedule Virtual Classroom</h2>
                <p className="text-body-sm text-on-surface-variant">Create a new live session for students</p>
              </div>
              <button 
                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" 
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form className="p-xl space-y-lg" onSubmit={handleSchedule}>
              {/* Title & Mapping */}
              <div className="grid grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface font-semibold uppercase tracking-wider">Class Title</label>
                  <input 
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm text-body-sm outline-none" 
                    placeholder="e.g. Weekly Theory Lab" 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface font-semibold uppercase tracking-wider">Course Mapping</label>
                  <select 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm text-body-sm outline-none bg-white"
                    value={formData.courseId}
                    onChange={e => setFormData({...formData, courseId: e.target.value})}
                  >
                    <option value="" disabled>Select a course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-4 gap-lg">
                <div className="col-span-2 flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface font-semibold uppercase tracking-wider">Session Date</label>
                  <input 
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm text-body-sm outline-none" 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface font-semibold uppercase tracking-wider">Start Time</label>
                  <input 
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm text-body-sm outline-none" 
                    type="time" 
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface font-semibold uppercase tracking-wider">Duration</label>
                  <select 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm text-body-sm outline-none bg-white"
                    value={formData.durationMinutes}
                    onChange={e => setFormData({...formData, durationMinutes: e.target.value})}
                  >
                    <option value={30}>30 min</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface font-semibold uppercase tracking-wider">Provider</label>
                  <select 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm text-body-sm outline-none bg-white"
                    value={formData.provider}
                    onChange={e => setFormData({...formData, provider: e.target.value})}
                  >
                    <option value="zoom">Zoom</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="custom">Custom Link</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant">
                <button 
                  className="px-xl py-sm rounded-lg font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors" 
                  onClick={() => setIsModalOpen(false)} 
                  type="button"
                >
                  Cancel
                </button>
                <button className="bg-primary text-on-primary px-2xl py-sm rounded-lg font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all" type="submit">
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVirtualClassrooms;

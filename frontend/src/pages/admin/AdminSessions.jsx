import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/api';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await sessionService.getAll();
      const sessionData = response.data?.data || response.data || [];
      setSessions(Array.isArray(sessionData) ? sessionData : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load academic sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Ensure dates are parsed correctly if backend requires Date objects/ISO strings
      await sessionService.create({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      });
      setIsModalOpen(false);
      setFormData({ name: '', startDate: '', endDate: '' });
      fetchSessions();
    } catch (err) {
      console.error('Failed to create session:', err);
      alert('Failed to create session. Please check your dates.');
    }
  };

  const handleActivate = async (id) => {
    try {
      await sessionService.activate(id);
      fetchSessions();
    } catch (err) {
      console.error('Failed to activate session:', err);
      alert('Failed to activate session. Ensure only one session is active if restricted.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.delete(id);
        fetchSessions();
      } catch (err) {
        console.error('Failed to delete session:', err);
        alert('Failed to delete session.');
      }
    }
  };

  const currentSession = sessions.find(s => s.status === 'Active' || s.isCurrent === true);

  return (
    <div className="flex-1 overflow-y-auto bg-surface-bright font-body-md">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-3xl">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-background mb-2">Academic Sessions</h1>
            <nav className="flex gap-2 text-on-surface-variant font-body-sm">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-primary font-bold">Academic Operations</span>
            </nav>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary px-xl py-3 rounded-lg flex items-center gap-sm font-label-md hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
            Create New Session
          </button>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-md mb-lg rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>error</span>
            {error}
          </div>
        )}

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-3xl">
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-secondary p-xl rounded-xl text-on-primary flex flex-col justify-between min-h-[160px] relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label-md opacity-80 mb-base">Current Session</p>
              <h3 className="font-headline-md">{currentSession ? currentSession.name : 'No Active Session'}</h3>
            </div>
            <div className="flex gap-xl relative z-10 mt-md">
              <div>
                <p className="text-display-lg-mobile font-bold">{currentSession ? 'Active' : '-'}</p>
                <p className="font-label-sm opacity-80">Status</p>
              </div>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <span className="material-symbols-outlined text-[140px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_stories</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg" style={{fontVariationSettings: "'FILL' 0"}}>history_edu</span>
              </div>
              <h4 className="font-label-md text-on-surface-variant uppercase">Total Sessions</h4>
            </div>
            <p className="text-display-lg-mobile font-bold text-on-background">{isLoading ? '-' : sessions.length}</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="mb-lg flex items-center justify-between">
          <h2 className="font-headline-sm text-on-background">Available Sessions</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-lg">
          {isLoading ? (
            <div className="col-span-full py-xl text-center text-on-surface-variant">Loading academic sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full py-xl text-center text-on-surface-variant">No sessions found. Create one to get started.</div>
          ) : (
            sessions.map(session => {
              const isActive = session.status === 'Active' || session.isCurrent;
              const isCompleted = session.status === 'Completed';

              return (
                <div key={session.id} className={`bg-surface-container-lowest border ${isActive ? 'border-primary shadow-sm hover:shadow-md' : 'border-outline-variant hover:border-secondary'} p-xl rounded-xl transition-all group`}>
                  <div className="flex justify-between items-start mb-lg">
                    <div>
                      <span className={`px-sm py-base rounded-full font-label-sm inline-block mb-sm ${isActive ? 'bg-primary/10 text-primary' : isCompleted ? 'bg-on-surface-variant/10 text-on-surface-variant' : 'bg-secondary/10 text-secondary'}`}>
                        {session.status || (isActive ? 'Active' : 'Upcoming')}
                      </span>
                      <h3 className="font-headline-sm text-on-background">{session.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(session.id)} className="p-2 hover:bg-error/10 rounded-full text-error" title="Delete">
                        <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-md mb-xl">
                    <div className="flex items-center gap-md text-on-surface-variant font-body-sm">
                      <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>calendar_month</span>
                      <span>
                        {new Date(session.startDate).toLocaleDateString()} — {new Date(session.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="pt-lg border-t border-outline-variant flex items-center justify-between">
                    {isActive ? (
                      <span className="font-label-md text-primary">Current Active Session</span>
                    ) : isCompleted ? (
                      <span className="font-label-sm text-on-surface-variant italic">Locked</span>
                    ) : (
                      <>
                        <span className="font-label-md text-on-surface-variant">Activate Session</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            className="sr-only peer" 
                            type="checkbox"
                            checked={false}
                            onChange={() => handleActivate(session.id)}
                          />
                          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State / New Section Hint */}
        {!isLoading && sessions.length > 0 && (
          <div className="mt-3xl border-2 border-dashed border-outline-variant rounded-2xl p-3xl flex flex-col items-center justify-center text-center bg-surface-container-lowest/50">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-md text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 0"}}>inventory_2</span>
            </div>
            <h3 className="font-headline-sm text-on-background">Need to archive historical data?</h3>
            <p className="max-w-md text-on-surface-variant font-body-md mt-sm mb-lg">Academic sessions older than 5 years are automatically archived to optimize system performance.</p>
            <button className="text-secondary border border-secondary px-lg py-2 rounded-lg font-label-md hover:bg-secondary/5 transition-all">
              Archive Settings
            </button>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Create Academic Session</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Session Name</label>
                <input 
                  required
                  placeholder="e.g. Academic Year 2024/2025"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="flex gap-md">
                <div className="flex-1">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Start Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">End Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Create Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;

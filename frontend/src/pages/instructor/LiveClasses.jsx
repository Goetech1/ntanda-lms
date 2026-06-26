import { useState, useEffect } from 'react';
import { Video, Plus, Calendar, Clock, Link as LinkIcon, Trash2, Edit2, Play, Users } from 'lucide-react';
import { liveSessionService, courseService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const LiveClasses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    provider: 'zoom',
    meeting_url: '',
    start_time: '',
    duration_minutes: 60,
    status: 'scheduled'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchSessions(selectedCourse);
    } else {
      setSessions([]);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const res = await courseService.getAll();
      setCourses(res.data);
      if (res.data.length > 0) {
        setSelectedCourse(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const fetchSessions = async (courseId) => {
    setIsLoading(true);
    try {
      const res = await liveSessionService.getByCourse(courseId);
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await liveSessionService.create({ ...formData, course_id: selectedCourse });
      setShowForm(false);
      fetchSessions(selectedCourse);
      // Reset form
      setFormData({
        title: '', description: '', provider: 'zoom', meeting_url: '', start_time: '', duration_minutes: 60, status: 'scheduled'
      });
    } catch (err) {
      console.error('Failed to create session', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this live session?')) return;
    try {
      await liveSessionService.delete(id);
      fetchSessions(selectedCourse);
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in_progress': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'completed': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Live Classes</h1>
          <p className="text-slate-400 mt-1">Schedule and manage virtual classrooms for your courses.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:ring-2 focus:ring-[var(--primary)] outline-none min-w-[200px]"
          >
            {courses.length === 0 && <option value="">No courses found</option>}
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          
          <Button onClick={() => setShowForm(true)} disabled={!selectedCourse}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Session
          </Button>
        </div>
      </div>

      {!selectedCourse ? (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm p-12 text-center">
          <Video className="h-12 w-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No Course Selected</h3>
          <p className="text-slate-500 mt-1">Please select or create a course to schedule live sessions.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sessions.length === 0 && !isLoading && (
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm p-12 text-center border-dashed">
              <Calendar className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No upcoming sessions</h3>
              <p className="text-slate-500 mt-1 mb-4">Schedule your first virtual class for this course.</p>
              <Button onClick={() => setShowForm(true)} variant="outline">Schedule Now</Button>
            </Card>
          )}

          {sessions.map(session => (
            <Card key={session.id} className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${getStatusColor(session.status)}`}>
                            {session.status.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded uppercase font-semibold">
                            {session.provider}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{session.title}</h3>
                        {session.description && <p className="text-slate-400 mt-1 text-sm">{session.description}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                        {new Date(session.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-slate-500" />
                        {new Date(session.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes} mins)
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-slate-500" />
                        Registered Students (coming soon)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                    {session.meeting_url ? (
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => window.open(session.meeting_url, '_blank')}>
                        <Play className="h-4 w-4 mr-2" /> Start Class
                      </Button>
                    ) : (
                      <Button className="w-full" disabled variant="outline">
                        No Meeting Link
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700" onClick={() => alert('Edit coming soon')}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="flex-1 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleDelete(session.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle>Schedule Live Session</CardTitle>
              <CardDescription>Create a new virtual classroom event.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Session Title</label>
                  <Input 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="e.g. Week 1 Q&A Session"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Date & Time</label>
                    <Input 
                      required 
                      type="datetime-local" 
                      value={formData.start_time} 
                      onChange={e => setFormData({...formData, start_time: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Duration (mins)</label>
                    <Input 
                      required 
                      type="number" 
                      min="1"
                      value={formData.duration_minutes} 
                      onChange={e => setFormData({...formData, duration_minutes: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Meeting Provider</label>
                  <select 
                    value={formData.provider} 
                    onChange={e => setFormData({...formData, provider: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="custom">Other / Custom Link</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Meeting URL / Join Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <Input 
                      required 
                      type="url"
                      className="pl-9"
                      value={formData.meeting_url} 
                      onChange={e => setFormData({...formData, meeting_url: e.target.value})} 
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit">Schedule Session</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LiveClasses;

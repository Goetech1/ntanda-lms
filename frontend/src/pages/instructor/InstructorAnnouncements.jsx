import { useState, useEffect } from 'react';
import { Megaphone, Send, Loader2, BookOpen } from 'lucide-react';
import { instructorPortalService, announcementService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const InstructorAnnouncements = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New Announcement Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchAnnouncements(selectedCourseId);
    } else {
      setAnnouncements([]);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const res = await instructorPortalService.getMyCourses();
      setCourses(res.data.data || res.data || []);
      if (res.data?.length > 0) {
        setSelectedCourseId(res.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
      // Demo fallback
      setCourses([
        { id: '1', title: 'Advanced Cloud Architecture' },
        { id: '2', title: 'UI/UX Design Masterclass' }
      ]);
      setSelectedCourseId('1');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async (courseId) => {
    setIsLoading(true);
    try {
      const res = await announcementService.getByCourse(courseId);
      setAnnouncements(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedCourseId) return;
    
    setIsSubmitting(true);
    try {
      await announcementService.create(selectedCourseId, { title, content });
      
      // Optimistic update
      setAnnouncements([{
        id: Date.now().toString(),
        title,
        content,
        first_name: user?.firstName || 'Instructor',
        last_name: user?.lastName || '',
        created_at: new Date().toISOString()
      }, ...announcements]);
      
      setTitle('');
      setContent('');
      
    } catch (error) {
      console.error("Failed to post announcement", error);
      alert("Failed to publish announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-[var(--primary)]" />
          Course Announcements
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Broadcast messages to all students enrolled in your courses.</p>
      </div>

      <div className="flex items-center gap-3 mb-6 bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
        <BookOpen className="h-5 w-5 text-slate-500" />
        <span className="text-slate-300 font-medium">Select Course:</span>
        <select 
          value={selectedCourseId} 
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)]"
        >
          <option value="" disabled>Select a course...</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-lg">Draft New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Subject Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Welcome to Week 2!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Message Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message here... Students will see this on their dashboard."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] min-h-[120px]"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !title || !content}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Publish Announcement
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {selectedCourseId && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Past Announcements</h2>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" /></div>
            ) : announcements.length === 0 ? (
              <div className="text-center p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500">
                No announcements published yet.
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white">{ann.title}</h3>
                    <span className="text-xs text-slate-500">{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{ann.content}</p>
                  <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                      {ann.first_name?.charAt(0)}{ann.last_name?.charAt(0)}
                    </div>
                    Posted by {ann.first_name} {ann.last_name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncements;

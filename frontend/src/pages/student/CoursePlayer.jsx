import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle2, Circle, Save, Loader2, FileText } from 'lucide-react';
import { courseService, studentNoteService } from '../../services/api';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [course, setCourse] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState('');
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [courseError, setCourseError] = useState('');
  
  // Notes State
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteStatus, setNoteStatus] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoadingCourse(true);
      setCourseError('');
      try {
        const res = await courseService.getCourseById(id);
        const data = res.data?.data || res.data;
        setCourse(data);
        const firstLesson = data?.modules?.flatMap(module => module.lessons || [])[0];
        setActiveLessonId(firstLesson?.id || '');
      } catch (error) {
        console.error('Could not fetch course', error);
        setCourseError(error.response?.data?.message || 'Unable to load course content.');
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Fetch notes when lesson changes
  useEffect(() => {
    const fetchNotes = async () => {
      setNoteText('');
      setNoteStatus('');
      try {
        const res = await studentNoteService.getNote(course.id, activeLessonId);
        if (res.data?.data) {
          setNoteText(res.data.data.note_text);
        }
      } catch (error) {
        console.error("Could not fetch note", error);
      }
    };
    if (activeTab === 'notes' && course?.id && activeLessonId) {
      fetchNotes();
    }
  }, [activeLessonId, activeTab, course?.id]);

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    setNoteStatus('');
    try {
      if (!course?.id || !activeLessonId) return;
      await studentNoteService.saveNote(course.id, activeLessonId, noteText);
      setNoteStatus('Saved successfully');
      setTimeout(() => setNoteStatus(''), 3000);
    } catch (error) {
      console.error("Failed to save note", error);
      setNoteStatus('Error saving');
    } finally {
      setIsSavingNote(false);
    }
  };

  const getActiveLesson = () => {
    for (const mod of course.modules) {
      const found = mod.lessons.find(l => l.id === activeLessonId);
      if (found) return found;
    }
    return course.modules?.[0]?.lessons?.[0] || null;
  };

  if (isLoadingCourse) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        {courseError || 'Course content not found.'}
      </div>
    );
  }

  const activeLesson = getActiveLesson();

  return (
    <div className={`flex min-h-screen bg-slate-950 text-slate-200 ${isMobile ? 'flex-col' : 'flex-row'}`}>
      
      {/* Main Player Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-4 shrink-0">
          <button 
            onClick={() => navigate('/student')} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-white truncate">{course.title}</h1>
        </div>

        <div className="w-full bg-black aspect-video flex items-center justify-center relative shrink-0">
          {activeLesson?.video_url ? (
            <iframe title={activeLesson.title} src={activeLesson.video_url} className="w-full h-full" allowFullScreen />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]">
              <PlayCircle className="w-10 h-10 ml-1" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 text-white font-bold tracking-wide drop-shadow-md">
            {activeLesson?.title}
          </div>
        </div>

        {/* Tabs Below Player */}
        <div className="bg-slate-900 border-b border-slate-800 flex px-6 shrink-0 overflow-x-auto custom-scrollbar">
          {['overview', 'q&a', 'notes', 'resources'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium capitalize whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-[var(--primary)] text-[var(--primary)]' 
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 bg-slate-950 overflow-y-auto custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="max-w-3xl animate-fade-up">
              <h2 className="text-xl font-bold text-white mb-4">About this Lesson</h2>
              <p className="text-slate-400 leading-relaxed">
                In this lesson, we will cover the fundamentals required to master the topic. Make sure to take notes and download the attached resources if needed.
              </p>
              
              <div className="flex items-center gap-4 mt-8 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                  {(course.instructor?.full_name || 'I').charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">Instructor: {course.instructor?.full_name || 'Unassigned'}</div>
                  <div className="text-sm text-slate-400">{course.instructor?.email || 'No instructor email recorded'}</div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div className="max-w-3xl flex flex-col h-full animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--primary)]" /> My Notes
                </h2>
                <div className="flex items-center gap-3">
                  {noteStatus && <span className={`text-sm ${noteStatus === 'Error saving' ? 'text-red-400' : 'text-emerald-400'}`}>{noteStatus}</span>}
                  <button 
                    onClick={handleSaveNote}
                    disabled={isSavingNote}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Note
                  </button>
                </div>
              </div>
              <textarea 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your personal notes here... They are automatically linked to this lesson."
                className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none min-h-[300px]"
              />
            </div>
          )}

          {activeTab === 'q&a' && <div className="text-slate-400">Search past questions or ask a new one...</div>}
          {activeTab === 'resources' && <div className="text-slate-400">No resources attached to this lesson.</div>}
        </div>

      </div>

      {/* Sidebar: Curriculum */}
      <div className={`${isMobile ? 'w-full' : 'w-80'} bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 ${!isMobile ? 'h-screen sticky top-0' : ''}`}>
        <div className="p-5 border-b border-slate-800 shrink-0">
          <h2 className="font-bold text-white text-lg">Course Content</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {(course.modules || []).map((mod, i) => (
            <div key={i} className="border-b border-slate-800/50">
              <div className="p-4 bg-slate-950/50 font-semibold text-sm text-slate-300">
                {mod.title}
              </div>
              <div>
                {(mod.lessons || []).map(lesson => {
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`p-4 flex items-start gap-3 cursor-pointer transition-colors border-l-4 ${
                        isActive 
                          ? 'bg-[var(--primary)]/10 border-[var(--primary)]' 
                          : 'bg-transparent border-transparent hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`mt-0.5 ${lesson.completed ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className={`text-sm mb-1 ${isActive ? 'text-[var(--primary)] font-semibold' : 'text-slate-300'}`}>
                          {lesson.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <PlayCircle className="w-3 h-3" /> {lesson.duration_minutes ? `${lesson.duration_minutes} min` : 'Self-paced'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CoursePlayer;

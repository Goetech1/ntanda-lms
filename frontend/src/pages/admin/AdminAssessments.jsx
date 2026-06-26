import React, { useState, useEffect } from 'react';
import { assessmentService, examService, courseService } from '../../services/api';

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer/Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    type: 'QUIZ', 
    courseId: '', 
    durationMinutes: 30, 
    requireWebcam: false, 
    secureBrowser: false 
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assesRes, courseRes] = await Promise.all([
        assessmentService.getAll().catch(() => ({ data: [] })),
        courseService.getAllCourses().catch(() => ({ data: { data: [] } }))
      ]);

      const fetchedAsses = assesRes?.data?.data || assesRes?.data || [];
      const fetchedCourses = courseRes?.data?.data || courseRes?.data || [];

      if (fetchedAsses.length === 0) {
        setAssessments([
          { id: '1', title: 'React Fundamentals Quiz', type: 'QUIZ', courseTitle: 'React 101', questionCount: 10, durationMinutes: 15 },
          { id: '2', title: 'Midterm Exam: Advanced JS', type: 'EXAM', courseTitle: 'JS Masterclass', questionCount: 50, durationMinutes: 120, requireWebcam: true },
          { id: '3', title: 'CSS Grid Challenge', type: 'QUIZ', courseTitle: 'Modern CSS', questionCount: 5, durationMinutes: 10 }
        ]);
      } else {
        setAssessments(fetchedAsses);
      }

      setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
    } catch (err) {
      console.error('Error fetching assessments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (form.type === 'EXAM') {
        await examService.schedule(form).catch(() => {});
      } else {
        await assessmentService.create(form).catch(() => {});
      }
      
      setIsModalOpen(false);
      setForm({ title: '', type: 'QUIZ', courseId: '', durationMinutes: 30, requireWebcam: false, secureBrowser: false });
      fetchData(); // Refresh list
    } catch {
      alert('Failed to create assessment');
    }
  };

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Academic Operations</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Assessments</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Assessments & Exams</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Manage quizzes, high-stakes exams, and question banks.</p>
        </div>
        <div className="flex items-center gap-md">
          <button 
            className="px-lg py-3 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>edit_note</span>
            Create Assessment
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-3xl">
        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>quiz</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Active Quizzes</p>
            <p className="font-display-lg text-on-surface font-bold">{assessments.filter(a => a.type === 'QUIZ').length}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-error/10 text-error rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>local_police</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">High-Stakes Exams</p>
            <p className="font-display-lg text-on-surface font-bold">{assessments.filter(a => a.type === 'EXAM').length}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-secondary/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>data_table</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Question Bank</p>
            <p className="font-display-lg text-on-surface font-bold">1,245</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <section className="space-y-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Repository</h3>
          <div className="flex gap-md">
            <button className="px-md py-2 bg-white border border-outline-variant rounded-lg text-on-surface-variant text-body-sm flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Title</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Type</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Course</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Details</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan="5" className="px-lg py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : assessments.map((a) => (
                <tr key={a.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-lg py-4 font-bold text-on-surface">{a.title}</td>
                  <td className="px-lg py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${a.type === 'EXAM' ? 'bg-error/10 text-error border border-error/30' : 'bg-primary/10 text-primary border border-primary/30'}`}>
                      {a.type}
                    </span>
                  </td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{a.course?.title || a.courseTitle || 'Unassigned'}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span>{a.questionCount || 0} Qs</span>
                      <span>•</span>
                      <span>{a.durationMinutes}m</span>
                      {a.requireWebcam && <span title="Webcam Required" className="text-error ml-1"><span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>videocam</span></span>}
                    </div>
                  </td>
                  <td className="px-lg py-4 text-right">
                    <button className="px-md py-1 border border-outline-variant text-primary font-label-sm rounded-lg hover:bg-surface-container transition-colors">
                      Edit Questions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-up flex flex-col max-h-[90vh]">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white shrink-0">
              <h2 className="text-headline-sm font-bold text-on-surface">Create Assessment</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-xl space-y-md overflow-y-auto">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Title</label>
                <input 
                  required
                  placeholder="e.g. Midterm Examination"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Course Mapping</label>
                <select 
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white"
                  value={form.courseId}
                  onChange={e => setForm({...form, courseId: e.target.value})}
                >
                  <option value="">Unassigned / Standalone</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Type</label>
                  <select 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white"
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value})}
                  >
                    <option value="QUIZ">Quiz</option>
                    <option value="EXAM">High-Stakes Exam</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Duration (Mins)</label>
                  <input 
                    type="number"
                    required min="5"
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                    value={form.durationMinutes}
                    onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {form.type === 'EXAM' && (
                <div className="bg-error/5 border border-error/20 p-md rounded-lg space-y-sm mt-md animate-fade-up">
                  <h4 className="font-label-md text-error font-bold mb-xs">Security Settings (Proctoring)</h4>
                  <label className="flex items-center gap-sm cursor-pointer">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary"
                      checked={form.requireWebcam}
                      onChange={e => setForm({...form, requireWebcam: e.target.checked})}
                    />
                    <span className="text-body-sm text-on-surface-variant">Require Webcam Monitoring</span>
                  </label>
                  <label className="flex items-center gap-sm cursor-pointer">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary"
                      checked={form.secureBrowser}
                      onChange={e => setForm({...form, secureBrowser: e.target.checked})}
                    />
                    <span className="text-body-sm text-on-surface-variant">Force Secure Browser Lock</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg shrink-0">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Create Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssessments;

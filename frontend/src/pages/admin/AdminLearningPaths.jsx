import { useState, useEffect } from 'react';
import { Route, MapPin, Plus, Loader2, Save, Trash2 } from 'lucide-react';
import { learningPathService } from '../../services/api';
import api from '../../services/api'; // for fetching courses directly for this simple implementation
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const AdminLearningPaths = () => {
  const [paths, setPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pathsRes, coursesRes] = await Promise.all([
        learningPathService.getAll(),
        api.get('/courses')
      ]);
      setPaths(pathsRes.data?.data || []);
      setCourses(coursesRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching learning paths data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = (courseId) => {
    if (!selectedCourses.includes(courseId) && courseId !== '') {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleRemoveCourse = (index) => {
    const updated = [...selectedCourses];
    updated.splice(index, 1);
    setSelectedCourses(updated);
  };

  const handleSavePath = async () => {
    if (!formData.title) return;
    setIsSaving(true);
    try {
      await learningPathService.create({
        title: formData.title,
        description: formData.description,
        courses: selectedCourses
      });
      setIsCreating(false);
      setFormData({ title: '', description: '' });
      setSelectedCourses([]);
      fetchData(); // reload list
    } catch (error) {
      console.error("Failed to save learning path", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCourseTitle = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.title : 'Unknown Course';
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Route className="h-8 w-8 text-[var(--primary)]" />
            Learning Paths
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Group related courses into curated tracks for students.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create Path
          </button>
        )}
      </div>

      {isCreating && (
        <Card className="bg-slate-900 border-[var(--primary)]/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-lg">Build New Learning Path</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Path Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Frontend Master Track"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what students will learn..."
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Add Courses</label>
                  <select 
                    onChange={(e) => handleAddCourse(e.target.value)}
                    value=""
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-[var(--primary)] transition-colors"
                  >
                    <option value="" disabled>Select a course to add...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id} disabled={selectedCourses.includes(course.id)}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-950 rounded-lg border border-slate-800 min-h-[160px] p-3">
                  <div className="text-xs text-slate-500 font-medium uppercase mb-3 pl-1">Curriculum Sequence</div>
                  
                  {selectedCourses.length === 0 ? (
                    <div className="text-slate-600 text-sm italic text-center py-8">
                      No courses added to this path yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCourses.map((courseId, index) => (
                        <div key={courseId} className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-md p-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 text-sm text-slate-200 truncate">
                            {getCourseTitle(courseId)}
                          </div>
                          <button 
                            onClick={() => handleRemoveCourse(index)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePath}
                disabled={isSaving || !formData.title || selectedCourses.length === 0}
                className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Path
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Existing Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map(path => (
          <Card key={path.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{path.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                {path.description || 'No description provided.'}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-sm font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-full">
                  {path.course_count} Courses
                </span>
                <button className="text-[var(--primary)] text-sm font-medium hover:underline">
                  Edit
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {paths.length === 0 && !isCreating && (
          <div className="col-span-full border-2 border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-slate-400 mb-1">No Learning Paths</h3>
            <p>Create a track to guide your students through a specific curriculum.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLearningPaths;

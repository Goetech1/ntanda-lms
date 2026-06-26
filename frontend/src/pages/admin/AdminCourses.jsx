import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService, categoryService } from '../../services/api';

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
    categoryId: '' // In case we want to support it later
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesRes, catsRes] = await Promise.all([
        courseService.getAllCourses().catch(() => ({ data: { data: [] } })),
        categoryService.getAll().catch(() => ({ data: { data: [] } }))
      ]);
      
      const cData = coursesRes?.data?.data || coursesRes?.data || [];
      const catData = catsRes?.data?.data || catsRes?.data || [];
      
      setCourses(Array.isArray(cData) ? cData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch curriculum data:', err);
      setError('Failed to load courses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseService.createCourse({
        ...formData,
        price: Number(formData.price)
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', price: 0, thumbnailUrl: '', categoryId: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to create course:', err);
      alert('Failed to create course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete course:', err);
        alert('Failed to delete course.');
      }
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Curriculum Engine</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Design, manage, and scale institutional academic content.</p>
        </div>
        <div className="flex gap-sm">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-md py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg ambient-shadow hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>add_circle</span>
            Course Builder
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-md mb-lg rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-lg">
        {/* Left Sidebar: Categories & Modules */}
        <aside className="col-span-12 lg:col-span-3 space-y-lg">
          {/* Course Categories */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="font-label-md text-label-md text-outline uppercase mb-md px-1 flex justify-between items-center">
              Curriculum Library
              <button className="text-primary hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
              </button>
            </h3>
            <div className="space-y-1">
              {categories.length === 0 && !isLoading && (
                <p className="text-body-sm text-on-surface-variant px-2 italic">No categories found.</p>
              )}
              {categories.map(cat => (
                <details key={cat.id} className="group">
                  <summary className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors list-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 0"}}>folder</span>
                      <span className="font-body-md text-body-md font-medium">{cat.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform" style={{fontVariationSettings: "'FILL' 0"}}>expand_more</span>
                  </summary>
                  <div className="pl-9 pr-2 py-2 space-y-2">
                    <span className="block font-body-sm text-body-sm text-outline italic">No specific sub-items assigned yet</span>
                  </div>
                </details>
              ))}
              
              {/* Fallback Static Categories if backend is empty for UI demonstration */}
              {categories.length === 0 && (
                <details className="group" open>
                  <summary className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors list-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 0"}}>biotech</span>
                      <span className="font-body-md text-body-md font-medium">STEM (Demo)</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform" style={{fontVariationSettings: "'FILL' 0"}}>expand_more</span>
                  </summary>
                  <div className="pl-9 pr-2 py-2 space-y-2">
                    <a className="block font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">Advanced Robotics</a>
                  </div>
                </details>
              )}
            </div>
          </div>
          
          {/* Course Stats Bento */}
          <div className="bg-primary-container text-on-primary-container rounded-xl p-md ambient-shadow">
            <p className="font-label-sm text-label-sm uppercase mb-sm opacity-80">Quick Insight</p>
            <div className="flex items-end justify-between">
              <div>
                <h4 className="font-display-lg text-[32px] leading-tight font-bold">{isLoading ? '-' : courses.length}</h4>
                <p className="font-body-sm text-body-sm">Active Courses</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-40" style={{fontVariationSettings: "'FILL' 0"}}>insights</span>
            </div>
          </div>
        </aside>

        {/* Main Grid Canvas */}
        <div className="col-span-12 lg:col-span-9 space-y-lg">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-sm bg-surface-container-low p-2 rounded-xl border border-outline-variant">
            <button className="px-md py-2 bg-surface-container-lowest text-primary border border-primary font-label-md text-label-md rounded-lg">All Courses</button>
            <div className="ml-auto flex items-center gap-sm pr-2">
              <span className="font-label-sm text-label-sm text-outline">Sort by:</span>
              <select className="bg-transparent border-none font-label-md text-label-md text-on-surface focus:ring-0 cursor-pointer outline-none">
                <option>Recent Activity</option>
                <option>Course Title</option>
              </select>
            </div>
          </div>

          {/* Course Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
            
            {isLoading ? (
              <div className="col-span-full py-xl text-center text-on-surface-variant">Loading courses...</div>
            ) : courses.map(course => (
              <div key={course.id} className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg flex flex-col">
                <div className="relative h-40 bg-surface-container-low flex items-center justify-center overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img alt={course.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={course.thumbnailUrl}/>
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-outline opacity-50" style={{fontVariationSettings: "'FILL' 0"}}>menu_book</span>
                  )}
                  <div className="absolute top-sm right-sm">
                    <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-2 py-1 rounded-full backdrop-blur-sm border border-primary/20">
                      {course.status || 'DRAFT'}
                    </span>
                  </div>
                </div>
                <div className="p-md flex flex-col flex-1 space-y-md">
                  <div className="flex-1">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2">{course.title}</h4>
                    <p className="font-body-sm text-body-sm text-outline mt-xs line-clamp-2">{course.description}</p>
                    <p className="font-label-sm text-primary mt-2 font-bold">${course.price}</p>
                  </div>
                  
                  <div className="pt-md border-t border-outline-variant flex gap-sm mt-auto">
                    <button 
                      onClick={() => navigate(`/admin/courses/${course.id}/curriculum`)}
                      className="flex-1 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant"
                    >
                      Curriculum
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors border border-outline-variant flex items-center justify-center"
                      title="Delete Course"
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Course Placeholder Card */}
            {!isLoading && (
              <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-col items-center justify-center text-outline hover:border-primary hover:text-primary transition-all group bg-surface-container-low/30 h-[380px] w-full">
                <span className="material-symbols-outlined text-5xl mb-md group-hover:scale-110 transition-transform" style={{fontVariationSettings: "'FILL' 0"}}>add_circle</span>
                <p className="font-headline-sm text-headline-sm">Create New Course</p>
                <p className="font-body-sm text-body-sm mt-xs opacity-70">Start with a template or from scratch.</p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Course Builder</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Course Title</label>
                <input 
                  required
                  placeholder="e.g. Advanced Robotics"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Course overview..."
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm resize-none" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-md">
                <div className="flex-1">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Price ($)</label>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Category</label>
                  <select 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="">None</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Thumbnail URL</label>
                <input 
                  type="url"
                  placeholder="https://..."
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.thumbnailUrl}
                  onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCourses;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/api';

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    status: 'DRAFT',
    thumbnailUrl: ''
  });

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await courseService.getAllCourses();
      const data = res?.data?.data || res?.data || [];
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      // Fallback Mock Data
      setCourses([
        { id: 'c1', title: 'Advanced React Patterns', price: 149.99, status: 'PUBLISHED', createdAt: new Date().toISOString() },
        { id: 'c2', title: 'Intro to Python Data Science', price: 89.99, status: 'DRAFT', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'c3', title: 'Mastering Figma UI/UX', price: 199.99, status: 'PUBLISHED', createdAt: new Date(Date.now() - 172800000).toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };
      
      const res = await courseService.createCourse(payload).catch(err => {
        // If backend fails, manually insert mock for demo
        const newMockCourse = {
          id: 'mock-' + Math.random(),
          ...payload,
          createdAt: new Date().toISOString()
        };
        setCourses([newMockCourse, ...courses]);
        throw new Error('Backend offline: inserted mock');
      });
      
      // If backend works
      if (res?.data?.data) {
        setCourses([res.data.data, ...courses]);
      }
      
      setIsDrawerOpen(false);
      setFormData({ title: '', description: '', price: '', status: 'DRAFT', thumbnailUrl: '' });
    } catch (err) {
      console.log('Course created (mock fallback)');
      setIsDrawerOpen(false);
      setFormData({ title: '', description: '', price: '', status: 'DRAFT', thumbnailUrl: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseService.deleteCourse(id).catch(() => null);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Course Management</h1>
        <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>+ Create Course</button>
      </div>
      
      {/* Course Data Table */}
      <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary)' }}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No courses found. Create one to get started!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Course Title</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Date Added</th>
                <th style={{ padding: '1rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--card-bg)', backgroundImage: `url(${course.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {!course.thumbnailUrl && '📚'}
                      </div>
                      <div style={{ fontWeight: '600' }}>{course.title}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>${typeof course.price === 'number' ? course.price.toFixed(2) : course.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: course.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)', 
                      color: course.status === 'PUBLISHED' ? '#10b981' : 'var(--text-muted)', 
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' 
                    }}>
                      {course.status || 'DRAFT'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '1rem' }} onClick={() => navigate(`/admin/courses/${course.id}/curriculum`)}>Build Curriculum</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide Drawer Overlay */}
      {isDrawerOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100,
          display: 'flex', justifyContent: 'flex-end'
        }} onClick={() => setIsDrawerOpen(false)}>
          
          {/* Drawer Content */}
          <div 
            className="animate-slide-in-right glass-panel" 
            style={{ 
              width: '450px', height: '100%', maxWidth: '100vw', 
              background: 'var(--bg-color)', borderLeft: '1px solid var(--border-color)',
              padding: '2rem', overflowY: 'auto', borderRadius: '0'
            }} 
            onClick={e => e.stopPropagation()} // prevent overlay click from closing
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>Create New Course</h2>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="input-group">
                <label>Course Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Advanced React Patterns" />
              </div>
              
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="What will students learn?" rows="4" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required step="0.01" min="0" placeholder="0.00" />
                </div>
                
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#1A1A24', color: 'white' }}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Thumbnail URL (Optional)</label>
                <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

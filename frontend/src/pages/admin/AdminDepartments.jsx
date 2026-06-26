import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/api';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAll();
      const data = response.data?.data || response.data || [];
      setDepartments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setError('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentService.update(editingDept.id, formData);
      } else {
        await departmentService.create(formData);
      }
      setIsModalOpen(false);
      setEditingDept(null);
      setFormData({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (err) {
      console.error('Submit department failed:', err);
      alert(err.response?.data?.message || 'Failed to save department. Ensure department code is unique.');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department? This will remove all academic scopes associated with it.')) {
      try {
        await departmentService.delete(id);
        fetchDepartments();
      } catch (err) {
        console.error('Delete department failed:', err);
        alert('Failed to delete department.');
      }
    }
  };

  return (
    <div className="max-w-max-width mx-auto w-full py-lg px-margin-mobile md:px-margin-desktop animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-2xl">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Institution Mgmt</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Departments</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md text-primary mb-base">Academic Departments</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Create and manage your institution's faculties, operational divisions, and subject departments.</p>
        </div>
        <button 
          onClick={() => {
            setEditingDept(null);
            setFormData({ name: '', code: '', description: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-sm bg-primary text-on-primary px-lg py-md rounded-lg font-body-md font-semibold hover:shadow-lg transition-all active:scale-95 self-start sm:self-auto w-full sm:w-auto"
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
          Add Department
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg flex items-center gap-2 mb-lg">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>error</span>
          {error}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="text-center text-on-surface-variant py-xl">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="glass-panel p-xl text-center">
          <h3 className="font-headline-sm text-headline-sm mb-xs text-on-surface">No Departments Registered</h3>
          <p className="mb-lg text-on-surface-variant text-body-md">Start by organizing your institution's academic structure.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Create Your First Department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {departments.map((dept) => (
            <div key={dept.id} className="glass-panel p-lg flex flex-col justify-between hover:border-primary/30 transition-colors group">
              <div>
                <div className="flex justify-between items-start mb-md">
                  <span className="text-primary font-bold bg-primary/10 px-sm py-xs rounded text-label-md">
                    {dept.code}
                  </span>
                  <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(dept)}
                      className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(dept.id)}
                      className="p-1.5 hover:bg-error/10 rounded text-error transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-xs">{dept.name}</h3>
                <p className="text-on-surface-variant text-body-sm mb-md leading-relaxed">{dept.description || 'No description provided.'}</p>
              </div>
              <div className="pt-md border-t border-outline-variant/10 flex items-center justify-between text-[11px] text-on-surface-variant uppercase tracking-wider">
                <span>Created At</span>
                <span>{new Date(dept.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container">
              <h2 className="text-headline-sm font-bold text-on-surface">
                {editingDept ? 'Edit Department' : 'Create Department'}
              </h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Department Code</label>
                <input 
                  required
                  placeholder="e.g. CS-DEPT"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '-')})}
                  disabled={!!editingDept}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Department Name</label>
                <input 
                  required
                  placeholder="e.g. Department of Computer Science"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Description</label>
                <textarea 
                  placeholder="Provide details about the research areas or course allocations..."
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white resize-y" 
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">
                  {editingDept ? 'Update Details' : 'Register Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;

import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      // Assume API returns { data: [...] } or just an array
      const usersData = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '', roleId: '' });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create user. Please check your inputs.');
    }
  };

  // Quick stats calculation
  const totalActive = users.length;
  // Fallback avatar generator
  const getInitials = (first, last) => `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();

  return (
    <div className="p-gutter max-w-max-width mx-auto relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-xl">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">User Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage global access, roles, and institutional assignments across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
            Create User
          </button>
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Dashboard Layout (Sidebar + Main) */}
      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="font-label-md text-label-md text-on-surface mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
              Filter Results
            </h3>
            
            {/* Role Filter */}
            <div className="space-y-sm mb-lg">
              <p className="font-label-sm text-label-sm text-outline">BY ROLE</p>
              <label className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg cursor-pointer">
                <input defaultChecked className="rounded-xs text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
                <span className="font-body-sm text-body-sm">All Roles</span>
              </label>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-xl p-md border border-primary/10">
            <p className="font-label-sm text-label-sm text-primary font-bold mb-2">QUICK STATS</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/50 p-3 rounded-lg border border-white/80">
                <p className="text-[10px] text-outline">TOTAL USERS</p>
                <p className="text-xl font-bold text-primary">{loading ? '-' : totalActive}</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg border border-white/80">
                <p className="text-[10px] text-outline">NEW THIS WEEK</p>
                <p className="text-xl font-bold text-secondary">+0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Data Section */}
        <div className="flex-1 space-y-md">
          {error && (
            <div className="bg-error-container text-on-error-container p-md rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>error</span>
              {error}
            </div>
          )}
          
          {/* Data Table Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden ambient-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30">
                    <th className="px-6 py-4 font-label-sm text-label-sm text-outline">USER NAME</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-outline">EMAIL</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-outline">ROLE</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-outline">STATUS</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-outline text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-label-md text-label-md">
                              {getInitials(user.firstName, user.lastName) || 'U'}
                            </div>
                            <span className="font-body-md text-body-md font-semibold">{user.firstName} {user.lastName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-lg font-label-sm text-label-sm">
                            {user.role?.name || 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.isActive === false ? 'bg-error' : 'bg-emerald-500'}`}></div>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              {user.isActive === false ? 'Inactive' : 'Active'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant" title="Edit">
                              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>edit</span>
                            </button>
                            <button 
                              className="p-2 hover:bg-error/10 rounded-full text-error" 
                              title="Delete"
                              onClick={() => handleDelete(user.id)}
                            >
                              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Showing {users.length} entries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Create New User</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-xl space-y-md">
              <div className="flex gap-md">
                <div className="flex-1">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">First Name</label>
                  <input 
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Last Name</label>
                  <input 
                    required
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Email Address</label>
                <input 
                  type="email"
                  required
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Temporary Password</label>
                <input 
                  type="password"
                  required
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import { roleService, permissionService } from '../../services/api';

const AdminSecurity = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals & Drawers State
  const [isPermissionDrawerOpen, setIsPermissionDrawerOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [rolePermissions, setRolePermissions] = useState([]); 
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getAll(),
        permissionService.getAll()
      ]);

      setRoles(rolesRes?.data?.data || rolesRes?.data || []);
      setPermissions(permsRes?.data?.data || permsRes?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching security data', err);
      setError('Failed to load security configurations. Make sure roles/permissions endpoints are available.');
      setRoles([]);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  // --- ROLE CRUD ACTIONS ---

  const openCreateRole = () => {
    setRoleForm({ name: '', description: '' });
    setIsEditing(false);
    setIsRoleModalOpen(true);
  };

  const openEditRole = (role) => {
    setRoleForm({ name: role.name, description: role.description });
    setSelectedRole(role);
    setIsEditing(true);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await roleService.update(selectedRole.id, roleForm);
      } else {
        await roleService.create(roleForm);
      }
      setIsRoleModalOpen(false);
      fetchSecurityData(); // Refresh from backend
    } catch (err) {
      console.error('Error saving role', err);
      alert('Error saving role. Ensure backend endpoint is valid.');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this custom role?")) {
      try {
        await roleService.delete(roleId);
        fetchSecurityData();
      } catch (err) {
        console.error('Error deleting role', err);
        alert('Error deleting role.');
      }
    }
  };

  // --- PERMISSION MATRIX ACTIONS ---

  const openPermissionDrawer = (role) => {
    setSelectedRole(role);
    const assigned = Array.isArray(role.permissions) ? role.permissions.map(p => p.id || p) : [];
    setRolePermissions(assigned);
    setIsPermissionDrawerOpen(true);
  };

  const togglePermission = (permId) => {
    if (rolePermissions.includes(permId)) {
      setRolePermissions(rolePermissions.filter(id => id !== permId));
    } else {
      setRolePermissions([...rolePermissions, permId]);
    }
  };

  const savePermissions = async () => {
    try {
      await roleService.assignPermissions(selectedRole.id, { permissionIds: rolePermissions });
      alert('Permissions saved successfully!');
      fetchSecurityData(); // Refresh
    } catch (err) {
      console.error('Save permissions failed', err);
      alert('Failed to save permissions to backend.');
    }
    setIsPermissionDrawerOpen(false);
  };

  // Group permissions by resource for the matrix UI
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {});

  return (
    <div className="max-w-[1280px] mx-auto w-full py-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2xl">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Security & Access Control</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Create custom roles and assign granular permissions (RBAC) to your staff.</p>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-md mb-lg rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>warning</span>
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="font-headline-sm text-headline-sm">Active Roles</h3>
          <button onClick={openCreateRole} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md font-bold hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
            Create Custom Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Role Name</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Description</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Type</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-lg py-8 text-center text-on-surface-variant">Loading roles...</td>
                </tr>
              ) : (isSuperAdmin ? roles : roles.filter(r => r.name !== 'SUPER_ADMIN')).map(r => (
                <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-lg py-md font-body-md font-bold text-on-surface">{r.name}</td>
                  <td className="px-lg py-md text-body-sm text-on-surface-variant">{r.description}</td>
                  <td className="px-lg py-md">
                    <span className={`inline-flex items-center px-sm py-xs rounded-full font-label-md text-[11px] uppercase tracking-wider font-bold ${r.isSystem ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                      {r.isSystem ? 'SYSTEM' : 'CUSTOM'}
                    </span>
                  </td>
                  <td className="px-lg py-md text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openPermissionDrawer(r)} className="px-3 py-1.5 border border-outline-variant rounded-md hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Permissions
                      </button>
                      {!r.isSystem && (
                        <>
                          <button onClick={() => openEditRole(r)} className="p-1.5 hover:bg-surface-container-high rounded-full text-on-surface-variant" title="Edit">
                            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>edit</span>
                          </button>
                          <button onClick={() => handleDeleteRole(r.id)} className="p-1.5 hover:bg-error/10 rounded-full text-error" title="Delete">
                            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Creation/Edit Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">{isEditing ? 'Edit Role' : 'Create Custom Role'}</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsRoleModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveRole} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Role Name</label>
                <input 
                  required
                  placeholder="e.g. BILLING_ADMIN"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm uppercase" 
                  value={roleForm.name}
                  onChange={e => setRoleForm({...roleForm, name: e.target.value.toUpperCase()})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm resize-none" 
                  value={roleForm.description}
                  onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">{isEditing ? 'Save Changes' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Matrix Drawer */}
      {isPermissionDrawerOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setIsPermissionDrawerOpen(false)} />}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface-container-lowest shadow-2xl z-[101] flex flex-col transition-transform duration-300 ${isPermissionDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-start bg-white">
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface mb-1">Permission Matrix</h2>
            <p className="text-label-md text-primary font-bold">Editing Role: {selectedRole?.name}</p>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsPermissionDrawerOpen(false)}>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-xl space-y-xl">
          {Object.keys(groupedPermissions).map(resource => (
            <div key={resource} className="space-y-md">
              <h4 className="text-label-sm font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">
                Module: {resource}
              </h4>
              <div className="grid gap-sm">
                {groupedPermissions[resource].map(perm => {
                  const isChecked = rolePermissions.includes(perm.id);
                  return (
                    <label 
                      key={perm.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isChecked ? 'bg-primary/5 border-primary/30' : 'border-transparent hover:bg-surface-container-low'}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => togglePermission(perm.id)}
                        disabled={selectedRole?.isSystem}
                        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded-sm disabled:opacity-50"
                      />
                      <span className={`font-body-sm ${isChecked ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>{perm.action}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {selectedRole?.isSystem && (
            <div className="p-md bg-error-container text-on-error-container rounded-lg text-body-sm mt-md flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>info</span>
              System roles cannot have their permissions modified.
            </div>
          )}
        </div>

        <div className="p-xl border-t border-outline-variant bg-white">
          <button onClick={savePermissions} className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 disabled:opacity-50" disabled={selectedRole?.isSystem}>
            Save Role Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;

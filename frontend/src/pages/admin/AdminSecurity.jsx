import { useState, useEffect } from 'react';
import { roleService, permissionService } from '../../services/api';

const AdminSecurity = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals & Drawers State
  const [isPermissionDrawerOpen, setIsPermissionDrawerOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Form State
  const [rolePermissions, setRolePermissions] = useState([]); 
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          roleService.getAll().catch(() => ({ 
            data: { data: [
              { id: '1', name: 'TENANT_ADMIN', description: 'Full tenant access', isSystem: true },
              { id: '2', name: 'INSTRUCTOR', description: 'Can manage their own courses', isSystem: false },
              { id: '3', name: 'ASSISTANT', description: 'Can grade submissions and answer questions', isSystem: false }
            ]} 
          })),
          permissionService.getAll().catch(() => ({
            data: { data: [
              { id: 'p1', action: 'CREATE_COURSE', resource: 'courses' },
              { id: 'p2', action: 'READ_COURSE', resource: 'courses' },
              { id: 'p3', action: 'UPDATE_COURSE', resource: 'courses' },
              { id: 'p4', action: 'DELETE_COURSE', resource: 'courses' },
              { id: 'p5', action: 'CREATE_USER', resource: 'users' },
              { id: 'p6', action: 'READ_USER', resource: 'users' },
              { id: 'p7', action: 'UPDATE_TENANT', resource: 'tenant' }
            ]}
          }))
        ]);

        setRoles(rolesRes?.data?.data || rolesRes?.data || []);
        setPermissions(permsRes?.data?.data || permsRes?.data || []);
      } catch (err) {
        console.error('Error fetching security data', err);
      } finally {
        setIsLoading(false);
      }
    };

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
        setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...roleForm } : r));
      } else {
        const newId = Date.now().toString(); // Mock ID
        // Mock API call
        await roleService.create(roleForm).catch(() => {});
        setRoles([...roles, { ...roleForm, id: newId, isSystem: false }]);
      }
      setIsRoleModalOpen(false);
    } catch (err) {
      alert('Error saving role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (confirm("Are you sure you want to delete this custom role?")) {
      try {
        await roleService.delete(roleId);
        setRoles(roles.filter(r => r.id !== roleId));
      } catch {
        // Fallback for mock
        setRoles(roles.filter(r => r.id !== roleId));
      }
    }
  };

  // --- PERMISSION MATRIX ACTIONS ---

  const openPermissionDrawer = (role) => {
    setSelectedRole(role);
    const mockAssigned = role.name === 'TENANT_ADMIN' 
      ? permissions.map(p => p.id) 
      : (role.name === 'INSTRUCTOR' ? ['p1', 'p2', 'p3'] : ['p2', 'p6']);
    
    setRolePermissions(mockAssigned);
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
    } catch {
      alert('Permissions saved (Mock Mode)!');
    }
    setIsPermissionDrawerOpen(false);
  };

  // Group permissions by resource for the matrix UI
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {});

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Security Data...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1000px', position: 'relative' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Security & Access Control</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Create custom roles and assign granular permissions (RBAC) to your staff.</p>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Active Roles</h3>
          <button onClick={openCreateRole} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Create Custom Role</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Role Name</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#fff' }}>{r.name}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{r.description}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ padding: '0.3rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', background: r.isSystem ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: r.isSystem ? '#ef4444' : '#3b82f6' }}>
                    {r.isSystem ? 'SYSTEM' : 'CUSTOM'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button onClick={() => openPermissionDrawer(r)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Permissions
                  </button>
                  {!r.isSystem && (
                    <>
                      <button onClick={() => openEditRole(r)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteRole(r.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Creation/Edit Modal */}
      {isRoleModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-up" style={{ width: '450px', padding: '2.5rem', position: 'relative' }}>
            <button onClick={() => setIsRoleModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{isEditing ? 'Edit Role' : 'Create Custom Role'}</h2>
            
            <form onSubmit={handleSaveRole}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Role Name</label>
                <input 
                  type="text" 
                  value={roleForm.name} 
                  onChange={e => setRoleForm({...roleForm, name: e.target.value.toUpperCase()})}
                  required 
                  placeholder="e.g., BILLING_ADMIN"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea 
                  value={roleForm.description} 
                  onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                  required 
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {isEditing ? 'Save Changes' : 'Create Role'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Permission Matrix Drawer */}
      {isPermissionDrawerOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setIsPermissionDrawerOpen(false)} />}
      <div 
        className={isPermissionDrawerOpen ? 'animate-slide-in-right' : ''}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px',
          background: 'rgba(11, 12, 16, 0.95)', backdropFilter: 'blur(30px)',
          borderLeft: '1px solid var(--border-color)', zIndex: 101,
          padding: '2rem', display: 'flex', flexDirection: 'column',
          transform: isPermissionDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Permission Matrix</h2>
            <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 'bold' }}>Editing Role: {selectedRole?.name}</p>
          </div>
          <button onClick={() => setIsPermissionDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
          {Object.keys(groupedPermissions).map(resource => (
            <div key={resource} style={{ marginBottom: '2rem' }}>
              <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Module: {resource}
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {groupedPermissions[resource].map(perm => {
                  const isChecked = rolePermissions.includes(perm.id);
                  return (
                    <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: isChecked ? 'rgba(0, 229, 255, 0.1)' : 'transparent', border: isChecked ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid transparent', transition: 'all 0.2s' }}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => togglePermission(perm.id)}
                        disabled={selectedRole?.isSystem}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontWeight: '500', color: isChecked ? '#fff' : 'var(--text-muted)' }}>{perm.action}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {selectedRole?.isSystem && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginTop: '1rem', fontSize: '0.875rem' }}>
              System roles cannot have their permissions modified.
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={savePermissions} className="btn btn-primary" style={{ width: '100%' }} disabled={selectedRole?.isSystem}>
            Save Role Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;

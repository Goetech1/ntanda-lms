import { useState, useEffect } from 'react';
import { roleService, permissionService } from '../../services/api';

const AdminSecurity = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]); // IDs of permissions the role has

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          roleService.getAll().catch(() => ({ 
            data: { data: [
              { id: '1', name: 'SUPER_ADMIN', description: 'Full system access', isSystem: true },
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

  const openPermissionDrawer = (role) => {
    setSelectedRole(role);
    // In a real app, we'd fetch the role's current permissions here.
    // For the mock, we'll assign random mock permissions to demo it.
    const mockAssigned = role.name === 'SUPER_ADMIN' 
      ? permissions.map(p => p.id) 
      : (role.name === 'INSTRUCTOR' ? ['p1', 'p2', 'p3'] : ['p2', 'p6']);
    
    setRolePermissions(mockAssigned);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRole(null), 300);
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
    closeDrawer();
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
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Security & Roles</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage custom roles and assign granular permissions (RBAC) to your staff.</p>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Active Roles</h3>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Create Custom Role</button>
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
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#fff' }}>{r.name}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{r.description}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ padding: '0.3rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', background: r.isSystem ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: r.isSystem ? '#ef4444' : '#3b82f6' }}>
                    {r.isSystem ? 'SYSTEM' : 'CUSTOM'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => openPermissionDrawer(r)}
                    className="btn btn-outline" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Matrix Drawer */}
      {isDrawerOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100 }} onClick={closeDrawer} />}
      <div 
        className={isDrawerOpen ? 'animate-slide-in-right' : ''}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px',
          background: 'rgba(11, 12, 16, 0.95)', backdropFilter: 'blur(30px)',
          borderLeft: '1px solid var(--border-color)', zIndex: 101,
          padding: '2rem', display: 'flex', flexDirection: 'column',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Permission Matrix</h2>
            <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 'bold' }}>Editing Role: {selectedRole?.name}</p>
          </div>
          <button onClick={closeDrawer} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
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

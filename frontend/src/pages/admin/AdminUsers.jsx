const AdminUsers = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>User Management</h1>
        <button className="btn btn-primary">+ Invite User</button>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>A data table of all students, instructors, and admins will be rendered here.</p>
      </div>
    </div>
  );
};

export default AdminUsers;

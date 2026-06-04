const AdminCourses = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Course Management</h1>
        <button className="btn btn-primary">+ Create Course</button>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>A data table of all courses will be rendered here, allowing admins to edit, publish, and delete courses.</p>
      </div>
    </div>
  );
};

export default AdminCourses;

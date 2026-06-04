const AdminDashboard = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>$12,450</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Students</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>1,204</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Published Courses</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>24</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Tenants</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</div>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ color: 'var(--text-muted)' }}>
          Analytics charts and activity feeds will go here.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-wrapper">
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #4F46E5, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to Ntanda LMS
        </h1>
        <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          A modern learning management system. Please log in or register to access your dashboard.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary" style={{ minWidth: '120px' }}>Login</Link>
          <Link to="/register" className="btn btn-secondary" style={{ minWidth: '120px' }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

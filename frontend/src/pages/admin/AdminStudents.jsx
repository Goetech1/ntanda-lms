import { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer State
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await studentService.getAll().catch(() => ({
          data: { data: [
            { id: '1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', enrolledCourses: 3, gpa: 3.8, status: 'ACTIVE', lastActive: '2026-06-04' },
            { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', enrolledCourses: 1, gpa: 2.9, status: 'INACTIVE', lastActive: '2026-05-15' },
            { id: '3', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', enrolledCourses: 5, gpa: 4.0, status: 'ACTIVE', lastActive: '2026-06-03' }
          ]}
        }));
        
        setStudents(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching students', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading SIS...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Student Directory</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage enrolled students and view their academic profiles.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎓</span> Invite Student
        </button>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Student Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Courses</th>
              <th style={{ padding: '1rem' }}>GPA</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr 
                key={s.id} 
                onClick={() => setSelectedStudent(s)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.8rem' }}>
                    {s.firstName[0]}{s.lastName[0]}
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{s.firstName} {s.lastName}</span>
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{s.email}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{s.enrolledCourses}</td>
                <td style={{ padding: '1.25rem 1rem', color: '#fff', fontWeight: '500' }}>{s.gpa.toFixed(1)}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: s.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)', 
                    color: s.status === 'ACTIVE' ? '#10b981' : '#9ca3af',
                  }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 360 Profile Drawer */}
      {selectedStudent && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setSelectedStudent(null)} />}
      <div 
        className={selectedStudent ? 'animate-slide-in-right' : ''}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px',
          background: 'rgba(11, 12, 16, 0.95)', backdropFilter: 'blur(30px)',
          borderLeft: '1px solid var(--border-color)', zIndex: 101,
          padding: '2rem', display: 'flex', flexDirection: 'column',
          transform: selectedStudent ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Student Profile</h2>
          <button onClick={() => setSelectedStudent(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        {selectedStudent && (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '1.5rem', boxShadow: '0 4px 15px var(--primary-glow)' }}>
                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedStudent.email}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Average GPA</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{selectedStudent.gpa.toFixed(1)}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Enrolled Courses</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{selectedStudent.enrolledCourses}</div>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Recent Activity</h4>
              <p style={{ fontSize: '0.9rem', color: '#fff' }}>
                Last active on platform: <span style={{ color: 'var(--primary)' }}>{selectedStudent.lastActive}</span>
              </p>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ width: '100%' }}>View Full Transcript</button>
              <button className="btn btn-primary" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Suspend Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;

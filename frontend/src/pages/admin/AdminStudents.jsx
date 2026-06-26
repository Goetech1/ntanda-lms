import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer/Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await studentService.getAll().catch(() => ({ data: [] }));
        const data = res?.data?.data || res?.data || [];
        
        if (data.length === 0) {
          setStudents([
            { id: '1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', enrolledCourses: 3, gpa: 3.8, status: 'ACTIVE', lastActive: '2026-06-04' },
            { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', enrolledCourses: 1, gpa: 2.9, status: 'INACTIVE', lastActive: '2026-05-15' },
            { id: '3', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', enrolledCourses: 5, gpa: 4.0, status: 'ACTIVE', lastActive: '2026-06-03' }
          ]);
        } else {
          setStudents(data);
        }
      } catch (err) {
        console.error('Error fetching students', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Core System</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Students</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Student Directory</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Manage enrolled students and view their academic profiles.</p>
        </div>
        <div className="flex items-center gap-md">
          <button className="px-lg py-3 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>person_add</span>
            Invite Student
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="space-y-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">All Students</h3>
          <div className="flex gap-md">
            <button className="px-md py-2 bg-white border border-outline-variant rounded-lg text-on-surface-variant text-body-sm flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Student Name</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Email</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Courses</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">GPA</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan="5" className="px-lg py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : students.map((s) => (
                <tr 
                  key={s.id} 
                  className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(s)}
                >
                  <td className="px-lg py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                        {s.firstName?.[0] || ''}{s.lastName?.[0] || ''}
                      </div>
                      <span className="text-body-sm font-bold text-on-surface">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{s.email}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{s.enrolledCourses || 0}</td>
                  <td className="px-lg py-4 text-body-sm font-bold text-on-surface">{(s.gpa || 0).toFixed(1)}</td>
                  <td className="px-lg py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${s.status === 'ACTIVE' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {s.status || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 360 Profile Modal/Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col border-l border-outline-variant">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white shrink-0">
              <h2 className="text-headline-sm font-bold text-on-surface">Student Profile</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setSelectedStudent(null)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <div className="p-xl space-y-xl flex-1">
              <div className="flex items-center gap-md bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                  {selectedStudent.firstName?.[0] || ''}{selectedStudent.lastName?.[0] || ''}
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface mb-xs">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <div className="text-body-sm text-on-surface-variant">{selectedStudent.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl">
                  <div className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Average GPA</div>
                  <div className="font-display-sm font-bold text-on-surface">{(selectedStudent.gpa || 0).toFixed(1)}</div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl">
                  <div className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Enrolled Courses</div>
                  <div className="font-display-sm font-bold text-on-surface">{selectedStudent.enrolledCourses || 0}</div>
                </div>
              </div>

              <div>
                <h4 className="font-label-md text-on-surface font-bold border-b border-outline-variant pb-xs mb-md">Recent Activity</h4>
                <p className="text-body-sm text-on-surface-variant">
                  Last active on platform: <span className="text-primary font-medium">{selectedStudent.lastActive || 'Unknown'}</span>
                </p>
              </div>
            </div>

            <div className="p-xl border-t border-outline-variant bg-surface-container-lowest shrink-0 space-y-md">
              <button className="w-full px-lg py-3 border border-outline-variant font-bold text-on-surface rounded-lg hover:bg-surface-container-low transition-colors">
                View Full Transcript
              </button>
              <button className="w-full px-lg py-3 bg-error/10 border border-error/30 text-error font-bold rounded-lg hover:bg-error/20 transition-colors">
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;

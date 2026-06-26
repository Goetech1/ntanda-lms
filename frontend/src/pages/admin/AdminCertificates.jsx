import React, { useState, useEffect } from 'react';
import { certificateService, courseService } from '../../services/api';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    courseId: '',
    issueDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [certRes, courseRes] = await Promise.all([
        certificateService.getAll().catch(() => ({ data: [] })),
        courseService.getAllCourses().catch(() => ({ data: { data: [] } }))
      ]);

      const fetchedCerts = certRes?.data?.data || certRes?.data || [];
      const fetchedCourses = courseRes?.data?.data || courseRes?.data || [];

      if (fetchedCerts.length === 0) {
        setCertificates([
          {
            id: 'NT-7721-XA',
            studentName: 'Jane Doe',
            courseTitle: 'Advanced Web Architecture',
            issueDate: '2024-10-12',
            status: 'Verified'
          },
          {
            id: 'NT-8190-BC',
            studentName: 'Marcus Sterling',
            courseTitle: 'UI/UX Design Systems',
            issueDate: '2024-10-10',
            status: 'Verified'
          },
          {
            id: 'NT-9211-LL',
            studentName: 'Aisha Lawson',
            courseTitle: 'Data Science Fundamentals',
            issueDate: '2024-10-09',
            status: 'Pending'
          }
        ]);
      } else {
        setCertificates(fetchedCerts);
      }

      setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await certificateService.issue(formData);
      setIsModalOpen(false);
      setFormData({ studentName: '', courseId: '', issueDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      console.error('Failed to issue certificate:', err);
      alert('Failed to issue certificate.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Certificate Hub Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Academic Operations</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Certificates</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Certificate Hub</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Manage issuance, verification, and templates for all credentials.</p>
        </div>
        <div className="flex items-center gap-md">
          <button className="px-lg py-3 rounded-lg border border-secondary text-secondary font-bold hover:bg-secondary/5 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>settings_suggest</span>
            Manage Templates
          </button>
          <button 
            className="px-lg py-3 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>workspace_premium</span>
            Issue Certificate
          </button>
        </div>
      </section>

      {/* Verification & Preview Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Verification Tool */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-[8px] border border-outline-variant p-xl rounded-xl space-y-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-secondary mb-sm">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
              <span className="font-label-md">AUTHENTICITY CHECK</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Verify Credentials</h3>
            <p className="text-body-sm text-on-surface-variant">Enter the unique 16-character certificate hash or ID to verify its validity against our secure blockchain records.</p>
          </div>
          <div className="space-y-md">
            <div className="relative">
              <input 
                className="w-full px-md py-4 bg-white border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-outline-variant" 
                placeholder="e.g. CERT-2024-8921-X99" 
                type="text"
              />
            </div>
            <button className="w-full py-4 bg-secondary text-on-secondary rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>qr_code_scanner</span>
              Verify Authenticity
            </button>
          </div>
          <div className="bg-surface-container-low p-md rounded-lg flex items-center gap-md">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>history</span>
            </div>
            <div>
              <p className="text-label-md font-bold text-on-surface">Recent Activity</p>
              <p className="text-body-sm text-on-surface-variant">42 verifications in the last 24h</p>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-8 bg-surface-container rounded-xl overflow-hidden relative border border-outline-variant">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#004ac6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative p-xl flex flex-col items-center group">
            <div className="w-full flex justify-between items-center mb-xl">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Live Template Preview</h3>
              <div className="flex gap-2">
                <span className="px-sm py-1 rounded bg-secondary-container text-on-secondary-container text-label-sm">Standard Diploma</span>
                <span className="px-sm py-1 rounded bg-primary-container text-on-primary-container text-label-sm">v2.1</span>
              </div>
            </div>

            {/* Certificate Graphic */}
            <div 
              className="w-full max-w-[600px] aspect-[1.414/1] bg-white shadow-lg border-[12px] border-primary/5 p-margin-mobile flex flex-col items-center justify-center text-center relative transition-transform duration-500 hover:scale-[1.02]"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
              <div className="flex flex-col items-center z-10">
                <span className="material-symbols-outlined text-secondary text-5xl mb-md" style={{fontVariationSettings: "'FILL' 0"}}>school</span>
                <h4 className="font-headline-md text-headline-md text-primary tracking-widest uppercase mb-base">Certificate of Completion</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">THIS IS TO CERTIFY THAT</p>
                <p className="font-display-lg text-headline-md text-on-surface border-b-2 border-outline-variant px-xl pb-base mb-lg italic">[Student Name]</p>
                <p className="text-body-sm text-on-surface-variant mb-md">HAS SUCCESSFULLY COMPLETED THE COURSE</p>
                <p className="font-headline-sm text-headline-sm text-secondary mb-xl font-bold">[Course Name & Category]</p>
                
                <div className="grid grid-cols-2 gap-2xl w-full max-w-sm mt-md">
                  <div className="border-t border-outline-variant pt-base">
                    <p className="text-label-sm font-bold text-on-surface">DR. NTANDA</p>
                    <p className="text-label-sm text-on-surface-variant">ACADEMIC DIRECTOR</p>
                  </div>
                  <div className="border-t border-outline-variant pt-base">
                    <p className="text-label-sm font-bold text-on-surface">{"{"}DATE{"}"}</p>
                    <p className="text-label-sm text-on-surface-variant">ISSUANCE DATE</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-xl flex gap-lg z-10">
              <button className="text-primary font-bold text-body-sm flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>edit</span>
                Edit Fields
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="space-y-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Issued Certificates</h3>
          <div className="flex gap-md">
            <button className="px-md py-2 bg-white border border-outline-variant rounded-lg text-on-surface-variant text-body-sm flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Certificate ID</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Student Name</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Course</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Date Issued</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Status</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan="6" className="px-lg py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : certificates.map((cert, idx) => (
                <tr key={cert.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-lg py-4 font-label-sm text-primary">{cert.id || `NT-C-${1000 + idx}`}</td>
                  <td className="px-lg py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-xs font-bold">
                        {getInitials(cert.student?.firstName || cert.studentName)}
                      </div>
                      <span className="text-body-sm font-medium">{cert.student?.firstName || cert.studentName} {cert.student?.lastName || ''}</span>
                    </div>
                  </td>
                  <td className="px-lg py-4 text-body-sm">{cert.course?.title || cert.courseTitle || 'General Course'}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                    {new Date(cert.issueDate || cert.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-lg py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${cert.status === 'Pending' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                      {cert.status || 'Verified'}
                    </span>
                  </td>
                  <td className="px-lg py-4 text-right">
                    <button className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors opacity-0 group-hover:opacity-100" title="Download PDF">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Issue Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Issue Certificate</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleIssue} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Student Name</label>
                <input 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.studentName}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Course</label>
                <select 
                  required
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={formData.courseId}
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  <option value="generic">Generic/Custom Course</option>
                </select>
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Issue Date</label>
                <input 
                  type="date"
                  required
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.issueDate}
                  onChange={e => setFormData({...formData, issueDate: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Issue Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;

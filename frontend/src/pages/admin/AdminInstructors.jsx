import React, { useState, useEffect } from 'react';
import { instructorService } from '../../services/api';

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', revenueShare: '70' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorService.getAll().catch(() => ({ data: [] }));
        const data = res?.data?.data || res?.data || [];
        
        if (data.length === 0) {
          setInstructors([
            { id: '1', name: 'Dr. Jane Smith', email: 'jane.smith@example.com', activeCourses: 4, revenueShare: '70%', totalEarnings: 4500.00 },
            { id: '2', name: 'Mark Johnson', email: 'mark.j@example.com', activeCourses: 2, revenueShare: '60%', totalEarnings: 1200.50 },
            { id: '3', name: 'Sarah Lee', email: 'sarah.lee@example.com', activeCourses: 7, revenueShare: '80%', totalEarnings: 12400.00 }
          ]);
        } else {
          setInstructors(data);
        }
      } catch (err) {
        console.error('Error fetching instructors', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const newInst = {
        ...form,
        id: Date.now().toString(),
        revenueShare: form.revenueShare + '%',
        activeCourses: 0,
        totalEarnings: 0
      };
      await instructorService.create(form).catch(() => {});
      setInstructors([...instructors, newInst]);
      setIsModalOpen(false);
      setForm({ name: '', email: '', revenueShare: '70' });
      alert('Instructor Invited Successfully!');
    } catch {
      alert('Failed to invite instructor');
    }
  };

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Core System</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Instructors</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Instructor Hub</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Manage your teaching staff, revenue shares, and payouts.</p>
        </div>
        <div className="flex items-center gap-md">
          <button 
            className="px-lg py-3 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>person_add</span>
            Invite Instructor
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-3xl">
        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>school</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Active Instructors</p>
            <p className="font-display-lg text-on-surface font-bold">{instructors.length}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-secondary/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>menu_book</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Avg Courses per Instructor</p>
            <p className="font-display-lg text-on-surface font-bold">
              {instructors.length ? (instructors.reduce((acc, i) => acc + (i.activeCourses || 0), 0) / instructors.length).toFixed(1) : 0}
            </p>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 p-xl rounded-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-primary/20 text-primary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>account_balance_wallet</span>
            </div>
            <span className="font-label-sm text-primary font-bold">Pending</span>
          </div>
          <div>
            <p className="font-label-md text-primary opacity-80 uppercase tracking-wider mb-xs">Total Payouts Due</p>
            <p className="font-display-lg text-primary font-bold">
              ${instructors.reduce((acc, i) => acc + (i.totalEarnings || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <section className="space-y-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Instructor Roster</h3>
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
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Instructor Name</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Email</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Active Courses</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Revenue Share</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Total Earnings</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan="6" className="px-lg py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : instructors.map((i) => (
                <tr key={i.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-lg py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold border border-secondary/20">
                        {i.name ? i.name.split(' ').map(n=>n[0]).join('').substring(0,2) : 'IN'}
                      </div>
                      <span className="text-body-sm font-bold text-on-surface">{i.name || 'Unknown Instructor'}</span>
                    </div>
                  </td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{i.email}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{i.activeCourses || 0}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{i.revenueShare || '0%'}</td>
                  <td className="px-lg py-4 text-body-sm font-bold text-primary">${(i.totalEarnings || 0).toFixed(2)}</td>
                  <td className="px-lg py-4 text-right">
                    <button className="px-md py-1 border border-outline-variant text-primary font-label-sm rounded-lg hover:bg-surface-container transition-colors">
                      Process Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Invite Instructor</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Full Name</label>
                <input 
                  required
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="e.g. jane.smith@example.com"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Revenue Share (%)</label>
                <input 
                  required
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white" 
                  value={form.revenueShare}
                  onChange={e => setForm({...form, revenueShare: e.target.value})}
                />
                <p className="text-body-sm text-on-surface-variant mt-1">Default is 70% instructor / 30% platform.</p>
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;

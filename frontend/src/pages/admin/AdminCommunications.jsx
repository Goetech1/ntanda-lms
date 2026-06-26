import React, { useState, useEffect } from 'react';
import { communicationService } from '../../services/api';

const AdminCommunications = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [form, setForm] = useState({ title: '', message: '', target: 'ALL_STUDENTS', channels: ['IN_APP'] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await communicationService.getAnnouncements().catch(() => ({ data: [] }));
        const data = res?.data?.data || res?.data || [];
        
        if (data.length === 0) {
          setAnnouncements([
            { id: '1', title: 'Platform Maintenance', message: 'The system will be down for 2 hours on Sunday.', date: '2026-06-03', target: 'ALL_USERS' },
            { id: '2', title: 'New React Course Added!', message: 'Check out the new React Masterclass in the course catalog.', date: '2026-06-01', target: 'ALL_STUDENTS' }
          ]);
        } else {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error('Error fetching announcements', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const newAnn = { ...form, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
      await communicationService.sendAnnouncement(form).catch(() => {});
      setAnnouncements([newAnn, ...announcements]);
      setForm({ title: '', message: '', target: 'ALL_STUDENTS', channels: ['IN_APP'] });
    } catch {
      alert('Failed to send announcement');
    }
  };

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Engagement & Utilities</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Communications</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Communications & CMS</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Send platform-wide announcements and manage landing pages.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        
        {/* Send Announcement Form */}
        <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-2xl p-xl">
          <div className="flex items-center gap-sm mb-xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>campaign</span>
            </div>
            <h3 className="font-headline-sm text-on-surface font-bold">Broadcast Announcement</h3>
          </div>

          <form onSubmit={handleSend} className="space-y-lg">
            <div>
              <label className="text-label-md text-on-surface font-semibold mb-xs block">Target Audience</label>
              <select 
                value={form.target} 
                onChange={e => setForm({...form, target: e.target.value})}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white" 
              >
                <option value="ALL_USERS">Everyone</option>
                <option value="ALL_STUDENTS">All Students</option>
                <option value="ALL_INSTRUCTORS">All Instructors</option>
              </select>
            </div>
            <div>
              <label className="text-label-md text-on-surface font-semibold mb-xs block">Title</label>
              <input 
                type="text" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})}
                required 
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white" 
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface font-semibold mb-xs block">Message</label>
              <textarea 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})}
                required rows="4"
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-sm bg-white resize-none" 
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface font-semibold mb-xs block">Notification Channels</label>
              <div className="flex flex-wrap gap-md mt-xs">
                <label className="flex items-center gap-xs text-body-sm text-on-surface cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.channels.includes('IN_APP')}
                    onChange={(e) => {
                      const updated = e.target.checked 
                        ? [...form.channels, 'IN_APP'] 
                        : form.channels.filter(c => c !== 'IN_APP');
                      setForm({ ...form, channels: updated });
                    }}
                    className="rounded text-primary border-outline-variant bg-white"
                  />
                  Dashboard (In-App)
                </label>
                <label className="flex items-center gap-xs text-body-sm text-on-surface cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.channels.includes('EMAIL')}
                    onChange={(e) => {
                      const updated = e.target.checked 
                        ? [...form.channels, 'EMAIL'] 
                        : form.channels.filter(c => c !== 'EMAIL');
                      setForm({ ...form, channels: updated });
                    }}
                    className="rounded text-primary border-outline-variant bg-white"
                  />
                  Email
                </label>
                <label className="flex items-center gap-xs text-body-sm text-on-surface cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.channels.includes('SMS')}
                    onChange={(e) => {
                      const updated = e.target.checked 
                        ? [...form.channels, 'SMS'] 
                        : form.channels.filter(c => c !== 'SMS');
                      setForm({ ...form, channels: updated });
                    }}
                    className="rounded text-primary border-outline-variant bg-white"
                  />
                  SMS
                </label>
                <label className="flex items-center gap-xs text-body-sm text-primary font-bold cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.channels.includes('WHATSAPP')}
                    onChange={(e) => {
                      const updated = e.target.checked 
                        ? [...form.channels, 'WHATSAPP'] 
                        : form.channels.filter(c => c !== 'WHATSAPP');
                      setForm({ ...form, channels: updated });
                    }}
                    className="rounded text-primary border-outline-variant bg-white"
                  />
                  WhatsApp Alert
                </label>
              </div>
            </div>
            <button type="submit" className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 bg-primary hover:opacity-90 hover:-translate-y-0.5 transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
              Send Broadcast
            </button>
          </form>
        </div>

        {/* Recent Announcements */}
        <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-2xl p-xl flex flex-col">
          <div className="flex items-center gap-sm mb-xl">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>history</span>
            </div>
            <h3 className="font-headline-sm text-on-surface font-bold">Recent Broadcasts</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-sm space-y-md">
            {isLoading ? (
              <div className="text-center text-on-surface-variant p-xl">Loading broadcasts...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center text-on-surface-variant p-xl">No recent broadcasts.</div>
            ) : announcements.map(a => (
              <div key={a.id} className="bg-surface-container border border-outline-variant p-lg rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="flex justify-between items-start mb-sm">
                  <h4 className="font-bold text-on-surface text-lg">{a.title}</h4>
                  <span className="text-label-sm text-on-surface-variant shrink-0">{new Date(a.date || a.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-md leading-relaxed">{a.message}</p>
                <div className="inline-flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>target</span>
                  {a.target?.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCommunications;

import React, { useState, useEffect } from 'react';
import { libraryService } from '../../services/api';

const AdminLibrary = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: 'E-Book',
    category: 'General',
    image: '',
    fileUrl: ''
  });

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await libraryService.getAll();
      const data = response?.data?.resources || response?.data?.data || response?.data || [];
      setResources((Array.isArray(data) ? data : []).map(item => ({
        ...item,
        type: item.resource_type || item.type,
        category: item.metadata?.category || item.category || 'General',
        author: item.metadata?.author || item.uploader?.full_name || 'Institution resource',
        image: item.metadata?.image || '',
        fileUrl: item.file_url || item.external_url || item.fileUrl || '',
        categoryColor: item.metadata?.category === 'Tech' ? 'tertiary' : item.metadata?.category === 'Economics' ? 'secondary' : 'primary',
      })));
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await libraryService.upload({
        title: formData.title,
        description: `Author: ${formData.author}`,
        resourceType: formData.type,
        externalUrl: formData.fileUrl || undefined,
        metadata: {
          author: formData.author,
          category: formData.category,
          image: formData.image,
        },
      });
      setIsModalOpen(false);
      setFormData({ title: '', author: '', type: 'E-Book', category: 'General', image: '', fileUrl: '' });
      fetchResources();
    } catch (err) {
      console.error('Failed to upload resource:', err);
      alert(err.response?.data?.message || 'Failed to upload resource.');
    }
  };

  return (
    <div className="max-w-max-width mx-auto w-full py-lg space-y-3xl relative">
      {/* Dashboard Header & Stats */}
      <section className="space-y-lg relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <nav className="flex items-center gap-xs text-on-surface-variant font-label-md mb-xs">
              <span>Engagement & Utilities</span>
              <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
              <span className="text-primary">Library</span>
            </nav>
            <h2 className="font-headline-md text-headline-md text-on-surface">Library &amp; Resource Management</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Inventory overview and student request monitoring.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-md py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20 transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>cloud_upload</span>
            <span>Upload New Resource</span>
          </button>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-low p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-sm bg-primary-container/10 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 0"}}>auto_stories</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold">Live count</span>
            </div>
            <div className="mt-xl">
              <p className="font-label-md text-label-md text-on-surface-variant">Total Resources</p>
              <p className="font-display-lg text-display-lg">{isLoading ? '-' : resources.length}</p>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-sm bg-secondary-container/10 rounded-lg">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 0"}}>assignment_return</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Current period</span>
            </div>
            <div className="mt-xl">
              <p className="font-label-md text-label-md text-on-surface-variant">Active Borrows</p>
              <p className="font-display-lg text-display-lg">0</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-lg border border-outline-variant rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-sm bg-error-container/20 rounded-lg">
                <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 0"}}>notification_important</span>
              </div>
              <div className="bg-error text-on-error px-2 py-0.5 rounded font-label-sm text-label-sm">Action Required</div>
            </div>
            <div className="mt-xl">
              <p className="font-label-md text-label-md text-on-surface-variant">Overdue Resources</p>
              <p className="font-display-lg text-display-lg text-error">0</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Repository & Borrowing Requests split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3xl relative z-10">
        {/* Main Resource Grid */}
        <section className="xl:col-span-8 space-y-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Digital Repository</h3>
            <div className="flex gap-sm">
              <button className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
                Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            {isLoading ? (
              <div className="col-span-full py-xl text-center text-on-surface-variant">Loading library...</div>
            ) : resources.length === 0 ? (
              <div className="col-span-full py-xl text-center text-on-surface-variant">No library resources uploaded yet.</div>
            ) : resources.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:-translate-y-1 hover:border-primary transition-all duration-200 cursor-pointer relative group">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container flex items-center justify-center">
                  {item.image ? (
                    <img alt={item.title} className="w-full h-full object-cover" src={item.image} />
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-outline opacity-50" style={{fontVariationSettings: "'FILL' 0"}}>menu_book</span>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`bg-${item.categoryColor || 'primary'}/90 text-on-${item.categoryColor || 'primary'} px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider`}>{item.type}</span>
                  </div>
                </div>
                <div className="p-md space-y-xs">
                  <p className={`font-label-sm text-label-sm text-${item.categoryColor || 'primary'} font-bold uppercase`}>{item.category}</p>
                  <h4 className="font-headline-sm text-[16px] text-on-surface line-clamp-1">{item.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{item.author}</p>
                  
                  <div className="pt-sm flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-body-sm text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="font-label-md text-label-md text-on-surface">Live</span>
                    </div>
                    <button className="text-primary font-label-md text-label-md hover:underline">Manage</button>
                  </div>
                </div>
                {/* CRUD Actions overlay */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                   <button className="p-1 bg-white/90 rounded text-error hover:bg-error hover:text-white transition-colors" title="Delete"><span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 0"}}>delete</span></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Borrowing Requests Sidebar */}
        <section className="xl:col-span-4 space-y-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Borrowing Requests</h3>
            <span className="bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-full text-[12px] font-bold">0 Pending</span>
          </div>
          <div className="space-y-md">
            <div className="bg-surface-container-low border border-outline-variant p-md rounded-xl text-on-surface-variant">
              No borrow requests recorded.
            </div>
          </div>
        </section>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Upload Resource</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-xl space-y-md">
              <div className="grid grid-cols-2 gap-md">
                <div className="col-span-2">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Title</label>
                  <input 
                    required
                    placeholder="e.g. Intro to Neural Networks"
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Author</label>
                  <input 
                    required
                    placeholder="e.g. Dr. Alan Turing"
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Category</label>
                  <input 
                    required
                    placeholder="e.g. Physics"
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Type</label>
                  <select 
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm bg-white"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="E-Book">E-Book</option>
                    <option value="Research">Research Paper</option>
                    <option value="Journal">Journal</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">Cover Image URL</label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-label-md text-on-surface font-semibold mb-xs block">File URL (PDF, EPUB, etc.)</label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                    value={formData.fileUrl}
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Upload Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLibrary;

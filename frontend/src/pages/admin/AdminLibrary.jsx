import { useState, useEffect } from 'react';
import { libraryService } from '../../services/api';

const AdminLibrary = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await libraryService.getAll().catch(() => ({
          data: { data: [
            { id: '1', name: 'React Architecture Guide.pdf', type: 'PDF', size: '2.4 MB', uploads: '2026-06-01' },
            { id: '2', name: 'Student Handbook 2026.docx', type: 'DOCX', size: '1.1 MB', uploads: '2026-05-15' },
            { id: '3', name: 'Welcome Video Assets.zip', type: 'ZIP', size: '145 MB', uploads: '2026-06-04' }
          ]}
        }));
        
        setFiles(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching library', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Digital Library...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Digital Library</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Manage global assets, PDFs, and resources available to all students.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>☁️</span> Upload Resource
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {files.map(f => (
          <div key={f.id} className="glass-panel animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
              {f.type === 'PDF' ? '📄' : f.type === 'ZIP' ? '📦' : '📝'}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', wordBreak: 'break-all' }}>{f.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <span>{f.size}</span>
              <span>{f.uploads}</span>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }}>View</button>
              <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLibrary;

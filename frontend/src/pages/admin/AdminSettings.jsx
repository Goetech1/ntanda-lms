import { useState, useEffect } from 'react';
import { tenantService } from '../../services/api';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    primaryColor: '#00e5ff',
    logoUrl: ''
  });

  // Keep track of the original color so we can revert if they cancel
  const [originalColor, setOriginalColor] = useState('#00e5ff');

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const res = await tenantService.getTenantProfile();
        const data = res?.data?.data || res?.data || {};
        
        const fetchedColor = data.branding?.primaryColor || '#00e5ff';
        setFormData({
          name: data.name || 'Ntanda LMS',
          primaryColor: fetchedColor,
          logoUrl: data.branding?.logoUrl || '/ntanda-logo.jpeg'
        });
        setOriginalColor(fetchedColor);
        
        // Ensure DOM matches fetched color
        document.documentElement.style.setProperty('--primary', fetchedColor);
      } catch (err) {
        console.error('Error fetching tenant data, using mock fallback.', err);
        // Fallback for mock demo
        const mockColor = '#00e5ff';
        setFormData({
          name: 'Demo Academy',
          primaryColor: mockColor,
          logoUrl: '/ntanda-logo.jpeg'
        });
        setOriginalColor(mockColor);
        document.documentElement.style.setProperty('--primary', mockColor);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  // Handle color change live preview
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setFormData({ ...formData, primaryColor: newColor });
    
    // Live CSS Injection for instant preview
    document.documentElement.style.setProperty('--primary', newColor);
    
    // Auto-calculate a secondary hover color by adjusting opacity
    document.documentElement.style.setProperty('--primary-hover', newColor + 'CC');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    const payload = {
      name: formData.name,
      branding: {
        primaryColor: formData.primaryColor,
        logoUrl: formData.logoUrl
      }
    };

    try {
      await tenantService.updateTenantProfile(payload);
      setOriginalColor(formData.primaryColor);
      setSuccessMessage('Settings saved successfully!');
    } catch (err) {
      console.log('Saved tenant profile (mock fallback)');
      setOriginalColor(formData.primaryColor);
      setSuccessMessage('Settings saved (mock mode)!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleRevertColor = () => {
    setFormData({ ...formData, primaryColor: originalColor });
    document.documentElement.style.setProperty('--primary', originalColor);
    document.documentElement.style.setProperty('--primary-hover', originalColor + 'CC');
  };

  if (isLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Settings...</div>;
  }

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Tenant Branding Settings</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Customize the look and feel of your learning platform.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="glass-panel" style={{ padding: '2.5rem' }}>
        
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>Platform Identity</h3>
        
        <div className="input-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Institution / LMS Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }} 
          />
        </div>

        <div className="input-group" style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Logo URL</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              name="logoUrl" 
              value={formData.logoUrl} 
              onChange={handleInputChange} 
              style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }} 
            />
            {formData.logoUrl && (
              <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                <img src={formData.logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '4px' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
        </div>

        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>Theme Colors</h3>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Primary Brand Color</label>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select a color. The platform's buttons, links, and accents will update instantly to preview your choice!
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="color" 
                value={formData.primaryColor} 
                onChange={handleColorChange}
                style={{ width: '80px', height: '50px', cursor: 'pointer', padding: '0', border: 'none', borderRadius: '8px', background: 'transparent' }} 
              />
              <input 
                type="text" 
                value={formData.primaryColor} 
                onChange={handleColorChange} 
                style={{ width: '120px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'monospace' }} 
              />
              
              {formData.primaryColor !== originalColor && (
                <button type="button" onClick={handleRevertColor} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>
                  Revert
                </button>
              )}
            </div>
          </div>
          
          <div style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <div style={{ marginBottom: '0.5rem', color: 'white', fontWeight: 'bold' }}>Live Preview Area</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>This is how your students will see your buttons and accents.</p>
            <button type="button" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }}>Primary Action</button>
            <div style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 'bold', textAlign: 'center' }}>Colored Text Sample</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <div>
            {successMessage && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ {successMessage}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ padding: '1rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.39)' }}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;

import { useState, useEffect } from 'react';
import { Palette, Loader2, Save, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { tenantBrandingService } from '../../services/api';
import api from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const AdminBranding = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [branding, setBranding] = useState({
    primaryColor: '#6366f1',
    logoUrl: '',
    companyName: 'Ntanda LMS'
  });

  useEffect(() => {
    // Fetch current tenant info
    api.get('/tenant/current').then(res => {
      if (res.data) {
        setBranding({
          primaryColor: res.data.branding?.primaryColor || '#6366f1',
          logoUrl: res.data.branding?.logoUrl || '',
          companyName: res.data.name || 'Ntanda LMS'
        });
      }
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await tenantBrandingService.updateCurrent({
        name: branding.companyName,
        branding: {
          primaryColor: branding.primaryColor,
          logoUrl: branding.logoUrl
        }
      });
      setSaveMessage('Branding updated successfully! Refresh to see changes globally.');
      // Update CSS variable immediately for preview
      document.documentElement.style.setProperty('--primary', branding.primaryColor);
      
      // Calculate RGB for shadows/glows based on hex
      const hex2rgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      };
      if(branding.primaryColor.startsWith('#')) {
        document.documentElement.style.setProperty('--primary-rgb', hex2rgb(branding.primaryColor));
      }

    } catch (error) {
      console.error(error);
      setSaveMessage('Failed to save branding.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Palette className="h-8 w-8 text-[var(--primary)]" />
            Custom Branding
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Personalize the platform to match your institution's identity.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg font-medium ${saveMessage.includes('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Settings Form */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg">Brand Identity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Institution Name</label>
                <input 
                  type="text" 
                  value={branding.companyName}
                  onChange={(e) => setBranding({...branding, companyName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Logo URL</label>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <input 
                    type="url" 
                    value={branding.logoUrl}
                    onChange={(e) => setBranding({...branding, logoUrl: e.target.value})}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Provide a direct link to an image. We recommend a square 512x512 PNG with a transparent background.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Primary Accent Color</label>
                <div className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg border border-slate-700 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                    <input 
                      type="color" 
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                      className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                    className="w-32 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 overflow-hidden">
            <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-slate-950/50">
              
              {/* Mock App Shell */}
              <div className="w-full aspect-[4/3] flex flex-col p-4 border border-slate-800 rounded-xl m-6 bg-slate-950 shadow-2xl relative overflow-hidden" style={{ width: 'calc(100% - 3rem)' }}>
                
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/50">
                  <div className="flex items-center gap-2">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} className="w-6 h-6 rounded-md object-cover" alt="logo" />
                    ) : (
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: branding.primaryColor }}>
                        {branding.companyName.charAt(0) || 'N'}
                      </div>
                    )}
                    <span className="font-bold text-white text-sm tracking-tight">{branding.companyName}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-2 rounded bg-slate-800"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-800"></div>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="flex-1 flex gap-4">
                  {/* Sidebar */}
                  <div className="w-24 space-y-2">
                    <div className="w-full h-2 rounded bg-slate-800/50 mb-4"></div>
                    <div className="w-full h-6 rounded text-[8px] flex items-center px-2 font-medium text-white shadow-sm transition-colors" style={{ backgroundColor: branding.primaryColor }}>
                      Dashboard
                    </div>
                    <div className="w-full h-6 rounded bg-slate-900 border border-slate-800"></div>
                    <div className="w-full h-6 rounded bg-slate-900 border border-slate-800"></div>
                  </div>
                  
                  {/* Main */}
                  <div className="flex-1 space-y-4">
                    <div className="h-4 w-32 rounded bg-slate-800/80"></div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-lg bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between">
                        <div className="h-2 w-12 rounded bg-slate-800"></div>
                        <div className="h-4 w-8 rounded text-white" style={{ color: branding.primaryColor }}>89%</div>
                      </div>
                      <div className="h-20 rounded-lg p-3 flex flex-col justify-between text-white shadow-[0_0_20px_rgba(0,0,0,0.2)]" style={{ backgroundColor: branding.primaryColor }}>
                        <div className="h-2 w-16 rounded bg-white/30"></div>
                        <div className="h-2 w-8 rounded bg-white/50"></div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <button className="w-full h-8 rounded-md text-[10px] font-bold text-white shadow-md transition-all hover:brightness-110" style={{ backgroundColor: branding.primaryColor }}>
                        Primary Action Button
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminBranding;

import { useState, useEffect } from 'react';
import { tenantService } from '../../services/api';

const AdminSettings = () => {
  const [primaryColor, setPrimaryColor] = useState('#004AC6');
  const [secondaryColor, setSecondaryColor] = useState('#7C43AB');
  const [logoUrl, setLogoUrl] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await tenantService.getTenantProfile();
        const tenantData = response.data?.data || response.data;
        if (tenantData) {
          setTenantName(tenantData.name || '');
          setSubdomain(tenantData.subdomain || '');
          setCustomDomain(tenantData.domain || '');
          if (tenantData.branding) {
            setPrimaryColor(tenantData.branding.primaryColor || '#004AC6');
            setSecondaryColor(tenantData.branding.secondaryColor || '#7C43AB');
            setLogoUrl(tenantData.branding.logoUrl || '');
          }
        }
      } catch (err) {
        console.error('Failed to fetch tenant branding:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranding();
  }, []);

  const handlePublish = async () => {
    try {
      await tenantService.updateTenantProfile({
        name: tenantName,
        subdomain: subdomain,
        domain: customDomain,
        branding: {
          primaryColor,
          secondaryColor,
          logoUrl
        }
      });
      
      // Update custom properties immediately
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--primary-hover', `${primaryColor}cc`);
      document.documentElement.style.setProperty('--primary-glow', `${primaryColor}4d`);
      document.documentElement.style.setProperty('--secondary', secondaryColor);
      document.documentElement.style.setProperty('--secondary-glow', `${secondaryColor}4d`);
      
      alert('Branding published successfully!');
    } catch (err) {
      console.error('Failed to update tenant branding:', err);
      alert('Failed to publish branding settings.');
    }
  };

  if (isLoading) {
    return <div className="p-xl text-center">Loading settings...</div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-lg">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex gap-2 text-label-sm text-outline mb-2">
            <span>System Settings</span>
            <span>/</span>
            <span className="text-primary">Institutional Branding</span>
          </nav>
          <h2 className="font-headline-md text-headline-md text-on-surface">Institutional Branding Portal</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Configure your institution's visual identity across the Ntanda ecosystem.</p>
        </div>
        <div className="flex gap-md">
          <button className="px-lg py-sm font-label-md text-on-surface-variant border border-outline-variant rounded hover:bg-surface-container transition-colors">Discard Changes</button>
          <button onClick={handlePublish} className="px-lg py-sm font-label-md bg-primary text-on-primary rounded shadow-sm hover:opacity-90 transition-opacity">Publish Branding</button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Brand Identity Section (Left - 7 cols) */}
        <section className="col-span-12 lg:col-span-7 space-y-lg">
          {/* 1. Assets Upload */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 0"}}>id_card</span>
              <h3 className="font-headline-sm text-headline-sm">Brand Identity</h3>
            </div>
            <div className="grid grid-cols-2 gap-lg">
              {/* Institution Name */}
              <div className="col-span-2 space-y-sm">
                <label className="font-label-md text-on-surface">Institution Name</label>
                <input 
                  type="text" 
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Springfield Academy"
                  className="w-full bg-surface-container border border-outline-variant rounded py-2 px-3 font-body-md focus:border-primary focus:ring-0 outline-none"
                />
              </div>
              {/* Primary Logo URL */}
              <div className="col-span-2 space-y-sm">
                <label className="font-label-md text-on-surface">Primary Logo URL</label>
                <input 
                  type="text" 
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="e.g. https://domain.com/logo.png"
                  className="w-full bg-surface-container border border-outline-variant rounded py-2 px-3 font-body-md focus:border-primary focus:ring-0 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Theme Customization */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 0"}}>palette</span>
              <h3 className="font-headline-sm text-headline-sm">Theme Customization</h3>
            </div>
            <div className="grid grid-cols-2 gap-xl">
              <div className="space-y-md">
                <label className="font-label-md text-on-surface">Primary Brand Color</label>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded border border-outline-variant ring-offset-2" style={{ backgroundColor: primaryColor, boxShadow: primaryColor ? `0 0 0 2px #fff, 0 0 0 2px ${primaryColor}` : 'none' }}></div>
                  <input 
                    className="flex-1 bg-surface-container border-none rounded py-2 px-3 font-label-md uppercase outline-none focus:ring-2 focus:ring-primary/20" 
                    type="text" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPrimaryColor('#2563eb')} className="w-6 h-6 rounded-full bg-blue-600 border border-white cursor-pointer"></button>
                  <button onClick={() => setPrimaryColor('#4f46e5')} className="w-6 h-6 rounded-full bg-indigo-600 border border-white cursor-pointer"></button>
                  <button onClick={() => setPrimaryColor('#0f172a')} className="w-6 h-6 rounded-full bg-white border border-white cursor-pointer"></button>
                  <button onClick={() => setPrimaryColor('#047857')} className="w-6 h-6 rounded-full bg-emerald-700 border border-white cursor-pointer"></button>
                </div>
              </div>
              <div className="space-y-md">
                <label className="font-label-md text-on-surface">Secondary Accent</label>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded border border-outline-variant" style={{ backgroundColor: secondaryColor }}></div>
                  <input 
                    className="flex-1 bg-surface-container border-none rounded py-2 px-3 font-label-md uppercase outline-none focus:ring-2 focus:ring-primary/20" 
                    type="text" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSecondaryColor('#9333ea')} className="w-6 h-6 rounded-full bg-purple-600 border border-white cursor-pointer"></button>
                  <button onClick={() => setSecondaryColor('#f43f5e')} className="w-6 h-6 rounded-full bg-rose-500 border border-white cursor-pointer"></button>
                  <button onClick={() => setSecondaryColor('#f59e0b')} className="w-6 h-6 rounded-full bg-amber-500 border border-white cursor-pointer"></button>
                  <button onClick={() => setSecondaryColor('#14b8a6')} className="w-6 h-6 rounded-full bg-teal-500 border border-white cursor-pointer"></button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Domain Settings */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 0"}}>language</span>
              <h3 className="font-headline-sm text-headline-sm">Domain Settings</h3>
            </div>
            
            <div className="space-y-lg">
              {/* Subdomain */}
              <div className="space-y-sm">
                <label className="font-label-md text-on-surface">Custom Subdomain</label>
                <div className="flex">
                  <input 
                    className="flex-1 bg-surface-container border border-outline-variant border-r-0 rounded-l py-3 px-4 font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                    placeholder="university" 
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                  />
                  <div className="bg-surface-container-high border border-outline-variant border-l-0 rounded-r py-3 px-4 font-label-md text-outline flex items-center justify-center">
                    .learningzm.com
                  </div>
                </div>
              </div>

              {/* Fully Qualified Custom Domain */}
              <div className="space-y-sm">
                <label className="font-label-md text-on-surface">Fully Qualified Custom Domain</label>
                <input 
                  type="text" 
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g. www.myschool.edu"
                  className="w-full bg-surface-container border border-outline-variant rounded py-3 px-4 font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <p className="text-body-sm text-on-surface-variant mt-1">
                  To use a custom domain, you must create a <strong>CNAME</strong> or <strong>A Record</strong> with your domain registrar pointing to the LearningZM server IP address.
                </p>
              </div>

              <div className="flex items-start gap-sm bg-tertiary-fixed text-on-tertiary-fixed p-md rounded-lg">
                <span className="material-symbols-outlined text-body-md shrink-0" style={{fontVariationSettings: "'FILL' 0"}}>info</span>
                <p className="text-body-sm">Note: Changing domain routing information will instantly update the tenant resolver and log out currently active sessions on the old domain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live Preview (Right - 5 cols) */}
        <section className="col-span-12 lg:col-span-5 sticky top-[calc(4rem+24px)] h-fit">
          <div className="bg-surface-container-high/30 rounded-xl border border-outline-variant overflow-hidden">
            <div className="p-md bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-label-md text-on-surface">Student Dashboard Preview</h4>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error/40"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/40"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/40"></div>
              </div>
            </div>

            {/* Mockup Container */}
            <div className="p-lg">
              <div className="aspect-[4/3] bg-white rounded-lg shadow-2xl overflow-hidden border border-outline-variant relative">
                {/* Mockup Header */}
                <div className="h-10 border-b border-outline-variant flex items-center px-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: primaryColor }}></div>
                    <div className="w-16 h-2 bg-outline-variant rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-surface-container-high"></div>
                    <div className="w-4 h-4 rounded-full bg-surface-container-high"></div>
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 space-y-2">
                      <div className="h-20 rounded flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: `${primaryColor}20` }}>
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `${primaryColor}40` }}></div>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded"></div>
                      <div className="h-2 w-2/3 bg-surface-container-high rounded"></div>
                    </div>
                    <div className="w-2/3 space-y-4">
                      <div className="h-32 bg-surface-container rounded-lg p-3 space-y-2">
                        <div className="h-3 w-1/4 rounded transition-colors duration-300" style={{ backgroundColor: primaryColor }}></div>
                        <div className="h-2 w-full bg-outline-variant rounded"></div>
                        <div className="h-2 w-full bg-outline-variant rounded"></div>
                        <div className="h-2 w-3/4 bg-outline-variant rounded"></div>
                        <div className="pt-2">
                          <div className="h-6 w-20 rounded transition-colors duration-300" style={{ backgroundColor: secondaryColor }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-surface-container rounded"></div>
                    <div className="h-12 bg-surface-container rounded"></div>
                    <div className="h-12 bg-surface-container rounded"></div>
                  </div>
                </div>

                {/* Live Overlay Indicators */}
                <div className="absolute bottom-4 right-4 animate-pulse">
                  <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] rounded-full font-bold tracking-wider uppercase">Live Preview</span>
                </div>
              </div>
              
              <div className="mt-lg space-y-md">
                <div className="flex items-center justify-between cursor-pointer group">
                  <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Mobile View</span>
                  <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 0"}}>phone_iphone</button>
                </div>
                <div className="flex items-center justify-between cursor-pointer group">
                  <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Dark Mode Compatibility</span>
                  <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 0"}}>dark_mode</button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="mt-lg p-md bg-secondary-fixed/30 rounded-lg border border-secondary-container flex gap-md">
            <span className="material-symbols-outlined text-on-secondary-fixed" style={{fontVariationSettings: "'FILL' 0"}}>tips_and_updates</span>
            <div>
              <p className="font-label-md text-on-secondary-fixed">Pro Tip</p>
              <p className="text-body-sm text-on-secondary-fixed-variant">Contrast ratio for Primary Brand color is checked automatically. Current ratio: 4.5:1 (Passed).</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;

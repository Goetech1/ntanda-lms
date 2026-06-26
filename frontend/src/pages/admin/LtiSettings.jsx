import { useEffect, useState } from 'react';
import { Network, Key, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ltiService, tenantService } from '../../services/api';

const LtiSettings = () => {
  const [copied, setCopied] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [platformForm, setPlatformForm] = useState({
    name: 'Canvas',
    issuer: '',
    client_id: '',
    auth_login_url: '',
    auth_token_url: '',
    key_set_url: '',
    deployment_id: '',
  });

  const baseUrl = window.location.origin.replace('5173', '8000'); // Assuming backend is on 8000

  useEffect(() => {
    Promise.all([
      tenantService.getTenantProfile(),
      ltiService.getPlatform(),
    ])
      .then(([tenantRes, platformRes]) => {
        setTenant(tenantRes.data?.data || tenantRes.data);
        const platform = platformRes.data?.data || platformRes.data;
        if (platform) {
          setPlatformForm({
            name: platform.name || 'Canvas',
            issuer: platform.issuer || '',
            client_id: platform.client_id || '',
            auth_login_url: platform.auth_login_url || '',
            auth_token_url: platform.auth_token_url || '',
            key_set_url: platform.key_set_url || '',
            deployment_id: platform.deployment_id || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load LTI settings', err);
        setError('Unable to load current LTI settings.');
      });
  }, []);
  
  const ltiConfig = {
    loginUrl: `${baseUrl}/api/lti/login`,
    launchUrl: `${baseUrl}/api/lti/launch`,
    jwksUrl: tenant?.id ? `${baseUrl}/api/lti/jwks/${tenant.id}` : '',
    deepLinkingUrl: `${baseUrl}/api/lti/launch`
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSavePlatform = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await ltiService.savePlatform(platformForm);
      setMessage('LTI platform trust saved.');
    } catch (err) {
      console.error('Failed to save LTI platform', err);
      setError(err.response?.data?.message || 'Failed to save LTI platform trust.');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Network className="h-8 w-8 text-[var(--primary)]" />
          LTI 1.3 Advantage Interoperability
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Configure Ntanda LMS to act as an external tool inside Canvas, Moodle, or Blackboard.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-400">Integration Guide</h4>
          <p className="text-sm text-blue-300/80 mt-1">
            To connect an external LMS, you must create a new "LTI 1.3 Tool" in their admin panel. 
            Paste the URLs below into the external LMS configuration, then paste the Client ID they generate back into Ntanda.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-300">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Step 1: Tool URLs */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[var(--primary)] text-white text-xs">1</span>
              Tool Configuration URLs (Copy these to your LMS)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-4">
              {[
                { label: 'OIDC Login Initiation URL', value: ltiConfig.loginUrl, id: 'login' },
                { label: 'Target Link URI (Launch URL)', value: ltiConfig.launchUrl, id: 'launch' },
                { label: 'Public JWKS URL (Keyset)', value: ltiConfig.jwksUrl, id: 'jwks' }
              ].filter((item) => item.value).map((item) => (
                <div key={item.id}>
                  <label className="text-sm font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    {item.label}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={item.value} 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 font-mono text-sm focus:outline-none"
                    />
                    <button 
                      onClick={() => handleCopy(item.value, item.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 border border-slate-700"
                    >
                      {copied === item.id ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* Step 2: Platform Registration */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[var(--primary)] text-white text-xs">2</span>
              Register LMS Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-6">
              After creating the tool in Canvas/Moodle, they will provide you with a Client ID and an Issuer URL. Paste them below to establish the trust.
            </p>

            <form className="space-y-4" onSubmit={handleSavePlatform}>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Platform Name</label>
                <input
                  type="text"
                  value={platformForm.name}
                  onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Platform Issuer URL (iss)</label>
                  <input 
                    type="url" 
                    placeholder="e.g., https://canvas.instructure.com"
                    value={platformForm.issuer}
                    onChange={(e) => setPlatformForm({ ...platformForm, issuer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Client ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 10000000000001"
                    value={platformForm.client_id}
                    onChange={(e) => setPlatformForm({ ...platformForm, client_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">OIDC Login URL</label>
                  <input type="url" value={platformForm.auth_login_url} onChange={(e) => setPlatformForm({ ...platformForm, auth_login_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Token URL</label>
                  <input type="url" value={platformForm.auth_token_url} onChange={(e) => setPlatformForm({ ...platformForm, auth_token_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Platform JWKS URL</label>
                  <input type="url" value={platformForm.key_set_url} onChange={(e) => setPlatformForm({ ...platformForm, key_set_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]" required />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Deployment ID</label>
                <input 
                  type="text" 
                  placeholder="e.g., 1"
                  value={platformForm.deployment_id}
                  onChange={(e) => setPlatformForm({ ...platformForm, deployment_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  <Key className="h-4 w-4" /> Save Platform Trust
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LtiSettings;

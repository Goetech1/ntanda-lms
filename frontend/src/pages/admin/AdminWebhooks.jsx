import { useState, useEffect } from 'react';
import { Globe, Key, Trash2, Plus, Check, AlertCircle, Info, Settings, Loader2, RefreshCw } from 'lucide-react';
import { webhookService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const AdminWebhooks = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newEvent, setNewEvent] = useState('student.course_completed');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      const res = await webhookService.getAll();
      setWebhooks(res.data);
    } catch (err) {
      console.error("Failed to load webhooks", err);
      setErrorMessage("Failed to load webhook subscriptions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUrl) {
      setErrorMessage('Endpoint URL is required.');
      return;
    }
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');
      const res = await webhookService.create({
        url: newUrl,
        event_type: newEvent
      });
      setWebhooks((prev) => [...prev, res.data]);
      setNewUrl('');
      setSuccessMessage('Webhook subscription successfully created.');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to create webhook.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (sub) => {
    try {
      const updated = { ...sub, is_active: !sub.is_active };
      const res = await webhookService.update(sub.id, { is_active: !sub.is_active });
      setWebhooks((prev) => prev.map((w) => (w.id === sub.id ? res.data : w)));
    } catch (err) {
      console.error("Failed to toggle webhook state", err);
      setErrorMessage("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this webhook subscription?')) return;
    try {
      await webhookService.delete(id);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
      setSuccessMessage('Webhook subscription deleted.');
    } catch (err) {
      console.error("Failed to delete webhook", err);
      setErrorMessage("Failed to delete subscription.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[85vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-5 w-5 text-[var(--primary)]" />
          <span className="text-[var(--primary)] font-bold text-sm tracking-widest uppercase">Developer Integrations</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">API Webhooks</h1>
        <p className="text-slate-400 mt-1">Configure URLs to receive real-time notifications for student milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Webhook Form */}
        <Card className="lg:col-span-1 border-slate-800 bg-slate-900/50 backdrop-blur-sm self-start">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Plus className="h-5 w-5 text-[var(--primary)]" />
              Add Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Payload URL</label>
                <Input
                  placeholder="https://yourserver.com/webhook"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Event Subscription</label>
                <select
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:border-[var(--primary)] outline-none"
                >
                  <option value="student.course_completed">Student Completed Course</option>
                  <option value="student.registered">Student Registered</option>
                  <option value="student.badge_earned">Student Earned Badge</option>
                </select>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-2.5 rounded-xl transition-all"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                  </span>
                ) : (
                  'Add Endpoint'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Globe className="h-5 w-5 text-indigo-400" />
                Active Endpoints ({webhooks.length})
              </CardTitle>
              <button 
                onClick={fetchWebhooks}
                className="text-slate-400 hover:text-white transition-colors"
                title="Refresh endpoints"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              {webhooks.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic">
                  No webhooks configured. Create one to receive automated API notifications.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {webhooks.map((sub) => (
                    <div key={sub.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-all">
                      <div className="space-y-2 max-w-lg">
                        <div className="flex items-center gap-3">
                          <span className="bg-slate-850 border border-slate-800 text-slate-300 font-mono text-xs px-2.5 py-1 rounded-full">
                            {sub.event_type}
                          </span>
                          <span className={`h-2.5 w-2.5 rounded-full ${sub.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                        </div>
                        <h4 className="text-white font-medium text-sm break-all">{sub.url}</h4>
                        
                        {/* Signing Secret Box */}
                        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono w-fit">
                          <Key className="h-3 w-3 text-amber-400 shrink-0" />
                          <span className="text-slate-400 select-all">{sub.secret}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggle(sub)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            sub.is_active 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {sub.is_active ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete endpoint"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integration documentation callout */}
          <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex gap-4">
            <Info className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-white font-semibold">Signing Secret Verification</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ntanda signs every payload using the signature in the <code className="text-indigo-300 font-mono text-xs px-1 py-0.5 rounded bg-slate-950">X-Ntanda-Signature</code> header.
                To verify authenticity, generate a HMAC SHA256 digest of the request body using your endpoint's secret key and compare it with the signature.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AdminWebhooks;

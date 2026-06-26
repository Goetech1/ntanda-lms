import React, { useState, useEffect } from 'react';
import { tenantService } from '../../services/api';

const AdminOrganization = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-red-500 font-bold">
        Access Denied: You do not have permission to view Tenants & Organizations.
      </div>
    );
  }

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    subdomain: '',
  });

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '') : 'ntandaapp.com';

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getAllTenants();
      const tenantsData = response.data?.data || response.data || [];
      setTenants(Array.isArray(tenantsData) ? tenantsData : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
      setError('Failed to load institutions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await tenantService.createTenant(formData);
      setIsModalOpen(false);
      setFormData({ name: '', domain: '', subdomain: '' });
      fetchTenants();
    } catch (err) {
      console.error('Create tenant failed:', err);
      alert('Failed to create institution. Check inputs and ensure domain/subdomain are unique.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this institution? This action is irreversible.')) {
      try {
        await tenantService.deleteTenant(id);
        fetchTenants();
      } catch (err) {
        console.error('Delete tenant failed:', err);
        alert('Failed to delete institution.');
      }
    }
  };

  // Helper to derive initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return 'IN';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-[1280px] mx-auto w-full py-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2xl">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary mb-base">Institution Management</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Monitor health, manage subscription lifecycles, and configure high-level security permissions across the platform ecosystem.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded-lg font-body-md font-semibold hover:shadow-lg transition-all active:scale-95 self-start md:self-auto"
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>add</span>
          Add New Tenant
        </button>
      </div>

      {/* Tenant Health Dashboard (Bento Style) */}
      <div className="grid grid-cols-12 gap-lg mb-3xl">
        {/* Global Health Stats */}
        <div className="col-span-12 lg:col-span-4 bg-white/70 backdrop-blur-md p-xl rounded-xl border border-outline-variant flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div>
            <span className="font-label-md text-label-md text-primary bg-primary/10 px-sm py-xs rounded-full uppercase tracking-wider">System Overview</span>
            <h3 className="font-headline-md text-headline-md mt-md mb-sm">Tenant Vitality</h3>
            <p className="text-on-surface-variant text-body-sm">Aggregate platform engagement across all {loading ? '-' : tenants.length} registered institutions.</p>
          </div>
          <div className="mt-2xl">
            <div className="flex items-end gap-base">
              <span className="text-display-lg font-bold text-primary">100%</span>
              <span className="text-primary font-bold mb-sm">Stable</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full mt-sm">
              <div className="w-[100%] h-full bg-primary rounded-full"></div>
            </div>
            <p className="text-label-sm text-label-sm mt-base text-on-surface-variant">Platform Uptime &amp; Service Availability</p>
          </div>
        </div>

        {/* Subscription Tier Distribution */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-xl rounded-xl border border-outline-variant">
          <div className="flex justify-between items-start mb-lg">
            <h3 className="font-headline-sm text-headline-sm">Tier Distribution</h3>
            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 0"}}>analytics</span>
          </div>
          <div className="space-y-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: "'FILL' 0"}}>workspace_premium</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between font-label-md text-label-md mb-xs">
                  <span>Enterprise</span>
                  <span>{loading ? '-' : Math.floor(tenants.length * 0.3)} Tenants</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full">
                  <div className="w-[30%] h-full bg-secondary rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 0"}}>stars</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between font-label-md text-label-md mb-xs">
                  <span>Premium</span>
                  <span>{loading ? '-' : Math.floor(tenants.length * 0.6)} Tenants</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full">
                  <div className="w-[62%] h-full bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rapid Renewal Alert */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-secondary-container/90 text-on-secondary-container p-xl rounded-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <span className="material-symbols-outlined text-[120px]" style={{fontVariationSettings: "'FILL' 0"}}>notification_important</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm mb-sm relative z-10">System Alerts</h3>
          <p className="font-body-sm opacity-80 mb-xl relative z-10">No pending renewals. All active institutions are currently in good standing.</p>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h3 className="font-headline-sm text-headline-sm">Registered Institutions</h3>
            <p className="text-body-sm text-on-surface-variant">Complete list of tenants and their operational status.</p>
          </div>
          <div className="flex gap-sm w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-sm px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
              Filter
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-sm px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>download</span>
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-md mx-lg mt-lg rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>error</span>
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Institution</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Domain</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">Health</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-lg py-8 text-center text-on-surface-variant">Loading institutions...</td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-lg py-8 text-center text-on-surface-variant">No institutions registered yet.</td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-primary">
                          {getInitials(tenant.name)}
                        </div>
                        <div>
                          <div className="font-body-md font-semibold">{tenant.name}</div>
                          <div className="text-body-sm text-on-surface-variant">ID: {tenant.id.slice(0,8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex flex-col">
                        <span className="font-body-sm text-on-surface font-semibold">{tenant.domain}</span>
                        <span className="text-[11px] text-on-surface-variant">{tenant.subdomain}.{currentDomain}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs text-primary font-bold">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-body-sm">{tenant.status || 'Active'}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant" title="Edit Profile">
                          <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>edit</span>
                        </button>
                        <button className="p-2 hover:bg-surface-container-high rounded-full text-primary" title="Manage Security">
                          <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>security</span>
                        </button>
                        <button onClick={() => handleDelete(tenant.id)} className="p-2 hover:bg-error/10 rounded-full text-error" title="Delete">
                          <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-lg flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
          <span className="font-label-md text-label-md text-on-surface-variant">Showing {tenants.length} institutions</span>
        </div>
      </div>

      {/* Add New Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="text-headline-sm font-bold text-on-surface">Register Institution</h2>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-xl space-y-md">
              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Institution Name</label>
                <input 
                  required
                  placeholder="e.g. Nexus University"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Domain Name</label>
                <input 
                  required
                  placeholder="e.g. nexus.edu"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.domain}
                  onChange={e => setFormData({...formData, domain: e.target.value})}
                />
              </div>

              <div>
                <label className="text-label-md text-on-surface font-semibold mb-xs block">Subdomain prefix (e.g. prefix.{currentDomain})</label>
                <input 
                  required
                  placeholder="e.g. nexus-edu"
                  className="w-full border border-outline-variant rounded-lg focus:ring-primary px-md py-sm" 
                  value={formData.subdomain}
                  onChange={e => setFormData({...formData, subdomain: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-md pt-lg border-t border-outline-variant mt-lg">
                <button type="button" className="px-lg py-2 font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90">Register Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrganization;

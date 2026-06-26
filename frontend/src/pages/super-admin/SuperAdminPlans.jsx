import React, { useState, useEffect } from 'react';
import { saasSubscriptionService } from '../../services/api';
import { Plus, Edit2, CheckCircle, XCircle } from 'lucide-react';

const SuperAdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    monthly_price: '',
    annual_price: '',
    max_students: '',
    max_staff: '',
    storage_limit: '',
    feature_access: '',
    is_active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await saasSubscriptionService.getPlans();
      // Usually SuperAdmins can see inactive plans too, but for now we get what the API returns
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingId(plan.id);
      setFormData({
        ...plan,
        feature_access: plan.feature_access ? plan.feature_access.join(', ') : '',
        max_students: plan.max_students || '',
        max_staff: plan.max_staff || '',
        storage_limit: plan.storage_limit || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        monthly_price: '',
        annual_price: '',
        max_students: '',
        max_staff: '',
        storage_limit: '',
        feature_access: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      max_students: formData.max_students ? parseInt(formData.max_students, 10) : null,
      max_staff: formData.max_staff ? parseInt(formData.max_staff, 10) : null,
      storage_limit: formData.storage_limit ? parseInt(formData.storage_limit, 10) : null,
      feature_access: formData.feature_access ? formData.feature_access.split(',').map(f => f.trim()) : [],
    };

    try {
      if (editingId) {
        await saasSubscriptionService.updatePlan(editingId, payload);
      } else {
        await saasSubscriptionService.createPlan(payload);
      }
      closeModal();
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save subscription plan.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading plans...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SaaS Plans Management</h1>
          <p className="mt-1 text-sm text-gray-500">Configure subscription plans for institutions.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Plan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing (Mo/Yr)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limits (Stu/Staff/GB)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map(plan => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{plan.name}</div>
                  <div className="text-xs text-gray-500 truncate w-48" title={plan.feature_access?.join(', ')}>
                    {plan.feature_access?.join(', ') || 'No features listed'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">ZMW {plan.monthly_price} / mo</div>
                  <div className="text-sm text-gray-500">ZMW {plan.annual_price} / yr</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {plan.max_students || '∞'} / {plan.max_staff || '∞'} / {plan.storage_limit ? `${plan.storage_limit}GB` : '∞'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.is_active ? (
                    <span className="inline-flex items-center text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4 mr-1"/> Active</span>
                  ) : (
                    <span className="inline-flex items-center text-red-600 text-sm font-medium"><XCircle className="w-4 h-4 mr-1"/> Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(plan)} className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal} />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{editingId ? 'Edit Plan' : 'Create Plan'}</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Price (ZMW)</label>
                    <input type="number" step="0.01" required value={formData.monthly_price} onChange={(e) => setFormData({...formData, monthly_price: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Price (ZMW)</label>
                    <input type="number" step="0.01" required value={formData.annual_price} onChange={(e) => setFormData({...formData, annual_price: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Students</label>
                    <input type="number" placeholder="Unlimited" value={formData.max_students} onChange={(e) => setFormData({...formData, max_students: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Staff</label>
                    <input type="number" placeholder="Unlimited" value={formData.max_staff} onChange={(e) => setFormData({...formData, max_staff: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Storage (GB)</label>
                    <input type="number" placeholder="Unlimited" value={formData.storage_limit} onChange={(e) => setFormData({...formData, storage_limit: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feature Highlights (Comma separated)</label>
                  <textarea rows={2} value={formData.feature_access} onChange={(e) => setFormData({...formData, feature_access: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm" placeholder="Custom Domain, 24/7 Support, Analytics" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Plan is Active</label>
                </div>
                <div className="mt-5 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">Save Plan</button>
                  <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPlans;

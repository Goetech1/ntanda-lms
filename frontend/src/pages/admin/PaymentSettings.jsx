import React, { useState, useEffect } from 'react';
import { paymentMethodService } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const PaymentSettings = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    method_name: '',
    provider_type: 'OTHER',
    account_name: '',
    account_number: '',
    bank_name: '',
    payment_instructions: '',
    is_active: true,
    integration_type: 'MANUAL',
    integration_credentials: {}
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await paymentMethodService.getAll();
      setMethods(data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (method = null) => {
    if (method) {
      setEditingId(method.id);
      setFormData({
        method_name: method.method_name || '',
        provider_type: method.provider_type || 'OTHER',
        account_name: method.account_name || '',
        account_number: method.account_number || '',
        bank_name: method.bank_name || '',
        payment_instructions: method.payment_instructions || '',
        is_active: method.is_active ?? true,
        integration_type: method.integration_type || 'MANUAL',
        integration_credentials: method.integration_credentials || {}
      });
    } else {
      setEditingId(null);
      setFormData({
        method_name: '',
        provider_type: 'OTHER',
        account_name: '',
        account_number: '',
        bank_name: '',
        payment_instructions: '',
        is_active: true,
        integration_type: 'MANUAL',
        integration_credentials: {}
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
    try {
      if (editingId) {
        await paymentMethodService.update(editingId, formData);
      } else {
        await paymentMethodService.create(formData);
      }
      closeModal();
      fetchMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Failed to save payment method.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await paymentMethodService.delete(id);
        fetchMethods();
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const toggleActive = async (method) => {
    try {
      await paymentMethodService.update(method.id, { is_active: !method.is_active });
      fetchMethods();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  const providerLabel = (type) => ({
    BANK_ACCOUNT: 'Bank Account',
    MTN_MOMO: 'MTN MoMo',
    AIRTEL_MONEY: 'Airtel Money',
    LIPILA: 'Lipila Gateway',
    OTHER: 'Other'
  }[type] || type);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Configure how students pay their fees to the institution.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Payment Method
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {methods.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No payment methods configured yet.</li>
          ) : (
            methods.map(method => (
              <li key={method.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{method.method_name}</h3>
                    <button
                      onClick={() => toggleActive(method)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {method.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>Type: <span className="font-semibold text-slate-700">{providerLabel(method.provider_type)}</span></p>
                    {method.account_name && <p>Account Name: {method.account_name}</p>}
                    {method.account_number && <p>Number: {method.account_number}</p>}
                    {method.bank_name && <p>{method.provider_type === 'BANK_ACCOUNT' ? 'Bank' : 'Network'}: {method.bank_name}</p>}
                    <p>Mode: <span className={`font-semibold ${method.integration_type === 'LIPILA' ? 'text-indigo-600' : 'text-slate-500'}`}>{method.integration_type === 'LIPILA' ? 'Automated (Lipila)' : 'Manual'}</span></p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-2">
                  <button onClick={() => openModal(method)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(method.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal} />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{editingId ? 'Edit Payment Method' : 'Add Payment Method'}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Method Name (e.g. MTN MoMo, Zanaco)</label>
                  <input
                    type="text"
                    required
                    value={formData.method_name}
                    onChange={(e) => setFormData({...formData, method_name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                  <select
                    value={formData.provider_type || 'OTHER'}
                    onChange={(e) => setFormData({...formData, provider_type: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="BANK_ACCOUNT">Bank Account</option>
                    <option value="MTN_MOMO">MTN MoMo</option>
                    <option value="AIRTEL_MONEY">Airtel Money</option>
                    <option value="LIPILA">Lipila Gateway</option>
                    <option value="OTHER">Other / Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Integration Type</label>
                  <select
                    value={formData.integration_type || 'MANUAL'}
                    onChange={(e) => setFormData({...formData, integration_type: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="MANUAL">Manual (Receipt Upload)</option>
                    <option value="LIPILA">Automated Mobile Money (Lipila)</option>
                  </select>
                </div>

                {formData.integration_type === 'LIPILA' && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-md space-y-4">
                    <h4 className="text-sm font-medium text-indigo-800">Lipila Gateway Configuration</h4>
                    <div>
                      <label className="block text-xs font-medium text-indigo-700">Lipila API Key</label>
                      <input
                        type="password"
                        placeholder={editingId ? '•••••••• (Leave blank to keep unchanged)' : 'Enter API Key'}
                        onChange={(e) => setFormData({...formData, integration_credentials: { ...formData.integration_credentials, lipila_api_key: e.target.value }})}
                        className="mt-1 block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-indigo-700">Lipila Webhook Secret</label>
                      <input
                        type="password"
                        placeholder={editingId ? '•••••••• (Leave blank to keep unchanged)' : 'Enter Webhook Secret'}
                        onChange={(e) => setFormData({...formData, integration_credentials: { ...formData.integration_credentials, lipila_webhook_secret: e.target.value }})}
                        className="mt-1 block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {formData.provider_type === 'BANK_ACCOUNT' ? 'Account Number' : 'Wallet / Account Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.account_number}
                      onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.provider_type === 'BANK_ACCOUNT' ? 'Bank Name' : 'Network / Bank Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Instructions for Students</label>
                  <textarea
                    rows={3}
                    value={formData.payment_instructions}
                    onChange={(e) => setFormData({...formData, payment_instructions: e.target.value})}
                    placeholder="e.g. Use your student ID as the reference..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active (visible to students)
                  </label>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;

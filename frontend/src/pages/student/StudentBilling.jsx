import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentPaymentService, paymentMethodService, studentAccountService } from '../../services/api';
import { Upload, CheckCircle, Clock, XCircle, Download, ExternalLink } from 'lucide-react';

const StudentBilling = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_method_id: '',
    reference_number: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
    receipt_file: null,
    mobile_number: ''
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // Polling for webhook updates
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, methodsRes, transactionsRes] = await Promise.all([
        studentPaymentService.getAll(),
        paymentMethodService.getAll(),
        studentAccountService.getAll()
      ]);
      setPayments(paymentsRes.data);
      setMethods(methodsRes.data.filter(m => m.is_active));
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, receipt_file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const selectedMethod = methods.find(m => m.id === formData.payment_method_id);

    try {
      if (selectedMethod?.integration_type === 'LIPILA') {
        const payload = {
          amount: formData.amount,
          payment_method_id: formData.payment_method_id,
          mobile_number: formData.mobile_number,
          notes: formData.notes,
        };
        const res = await studentPaymentService.initiateCollection(payload);
        alert(res.data.message || 'Check your phone to enter your PIN.');
      } else {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== '') {
            data.append(key, formData[key]);
          }
        });
        await studentPaymentService.create(data);
        alert('Payment submitted successfully for review.');
      }

      setFormData({
        amount: '',
        payment_method_id: '',
        reference_number: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
        receipt_file: null,
        mobile_number: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert(error.response?.data?.message || 'Failed to submit payment. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const providerLabel = (type) => ({
    BANK_ACCOUNT: 'Bank Account',
    MTN_MOMO: 'MTN MoMo',
    AIRTEL_MONEY: 'Airtel Money',
    LIPILA: 'Lipila',
    OTHER: 'Other'
  }[type] || type);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading billing information...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Billing & Payments</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your institution fee payments and receipts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Submit Payment Proof</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    required
                    value={formData.payment_method_id}
                    onChange={(e) => setFormData({...formData, payment_method_id: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a method</option>
                    {methods.map(m => (
                      <option key={m.id} value={m.id}>{m.method_name} - {providerLabel(m.provider_type)}</option>
                    ))}
                  </select>
                </div>
                
                {formData.payment_method_id && (
                  <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                    <strong>Instructions:</strong>
                    <p className="mt-1 whitespace-pre-line">
                      {methods.find(m => m.id === formData.payment_method_id)?.payment_instructions || 'No special instructions.'}
                    </p>
                    {methods.find(m => m.id === formData.payment_method_id)?.account_number && (
                      <p className="mt-2 font-mono">Account/Wallet: {methods.find(m => m.id === formData.payment_method_id)?.account_number}</p>
                    )}
                    <p className="mt-2 text-xs uppercase tracking-wider">
                      {providerLabel(methods.find(m => m.id === formData.payment_method_id)?.provider_type)}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount Paid (ZMW)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {methods.find(m => m.id === formData.payment_method_id)?.integration_type === 'LIPILA' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Money Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0970000000"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <p className="mt-2 text-xs text-indigo-600 font-medium">An STK Push (USSD prompt) will be sent to this number. Please enter your PIN to authorize.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reference Number / Transaction ID</label>
                      <input
                        type="text"
                        required
                        value={formData.reference_number}
                        onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Payment</label>
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().split('T')[0]}
                        value={formData.payment_date}
                        onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Upload Receipt (Image/PDF)</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload a file</span>
                              <input type="file" required className="sr-only" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formData.receipt_file ? formData.receipt_file.name : 'PNG, JPG, PDF up to 5MB'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading || !formData.payment_method_id || (methods.find(m => m.id === formData.payment_method_id)?.integration_type !== 'LIPILA' && !formData.receipt_file) || (methods.find(m => m.id === formData.payment_method_id)?.integration_type === 'LIPILA' && !formData.mobile_number)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitLoading ? 'Processing...' : (methods.find(m => m.id === formData.payment_method_id)?.integration_type === 'LIPILA' ? 'Pay Now' : 'Submit Payment Proof')}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
            </div>
            
            {payments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                You haven't submitted any payments yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {payments.map(payment => (
                  <li key={payment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {payment.payment_method?.method_name} - {payment.amount} ZMW
                        </span>
                        <span className="text-sm text-gray-500">
                          Ref: {payment.reference_number} | {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                        {payment.notes && <span className="text-xs text-gray-400 mt-1">Note: {payment.notes}</span>}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className="text-sm text-gray-700 font-medium">{payment.status}</span>
                        </div>
                        {payment.receipt_file && (
                          <a href={payment.receipt_file} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm font-medium">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Student Account Ledger</h2>
          <span className="text-sm text-gray-500">{transactions.length} recorded entries</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No posted account transactions yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.map((entry) => (
              <li key={entry.id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {entry.source_type}{entry.reference_number ? ` • ${entry.reference_number}` : ''}
                  </span>
                  <span className="text-sm text-gray-500">
                    {entry.description || 'Recorded payment'}{entry.posted_at ? ` | ${new Date(entry.posted_at).toLocaleDateString()}` : ''}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${entry.direction === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.direction === 'CREDIT' ? '+' : '-'}{entry.amount} ZMW
                  </div>
                  <div className="text-xs text-gray-500">{entry.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentBilling;

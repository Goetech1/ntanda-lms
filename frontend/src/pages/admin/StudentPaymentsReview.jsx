import React, { useState, useEffect } from 'react';
import { studentPaymentService } from '../../services/api';
import { Check, X, Eye, ExternalLink, Search, Filter } from 'lucide-react';

const StudentPaymentsReview = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await studentPaymentService.getAll();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status) => {
    if (!selectedPayment) return;
    try {
      await studentPaymentService.review(selectedPayment.id, {
        status,
        notes: reviewNotes
      });
      setSelectedPayment(null);
      setReviewNotes('');
      fetchPayments();
    } catch (error) {
      console.error('Error reviewing payment:', error);
      alert('Failed to update payment status.');
    }
  };

  const filteredPayments = payments.filter(p => filter === 'All' ? true : p.status === filter);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading payments...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Payments Review</h1>
          <p className="mt-1 text-sm text-gray-500">Verify and approve student payment receipts.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No payments found.</td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.student?.full_name}</div>
                      <div className="text-sm text-gray-500">{payment.student?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.amount} ZMW</div>
                      <div className="text-sm text-gray-500">{payment.payment_method?.method_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(payment.payment_date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{payment.reference_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedPayment(null)} />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Review Payment</h3>
                <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Payment Info</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-500">Student:</dt><dd className="font-medium text-gray-900">{selectedPayment.student?.full_name}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Amount:</dt><dd className="font-medium text-gray-900">{selectedPayment.amount} ZMW</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Method:</dt><dd className="font-medium text-gray-900">{selectedPayment.payment_method?.method_name}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Date:</dt><dd className="font-medium text-gray-900">{new Date(selectedPayment.payment_date).toLocaleDateString()}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Ref:</dt><dd className="font-medium text-gray-900">{selectedPayment.reference_number}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Notes:</dt><dd className="font-medium text-gray-900">{selectedPayment.notes || 'N/A'}</dd></div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Receipt Proof</h4>
                  {selectedPayment.receipt_file ? (
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      {selectedPayment.receipt_file.endsWith('.pdf') ? (
                        <div className="flex items-center justify-center h-32">
                          <a href={selectedPayment.receipt_file} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium flex items-center hover:underline">
                            View PDF Document <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      ) : (
                        <a href={selectedPayment.receipt_file} target="_blank" rel="noreferrer">
                          <img src={selectedPayment.receipt_file} alt="Receipt" className="max-h-48 mx-auto object-contain rounded" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded bg-gray-50">No receipt file attached.</div>
                  )}
                </div>
              </div>

              {selectedPayment.status === 'Pending' ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes (Sent to student)</label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-4"
                    placeholder="Provide reason if rejecting..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReview('Approved')}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => handleReview('Rejected')}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700">
                    This payment was <strong>{selectedPayment.status}</strong> by {selectedPayment.verifier?.full_name || 'an administrator'} on {new Date(selectedPayment.verified_at).toLocaleDateString()}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPaymentsReview;

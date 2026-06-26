import { useState, useEffect } from 'react';
import { saasSubscriptionService } from '../../services/api';
import { Check, CreditCard, ShieldCheck } from 'lucide-react';

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [paymentProvider, setPaymentProvider] = useState('BANK_ACCOUNT');
  const [checkoutData, setCheckoutData] = useState({
    account_number: '',
    bank_name: '',
    account_name: '',
    mobile_number: ''
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function fetchData() {
    try {
      const [plansRes, subRes] = await Promise.all([
        saasSubscriptionService.getPlans(),
        saasSubscriptionService.getCurrentSubscription()
      ]);
      setPlans(plansRes.data);
      setCurrentSub(subRes.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    try {
      const payload = {
        plan_id: selectedPlan.id,
        billing_cycle: billingCycle,
        payment_provider: paymentProvider,
        ...checkoutData
      };
      
      const res = await saasSubscriptionService.initiatePayment(payload);
      alert('Payment initiated! ' + res.data.message);
      setSelectedPlan(null);
      fetchData(); // Refresh current sub
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please verify your details.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading subscription details...</div>;

  const providerLabel = (value) => ({
    BANK_ACCOUNT: 'Bank Account',
    MTN_MOMO: 'MTN MoMo',
    AIRTEL_MONEY: 'Airtel Money',
    LIPILA: 'Lipila',
  }[value] || value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SaaS Subscription Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your institution's LMS platform subscription.</p>
      </div>

      {currentSub && currentSub.status === 'ACTIVE' && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-8 border border-green-200 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-bold text-green-900">Active Subscription: {currentSub.plan?.name}</h2>
            </div>
            <p className="text-sm text-green-800 mt-1">
              Valid until {new Date(currentSub.end_date).toLocaleDateString()}. Billing: {currentSub.billing_cycle}.
            </p>
          </div>
          <button onClick={() => setSelectedPlan(null)} className="text-sm font-medium text-green-700 bg-white px-4 py-2 rounded-md shadow-sm hover:bg-green-50 border border-green-200">
            Change Plan
          </button>
        </div>
      )}

      {currentSub && ['PAST_DUE', 'TRIAL', 'CANCELED'].includes(currentSub.status) && (
        <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <h2 className="text-lg font-bold text-yellow-900">Subscription Status: {currentSub.status}</h2>
          <p className="text-sm text-yellow-800 mt-1">
            Please renew your subscription to continue uninterrupted access to the LMS platform.
          </p>
        </div>
      )}

      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold text-indigo-600">
                  ZMW {plan.monthly_price}
                  <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">or ZMW {plan.annual_price}/year</p>
              </div>
              <div className="p-6 flex-1 bg-gray-50">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700">Up to {plan.max_students || 'Unlimited'} Students</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700">{plan.storage_limit} GB Storage</span>
                  </li>
                  {plan.feature_access?.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  {currentSub?.plan_id === plan.id ? 'Renew Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:w-2/3 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Checkout: {selectedPlan.name}</h2>
            <button onClick={() => setSelectedPlan(null)} className="text-sm text-gray-500 hover:text-gray-700">Back to Plans</button>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
              <div className="mt-2 flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" value="MONTHLY" checked={billingCycle === 'MONTHLY'} onChange={(e) => setBillingCycle(e.target.value)} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <span className="text-sm text-gray-900">Monthly (ZMW {selectedPlan.monthly_price})</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="ANNUALLY" checked={billingCycle === 'ANNUALLY'} onChange={(e) => setBillingCycle(e.target.value)} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <span className="text-sm text-gray-900">Annually (ZMW {selectedPlan.annual_price}) - Save 20%</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Payment Provider</label>
              <p className="mt-1 text-xs text-gray-500">Selected: {providerLabel(paymentProvider)}</p>
              <div className="mt-2 flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" value="BANK_ACCOUNT" checked={paymentProvider === 'BANK_ACCOUNT'} onChange={(e) => setPaymentProvider(e.target.value)} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <span className="text-sm text-gray-900">Bank Account</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="MTN_MOMO" checked={paymentProvider === 'MTN_MOMO'} onChange={(e) => setPaymentProvider(e.target.value)} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <span className="text-sm text-gray-900">MTN MoMo</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="AIRTEL_MONEY" checked={paymentProvider === 'AIRTEL_MONEY'} onChange={(e) => setPaymentProvider(e.target.value)} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <span className="text-sm text-gray-900">Airtel Money</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="LIPILA" checked={paymentProvider === 'LIPILA'} onChange={(e) => setPaymentProvider(e.target.value)} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  <span className="text-sm text-gray-900">Lipila</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
              {paymentProvider === 'BANK_ACCOUNT' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <input type="text" required value={checkoutData.account_number} onChange={(e) => setCheckoutData({...checkoutData, account_number: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input type="text" required value={checkoutData.bank_name} onChange={(e) => setCheckoutData({...checkoutData, bank_name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input type="text" required value={checkoutData.account_name} onChange={(e) => setCheckoutData({...checkoutData, account_name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                  </div>
                </>
              ) : (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile Number (Format: 09XXXXXXXX)</label>
                  <input type="text" required value={checkoutData.mobile_number} onChange={(e) => setCheckoutData({...checkoutData, mobile_number: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">
                Total Due: ZMW {billingCycle === 'ANNUALLY' ? selectedPlan.annual_price : selectedPlan.monthly_price}
              </span>
              <button
                type="submit"
                disabled={checkoutLoading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {checkoutLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;

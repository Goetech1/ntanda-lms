import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { CreditCard, Wallet, Plus, ExternalLink } from 'lucide-react';

const SuperAdminPayments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Methods</h1>
          <p className="text-slate-500 text-sm mt-1">Configure global payment gateways for tenant subscriptions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Gateway
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Stripe Connect</CardTitle>
                <CardDescription>Primary gateway for credit card processing.</CardDescription>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Account Status</span>
                </div>
                <p className="text-xs text-slate-500">Fully configured and receiving live payments.</p>
              </div>
              <button className="text-sm text-[#2563EB] hover:text-blue-700 font-medium flex items-center gap-1">
                Manage in Stripe Dashboard <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>PayPal Business</CardTitle>
                <CardDescription>Secondary gateway for international clients.</CardDescription>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                Inactive
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Setup Required</span>
                </div>
                <p className="text-xs text-slate-500">Connect your PayPal Business account to accept payments.</p>
              </div>
              <button className="text-sm text-[#2563EB] hover:text-blue-700 font-medium">
                Connect Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPayments;

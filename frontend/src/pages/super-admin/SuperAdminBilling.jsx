import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';

const SuperAdminBilling = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscriptions</h1>
        <p className="text-slate-500 text-sm mt-1">Manage tenant plans, invoices, and billing history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Active Subscriptions</p>
                <h3 className="text-2xl font-bold text-emerald-900">38</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">Past Due</p>
                <h3 className="text-2xl font-bold text-amber-900">4</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-blue-900">$24,500</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>A summary of all recent billing activity across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-500">
            <CreditCard className="h-10 w-10 text-slate-300 mb-3" />
            <p>Invoice Data Grid Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminBilling;

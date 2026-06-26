import React from 'react';
import { Building, Users, CreditCard, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const SuperAdminDashboard = () => {
  const metrics = [
    { title: 'Total Tenants', value: '42', change: '+3 this month', icon: Building, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Users', value: '14,205', change: '+8% this week', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'MRR', value: '$24,500', change: '+12% this month', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'System Health', value: '99.9%', change: 'Stable', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 text-sm mt-1">High-level metrics across all tenants and subscriptions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600 font-medium">{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly recurring revenue across all subscription tiers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <span className="text-slate-400">Revenue Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tenants</CardTitle>
            <CardDescription>Newly registered organizations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">University {i}</p>
                      <p className="text-xs text-slate-500">Pro Plan</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-[var(--primary)] transition-colors">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Users, BookOpen, DollarSign, BrainCircuit, Activity, Loader2 } from 'lucide-react';
import { analyticsService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsService.getAdminDashboard();
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch admin analytics', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!data) return null;

  const { kpis, revenueChart, enrollmentChart } = data;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="h-5 w-5 text-[#2563EB]" />
            <span className="text-[#2563EB] font-bold text-sm tracking-widest uppercase">Admin Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Platform Overview</h1>
          <p className="text-[#4B5563] mt-1">Global metrics and analytics for your tenant.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[16px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#4B5563]">Platform Revenue</p>
                <h3 className="text-[36px] font-bold text-[#111827] mt-1 leading-none">${kpis.totalRevenue?.toLocaleString() || '0'}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] shadow-sm">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[16px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#4B5563]">Total Students</p>
                <h3 className="text-[36px] font-bold text-[#111827] mt-1 leading-none">{kpis.totalStudents?.toLocaleString() || '0'}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[16px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#4B5563]">Total Enrollments</p>
                <h3 className="text-[36px] font-bold text-[#111827] mt-1 leading-none">{kpis.totalEnrollments?.toLocaleString() || '0'}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] shadow-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[16px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#4B5563]">Active Courses</p>
                <h3 className="text-[36px] font-bold text-[#111827] mt-1 leading-none">{kpis.totalCourses || '0'}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-0 bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[16px] overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-[#111827]">Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {revenueChart?.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#111827', fontWeight: '600' }}
                      formatter={(val) => [`$${val}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center px-4">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-slate-300" />
                </div>
                <h4 className="text-base font-semibold text-[#111827] mb-1">No revenue data available yet</h4>
                <p className="text-sm text-[#4B5563] max-w-[250px]">Create your first paid course and enroll students to generate analytics.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrollments Chart */}
        <Card className="border-0 bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[16px] overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-[#111827]">Enrollments (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {enrollmentChart?.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94A3B8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#111827', fontWeight: '600' }}
                      labelFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    />
                    <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center px-4">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-slate-300" />
                </div>
                <h4 className="text-base font-semibold text-[#111827] mb-1">No enrollment data available yet</h4>
                <p className="text-sm text-[#4B5563] max-w-[250px]">Invite students or publish courses to see enrollment activity here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actionable AI Insights Feed Placeholder */}
      <section className="mt-8 border-l-4 border-l-[#2563EB] pl-6 py-2">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2 mb-3">
          <Activity className="h-5 w-5 text-[#2563EB]" />
          Smart Insights
        </h3>
        <div className="bg-[#FFFFFF] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[12px] p-6 text-[#4B5563] italic border border-[#E5E7EB]">
          Ntanda AI needs more data to generate insights. Check back once courses are active!
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

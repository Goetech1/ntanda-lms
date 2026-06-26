import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Award, Bell, User, LogOut, MessageSquare, Trophy, CreditCard } from 'lucide-react';
import { useTenantBranding } from '../../components/TenantBrandingProvider';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant } = useTenantBranding();

  const navItems = [
    { name: 'Home', path: '/student', icon: Home },
    { name: 'Explore', path: '/student/catalog', icon: Compass },
    { name: 'Arena', path: '/student/leaderboard', icon: Trophy },
    { name: 'Wallet', path: '/student/achievements', icon: Award },
    { name: 'Billing', path: '/student/billing', icon: CreditCard },
    { name: 'Alerts', path: '/student/notifications', icon: Bell },
    { name: 'Profile', path: '/student/profile', icon: User },
    { name: 'Forums', path: '/student/forums', icon: MessageSquare },
    { name: 'Chat', path: '/student/chat', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[var(--primary)] selection:text-white flex flex-col md:flex-row font-sans">
      
      {/* TopAppBar for Desktop */}
      <header className="md:hidden w-full top-0 sticky z-40 bg-[#FFFFFF] border-b border-[#E5E7EB] flex justify-between items-center px-4 h-[72px] shadow-sm">
        <div className="flex items-center gap-3">
          {tenant?.branding?.logoUrl ? (
            <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-8 w-8 rounded-lg object-cover" onClick={() => navigate('/student')} />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-sm cursor-pointer" onClick={() => navigate('/student')}>
              <span className="text-sm font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
            </div>
          )}
          <h1 className="text-lg font-bold text-[#111827] cursor-pointer tracking-tight truncate max-w-[150px]" onClick={() => navigate('/student')}>
            {tenant?.name || "Ntanda"}
          </h1>
        </div>
        <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => navigate('/student/notifications')}>
          <Bell className="h-5 w-5 text-[#4B5563]" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#FFFFFF]">3</span>
        </div>
      </header>

      {/* Desktop Navigation Side Anchored */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-[88px] flex-col items-center py-6 gap-6 border-r border-[#0F172A] bg-[#0F172A] z-50">
        <div className="mb-4 cursor-pointer" onClick={() => navigate('/student')}>
          {tenant?.branding?.logoUrl ? (
            <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-10 w-10 rounded-xl object-cover shadow-sm" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-4 w-full px-3 mt-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/student' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <div key={item.path} className="relative group flex justify-center">
                <Link 
                  to={item.path} 
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center w-full ${
                    isActive 
                      ? 'bg-[#1E40AF] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isActive ? 'fill-[#1E40AF]/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                </Link>
                {/* Tooltip */}
                <div className="absolute left-[70px] px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-slate-700 shadow-md">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto p-3 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer w-[calc(100%-1.5rem)] flex justify-center mb-4" onClick={() => navigate('/login')}>
          <LogOut className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[88px] flex flex-col min-w-0 pb-20 md:pb-0 relative bg-[#F8FAFC]">

        {/* Top Desktop Header (Optional, if we want search/profile up top like admin) */}
        <header className="hidden md:flex h-[72px] px-8 items-center justify-between sticky top-0 bg-[#FFFFFF] border-b border-[#E5E7EB] z-30">
          <h2 className="text-xl font-semibold text-[#111827] tracking-tight">Student Portal</h2>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => navigate('/student/notifications')}>
              <Bell className="h-5 w-5 text-[#4B5563]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-px h-6 bg-[#E5E7EB]"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111827]">Student Name</span>
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 bg-[#FFFFFF] border-t border-[#E5E7EB] h-16 px-2 flex justify-around items-center md:hidden pb-safe">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/student' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                isActive ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'fill-[#2563EB]/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-[#2563EB]' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default StudentLayout;

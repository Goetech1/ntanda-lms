import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, DollarSign, LogOut, Menu, Bell, Search, ShieldCheck, MessageSquare, Database, Video, Megaphone } from 'lucide-react';
import { useTenantBranding } from '../../components/TenantBrandingProvider';

const InstructorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant } = useTenantBranding();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/instructor', icon: LayoutDashboard },
    { name: 'My Courses', path: '/instructor/courses', icon: BookOpen },
    { name: 'Live Classes', path: '/instructor/live-classes', icon: Video },
    { name: 'Question Bank', path: '/instructor/question-bank', icon: Database },
    { name: 'My Students', path: '/instructor/students', icon: Users },
    { name: 'Earnings', path: '/instructor/earnings', icon: DollarSign },
    { name: 'Announcements', path: '/instructor/announcements', icon: Megaphone },
    { name: 'Q&A Forums', path: '/instructor/forums', icon: MessageSquare }
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[var(--primary)] selection:text-white flex overflow-hidden">
      {/* Sidebar Backdrop Overlay on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SideNavBar Shell */}
      <aside className={`fixed top-0 bottom-0 w-[260px] bg-[#0F172A] flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 px-6 flex items-center border-b border-slate-800 shrink-0">
          <Link to="/instructor" className="flex items-center gap-3 w-full" onClick={closeSidebar}>
            {tenant?.branding?.logoUrl ? (
              <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold tracking-tight truncate">{tenant?.name || "Ntanda LMS"}</span>
              <span className="text-[10px] text-[var(--primary)] font-medium uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Instructor
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/instructor' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1E40AF] text-white font-medium shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-[var(--primary)]/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors group" onClick={() => navigate('/login')}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              TS
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">Tom Smith</span>
              <span className="text-[10px] text-slate-500">Log out</span>
            </div>
            <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* TopNavBar Shell - Glassmorphic */}
        <header className="h-[72px] px-4 lg:px-8 flex items-center justify-between sticky top-0 bg-[#FFFFFF] border-b border-[#E5E7EB] z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-all text-slate-500"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                className="w-full bg-white hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[var(--primary)]/50 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/10" 
                placeholder="Search courses, students..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full transition-all">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
            />
          </div>
        </header>



        {/* Canvas */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;

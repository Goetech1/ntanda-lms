import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, BookOpen, Calendar, Video, Award,
  Library, DollarSign, MessageSquare, Bot, Building, Network, Settings, 
  Activity, LogOut, Menu, Search, Bell, HelpCircle, ChevronDown
} from 'lucide-react';
import { useTenantBranding } from './TenantBrandingProvider';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant } = useTenantBranding();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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
          <Link to="/admin" className="flex items-center gap-3 w-full" onClick={closeSidebar}>
            {tenant?.branding?.logoUrl ? (
              <img src={tenant.branding.logoUrl} alt={tenant.name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">{tenant?.name?.charAt(0) || "N"}</span>
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold tracking-tight truncate">{tenant?.name || "Ntanda LMS"}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Admin Console</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <Link to="/admin" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/admin' ? 'bg-[#1E40AF] text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm">Overview</span>
          </Link>
          
          <details className="group [&_summary::-webkit-details-marker]:hidden" open={location.pathname.startsWith('/admin/users') || location.pathname.startsWith('/admin/students') || location.pathname.startsWith('/admin/instructors') || location.pathname.startsWith('/admin/security')}>
            <summary className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname.match(/^\/admin\/(users|students|instructors|security)/) ? 'bg-white/5 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <Users className="h-4 w-4" />
              <span className="text-sm">User Management</span>
              <ChevronDown className="h-4 w-4 ml-auto transition-transform group-open:rotate-180 opacity-50" />
            </summary>
            <div className="pl-10 pr-3 py-1 mt-1 space-y-1 border-l border-slate-800 ml-4">
               <Link to="/admin/users" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/users' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>All Users</Link>
               <Link to="/admin/students" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/students' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Students</Link>
               <Link to="/admin/instructors" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/instructors' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Instructors</Link>
               <Link to="/admin/users/import" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/users/import' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Users (Bulk Import)</Link>
               <Link to="/admin/security" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/security' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Roles & Perms</Link>
            </div>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden" open={location.pathname.includes('/admin/sessions') || location.pathname.includes('/admin/live-classes') || location.pathname.includes('/admin/certificates') || location.pathname.includes('/admin/courses') || location.pathname.includes('/admin/assessments')}>
            <summary className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname.match(/^\/admin\/(courses|sessions|live-classes|certificates|assessments)/) ? 'bg-white/5 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Academic Ops</span>
              <ChevronDown className="h-4 w-4 ml-auto transition-transform group-open:rotate-180 opacity-50" />
            </summary>
            <div className="pl-10 pr-3 py-1 mt-1 space-y-1 border-l border-slate-800 ml-4">
               <Link to="/admin/courses" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname.includes('/admin/courses') ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Courses</Link>
               <Link to="/admin/learning-paths" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/learning-paths' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Learning Paths</Link>
               <Link to="/admin/sessions" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/sessions' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Academic Sessions</Link>
               <Link to="/admin/live-classes" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/live-classes' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Virtual Classrooms</Link>
               <Link to="/admin/assessments" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/assessments' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Assessments</Link>
               <Link to="/admin/certificates" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/certificates' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Certificate Hub</Link>
            </div>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden" open={location.pathname.includes('/admin/library') || location.pathname.includes('/admin/financials') || location.pathname.includes('/admin/ai-studio') || location.pathname.includes('/admin/communications') || location.pathname.includes('/admin/support')}>
            <summary className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname.match(/^\/admin\/(library|financials|ai-studio|communications|support)/) ? 'bg-white/5 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <Activity className="h-4 w-4" />
              <span className="text-sm">Engagement</span>
              <ChevronDown className="h-4 w-4 ml-auto transition-transform group-open:rotate-180 opacity-50" />
            </summary>
            <div className="pl-10 pr-3 py-1 mt-1 space-y-1 border-l border-slate-800 ml-4">
               <Link to="/admin/library" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/library' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Library</Link>
               <Link to="/admin/financials" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/financials' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Financials</Link>
               <Link to="/admin/payment-settings" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/payment-settings' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Payment Settings</Link>
               <Link to="/admin/student-payments-review" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/student-payments-review' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Student Payments</Link>
               <Link to="/admin/communications" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/communications' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Communications</Link>
               <Link to="/admin/ai-studio" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/ai-studio' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>AI Studio</Link>
               <Link to="/admin/support" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/support' ? 'text-[var(--primary)] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Helpdesk</Link>
            </div>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden" open={location.pathname.includes('/admin/departments') || location.pathname.includes('/admin/settings')}>
            <summary className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname.match(/^\/admin\/(departments|settings)/) ? 'bg-white/5 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <Building className="h-4 w-4" />
              <span className="text-sm">Institution</span>
              <ChevronDown className="h-4 w-4 ml-auto transition-transform group-open:rotate-180 opacity-50" />
            </summary>
            <div className="pl-10 pr-3 py-1 mt-1 space-y-1 border-l border-slate-800 ml-4">
               <Link to="/admin/departments" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/departments' ? 'text-[#1E40AF] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Departments</Link>
               <Link to="/admin/settings" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/settings' ? 'text-[#1E40AF] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>Settings</Link>
               <Link to="/admin/subscription-management" onClick={closeSidebar} className={`block text-sm py-1.5 transition-colors ${location.pathname === '/admin/subscription-management' ? 'text-[#1E40AF] font-medium' : 'text-slate-500 hover:text-slate-300'}`}>SaaS Subscription</Link>
            </div>
          </details>
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors group" onClick={handleLogout}>
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-xs shrink-0">
              {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">{user.fullName || 'Admin User'}</span>
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
            <div className="relative w-full max-w-md hidden sm:block group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--primary)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
              </div>
              <input 
                className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-[var(--primary)]/50 rounded-lg py-2 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/10 shadow-sm" 
                placeholder="Ask Ntanda AI or search everything..." 
                type="text"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
                 <span className="text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">⌘K</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full transition-all">
              <Bell className="h-4 w-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full transition-all">
              <HelpCircle className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <img 
              alt="Administrator Profile" 
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7M5yDgYXcIUTVqMNWwe9qaHjuldaE-POzR581YJru69Jik08MvY3YiWY6CIhiTjOSiSCFNhc-yPIiM68etl-1GQh9QiXtHB1QqnCWQR87ZORGeBmSMVdGaQEkHaCP416Q91Rm1MpJ6-s7sCk2k3boxqlFJr9iFNq919xJAOjTsIu8hYwlm8_sVrH8b5Ff9MfI-CLk5FmIFETUCj1XazmQ8x5dzTd1nKwjebArQIbjsqqys2nm4voGmi0sF8o19NT0ULKLVEVUFME"
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

export default AdminLayout;

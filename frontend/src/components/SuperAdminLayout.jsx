import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building, Settings, LogOut, Menu, Bell, HelpCircle, 
  CreditCard, ShieldCheck, Database, LayoutTemplate, Link as LinkIcon, Webhook
} from 'lucide-react';

const SuperAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const navItems = [
    { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
    { name: 'Tenants / Org', path: '/super-admin/organization', icon: Building },
    { name: 'Billing & Subscriptions', path: '/super-admin/billing', icon: CreditCard },
    { name: 'SaaS Plans', path: '/super-admin/saas-plans', icon: CreditCard },
    { name: 'Payment Methods', path: '/super-admin/payments', icon: CreditCard },
    { name: 'System Ops', path: '/super-admin/operations', icon: Database },
    { name: 'Custom Branding', path: '/super-admin/branding', icon: LayoutTemplate },
    { name: 'LTI 1.3 Advantage', path: '/super-admin/lti-integrations', icon: LinkIcon },
    { name: 'API Webhooks', path: '/super-admin/webhooks', icon: Webhook }
  ];

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
          <Link to="/super-admin" className="flex items-center gap-3 w-full" onClick={closeSidebar}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">SA</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold tracking-tight truncate text-white">Ntanda Core</span>
              <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Super Admin
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/super-admin' && location.pathname.startsWith(item.path));
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
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors group" onClick={handleLogout}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
              {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'SA'}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">{user.fullName || 'Super Admin'}</span>
              <span className="text-[10px] text-slate-500">Log out</span>
            </div>
            <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* TopNavBar Shell */}
        <header className="h-[72px] px-4 lg:px-8 flex items-center justify-between sticky top-0 bg-[#FFFFFF] border-b border-[#E5E7EB] z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-all text-slate-500"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block">Global Command Center</h2>
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
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm bg-slate-100" 
              src="https://ui-avatars.com/api/?name=Super+Admin&background=4f46e5&color=fff"
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

export default SuperAdminLayout;

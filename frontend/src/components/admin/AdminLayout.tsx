import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Beer,
  Newspaper,
  Briefcase,
  Users,
  Mail,
  ExternalLink,
  LogOut,
  Shield,
  Loader2,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-unb-navy animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Authenticating admin session...
        </p>
      </div>
    );
  }

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Beer },
    { label: 'News & Media', path: '/admin/news', icon: Newspaper },
    { label: 'Careers & Jobs', path: '/admin/careers', icon: Briefcase },
    { label: 'Applications', path: '/admin/applications', icon: Users },
    { label: 'Enquiries', path: '/admin/enquiries', icon: Mail },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* TOPBAR */}
      <header className="bg-unb-navy text-white h-16 border-b border-blue-900/60 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 bg-unb-amber flex items-center justify-center font-bold text-white text-xs shadow-xs"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          >
            <span className="mt-1 text-[9px] text-unb-navy font-black">UNB</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase">UNB CMS PORTAL</h1>
            <p className="text-[10px] text-blue-200">Management & Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User profile badge */}
          <div className="hidden sm:flex items-center gap-2 bg-blue-900/50 border border-blue-800/80 px-3 py-1.5 rounded-xs">
            <Shield className="w-3.5 h-3.5 text-unb-amber" />
            <span className="text-xs font-bold text-white">{user.name}</span>
            <span
              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs ${
                user.role === 'ADMIN'
                  ? 'bg-unb-amber text-unb-navy'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {user.role}
            </span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-blue-200 hover:text-white font-semibold transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-100 font-bold ml-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY: SIDEBAR + CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-unb-navy text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-unb-amber' : 'text-gray-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-[11px] text-gray-500">
              <p className="font-semibold text-gray-700">Role Permissions</p>
              <p className="mt-0.5">
                {user.role === 'ADMIN'
                  ? 'Full administrative control with delete rights.'
                  : 'Editor access (Create, Edit & Status Publish).'}
              </p>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
            <div>
              <h2 className="text-2xl font-black text-unb-navy tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>

          {/* Page Contents */}
          {children}
        </main>
      </div>
    </div>
  );
};

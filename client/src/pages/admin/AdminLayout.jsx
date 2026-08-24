import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Package,
  FileText,
  Mail,
  Star,
  LogOut,
  Hammer,
  User,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminLayout = () => {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Portfolio CRUD', path: '/admin/portfolio', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Products CRUD', path: '/admin/products', icon: <Package className="h-5 w-5" /> },
    { name: 'Services CRUD', path: '/admin/services', icon: <Wrench className="h-5 w-5" /> },
    { name: 'Quote Requests', path: '/admin/quotes', icon: <FileText className="h-5 w-5" /> },
    { name: 'Contact Messages', path: '/admin/messages', icon: <Mail className="h-5 w-5" /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <Star className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 selection:bg-sky-500 selection:text-slate-950">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="bg-sky-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-sky-500/20">
              <Hammer className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="font-display font-black text-sm tracking-wide block text-white">HPY Admin</span>
              <span className="text-[10px] text-sky-400 font-bold tracking-wider block mt-0.5">Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-left">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-slate-950' : 'text-sky-400'}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Block & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3 text-left">
          {/* Public Link */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 hover:border-sky-400 text-xs font-bold text-slate-300 hover:text-sky-400 transition-colors"
          >
            <span className="flex items-center gap-2"><ExternalLink className="h-3.5 w-3.5 text-sky-400" /> View Main Site</span>
          </Link>
          
          <div className="flex items-center space-x-3 px-4 py-2 text-xs bg-slate-950/40 rounded-xl border border-slate-800/80">
            <div className="bg-slate-800 p-2 rounded-lg text-sky-400 border border-slate-700">
              <User className="h-4 w-4" />
            </div>
            <div className="truncate text-left">
              <p className="font-bold text-white leading-none truncate">{user.name}</p>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Administrator</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-xs font-bold tracking-wide bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col overflow-x-hidden min-h-screen">
        {/* Mobile Nav Header */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-sky-500 text-slate-950 p-1.5 rounded-lg">
              <Hammer className="h-4 w-4" />
            </div>
            <span className="font-display font-black text-sm tracking-wide text-white">HPY Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20 focus:outline-none"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Sub-Routes Outlet Container */}
        <main className="p-6 md:p-10 flex-grow max-w-7xl w-full mx-auto">
          {/* Mobile Bottom Navigation Bar */}
          <div className="md:hidden flex overflow-x-auto gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 mb-6 select-none">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap ${
                    isActive ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-300 bg-slate-950/60'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

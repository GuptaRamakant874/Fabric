import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
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
    { name: 'Services CRUD', path: '/admin/services', icon: <Wrench className="h-5 w-5" /> },
    { name: 'Quote Requests', path: '/admin/quotes', icon: <FileText className="h-5 w-5" /> },
    { name: 'Contact Messages', path: '/admin/messages', icon: <Mail className="h-5 w-5" /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <Star className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-industrial-charcoal flex text-industrial-light">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-industrial-gray border-r border-industrial-border flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-industrial-border/60 flex items-center space-x-2">
            <div className="bg-industrial-orange text-industrial-charcoal p-1.5 rounded text-left">
              <Hammer className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-wider block">VANCE PANEL</span>
              <span className="text-[10px] text-industrial-orange font-bold tracking-widest block uppercase mt-0.5">Control Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-industrial-orange text-industrial-charcoal font-bold'
                      : 'hover:bg-industrial-steel/40 text-industrial-muted hover:text-industrial-light'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Block & Logout */}
        <div className="p-4 border-t border-industrial-border/60 space-y-2">
          {/* Public Link */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded border border-industrial-border hover:border-industrial-orange/30 text-xs font-semibold text-industrial-muted hover:text-industrial-orange transition-colors"
          >
            <span className="flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> View Main Site</span>
          </Link>
          
          <div className="flex items-center space-x-3 px-4 py-2 text-xs">
            <div className="bg-industrial-steel p-1.5 rounded-full">
              <User className="h-4 w-4 text-industrial-orange" />
            </div>
            <div className="truncate text-left">
              <p className="font-bold text-industrial-light leading-none">{user.name}</p>
              <span className="text-[10px] text-industrial-muted mt-1 block">Administrator</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded text-sm font-semibold hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col overflow-x-hidden min-h-screen">
        {/* Mobile Nav Header */}
        <header className="md:hidden bg-industrial-gray border-b border-industrial-border px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-industrial-orange text-industrial-charcoal p-1.5 rounded">
              <Hammer className="h-4 w-4" />
            </div>
            <span className="font-display font-black text-sm tracking-wider">VANCE ADMIN</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="p-1 rounded text-red-400 hover:text-red-300 focus:outline-none"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Sub-Routes Outlet Container */}
        <main className="p-6 md:p-10 flex-grow max-w-7xl w-full mx-auto">
          {/* Mobile Bottom Navigation Bar (just in case they use mobile) */}
          <div className="md:hidden flex overflow-x-auto gap-2 bg-industrial-gray/60 p-2 rounded-lg border border-industrial-border/60 mb-6 select-none">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap ${
                    isActive ? 'bg-industrial-orange text-industrial-charcoal font-bold' : 'text-industrial-muted bg-industrial-steel/20'
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

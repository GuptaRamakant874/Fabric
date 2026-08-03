import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hammer, Phone, Mail, LayoutDashboard, Globe2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/services' },
    { name: 'Industries', path: '/about#industries' },
    { name: 'Projects', path: '/portfolio' },
    { name: 'Catalog', path: '/quote' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="sticky top-0 z-50">
      <div className="hidden md:flex items-center justify-between bg-slate-950 text-slate-200 px-6 py-2 text-xs tracking-[0.16em]">
        <div className="flex items-center gap-6">
          <a href="tel:+916358890888" className="inline-flex items-center gap-2 hover:text-sky-300 transition-colors">
            <Phone className="h-4 w-4" />
            +91 63588 90888
          </a>
          <a href="mailto:info@hpyengineering.com" className="inline-flex items-center gap-2 hover:text-sky-300 transition-colors">
            <Mail className="h-4 w-4" />
            info@hpyengineering.com
          </a>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <a href="https://www.hpyengineering.com" target="_blank" rel="noreferrer" className="hover:text-sky-300"><Globe2 className="h-4 w-4" /></a>
          <a href="https://www.hpyengineering.com" target="_blank" rel="noreferrer" className="hover:text-sky-300"><ExternalLink className="h-4 w-4" /></a>
        </div>
      </div>

      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-sky-600 text-white p-3 rounded-xl shadow-lg shadow-sky-500/20">
                <Hammer className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-black text-slate-950 uppercase tracking-[0.3em]">HPY</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Engineering</p>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path === '/about#industries' && location.pathname === '/about');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-semibold tracking-[0.18em] transition-colors duration-200 ${
                      isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <Link
                  to="/admin/dashboard"
                  className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700"
              >
                Get a Quote
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden inline-flex items-center justify-center rounded-full bg-slate-900 p-3 text-white shadow-lg shadow-slate-900/20"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden bg-white border-t border-slate-200 transition-max-height duration-300 overflow-hidden ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
          <div className="px-4 py-5 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/about#industries' && location.pathname === '/about');
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.15em] transition ${
                    isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

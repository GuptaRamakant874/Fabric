import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hammer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Catalog', path: '/quote' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-slate-950/60' : ''}`}>
      {/* Main Navbar */}
      <nav className={`backdrop-blur-md border-b transition-all duration-300 ${scrolled ? 'bg-slate-950 border-slate-700 shadow-xl' : 'bg-slate-900/95 border-slate-800 shadow-lg'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-sky-500 text-slate-950 p-2.5 rounded-xl shadow-lg shadow-sky-500/20 group-hover:bg-sky-400 transition-colors">
                <Hammer className="h-5 w-5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="font-display text-xl font-black text-white tracking-wide group-hover:text-sky-400 transition-colors">HPY</p>
                <p className="text-xs text-sky-400 font-bold tracking-wider">Engineering</p>
              </div>
            </Link>

            {/* Desktop Navigation Links in Title Case */}
            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-sky-300 bg-sky-500/15 border border-sky-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/quote"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2.5 text-xs font-black tracking-wide shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
              >
                Get A Quote
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
                className="xl:hidden inline-flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white shadow-lg hover:bg-slate-700 transition"
              >
                {isOpen ? <X className="h-5 w-5 text-sky-400" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Opens Downwards) */}
        <div className={`xl:hidden bg-slate-950 border-t border-slate-800 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[720px] py-4' : 'max-h-0'}`}>
          <div className="px-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold' : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              to="/quote"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-sky-500/25"
            >
              Get A Quote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

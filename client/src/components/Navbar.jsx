import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hammer, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-industrial-charcoal/90 backdrop-blur-md border-b border-industrial-border/60 py-3 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-industrial-orange text-industrial-charcoal p-2 rounded-lg font-bold transition-transform duration-300 group-hover:rotate-6">
              <Hammer className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-wider text-industrial-light block leading-none">
                VANCE
              </span>
              <span className="font-sans font-bold text-xs tracking-widest text-industrial-orange block leading-none mt-1">
                METAL FABRICATION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-industrial-orange ${
                    isActive ? 'text-industrial-orange' : 'text-industrial-light'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-industrial-steel/50 border border-industrial-border text-xs font-semibold text-industrial-light hover:bg-industrial-steel hover:text-industrial-orange transition-colors"
                title="Admin Panel"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link
              to="/quote"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-bold text-sm tracking-wider uppercase transition-all shadow-md shadow-industrial-orange/20 hover:scale-[1.02]"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="p-2 text-industrial-light hover:text-industrial-orange"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md bg-black text-white hover:text-industrial-orange focus:outline-none focus:ring-2 focus:ring-industrial-orange"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-transparent transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute inset-y-0 right-0 w-72 bg-black shadow-none border-l border-black/0 h-screen z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(event) => event.stopPropagation()}
          style={{ backgroundColor: '#000000' }}
        >
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-black tracking-wider text-industrial-light text-sm">
                  MENU
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-industrial-light hover:text-industrial-orange focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-base font-bold uppercase tracking-wider py-3 px-1 transition-colors duration-200 ${
                        isActive
                          ? 'text-industrial-orange border-l-2 border-industrial-orange pl-4'
                          : 'text-industrial-light pl-4 hover:text-industrial-orange'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {isAuthenticated && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 rounded-md bg-industrial-steel/50 border border-industrial-border text-sm font-bold text-industrial-light"
                >
                  <LayoutDashboard className="h-5 w-5 text-industrial-orange" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <Link
                to="/quote"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-md bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-industrial-orange/20"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

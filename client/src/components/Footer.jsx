import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Hammer, Download } from 'lucide-react';

// Inline SVG brand icons (lucide-react no longer ships brand icons)
const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="bg-slate-900/95 border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Build with confidence</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
              Custom stainless-steel solutions built for GMP, cleanroom, and critical environments.
            </h2>
          </div>
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition"
          >
            <Download className="h-4 w-4" />
            Request Catalog
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-sky-600 text-white p-3 rounded-2xl shadow-lg shadow-sky-600/20">
                <Hammer className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base font-black uppercase tracking-[0.3em] text-white">HPY</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Engineering</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              HPY Engineering offers premium SS 304 / SS 316 cabinets, tables, trolleys and custom cleanroom fabrication with audit-ready documentation.
            </p>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-sky-300" />
                <a href="tel:+916358890888" className="hover:text-white transition">+91 63588 90888</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-300" />
                <a href="mailto:info@hpyengineering.com" className="hover:text-white transition">info@hpyengineering.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-300" />
                <span>GIDC, Gandhinagar – 382021, Gujarat, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400 mb-5">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span>Survey No. 72, Near GIDC, Gandhinagar – 382021, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sky-400" />
                <a href="tel:+916358890888" className="hover:text-white transition">+91 63588 90888</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sky-400" />
                <a href="mailto:info@hpyengineering.com" className="hover:text-white transition">info@hpyengineering.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400 mb-5">Product Highlights</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>SS Cabinets</li>
              <li>Cleanroom Tables</li>
              <li>Pass Boxes</li>
              <li>SS Sinks</li>
              <li>Storage Lockers</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-6 text-sm text-slate-400 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p>&copy; {currentYear} HPY Engineering. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/quote" className="hover:text-white transition">Request Catalog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

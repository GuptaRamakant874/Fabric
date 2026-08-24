import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper CTA Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              Ready To Fabricate Your Next Cleanroom Project?
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Get in touch with our technical team today for precision stainless steel engineering, fast turnaround times, and competitive direct pricing.
            </p>
          </div>
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm px-7 py-3.5 shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02] shrink-0"
          >
            <span>Request A Free Quote</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-sky-500 text-slate-950 p-2 rounded-xl">
                <Hammer className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-lg font-black text-white tracking-wide block">HPY</span>
                <span className="text-[10px] text-sky-400 font-bold tracking-wider block">Engineering</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Leading manufacturers of stainless steel furniture, cleanroom workstations, trolleys, cabinets, and precision sheet metal solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-sky-400 tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-300 hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/quote" className="text-slate-300 hover:text-white transition-colors">Request A Quote</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Our Capabilities */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-sky-400 tracking-wider">
              Our Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="hover:text-white transition-colors">Cleanroom Equipment</li>
              <li className="hover:text-white transition-colors">SS Cabinets & Trolleys</li>
              <li className="hover:text-white transition-colors">Precision CNC Cutting</li>
              <li className="hover:text-white transition-colors">TIG & MIG Welding</li>
              <li className="hover:text-white transition-colors">Custom Sheet Metal</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-sky-400 tracking-wider">
              Headquarters
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Ahmedabad & Industrial Estates, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="tel:+916358890888" className="hover:text-white transition-colors font-medium">+91 63588 90888</a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="mailto:dg614768@gmail.com" className="hover:text-white transition-colors font-medium">dg614768@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} HPY Engineering. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-sky-400 transition-colors">Admin Portal</Link>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms Of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

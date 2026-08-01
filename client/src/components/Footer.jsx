import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Hammer, Shield, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-industrial-gray border-t border-industrial-border/60">
      {/* Top Banner CTA */}
      <div className="bg-industrial-orange/10 border-b border-industrial-orange/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-industrial-orange text-industrial-charcoal p-2 rounded-lg font-bold">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-industrial-light">Ready to start your fabrication project?</h4>
              <p className="text-sm text-industrial-muted">Get a competitive quote with engineered drawings review.</p>
            </div>
          </div>
          <Link
            to="/quote"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-sm tracking-wider uppercase transition-all whitespace-nowrap hover:scale-[1.02]"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-industrial-orange text-industrial-charcoal p-2 rounded-lg font-bold">
                <Hammer className="h-5 w-5" />
              </div>
              <span className="font-display font-black text-lg tracking-wider text-industrial-light">
                VANCE STEEL
              </span>
            </Link>
            <p className="text-sm text-industrial-muted leading-relaxed">
              Premium steel and metal fabrication solutions for heavy industrial, commercial, and bespoke architectural projects. ISO 9001 and AISC certified.
            </p>
            <div className="flex items-center space-x-2 text-xs text-industrial-muted bg-industrial-charcoal/50 p-2 rounded border border-industrial-border/40 w-fit">
              <Shield className="h-4 w-4 text-industrial-orange" />
              <span>Certified AWS D1.1 Welding Standard</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-display font-bold uppercase tracking-wider text-sm text-industrial-light mb-4 border-l-2 border-industrial-orange pl-2">
              Capabilities
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-industrial-muted hover:text-industrial-orange transition-colors">
                  Structural Steel
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-industrial-muted hover:text-industrial-orange transition-colors">
                  CNC Laser Cutting
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-industrial-muted hover:text-industrial-orange transition-colors">
                  Industrial Welding
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-industrial-muted hover:text-industrial-orange transition-colors">
                  Custom Railings & Stairs
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-industrial-muted hover:text-industrial-orange transition-colors">
                  Completed Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Operational Hours */}
          <div>
            <h3 className="font-display font-bold uppercase tracking-wider text-sm text-industrial-light mb-4 border-l-2 border-industrial-orange pl-2">
              Working Hours
            </h3>
            <ul className="space-y-3 text-sm text-industrial-muted">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-industrial-orange" /> Mon - Fri</span>
                <span>7:00 AM - 5:00 PM</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Saturday</span>
                <span>8:00 AM - 1:00 PM</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Sunday</span>
                <span className="text-industrial-orange font-bold text-xs uppercase">Closed</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h3 className="font-display font-bold uppercase tracking-wider text-sm text-industrial-light mb-4 border-l-2 border-industrial-orange pl-2">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm text-industrial-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-industrial-orange shrink-0 mt-0.5" />
                <span>102 Industrial Parkway, Sector 4, Heavy Engineering Zone, TX 75001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-industrial-orange shrink-0" />
                <a href="tel:+18005553227" className="hover:text-industrial-orange transition-colors">
                  +1 (800) 555-3227
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-industrial-orange shrink-0" />
                <a href="mailto:info@vancesteeel.com" className="hover:text-industrial-orange transition-colors">
                  info@vancesteel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and admin gateway */}
        <div className="border-t border-industrial-border/40 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-industrial-muted">
          <div>
            &copy; {currentYear} Vance Metal Fabrication. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="hover:text-industrial-orange transition-colors">
              Safety First Policy
            </Link>
            <span>&bull;</span>
            <Link to="/admin/login" className="hover:text-industrial-orange transition-colors font-bold text-industrial-orange/80">
              Admin Portal Gateway
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

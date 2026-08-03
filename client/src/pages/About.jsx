import React from 'react';
import { ShieldCheck, HardHat, FileText, CheckCircle, ShieldAlert, Award } from 'lucide-react';

const About = () => {
  const certifications = [
    { title: 'AISC Certified Fabricator', issuer: 'American Institute of Steel Construction', code: 'BU-38291' },
    { title: 'AWS D1.1 & D1.5 Standards', issuer: 'American Welding Society', code: 'Weld-QC-401' },
    { title: 'ISO 9001:2015 Registered', issuer: 'International Quality Register', code: 'QMS-9001' },
    { title: 'OSHA 30-Hour Certified Leads', issuer: 'Occupational Safety & Health Admin', code: 'Safety-Lead' },
  ];

  const timeline = [
    { year: '2008', title: 'Company Founded', desc: 'HPY Engineering opened a single 2,000 sq ft workshop focused on stainless steel assembly, welding, and cleanroom readiness.' },
    { year: '2013', title: 'Expanded Facility & Laser CNC', desc: 'Acquired a new 12,000 sq ft facility and added high-precision multi-axis CNC laser cutting to support pharmaceutical-grade fabrications.' },
    { year: '2019', title: 'SS 304/316 Shop Certification', desc: 'Gained process certifications for stainless steel cleanroom products, enabling production for pharma, biotech, and hospital applications.' },
    { year: '2024', title: 'Full Industry Integration', desc: 'Expanded into our current headquarters with powder coating, assembly, and GMP-compliant fabrication under one roof.' },
  ];

  const leaders = [
    { name: 'Hardik Patel', role: 'Founder & Managing Director', bio: 'Hardik leads strategic planning and production oversight for all cleanroom and pharmaceutical fabrication projects.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
    { name: 'Parth Yadav', role: 'Engineering Lead', bio: 'Parth coordinates CAD-to-shop workflows and verifies each drawing against manufacturing and GMP standards.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { name: 'Meera Shah', role: 'QC & Safety Inspector', bio: 'Meera owns our shop-floor quality audits and ensures compliance with welding inspections and cleanroom cleanliness checks.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' }
  ];

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-industrial-gray border-b border-industrial-border/60 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-industrial-light uppercase tracking-tight">
            About <span className="text-industrial-orange">HPY Engineering</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto">
            Learn about our fabrication standards, strict safety policies, and the team driving engineering excellence since 2008.
          </p>
        </div>
      </section>

      {/* History & Timeline */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* History details */}
          <div className="lg:col-span-1 text-left space-y-6">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-industrial-light uppercase tracking-tight">
              Our <span className="text-industrial-orange">Journey</span>
            </h2>
            <p className="text-sm sm:text-base text-industrial-muted leading-relaxed">
              We started with a simple belief: steel fabrication demands absolute precision. There is no room for error when building the structural backbone of warehouses, skyscrapers, or custom staircases.
            </p>
            <p className="text-sm sm:text-base text-industrial-muted leading-relaxed">
              Over nearly two decades, we have invested in state-of-the-art automated machinery while staying true to our craftsmanship roots. Every column, gusset, and weld has our name on it.
            </p>
            <div className="p-4 bg-industrial-gray border border-industrial-border rounded-lg flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-industrial-orange shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-industrial-light">Quality Checked</h4>
                <p className="text-xs text-industrial-muted mt-0.5">Every structural beam receives mill test reports and visual quality signs.</p>
              </div>
            </div>
          </div>

          {/* Timeline chart */}
          <div className="lg:col-span-2 relative border-l border-industrial-border pl-6 sm:pl-8 space-y-12 text-left ml-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Bullet */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 bg-industrial-orange text-industrial-charcoal p-1.5 rounded-full font-bold shadow-lg border-2 border-industrial-charcoal">
                  <span className="block w-2.5 h-2.5 rounded-full bg-industrial-charcoal"></span>
                </div>
                
                <span className="inline-block bg-industrial-orange/10 border border-industrial-orange/30 text-industrial-orange font-display font-black px-2 py-0.5 rounded text-sm mb-2">
                  {item.year}
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-industrial-light">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-industrial-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications and Safety Standards */}
      <section className="bg-industrial-gray border-t border-b border-industrial-border/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-industrial-orange/15 border border-industrial-orange/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-industrial-orange">
                <HardHat className="h-4 w-4" /> Safety First Culture
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-industrial-light uppercase tracking-tight">
                Certifications & <span className="text-industrial-orange">Industry Standards</span>
              </h2>
              <p className="text-sm text-industrial-muted leading-relaxed">
                HPY Engineering maintains standard certifications to bid and execute complex pharmaceutical and industrial fabrication contracts. Our shop is audited annually to verify compliance.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((c, i) => (
                  <div key={i} className="bg-industrial-charcoal border border-industrial-border/60 p-4 rounded-lg flex items-start gap-3">
                    <Award className="h-5 w-5 text-industrial-orange shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-industrial-light">{c.title}</h4>
                      <p className="text-[11px] text-industrial-muted mt-0.5">{c.issuer}</p>
                      <span className="text-[10px] text-industrial-orange/70 font-mono mt-1 block">{c.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-industrial-charcoal border border-industrial-border rounded-xl p-8 space-y-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 text-industrial-orange/5 font-display font-black text-9xl pointer-events-none select-none">
                AWS
              </div>
              
              <h3 className="font-display font-extrabold text-xl text-industrial-light flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-industrial-orange" /> Quality Assurance Protocols
              </h3>
              <p className="text-xs sm:text-sm text-industrial-muted leading-relaxed">
                We operate under a strict quality management system (QMS) matching AWS D1.1 specifications. Our inspection checks include:
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-industrial-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-industrial-orange shrink-0" />
                  <span>Full Material Traceability (Mill Test Reports for all steels)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-industrial-orange shrink-0" />
                  <span>Visual & Ultrasonic testing for structural welding joints</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-industrial-orange shrink-0" />
                  <span>Tolerance verifications matching AISC Code of Standard Practice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-industrial-orange shrink-0" />
                  <span>Sandblasting to SSPC-SP6/SP10 specifications prior to primer coating</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-industrial-light uppercase tracking-tight">
            Leadership <span className="text-industrial-orange">Team</span>
          </h2>
          <p className="text-sm text-industrial-muted">
            The skilled engineering, safety, and management team driving our fabrication quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-industrial-gray border border-industrial-border/60 rounded-lg overflow-hidden flex flex-col h-full shadow-lg hover:border-industrial-orange/30 transition-all duration-300">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full aspect-square object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="p-6 text-left flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-industrial-light leading-snug">
                    {leader.name}
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange block mt-1">
                    {leader.role}
                  </span>
                  <p className="mt-4 text-xs sm:text-sm text-industrial-muted leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

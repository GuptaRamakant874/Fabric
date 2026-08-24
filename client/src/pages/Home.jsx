import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  Hammer,
  Sparkles,
  Layers,
  ChevronRight,
  Star,
  Quote as QuoteIcon
} from 'lucide-react';
import API from '../api';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import Lightbox from '../components/Lightbox';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveAssetUrl } from '../utils/urls';

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox selection
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
          API.getServices(),
          API.getProjects({ featured: true }),
          API.getTestimonials(),
        ]);

        setFeaturedServices(servicesRes.data.data.slice(0, 3));
        setFeaturedProjects(projectsRes.data.data.slice(0, 3));
        setTestimonials(testimonialsRes.data.data);
      } catch (err) {
        console.error('Error loading homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-0 text-slate-100 selection:bg-sky-500 selection:text-slate-950">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-950 border-b border-slate-800 overflow-hidden text-left">
        {/* Background Grid Pattern & Radial Glow */}
        <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/40 px-4 py-2 rounded-full text-xs font-bold text-sky-300 shadow-sm">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span>ISO 9001 Certified Cleanroom Solutions</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-[1.1] tracking-tight">
              Precision-Engineered <span className="text-sky-400">Stainless Steel</span> & Cleanroom Solutions
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              HPY Engineering delivers premium industrial stainless steel fabrication, sterile pharmaceutical furniture, custom cleanroom cabinets, and heavy structural assemblies built to exacting specifications.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-xl shadow-sky-500/25 hover:scale-[1.02]"
              >
                <span>Explore Our Products</span>
                <ChevronRight className="h-4 w-4 ml-1.5 stroke-[3]" />
              </Link>
              <Link
                to="/quote"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm tracking-wide transition-all hover:scale-[1.02]"
              >
                <span>Request A Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="block font-display font-black text-4xl sm:text-5xl text-sky-400">
                500+
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-300">
                Completed Projects
              </span>
            </div>
            <div className="space-y-1">
              <span className="block font-display font-black text-4xl sm:text-5xl text-sky-400">
                100%
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-300">
                Quality Certifications
              </span>
            </div>
            <div className="space-y-1">
              <span className="block font-display font-black text-4xl sm:text-5xl text-sky-400">
                15+
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-300">
                Years Of Excellence
              </span>
            </div>
            <div className="space-y-1">
              <span className="block font-display font-black text-4xl sm:text-5xl text-sky-400">
                99.8%
              </span>
              <span className="block text-xs sm:text-sm font-bold text-slate-300">
                Client Satisfaction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Company Intro & Quality Assurance Section */}
      <section className="bg-slate-950 border-b border-slate-800 py-20 text-left relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-wider text-sky-400 block">
                Why Choose HPY Engineering
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Engineered For Hygiene, Built For <span className="text-sky-400">Longevity</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                With comprehensive in-house fabrication machinery including CNC laser cutters, high-tonnage press brakes, and certified TIG/MIG welding units, we craft precision equipment for laboratories, hospitals, pharmaceutical factories, and food processing facilities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <ShieldCheck className="h-6 w-6 text-sky-400 shrink-0" />
                  <span className="font-bold text-xs text-slate-200">ISO 9001 Certified</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Award className="h-6 w-6 text-sky-400 shrink-0" />
                  <span className="font-bold text-xs text-slate-200">Qualified AWS Welders</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
              <h3 className="font-display font-bold text-xl text-white">
                Zero-Incident Safety Standard
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Every fabrication piece undergoes strict quality and surface roughness testing (Ra values for cleanroom compliance) before delivery.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                  <span>SS 304 & SS 316 Grade Stainless Steel Only</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                  <span>Electropolished & Mirror Finish Capabilities</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                  <span>Factory Direct Pricing With Fast Turnarounds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities Showcase */}
      <section className="bg-slate-900 border-b border-slate-800 py-20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-sky-400 block mb-1">
                Precision Manufacturing
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Our Core <span className="text-sky-400">Capabilities</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center font-bold text-xs sm:text-sm tracking-wide text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/10 border border-sky-500/30 px-6 py-3 rounded-xl hover:bg-sky-500/20"
            >
              <span>Explore All Products</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Projects Gallery */}
      <section className="bg-slate-950 border-b border-slate-800 py-20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-sky-400 block mb-1">
                Proven Track Record
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Featured <span className="text-sky-400">Projects</span>
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center font-bold text-xs sm:text-sm tracking-wide text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/10 border border-sky-500/30 px-6 py-3 rounded-xl hover:bg-sky-500/20 shrink-0"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-slate-900 py-20 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-wider text-sky-400 block mb-1">
                Client Trust
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                What Our Clients <span className="text-sky-400">Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => {
                const avatarUrl = resolveAssetUrl(t.image);
                return (
                  <div
                    key={t._id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative"
                  >
                    <div className="space-y-4">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-200 text-sm italic leading-relaxed">
                        "{t.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 border-t border-slate-800 mt-6 pt-4">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={t.clientName}
                          className="h-10 w-10 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
                          {t.clientName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-white">{t.clientName}</h4>
                        <span className="text-xs text-slate-400">{t.company || 'Industry Partner'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox for featured project preview */}
      {selectedProject && (
        <Lightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default Home;

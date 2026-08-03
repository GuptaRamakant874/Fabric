import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Users, HardHat, Star } from 'lucide-react';
import API from '../api';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import Lightbox from '../components/Lightbox';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
          API.getServices(),
          API.getProjects({ featured: true }),
          API.getTestimonials(),
        ]);
        setServices(servicesRes.data.data.slice(0, 4));
        setFeaturedProjects(projectsRes.data.data.slice(0, 3));
        setTestimonials(testimonialsRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page content:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Years in Business', value: '18+' },
    { label: 'Projects Completed', value: '920+' },
    { label: 'Tons of Fabricated Steel', value: '14,500+' },
    { label: 'Certified Welding Experts', value: '38+' },
  ];

  return (
    <div className="pt-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-industrial-charcoal overflow-hidden py-20">
        {/* Visual Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600"
            alt="Steel fabrication factory background"
            className="w-full h-full object-cover opacity-20 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-industrial-charcoal via-industrial-charcoal/80 to-transparent"></div>
          {/* Decorative Industrial Grid Overlay */}
          <div className="absolute inset-0 industrial-grid opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-industrial-orange/15 border border-industrial-orange/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-industrial-orange">
              <HardHat className="h-4 w-4" /> GMP & AWS Certified Facility
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-6xl text-industrial-light leading-[1.1] tracking-tight uppercase">
              Precision-Engineered <span className="text-industrial-orange block">Steel Fabrication</span>
            </h1>
            
            <p className="text-base sm:text-lg text-industrial-muted max-w-2xl leading-relaxed">
              We specialize in custom structural steel columns, heavy-duty industrial framing, precision CNC metal cutting, and certified architectural welding. Built for safety, durability, and standard compliance.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-sm tracking-wider uppercase transition-all shadow-lg shadow-industrial-orange/10 hover:scale-[1.02]"
              >
                Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-industrial-steel/60 hover:bg-industrial-steel border border-industrial-border text-industrial-light font-bold text-sm tracking-wider uppercase transition-all hover:scale-[1.02]"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-industrial-gray border-y border-industrial-border/60 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block font-display font-black text-3xl sm:text-5xl text-industrial-orange">
                  {stat.value}
                </span>
                <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-industrial-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Company Intro & Safety */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800"
              alt="Structural Steel Welding Team"
              className="rounded-lg shadow-2xl border border-industrial-border/60 object-cover w-full aspect-video"
            />
            {/* Float Badge */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-industrial-gray border border-industrial-orange/30 p-5 rounded-lg shadow-2xl max-w-xs">
              <ShieldCheck className="h-10 w-10 text-industrial-orange shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-industrial-light">Zero-Incident Safety Record</h4>
                <p className="text-xs text-industrial-muted mt-0.5">Strict compliance with OSHA protocols.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-industrial-light uppercase tracking-tight">
              A Culture of <span className="text-industrial-orange">Precision & Safety</span>
            </h2>
            <p className="text-sm sm:text-base text-industrial-muted leading-relaxed">
              Founded in 2008, HPY Engineering has grown from a local workshop into a state-of-the-art stainless steel and cleanroom fabrication facility. We serve pharmaceutical, biotech, and industrial clients nationwide.
            </p>
            <p className="text-sm sm:text-base text-industrial-muted leading-relaxed">
              Every weld is performed by certified AWS professionals, and our structural materials comply strictly with AISC standards. Whether you need single prototyping, heavy-duty production runs, or commercial frame erections, we have the machinery and expertise.
            </p>
            <div className="pt-4 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-industrial-orange" />
                <span className="font-bold text-xs uppercase tracking-wider text-industrial-light">ISO 9001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-industrial-orange" />
                <span className="font-bold text-xs uppercase tracking-wider text-industrial-light">Qualified AWS Welders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Services Overview */}
      <section className="bg-industrial-gray/50 border-t border-industrial-border/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-industrial-light uppercase tracking-tight">
              Our <span className="text-industrial-orange">Core Capabilities</span>
            </h2>
            <p className="text-sm text-industrial-muted">
              We operate high-capacity heavy machinery and engineering software to deliver structurally sound metal fabrications.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center text-industrial-muted py-8">
              No services configured. Seed the database or add them in the admin dashboard.
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center font-bold text-sm tracking-wider uppercase text-industrial-orange hover:text-industrial-orange-hover transition-colors"
            >
              Explore All Services <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured Projects Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left max-w-2xl space-y-3">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-industrial-light uppercase tracking-tight">
              Featured <span className="text-industrial-orange">Projects</span>
            </h2>
            <p className="text-sm text-industrial-muted">
              View our latest structural steel installations, architectural fabrication work, and custom precision components.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center font-bold text-sm tracking-wider uppercase text-industrial-orange hover:text-industrial-orange-hover transition-colors shrink-0"
          >
            Browse Full Gallery <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-industrial-muted py-8">
            No projects featured yet. Mark projects as featured in the admin panel.
          </div>
        )}
      </section>

      {/* 6. Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-industrial-gray py-20 border-t border-industrial-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-industrial-light uppercase tracking-tight">
                Client <span className="text-industrial-orange">Reviews</span>
              </h2>
              <p className="text-sm text-industrial-muted">
                What pharmaceutical manufacturers and cleanroom engineers say about working with HPY Engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="bg-industrial-charcoal border border-industrial-border/50 rounded-lg p-6 flex flex-col justify-between shadow-md relative hover:border-industrial-orange/30 transition-all"
                >
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex text-industrial-orange">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-industrial-muted italic leading-relaxed">
                      "{t.message}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-industrial-border/30 mt-6 pt-4">
                    {t.image && (
                      <img
                        src={t.image}
                        alt={t.clientName}
                        className="h-10 w-10 rounded-full object-cover border border-industrial-border"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-industrial-light">{t.clientName}</h4>
                      <p className="text-xs text-industrial-muted">{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Lightbox Modal */}
      {selectedProject && (
        <Lightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default Home;

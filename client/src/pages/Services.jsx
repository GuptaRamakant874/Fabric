import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight, ShieldCheck, Hammer } from 'lucide-react';
import API from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.getServices();
        setServices(res.data.data);
      } catch (err) {
        setError('Failed to load services. Please check back later.');
        console.error('Error fetching services:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-20">
      {/* Services Header */}
      <section className="bg-industrial-gray border-b border-industrial-border/60 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-industrial-light uppercase tracking-tight">
            Fabrication <span className="text-industrial-orange">Capabilities</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto">
            From multi-ton structural building skeletons to precision-formed custom brackets, we offer full-service metal fabrication.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 font-bold p-8 bg-red-500/10 border border-red-500/20 rounded-lg max-w-xl mx-auto">
            {error}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No Services Configured"
            description="Sample services can be loaded using the database seeder script or created directly inside the admin panel."
          />
        )}
      </section>

      {/* Specialty Custom Capability Panel */}
      <section className="bg-industrial-gray border-t border-b border-industrial-border/60 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3 rounded-full bg-industrial-orange/10 border border-industrial-orange/30 text-industrial-orange">
            <HelpCircle className="h-8 w-8" />
          </div>
          
          <h2 className="font-display font-black text-2xl sm:text-3xl text-industrial-light uppercase tracking-tight">
            Need a Bespoke <span className="text-industrial-orange">Custom Component?</span>
          </h2>
          
          <p className="text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto leading-relaxed">
            Our engineering team specializes in translating custom AutoCAD, SolidWorks, or PDF drawings into structurally sound metal products. We handle material selections, stress calculations, and structural detailing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-sm tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02]"
            >
              Upload Spec Sheets <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-md bg-industrial-steel/40 hover:bg-industrial-steel border border-industrial-border text-industrial-light font-bold text-sm tracking-wider uppercase transition-all"
            >
              Consult an Engineer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

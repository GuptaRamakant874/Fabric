import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Hammer } from 'lucide-react';
import API from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.getServices();
        setServices(res.data.data);
      } catch (err) {
        setError('Failed to load products. Please check back later.');
        console.error('Error fetching services:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(services.map((service) => service.category || '').filter(Boolean)));
    return ['All', ...unique];
  }, [services]);

  const filteredServices = useMemo(() => {
    const list = activeCategory === 'All'
      ? services
      : services.filter((service) => service.category === activeCategory);

    if (sortBy === 'Name') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [services, activeCategory, sortBy]);

  return (
    <div className="pt-20">
      <section className="bg-industrial-gray border-b border-industrial-border/60 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-industrial-orange mb-4">Product Catalog</p>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-industrial-light uppercase tracking-tight">
            SS Cabinets, Trolleys, Workstations & More
          </h1>
          <p className="mt-4 text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto">
            Explore HPY Engineering’s stainless steel product categories for cleanroom, pharma, and laboratory applications.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <aside className="space-y-8">
            <div className="rounded-3xl border border-industrial-border/60 bg-industrial-gray p-6 shadow-xl">
              <h2 className="font-display font-black text-sm uppercase tracking-[0.28em] text-industrial-light mb-6">Product Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      activeCategory === category
                        ? 'bg-industrial-orange text-industrial-charcoal shadow-lg'
                        : 'bg-industrial-charcoal/20 text-industrial-light hover:bg-industrial-charcoal/40'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-industrial-border/60 bg-industrial-gray p-6 shadow-xl">
              <h3 className="font-display font-bold text-lg text-industrial-light mb-4">Need Custom Design?</h3>
              <p className="text-sm text-industrial-muted leading-relaxed">
                We manufacture per your requirement with precision stainless steel fabrication for custom cabinets, tables, racks and cleanroom equipment.
              </p>
              <Link
                to="/quote"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-industrial-orange px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-industrial-charcoal transition hover:bg-industrial-orange-hover"
              >
                Request Customization
              </Link>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-industrial-orange mb-2">Showing</p>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-industrial-light uppercase tracking-tight">
                  {activeCategory === 'All' ? 'All Products' : activeCategory}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-sm text-industrial-muted">
                <label htmlFor="sortBy" className="uppercase tracking-[0.22em] text-xs">Sort by</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-industrial-border/70 bg-industrial-charcoal px-4 py-2 text-sm text-industrial-light outline-none focus:border-industrial-orange"
                >
                  <option value="Popular">Popular</option>
                  <option value="Name">Name</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center text-red-500 font-bold p-8 bg-red-500/10 border border-red-500/20 rounded-lg max-w-xl mx-auto">
                {error}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // This placeholder can be replaced with a dedicated product detail action.
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                message="No products found"
                description="Select a different category or seed product data through the admin panel."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

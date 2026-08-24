import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import CustomDropdown from '../components/CustomDropdown';

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

  const sortOptions = [
    { value: 'Popular', label: 'Most Popular' },
    { value: 'Name', label: 'Alphabetical Name' },
  ];

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
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-15"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold text-sky-400 mb-3 tracking-wider">Product Catalog</p>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Stainless Steel Cabinets, Trolleys & Workstations
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore HPY Engineering’s stainless steel product categories for cleanroom, pharma, and laboratory applications.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <aside className="space-y-8 text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="font-display font-bold text-sm text-sky-400 mb-5 tracking-wide">Product Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left rounded-xl px-4 py-3 text-xs sm:text-sm font-bold tracking-wide transition ${
                      activeCategory === category
                        ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="font-display font-bold text-lg text-white mb-3">Need Custom Design?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We manufacture per your requirement with precision stainless steel fabrication for custom cabinets, tables, racks, and cleanroom equipment.
              </p>
              <Link
                to="/quote"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-3 text-center text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-sky-500/25 transition hover:scale-[1.02]"
              >
                Request Customization
              </Link>
            </div>
          </aside>

          <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <p className="text-xs font-bold text-sky-400 mb-1 tracking-wide">Showing</p>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {activeCategory === 'All' ? 'All Products' : activeCategory}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort By:</span>
                <div className="w-48">
                  <CustomDropdown
                    id="sortBy"
                    options={sortOptions}
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    buttonClassName="py-2 px-3 text-xs sm:text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center text-red-400 font-bold p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-xl mx-auto">
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
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                message="No Products Found"
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

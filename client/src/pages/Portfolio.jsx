import React, { useState, useEffect } from 'react';
import API from '../api';
import ProjectCard from '../components/ProjectCard';
import Lightbox from '../components/Lightbox';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category Filtering
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Lightbox selection
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Industrial', 'Commercial', 'Residential', 'Custom'];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = activeCategory !== 'All' ? { category: activeCategory } : {};
        const res = await API.getProjects(params);
        setProjects(res.data.data);
      } catch (err) {
        setError('Failed to fetch portfolio projects. Please try reloading.');
        console.error('Error fetching projects:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Portfolio Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-15"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Our <span className="text-sky-400">Portfolio</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse our completed fabrication projects across industrial complexes, commercial plazas, and custom residential steel designs.
          </p>
        </div>
      </section>

      {/* Tabs & Gallery Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs in Title Case */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 border-b border-slate-800 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-black scale-[1.02] shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900 border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-400 font-bold p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-xl mx-auto">
            {error}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No Projects Found"
            description={`We don't have any projects categorized under '${activeCategory}' in our logs right now.`}
          />
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedProject && (
        <Lightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default Portfolio;

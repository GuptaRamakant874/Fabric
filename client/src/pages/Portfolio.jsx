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
    <div className="pt-20">
      {/* Portfolio Header */}
      <section className="bg-industrial-gray border-b border-industrial-border/60 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-industrial-light uppercase tracking-tight">
            Our <span className="text-industrial-orange">Portfolio</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto">
            Browse our completed fabrication projects across industrial complexes, commercial plazas, and custom residential steel designs.
          </p>
        </div>
      </section>

      {/* Tabs & Gallery Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-industrial-border/40 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-industrial-orange text-industrial-charcoal font-black scale-[1.02]'
                  : 'bg-industrial-steel/40 border border-industrial-border/80 text-industrial-light hover:bg-industrial-steel hover:text-industrial-orange'
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
          <div className="text-center text-red-500 font-bold p-8 bg-red-500/10 border border-red-500/20 rounded-lg max-w-xl mx-auto">
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

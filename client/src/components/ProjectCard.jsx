import React from 'react';
import { Calendar, User, ArrowUpRight } from 'lucide-react';
import { resolveAssetUrl } from '../utils/urls';

const ProjectCard = ({ project, onClick }) => {
  const formattedDate = new Date(project.completedDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  // Resolve Image Path (handles absolute URLs from seed and relative ones from local uploads)
  const mainImage = project.images?.[0];
  const imageUrl = resolveAssetUrl(mainImage);

  return (
    <div
      onClick={onClick}
      className="group bg-industrial-gray border border-industrial-border/60 rounded-lg overflow-hidden cursor-pointer hover:border-industrial-orange/40 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Wrap */}
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-industrial-steel flex items-center justify-center">
            <span className="text-industrial-muted">No Image</span>
          </div>
        )}
        
        {/* Category tag */}
        <span className="absolute top-4 left-4 bg-industrial-charcoal/90 backdrop-blur-sm border border-industrial-border text-industrial-orange px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
          {project.category}
        </span>

        {/* View Icon Overlay */}
        <div className="absolute inset-0 bg-industrial-charcoal/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-industrial-orange text-industrial-charcoal p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowUpRight className="h-6 w-6 font-bold" />
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-display font-extrabold text-lg text-industrial-light group-hover:text-industrial-orange transition-colors duration-200 line-clamp-1">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-industrial-muted line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="border-t border-industrial-border/40 mt-4 pt-3 flex items-center justify-between text-xs text-industrial-muted">
          {project.client && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-industrial-orange" />
              <span className="line-clamp-1 max-w-[120px]">{project.client}</span>
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="h-3.5 w-3.5 text-industrial-orange" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

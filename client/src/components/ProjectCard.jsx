import React from 'react';
import { Calendar, User, ArrowUpRight } from 'lucide-react';
import { resolveAssetUrl } from '../utils/urls';

const ProjectCard = ({ project, onClick }) => {
  const formattedDate = new Date(project.completedDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  // Resolve Image Path
  const mainImage = project.images?.[0];
  const imageUrl = resolveAssetUrl(mainImage);

  return (
    <div
      onClick={onClick}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-sky-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-full text-left"
    >
      {/* Image Wrap */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-950 flex items-center justify-center">
            <span className="text-slate-500 text-sm">No Image</span>
          </div>
        )}
        
        {/* Category tag */}
        <span className="absolute top-3.5 left-3.5 right-3.5 max-w-[calc(100%-1.75rem)] truncate bg-slate-950/90 backdrop-blur-md border border-slate-700 text-sky-300 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
          {project.category}
        </span>

        {/* View Icon Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-sky-500 text-slate-950 p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowUpRight className="h-6 w-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-display font-black text-lg text-white group-hover:text-sky-400 transition-colors duration-200 line-clamp-1">
            {project.title}
          </h3>
          <p className="mt-2.5 text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="border-t border-slate-800 mt-5 pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          {project.client && (
            <span className="flex min-w-0 items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span className="line-clamp-1 max-w-[140px] font-medium">{project.client}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 sm:ml-auto">
            <Calendar className="h-3.5 w-3.5 text-sky-400 shrink-0" />
            <span className="font-medium text-slate-400">{formattedDate}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

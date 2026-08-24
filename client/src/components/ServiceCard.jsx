import React from 'react';
import * as Icons from 'lucide-react';
import { resolveAssetUrl } from '../utils/urls';

const ServiceCard = ({ service, onClick }) => {
  // Dynamically resolve Lucide Icon component based on saved string name
  const IconComponent = Icons[service.icon] || Icons.Wrench;
  const buttonLabel = service.ctaLabel || 'View Details';

  return (
    <div className={`group relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all duration-300 flex flex-col h-full shadow-xl hover:border-sky-500/50 hover:shadow-2xl text-left ${onClick ? 'cursor-pointer' : ''}`}>
      {/* Background Image Panel */}
      <div className="h-48 overflow-hidden relative bg-slate-950">
        {service.image ? (
          <img
            src={resolveAssetUrl(service.image)}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-950 flex items-center justify-center">
            <IconComponent className="h-16 w-16 text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col justify-between relative -mt-8 bg-slate-900 rounded-t-2xl">
        <div>
          {/* Icon Badge */}
          <div className="inline-flex p-3 rounded-xl bg-slate-950 border border-slate-700 text-sky-400 mb-4 shadow-lg group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
            <IconComponent className="h-6 w-6" />
          </div>
          
          <h3 className="font-display font-black text-xl text-white group-hover:text-sky-400 transition-colors duration-200">
            {service.title}
          </h3>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {service.description}
          </p>
        </div>

        {onClick && (
          <div className="mt-6">
            <button
              type="button"
              onClick={onClick}
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-center text-xs font-black tracking-wide text-slate-950 transition hover:bg-sky-400 shadow-md shadow-sky-500/20"
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;

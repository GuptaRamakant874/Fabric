import React from 'react';
import * as Icons from 'lucide-react';

const ServiceCard = ({ service }) => {
  // Dynamically resolve Lucide Icon component based on saved string name
  const IconComponent = Icons[service.icon] || Icons.Wrench;

  return (
    <div className="group relative rounded-lg bg-industrial-gray border border-industrial-border/60 overflow-hidden hover:border-industrial-orange/50 transition-all duration-300 flex flex-col h-full shadow-lg">
      {/* Background Image Panel (if present, overlay gradient) */}
      <div className="h-48 overflow-hidden relative">
        {service.image ? (
          <img
            src={service.image.startsWith('/uploads/') ? `http://localhost:5000${service.image}` : service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-industrial-steel/30 flex items-center justify-center">
            <IconComponent className="h-16 w-16 text-industrial-steel" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-gray via-industrial-gray/20 to-transparent"></div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col justify-between relative -mt-8 bg-industrial-gray">
        <div>
          {/* Icon Badge */}
          <div className="inline-flex p-3 rounded-lg bg-industrial-charcoal border border-industrial-border text-industrial-orange mb-4 shadow-md group-hover:bg-industrial-orange group-hover:text-industrial-charcoal transition-all duration-300">
            <IconComponent className="h-6 w-6" />
          </div>
          
          <h3 className="font-display font-extrabold text-xl text-industrial-light group-hover:text-industrial-orange transition-colors duration-200">
            {service.title}
          </h3>
          <p className="mt-3 text-sm text-industrial-muted leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

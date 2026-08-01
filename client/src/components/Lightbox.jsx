import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, User, Tag } from 'lucide-react';

const Lightbox = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!project) return null;

  const images = project.images || [];
  const hasMultiple = images.length > 1;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const activeImage = images[currentIndex];
  const imageUrl = activeImage?.startsWith('/uploads/') ? `http://localhost:5000${activeImage}` : activeImage;

  const formattedDate = new Date(project.completedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-industrial-charcoal/95 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent close on clicking modal contents
        className="relative bg-industrial-gray border border-industrial-border rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-industrial-charcoal/80 text-industrial-light hover:text-industrial-orange hover:bg-industrial-charcoal transition-all border border-industrial-border/60"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media Viewer Area */}
        <div className="relative aspect-video bg-black/40 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${project.title} - ${currentIndex + 1}`}
              className="max-h-[70vh] max-w-full object-contain"
            />
          ) : (
            <span className="text-industrial-muted">No Image</span>
          )}

          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 p-2 rounded-full bg-industrial-charcoal/80 text-industrial-light hover:text-industrial-orange hover:bg-industrial-charcoal border border-industrial-border/60 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-2 rounded-full bg-industrial-charcoal/80 text-industrial-light hover:text-industrial-orange hover:bg-industrial-charcoal border border-industrial-border/60 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-industrial-charcoal/65 px-3 py-1.5 rounded-full border border-industrial-border/40">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-industrial-orange' : 'bg-industrial-steel'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Metadata Details Area */}
        <div className="p-6 md:p-8 border-t border-industrial-border/60">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 bg-industrial-orange/10 border border-industrial-orange/30 text-industrial-orange px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5" />
              {project.category}
            </span>
            {project.client && (
              <span className="inline-flex items-center gap-1 text-sm text-industrial-muted border-r border-industrial-border/60 pr-3">
                <User className="h-4 w-4 text-industrial-orange" />
                <span>Client: <strong>{project.client}</strong></span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm text-industrial-muted">
              <Calendar className="h-4 w-4 text-industrial-orange" />
              <span>Completed: {formattedDate}</span>
            </span>
          </div>

          <h2 className="font-display font-black text-2xl md:text-3xl text-industrial-light">
            {project.title}
          </h2>
          <p className="mt-4 text-sm md:text-base text-industrial-muted leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { resolveAssetUrl } from '../utils/urls';

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
  const imageUrl = resolveAssetUrl(activeImage);

  const formattedDate = new Date(project.completedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent close on clicking modal contents
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden my-4 sm:my-8 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project preview"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-slate-950/90 text-slate-200 hover:text-sky-400 hover:bg-slate-800 transition-all border border-slate-700 shadow-lg"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media Viewer Area */}
        <div className="relative min-h-[240px] aspect-video bg-black/60 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${project.title} - ${currentIndex + 1}`}
              className="max-h-[55vh] sm:max-h-[70vh] max-w-full object-contain"
            />
          ) : (
            <span className="text-slate-500 text-sm">No Image</span>
          )}

          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-slate-950/90 text-slate-200 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 transition-all shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-slate-950/90 text-slate-200 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 transition-all shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-700 backdrop-blur-sm">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-sky-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Metadata Details Area */}
        <div className="p-6 md:p-8 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 bg-sky-500/15 border border-sky-400/30 text-sky-300 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
              <Tag className="h-3.5 w-3.5 text-sky-400" />
              {project.category}
            </span>
            {project.client && (
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-300 border-r border-slate-800 pr-3">
                <User className="h-4 w-4 text-sky-400" />
                <span>Client: <strong className="text-white">{project.client}</strong></span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-300">
              <Calendar className="h-4 w-4 text-sky-400" />
              <span>Completed: <span className="text-slate-200">{formattedDate}</span></span>
            </span>
          </div>

          <h2 className="font-display font-black text-2xl md:text-3xl text-white">
            {project.title}
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;

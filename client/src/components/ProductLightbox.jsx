import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Ruler, Tag, X } from 'lucide-react';
import { resolveAssetUrl } from '../utils/urls';

const ProductLightbox = ({ product, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    const allImages = [product?.image, ...(product?.gallery || [])].filter(Boolean);
    return [...new Set(allImages)];
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const hasMultiple = images.length > 1;
  const activeImage = images[currentIndex];
  const imageUrl = resolveAssetUrl(activeImage);
  const features = product.features || [];
  const specifications = product.specifications && typeof product.specifications === 'object'
    ? Object.entries(product.specifications).filter(([, value]) => value !== null && value !== undefined && value !== '')
    : [];

  const handleNext = (event) => {
    event.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = (event) => {
    event.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden my-4 sm:my-8 text-left"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product preview"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-slate-950/90 text-slate-200 hover:text-sky-400 hover:bg-slate-800 transition-all border border-slate-700 shadow-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="relative min-h-[240px] sm:min-h-[300px] bg-black/60 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${product.name} - ${currentIndex + 1}`}
                className="max-h-[55vh] lg:max-h-[75vh] w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <Package className="h-12 w-12" />
                <span className="text-sm font-semibold text-slate-400">No Image Available</span>
              </div>
            )}

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous product image"
                  className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-slate-950/90 text-slate-200 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 transition-all shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next product image"
                  className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-slate-950/90 text-slate-200 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 transition-all shadow-lg"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-700 backdrop-blur-sm">
                  {images.map((image, idx) => (
                    <button
                      key={`${image}-${idx}`}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      aria-label={`View product image ${idx + 1}`}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        idx === currentIndex ? 'bg-sky-400' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto lg:max-h-[75vh]">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              {product.category && (
                <span className="inline-flex items-center gap-1 bg-sky-500/15 border border-sky-400/30 text-sky-300 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                  <Tag className="h-3.5 w-3.5 text-sky-400" />
                  {product.category}
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                  Featured
                </span>
              )}
            </div>

            <h2 className="font-display font-black text-2xl md:text-3xl text-white">
              {product.name}
            </h2>

            <p className="mt-4 text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
              {product.description || 'Stainless steel fabrication for cleanroom, pharmaceutical, and laboratory applications.'}
            </p>

            {(product.material || product.dimensions) && (
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {product.material && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400 tracking-wide">
                      <Package className="h-4 w-4" />
                      Material
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-white">{product.material}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400 tracking-wide">
                      <Ruler className="h-4 w-4" />
                      Dimensions
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-white">{product.dimensions}</p>
                  </div>
                )}
              </div>
            )}

            {features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display font-bold text-xs text-sky-400 tracking-wide">
                  Key Features
                </h3>
                <ul className="mt-3 space-y-2">
                  {features.map((feature, index) => (
                    <li key={`${feature}-${index}`} className="flex gap-2.5 text-sm text-slate-200 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {specifications.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display font-bold text-xs text-sky-400 tracking-wide">
                  Technical Specifications
                </h3>
                <dl className="mt-3 divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden">
                  {specifications.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 bg-slate-950/60 px-4 py-3">
                      <dt className="text-xs font-bold text-slate-400">{label}</dt>
                      <dd className="text-sm text-white font-medium break-words">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLightbox;

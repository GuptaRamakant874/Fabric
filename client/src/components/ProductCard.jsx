import React from 'react';
import { ArrowUpRight, Package } from 'lucide-react';
import { resolveAssetUrl } from '../utils/urls';

const ProductCard = ({ product, onImageClick }) => {
  const imageUrl = resolveAssetUrl(product.image);
  const canOpenPreview = Boolean(imageUrl && onImageClick);

  return (
    <article className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-full text-left">
      <button
        type="button"
        onClick={canOpenPreview ? onImageClick : undefined}
        disabled={!canOpenPreview}
        aria-label={`View ${product.name} details`}
        className={`relative aspect-video w-full overflow-hidden bg-slate-950 text-left ${
          canOpenPreview ? 'cursor-zoom-in' : 'cursor-default'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-slate-600" />
          </div>
        )}
        <span className="absolute top-3.5 left-3.5 right-3.5 max-w-[calc(100%-1.75rem)] truncate bg-slate-950/90 backdrop-blur-md border border-slate-700 text-sky-300 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
          {product.category}
        </span>
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-sky-500 text-slate-950 p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowUpRight className="h-6 w-6 stroke-[2.5]" />
          </div>
        </div>
      </button>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="font-display font-black text-lg text-white group-hover:text-sky-400 transition-colors line-clamp-2 break-words">
            {product.name}
          </h2>
          <p className="mt-2.5 text-sm text-slate-300 line-clamp-3 leading-relaxed">
            {product.description || 'Stainless steel fabrication for cleanroom, pharmaceutical, and laboratory applications.'}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

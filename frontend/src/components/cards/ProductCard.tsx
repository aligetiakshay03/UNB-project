import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  name: string;
  category?: string;
  description: string;
  imageUrl: string;
  slug: string;
  tag?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  imageUrl,
  slug,
}) => {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow bg-white text-center sm:text-left">
        <h3 className="text-xl font-black text-unb-navy tracking-tight group-hover:text-unb-amber transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-700 mt-3 line-clamp-3 leading-relaxed flex-grow">
          {description}
        </p>

        <div className="pt-6 mt-auto">
          <Link
            to={`/brands/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-unb-navy hover:text-unb-amber tracking-wider uppercase transition-colors"
          >
            <span>DISCOVER MORE</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

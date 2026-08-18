import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

interface NewsCardProps {
  title: string;
  summary: string;
  category?: string;
  publishedAt?: string;
  imageUrl: string;
  slug: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  category = "Corporate",
  publishedAt = "August 2026",
  imageUrl,
  slug,
}) => {
  return (
    <article className="bg-white border border-gray-100 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
      <div className="relative h-52 overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/unb-reference/home-about.jpg';
          }}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-[#132B5B] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 z-10 shadow-xs">
          {category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#D99B26]" />
          <span>{publishedAt}</span>
        </div>

        <h3 className="text-base font-extrabold text-[#132B5B] leading-snug group-hover:text-[#D99B26] transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3 flex-grow">
          {summary}
        </p>

        <div className="pt-4 mt-auto border-t border-gray-100">
          <Link
            to={`/news/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#132B5B] hover:text-[#D99B26] tracking-wider uppercase transition-colors"
          >
            <span>READ MORE</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

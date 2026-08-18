import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, ArrowRight } from 'lucide-react';

interface JobCardProps {
  title: string;
  location?: string;
  employmentType?: string;
  closingDate?: string;
  slug: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  location = "Pretoria, South Africa",
  employmentType = "Full-time",
  closingDate,
  slug,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xs p-6 hover:border-[#132B5B] hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="space-y-2">
        <h3 className="text-lg font-black text-[#132B5B] group-hover:text-[#D99B26] transition-colors">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D99B26]" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#D99B26]" />
            <span>{employmentType}</span>
          </div>

          {closingDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Closing: {closingDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <Link
          to={`/careers/${slug}`}
          className="inline-flex items-center gap-2 bg-[#132B5B] hover:bg-[#1B365D] text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xs transition-colors shadow-xs"
        >
          <span>VIEW DETAILS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

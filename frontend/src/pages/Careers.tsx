import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { JobCard } from '../components/cards/JobCard';
import { Search } from 'lucide-react';

export const Careers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const jobs = [
    {
      title: 'Production Manager — Sorghum Brewing',
      location: 'Pretoria Industrial, South Africa',
      employmentType: 'Full-time',
      closingDate: '30 Sept 2026',
      slug: 'production-manager-sorghum-brewing',
    },
    {
      title: 'Quality Control Chemist & Microbiologist',
      location: 'Pretoria Industrial, South Africa',
      employmentType: 'Full-time',
      closingDate: '15 Oct 2026',
      slug: 'quality-control-chemist',
    },
    {
      title: 'Logistics & Distribution Supervisor',
      location: 'Gauteng Region, South Africa',
      employmentType: 'Full-time',
      closingDate: '28 Oct 2026',
      slug: 'logistics-distribution-supervisor',
    },
    {
      title: 'Maintenance Artisan — Brewery Mechanical',
      location: 'Pretoria Industrial, South Africa',
      employmentType: 'Full-time',
      closingDate: '10 Nov 2026',
      slug: 'maintenance-artisan-mechanical',
    },
  ];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || j.employmentType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      {/* HERO BANNER */}
      <PageHero
        categoryTag="CAREERS AT UNB"
        title="Grow With Us"
        description="From brewing and production to distribution and leadership, our people are at the heart of everything we do. Discover opportunities to grow, learn, and make an impact at United National Breweries."
        backgroundImageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-16 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            categoryTag="OPPORTUNITIES"
            title="Current Openings"
            description="Explore available positions across our breweries, distribution networks, and corporate offices."
          />

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 border border-gray-200 rounded-xs shadow-xs mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B]"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full md:w-auto px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B] bg-white font-medium"
              >
                <option value="ALL">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

          </div>

          {/* Job Cards Listing */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.slug}
                  title={job.title}
                  location={job.location}
                  employmentType={job.employmentType}
                  closingDate={job.closingDate}
                  slug={job.slug}
                />
              ))
            ) : (
              <div className="bg-white p-12 text-center border border-gray-200 rounded-xs space-y-2">
                <h3 className="text-base font-bold text-[#132B5B]">No openings found matching your criteria</h3>
                <p className="text-xs text-gray-500">Try adjusting your search terms or filter selections.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
};

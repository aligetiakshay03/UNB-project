import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { JobCard } from '../components/cards/JobCard';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import type { Job } from '../types';

export const Careers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await jobService.getJobs({ type: selectedType });
        if (isMounted) {
          setJobs(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Unable to load career opportunities from server');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [selectedType]);

  const filteredJobs = jobs.filter((j) => {
    const titleMatch = j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const locationMatch = j.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return titleMatch || locationMatch;
  });

  const formatClosingDate = (dateStr?: string) => {
    if (!dateStr) return 'Open until filled';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Layout>
      {/* HERO BANNER */}
      <PageHero
        categoryTag="CAREERS AT UNB"
        title="Grow With Us"
        description="From brewing and production to distribution and leadership, our people are at the heart of everything we do. Discover opportunities to grow, learn, and make an impact at United National Breweries."
        backgroundImageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-16 bg-unb-sand">
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
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full md:w-auto px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

          </div>

          {/* Job State Handling */}
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Loading active vacancies...
              </p>
            </div>
          ) : error ? (
            <div className="my-8 p-6 bg-red-50 border border-red-200 rounded-xs text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.slug}
                    title={job.title}
                    location={job.location || 'Pretoria Industrial, South Africa'}
                    employmentType={job.employmentType || 'Full-time'}
                    closingDate={formatClosingDate(job.closingDate)}
                    slug={job.slug}
                  />
                ))
              ) : (
                <div className="bg-white p-12 text-center border border-gray-200 rounded-xs space-y-2">
                  <h3 className="text-base font-bold text-unb-navy">No openings found matching your criteria</h3>
                  <p className="text-xs text-gray-500">Try adjusting your search terms or filter selections, or check back soon for upcoming vacancies.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

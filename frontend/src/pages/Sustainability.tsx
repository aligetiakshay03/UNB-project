import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SEOHead } from '../components/seo/SEOHead';

export const Sustainability: React.FC = () => {
  return (
    <Layout>
      <SEOHead
        title="Sustainability | United National Breweries"
        description="Discover UNB's environmental stewardship, sustainable brewing commitments, and community upliftment initiatives across South Africa."
        canonicalUrl="https://unb.co.za/sustainability"
      />
      <PageHero
        categoryTag="SUSTAINABILITY"
        title="Brewing a Better Tomorrow"
        description="We are committed to sustainable practices that protect our environment, support local communities, and build a better future for generations to come."
        backgroundImageUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop"
      />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#132B5B]">Sustainability Page Shell</h2>
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mt-2">[CLIENT TO PROVIDE SUSTAINABILITY CONTENT]</p>
      </div>
    </Layout>
  );
};

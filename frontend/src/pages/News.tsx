import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { NewsCard } from '../components/cards/NewsCard';

export const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const articles = [
    {
      title: 'Supporting Local Communities Through Sustainable Sourcing',
      summary: 'Creating opportunities and supporting local South African farmers through agricultural partnerships and community brewing programs.',
      category: 'COMMUNITY',
      publishedAt: '12 August 2026',
      imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop',
      slug: 'supporting-local-communities',
    },
    {
      title: 'Celebrating African Brewing Heritage & Innovation',
      summary: 'Honouring the traditional brewing techniques behind South Africa’s favourite sorghum beverages while upgrading quality control standards.',
      category: 'HERITAGE',
      publishedAt: '28 July 2026',
      imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=800&auto=format&fit=crop',
      slug: 'celebrating-african-brewing-heritage',
    },
    {
      title: 'UNB Announces Infrastructure Upgrades at Pretoria Facility',
      summary: 'Investing in eco-efficient packaging lines and water purification systems to support sustainable growth.',
      category: 'CORPORATE',
      publishedAt: '15 June 2026',
      imageUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=800&auto=format&fit=crop',
      slug: 'unb-infrastructure-upgrades',
    },
  ];

  const filteredArticles = selectedCategory === 'ALL'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const categories = ['ALL', 'COMMUNITY', 'HERITAGE', 'CORPORATE'];

  return (
    <Layout>
      <PageHero
        categoryTag="NEWS & MEDIA"
        title="Latest News & Press Releases"
        description="Stay updated with stories, announcements, community initiatives, and news from United National Breweries."
        backgroundImageUrl="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-16 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            categoryTag="PRESS & MEDIA"
            title="Articles & Announcements"
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-wider rounded-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#132B5B] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard
                key={article.slug}
                title={article.title}
                summary={article.summary}
                category={article.category}
                publishedAt={article.publishedAt}
                imageUrl={article.imageUrl}
                slug={article.slug}
              />
            ))}
          </div>

        </div>
      </section>
    </Layout>
  );
};

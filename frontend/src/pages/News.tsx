import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { NewsCard } from '../components/cards/NewsCard';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Loader2, AlertCircle } from 'lucide-react';
import { newsService } from '../services/newsService';
import { resolveImageUrl } from '../utils/imageUrl';
import type { News as NewsItem } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

export const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await newsService.getNews({ category: selectedCategory });
        if (isMounted) {
          const list = Array.isArray(data)
            ? data
            : ((data as unknown as { data: NewsItem[] })?.data || []);
          setArticles(list);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Unable to load news articles from server');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const categories = ['ALL', 'COMMUNITY', 'HERITAGE', 'CORPORATE'];

  const getArticleImage = (item: NewsItem) => {
    return resolveImageUrl(item.featuredImage, '/images/unb-reference/home-about.jpg');
  };

  const formatPublishDate = (dateStr?: string) => {
    if (!dateStr) return 'Latest';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Latest';
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'Latest';
    }
  };

  return (
    <ErrorBoundary>
      <Layout>
        <SEOHead
          title="News & Media | United National Breweries"
          description="Read the latest news, community initiatives, brewing achievements, and company announcements from United National Breweries."
          canonicalUrl="https://unb.co.za/news"
        />
        <PageHero
          categoryTag="NEWS & MEDIA"
          title="Latest News & Press Releases"
          description="Stay updated with stories, announcements, community initiatives, and news from United National Breweries."
          backgroundImageUrl="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop"
        />

        <section className="py-16 bg-unb-sand">
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
                  className={`px-4 py-2 text-xs font-bold tracking-wider rounded-xs transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-unb-navy text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* News State Handling */}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Loading news & announcements...
                </p>
              </div>
            ) : error ? (
              <div className="my-8 p-6 bg-red-50 border border-red-200 rounded-xs text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="my-8 p-12 bg-white border border-gray-200 rounded-xs text-center space-y-2">
                <h3 className="text-sm font-bold text-unb-navy">No articles found in this category</h3>
                <p className="text-xs text-gray-500">Check back soon for new press releases and community announcements.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <NewsCard
                    key={article.slug || article.id}
                    title={article.title || 'Untitled Article'}
                    summary={
                      article.summary ||
                      (article.content ? article.content.substring(0, 140) + '...' : 'Read full announcement for details.')
                    }
                    category={article.category || 'CORPORATE'}
                    publishedAt={formatPublishDate(article.publishedAt || article.createdAt)}
                    imageUrl={getArticleImage(article)}
                    slug={article.slug || article.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </ErrorBoundary>
  );
};

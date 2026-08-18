import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ArrowLeft, Calendar, FileText, Share2, Loader2, AlertCircle } from 'lucide-react';
import { newsService } from '../services/newsService';
import { resolveImageUrl } from '../utils/imageUrl';
import type { News } from '../types';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await newsService.getNewsBySlug(slug);
        if (isMounted) {
          setArticle(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Article not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticle();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 py-24">
          <Loader2 className="w-10 h-10 text-unb-navy animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading article...</p>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-unb-amber mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-unb-navy">Article Not Found</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            The requested article or announcement could not be located or may have been archived.
          </p>
          <div>
            <Link to="/news">
              <Button variant="navy">← BACK TO NEWS & MEDIA</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPublishDate = (dateStr?: string) => {
    if (!dateStr) return 'Latest';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const articleImage = resolveImageUrl(
    article.featuredImage,
    '/images/unb-reference/home-about.jpg'
  );

  const paragraphs = article.content ? article.content.split('\n\n').filter(Boolean) : [];

  return (
    <ErrorBoundary>
      <Layout>
        <PageHero
          categoryTag={article.category || 'NEWS & MEDIA'}
          title={article.title || 'News Article'}
          backgroundImageUrl="/images/unb-reference/home-hero.jpg"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Back Link */}
          <div className="mb-6">
            <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-bold text-unb-navy hover:text-unb-amber tracking-wider uppercase">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO NEWS & MEDIA</span>
            </Link>
          </div>

          {/* Article Container */}
          <article className="bg-white border border-gray-200 rounded-xs p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-unb-amber" />
                <span>Published: {formatPublishDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <button className="flex items-center gap-1 text-unb-navy hover:text-unb-amber font-bold cursor-pointer">
                <Share2 className="w-4 h-4" />
                <span>SHARE</span>
              </button>
            </div>

            {/* Featured Image Showcase */}
            {article.featuredImage && (
              <div className="w-full max-h-[500px] overflow-hidden rounded-xs bg-gray-50 border border-gray-100 flex items-center justify-center">
                <img
                  src={articleImage}
                  alt={article.title}
                  className="w-full max-h-[500px] object-contain rounded-xs"
                />
              </div>
            )}

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>{article.content || article.summary || 'No article content available.'}</p>
              )}
            </div>

            {/* Document Download Placeholder */}
            <div className="pt-6 border-t border-gray-100">
              <div className="bg-unb-sand p-4 rounded-xs border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-unb-navy" />
                  <div>
                    <h4 className="text-xs font-bold text-unb-navy">Official Press Release (PDF)</h4>
                    <p className="text-[10px] text-gray-500">Download the full announcement document</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400 italic">[PDF DOWNLOAD PLACEHOLDER]</span>
              </div>
            </div>

          </article>

        </div>
      </Layout>
    </ErrorBoundary>
  );
};

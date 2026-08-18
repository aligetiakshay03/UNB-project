import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { ArrowLeft, Calendar, FileText, Share2 } from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const article = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'SUPPORTING LOCAL COMMUNITIES',
    category: 'COMMUNITY',
    publishedAt: '12 August 2026',
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&auto=format&fit=crop',
    content: [
      'United National Breweries (UNB) has reaffirmed its commitment to local economic development and community empowerment across South Africa.',
      'Through strategic partnerships with local farmers and suppliers, UNB sources high-quality sorghum and agricultural ingredients directly from surrounding communities, creating sustainable livelihoods and strengthening local supply chains.',
      'In addition to agricultural support, UNB actively invests in local skills development, apprentice brewing programs, and community welfare initiatives near our Pretoria industrial brewery facilities.',
      'As we continue to grow, celebrating our rich African heritage means ensuring that our communities grow alongside us.',
    ],
  };

  return (
    <Layout>
      <PageHero
        categoryTag={article.category}
        title={article.title}
        backgroundImageUrl={article.imageUrl}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#132B5B] hover:text-[#D99B26] tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO NEWS & MEDIA</span>
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white border border-gray-200 rounded-xs p-8 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D99B26]" />
              <span>Published: {article.publishedAt}</span>
            </div>
            <button className="flex items-center gap-1 text-[#132B5B] hover:text-[#D99B26] font-bold">
              <Share2 className="w-4 h-4" />
              <span>SHARE</span>
            </button>
          </div>

          <div className="space-y-4 text-xs text-gray-700 leading-relaxed text-justify">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Document Download Placeholder */}
          <div className="pt-6 border-t border-gray-100">
            <div className="bg-[#F7F6F2] p-4 rounded-xs border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#132B5B]" />
                <div>
                  <h4 className="text-xs font-bold text-[#132B5B]">Official Press Release (PDF)</h4>
                  <p className="text-[10px] text-gray-500">Download the full announcement document</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 italic">[PDF DOWNLOAD PLACEHOLDER]</span>
            </div>
          </div>

        </article>

      </div>
    </Layout>
  );
};

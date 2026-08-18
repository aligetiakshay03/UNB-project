import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle2, Package } from 'lucide-react';

export const BrandDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Mock product detail dictionary for Phase 2 UI
  const productData: Record<string, {
    name: string;
    category: string;
    description: string;
    fullDescription: string;
    imageUrl: string;
    tag: string;
    specs: string[];
    variants?: { name: string; description: string; imageUrl: string }[];
  }> = {
    'chibuku': {
      name: 'CHIBUKU',
      category: 'Sorghum Beverages',
      tag: 'ORIGINAL SORGHUM BEER',
      description: 'The original and most loved sorghum beer, brewed for the people.',
      fullDescription: 'Chibuku is an authentic, traditional sorghum beer crafted from locally sourced grains. Known for its distinct taste, rich texture, and deep heritage, Chibuku brings communities together in celebration of authentic African brewing traditions.',
      imageUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=800&auto=format&fit=crop',
      specs: ['Brewed from quality sorghum grains', 'Traditional live culture fermentation', 'Value-driven packaging format', 'Served chilled'],
    },
    'chibuku-super': {
      name: 'PREMIUM | CHIBUKU SUPER',
      category: 'Sorghum Beverages',
      tag: 'FLAGSHIP CARBONATED',
      description: "UNB's flagship carbonated sorghum beer brand, celebrated for its rich taste, consistent quality and smooth finish.",
      fullDescription: 'Chibuku Super is a premium carbonated sorghum beer that combines traditional brewing techniques with modern carbonation innovation. It offers a smooth, refreshing finish and an extended shelf life, making it the leading choice across Southern Africa.',
      imageUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=800&auto=format&fit=crop',
      specs: ['Lightly carbonated for smooth finish', 'Extended shelf life carton packaging', 'Consistent taste and premium quality', 'Best served cold'],
    },
    'ukhozi-mageu': {
      name: 'UKHOZI MAGEU',
      category: 'Non-Alcoholic Beverages',
      tag: 'NON-ALCOHOLIC MAGEU',
      description: 'A traditional cultured maize drink, nourishing and refreshing.',
      fullDescription: 'Ukhozi Mageu is a classic, non-alcoholic cultured maize beverage providing everyday energy and traditional refreshment. Made from wholesome grains, it is available in popular flavor variants for the whole family to enjoy.',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
      specs: ['100% Non-Alcoholic beverage', 'Rich source of daily energy', 'Available in 3 popular flavor variants', 'No artificial preservatives'],
      variants: [
        { name: 'Banana', description: 'Smooth and fruity', imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=400&auto=format&fit=crop' },
        { name: 'Cream', description: 'Rich and indulgent', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop' },
        { name: 'Mabele', description: 'Traditional grain goodness', imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=400&auto=format&fit=crop' },
      ],
    },
  };

  const product = (slug && productData[slug]) || {
    name: (slug || 'PRODUCT').toUpperCase().replace(/-/g, ' '),
    category: 'Traditional Beverage',
    tag: 'UNB BRAND',
    description: 'A quality traditional African beverage crafted by United National Breweries.',
    fullDescription: 'United National Breweries produces a diverse portfolio of authentic traditional African beverages crafted with quality ingredients, celebrating heritage and bringing communities together.',
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=800&auto=format&fit=crop',
    specs: ['Authentic African recipe', 'Quality controlled brewing', 'Accessible value packaging', 'Trusted brand heritage'],
  };

  return (
    <Layout>
      <PageHero
        categoryTag={product.category}
        title={product.name}
        description={product.description}
        backgroundImageUrl={product.imageUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/brands" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#132B5B] hover:text-[#D99B26] tracking-wider uppercase transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO BRANDS PORTFOLIO</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Image */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xs p-8 shadow-xs flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-96 object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block bg-[#132B5B] text-[#D99B26] text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 mb-2">
                {product.tag}
              </span>
              <h1 className="text-3xl font-black text-[#132B5B]">{product.name}</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">{product.category}</p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Specifications Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-[#D99B26] uppercase tracking-widest flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#132B5B]" />
                <span>PRODUCT HIGHLIGHTS</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#132B5B]" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA */}
            <div className="pt-4 flex gap-4">
              <Button href="/contact" variant="primary">
                TRADE & DISTRIBUTION INQUIRY
              </Button>
            </div>
          </div>

        </div>

        {/* Variants Section (if applicable) */}
        {product.variants && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-xl font-black text-[#132B5B] uppercase tracking-tight mb-6">
              FLAVOR VARIANTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {product.variants.map((v, i) => (
                <div key={i} className="bg-[#F7F6F2] p-6 border border-gray-200 rounded-xs text-center space-y-3">
                  <div className="h-44 bg-white rounded-xs overflow-hidden flex items-center justify-center p-4 shadow-inner">
                    <img src={v.imageUrl} alt={v.name} className="max-h-full object-contain" />
                  </div>
                  <h3 className="text-sm font-black text-[#132B5B] uppercase">{v.name}</h3>
                  <p className="text-xs text-gray-600">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

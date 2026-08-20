import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle2, Package, Loader2, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService';
import { resolveImageUrl } from '../utils/imageUrl';
import type { Product } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

export const BrandDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductBySlug(slug);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Product not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Approved reference image fallback helper
  const getProductImage = (p: Product | null) => {
    const slugMap: Record<string, string> = {
      'chibuku-super': '/images/unb-reference/brand-chibuku.jpg',
      'chibuku': '/images/unb-reference/brand-chibuku.jpg',
      'lion-lager': '/images/unb-reference/brand-leopard.jpg',
      'leopard': '/images/unb-reference/brand-leopard.jpg',
      'ijuba': '/images/unb-reference/brand-ijuba.jpg',
      'ukhozi-mageu': '/images/unb-reference/brand-ukhozi-mageu.jpg',
      'sparkling-water': '/images/unb-reference/brand-ijuba.jpg',
    };
    const fallback = (p?.slug && slugMap[p.slug]) || '/images/unb-reference/brand-chibuku.jpg';
    return resolveImageUrl(p?.imageUrl, fallback);
  };

  const defaultSpecs = [
    'Brewed from quality grains',
    'Authentic African recipe',
    'Strict quality control standards',
    'Best served chilled',
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 py-24">
          <Loader2 className="w-10 h-10 text-unb-navy animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading brand details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-unb-amber mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-unb-navy">Brand or Product Not Found</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            The requested product could not be located in our active beverage portfolio.
          </p>
          <div>
            <Link to="/brands">
              <Button variant="navy">← BACK TO BRANDS PORTFOLIO</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const productImage = getProductImage(product);
  const categoryName = product.category?.name || 'Traditional African Beverages';
  const displayDescription = product.description && !product.description.includes('[CLIENT')
    ? product.description
    : (product.shortDescription && !product.shortDescription.includes('[CLIENT')
      ? product.shortDescription
      : 'United National Breweries produces a diverse portfolio of authentic traditional African beverages crafted with quality ingredients, celebrating heritage and bringing communities together.');

  return (
    <Layout>
      <SEOHead
        title={`${product.name} | United National Breweries`}
        description={displayDescription.substring(0, 160)}
        canonicalUrl={`https://unb.co.za/brands/${product.slug}`}
        ogImage={productImage}
      />
      <PageHero
        categoryTag={categoryName}
        title={product.name}
        description={product.shortDescription && !product.shortDescription.includes('[CLIENT') ? product.shortDescription : undefined}
        backgroundImageUrl={productImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/brands" className="inline-flex items-center gap-1.5 text-xs font-bold text-unb-navy hover:text-unb-amber tracking-wider uppercase transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO BRANDS PORTFOLIO</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Image */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xs p-8 shadow-xs flex items-center justify-center">
            <img
              src={productImage}
              alt={product.name}
              className="max-h-96 object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block bg-unb-navy text-unb-amber text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 mb-2">
                {product.isFeatured ? 'FLAGSHIP BRAND' : 'UNB BRAND'}
              </span>
              <h1 className="text-3xl font-black text-unb-navy">{product.name}</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">{categoryName}</p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {displayDescription}
            </p>

            {/* Specifications Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-unb-amber uppercase tracking-widest flex items-center gap-1.5">
                <Package className="w-4 h-4 text-unb-navy" />
                <span>PRODUCT HIGHLIGHTS</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                {defaultSpecs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-unb-navy" />
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

        {/* Variants Section (if applicable from API) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-xl font-black text-unb-navy uppercase tracking-tight mb-6">
              FLAVOR & PACKAGING VARIANTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {product.variants.map((v) => (
                <div key={v.id} className="bg-unb-sand p-6 border border-gray-200 rounded-xs text-center space-y-3">
                  <div className="h-44 bg-white rounded-xs overflow-hidden flex items-center justify-center p-4 shadow-inner">
                    <img src={v.imageUrl || productImage} alt={v.name} className="max-h-full object-contain" />
                  </div>
                  <h3 className="text-sm font-black text-unb-navy uppercase">{v.name}</h3>
                  {v.description && <p className="text-xs text-gray-600">{v.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

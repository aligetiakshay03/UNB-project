import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { ProductCard } from '../components/cards/ProductCard';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService';
import { resolveImageUrl } from '../utils/imageUrl';
import type { Product } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

export const Brands: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Unable to load products from server');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Approved reference image fallback helper
  const getProductImage = (p: Product) => {
    const slugMap: Record<string, string> = {
      'chibuku-super': '/images/unb-reference/brand-chibuku.jpg',
      'chibuku': '/images/unb-reference/brand-chibuku.jpg',
      'lion-lager': '/images/unb-reference/brand-leopard.jpg',
      'leopard': '/images/unb-reference/brand-leopard.jpg',
      'ijuba': '/images/unb-reference/brand-ijuba.jpg',
      'ukhozi-mageu': '/images/unb-reference/brand-ukhozi-mageu.jpg',
      'sparkling-water': '/images/unb-reference/brand-ijuba.jpg',
    };
    const fallback = slugMap[p.slug] || '/images/unb-reference/brand-chibuku.jpg';
    return resolveImageUrl(p.imageUrl, fallback);
  };

  return (
    <Layout>
      <SEOHead
        title="Our Brands | Traditional African Sorghum Beer & Beverages"
        description="Explore UNB's distinguished portfolio of traditional sorghum beers, premium maize brews, lagers, and traditional mageu beverages including Chibuku, Ijuba, and Leopard."
        canonicalUrl="https://unb.co.za/brands"
      />
      {/* HERO SECTION matching PDF Page 3 */}
      <PageHero
        categoryTag="OUR BRANDS"
        title="A Portfolio of Traditional African Beverages"
        description="From time-honoured brewing traditions to modern innovation, our brands are crafted to bring people together and celebrate African heritage. Discover a portfolio of trusted beverages enjoyed by communities across Southern Africa."
        backgroundImageUrl="/images/unb-reference/brands-hero.jpg"
      />

      {/* SORGHUM BEVERAGES SECTION matching PDF Page 3 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            categoryTag="OUR PRODUCTS"
            title="Sorghum Beverages"
            description="Our range of sorghum beverages offers something for every occasion. Authentic taste. Trusted quality. Deeply rooted in tradition."
          />

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Loading brand portfolio...
              </p>
            </div>
          ) : error ? (
            <div className="my-8 p-6 bg-red-50 border border-red-200 rounded-xs text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="my-8 p-12 bg-gray-50 border border-gray-200 rounded-xs text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                No products currently available in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {products.map((prod) => (
                <ProductCard
                  key={prod.slug}
                  name={prod.name}
                  description={
                    prod.shortDescription && !prod.shortDescription.includes('[CLIENT')
                      ? prod.shortDescription
                      : 'Authentic African beverage crafted with quality and heritage.'
                  }
                  imageUrl={getProductImage(prod)}
                  slug={prod.slug}
                  tag={prod.isFeatured ? 'FEATURED' : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NON-ALCOHOLIC BEVERAGES (UKHOZI MAGEU) SECTION matching PDF Page 3 */}
      <section className="py-16 bg-unb-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Description & Benefits */}
            <div className="lg:col-span-5 space-y-6">
              <SectionHeader
                categoryTag="OUR PRODUCTS"
                title="Non-alcoholic Beverages"
              />

              <div>
                <h3 className="text-2xl font-black text-unb-navy">UKHOZI MAGEU</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  A delicious and nutritious maize beverage, crafted to deliver great taste and everyday nourishment for the whole family. Available in Banana, Cream, and Mabele flavours.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-unb-amber uppercase tracking-widest">KEY ATTRIBUTES</h4>
                <ul className="space-y-2.5 text-xs text-gray-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-unb-navy" />
                    <span>Refreshing & Smooth Taste</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-unb-navy" />
                    <span>Everyday Nourishment & Energy Food</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-unb-navy" />
                    <span>Traditionally Loved African Heritage Drink</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button href="/contact" variant="navy">
                  EXPLORE UKHOZI MAGEU
                </Button>
              </div>
            </div>

            {/* Feature Showcase matching PDF Page 3 */}
            <div className="lg:col-span-7">
              <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 aspect-16/9 bg-white">
                <img
                  src="/images/unb-reference/brands-ukhozi-feature.jpg"
                  alt="Ukhozi Mageu 1L Flavours - Banana, Cream, Mabele"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LOOKING FOR A PRODUCT CTA BANNER matching PDF Page 3 */}
      <section className="py-16 bg-unb-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Looking for a specific brand or product?
          </h2>
          <p className="text-xs text-blue-100 leading-relaxed">
            Explore our full beverage portfolio and discover the stories behind our trusted African brands.
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="primary">
              GET IN TOUCH
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

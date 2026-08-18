import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { ProductCard } from '../components/cards/ProductCard';
import { Button } from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export const Brands: React.FC = () => {
  const sorghumProducts = [
    {
      name: '1L CARTONS',
      description: 'The authentic taste of traditional sorghum beer in a convenient, value-driven format.',
      imageUrl: '/images/unb-reference/brand-chibuku.jpg',
      slug: '1l-cartons',
      tag: '1L PACK',
    },
    {
      name: '2L SHARING PACKS',
      description: 'A smooth, rich and full-bodied sorghum beer experience, crafted for quality and value.',
      imageUrl: '/images/unb-reference/brand-ijuba.jpg',
      slug: '2l-sharing-packs',
      tag: '2L PACK',
    },
    {
      name: 'EXTRA RANGE',
      description: 'A refreshing twist on traditional sorghum beer with a smooth, lightly carbonated finish.',
      imageUrl: '/images/unb-reference/brand-leopard.jpg',
      slug: 'extra-range',
      tag: 'LIGHTLY CARBONATED',
    },
    {
      name: 'PREMIUM | CHIBUKU SUPER',
      description: "UNB's flagship carbonated sorghum beer brand, celebrated for its rich taste, consistent quality and smooth finish.",
      imageUrl: '/images/unb-reference/brand-chibuku.jpg',
      slug: 'chibuku-super',
      tag: 'FLAGSHIP',
    },
  ];

  return (
    <Layout>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {sorghumProducts.map((prod) => (
              <ProductCard
                key={prod.slug}
                name={prod.name}
                description={prod.description}
                imageUrl={prod.imageUrl}
                slug={prod.slug}
                tag={prod.tag}
              />
            ))}
          </div>
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

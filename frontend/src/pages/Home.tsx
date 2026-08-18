import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { ProductCard } from '../components/cards/ProductCard';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  // Sample data matching PDF Page 1
  const featuredBrands = [
    {
      name: 'CHIBUKU',
      description: 'The original and most loved sorghum beer, brewed for the people.',
      imageUrl: '/images/unb-reference/brand-chibuku.jpg',
      slug: 'chibuku',
    },
    {
      name: 'IJUBA',
      description: 'A premium maize beer with a rich heritage and exceptional taste.',
      imageUrl: '/images/unb-reference/brand-ijuba.jpg',
      slug: 'ijuba',
    },
    {
      name: 'LEOPARD',
      description: 'A crisp, refreshing lager that delivers bold taste and quality.',
      imageUrl: '/images/unb-reference/brand-leopard.jpg',
      slug: 'leopard',
    },
    {
      name: 'UKHOZI MAGEU',
      description: 'A traditional cultured maize drink, nourishing and refreshing.',
      imageUrl: '/images/unb-reference/brand-ukhozi-mageu.jpg',
      slug: 'ukhozi-mageu',
    },
  ];

  const latestNews = [
    {
      title: 'Supporting Local Communities',
      summary: 'Creating opportunities and supporting the communities we serve through local sourcing, skills development, and community initiatives.',
      category: 'COMMUNITY',
      publishedAt: 'August 2026',
      imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop',
      slug: 'supporting-local-communities',
    },
    {
      title: 'Celebrating African Brewing Heritage',
      summary: 'Honouring the traditions behind South Africa’s favourite sorghum beers while embracing modern brewing innovation and quality standards.',
      category: 'HERITAGE',
      publishedAt: 'July 2026',
      imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=800&auto=format&fit=crop',
      slug: 'celebrating-african-brewing-heritage',
    },
  ];

  return (
    <Layout>
      {/* 1. HERO BANNER matching PDF Page 1 */}
      <PageHero
        title="Celebrating African Brewing Heritage"
        subtitle="Connecting Communities Through Quality Traditional Beverages"
        description="Sed malesuada et eros ut vehicula. Maecenas vel interdum leo. Quisque euismod odio libero, in porttitor magna euismod vel. Praesent placerat vulputate maximus. Sed ut sapien faucibus, congue libero eu, tristique mauris. Duis eget porttitor eros."
        backgroundImageUrl="/images/unb-reference/home-hero.jpg"
        actions={[
          { label: 'MORE ABOUT US', href: '/about', variant: 'primary' },
          { label: 'EXPLORE OUR BRANDS', href: '/brands', variant: 'outline' },
        ]}
        height="full"
      />

      {/* 2. ABOUT UNB TEASER SECTION matching PDF Page 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <SectionHeader
                categoryTag="ABOUT UNB"
                title="Rooted in Tradition"
              />
              <p className="text-base text-gray-700 leading-relaxed">
                For generations, United National Breweries has been at the heart of African communities, preserving authentic brewing traditions while embracing innovation.
              </p>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                We are committed to producing quality beverages that celebrate our heritage, create opportunities, and bring people together.
              </p>
              <div className="pt-6">
                <Button href="/about" variant="navy">
                  MORE ABOUT US
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-md overflow-hidden">
                <img
                  src="/images/unb-reference/home-about.jpg"
                  alt="African community sharing traditional beverages"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR BRANDS GRID SECTION matching PDF Page 1 */}
      <section className="py-20 bg-unb-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            categoryTag="OUR BRANDS"
            title="Some of Our Iconic African Beers"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {featuredBrands.map((brand) => (
              <ProductCard
                key={brand.slug}
                name={brand.name}
                description={brand.description}
                imageUrl={brand.imageUrl}
                slug={brand.slug}
              />
            ))}
          </div>

          <div className="mt-12">
            <Button href="/brands" variant="navy">
              EXPLORE ALL BRANDS
            </Button>
          </div>
        </div>
      </section>

      {/* 4. SUSTAINABILITY SECTION matching PDF Page 1 split layout */}
      <section className="bg-white">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 h-72 sm:h-96 lg:h-auto min-h-[420px] relative">
            <img
              src="/images/unb-reference/home-sustainability.jpg"
              alt="Sorghum fields at sunset"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Right: Content Block */}
          <div className="w-full lg:w-1/2 bg-unb-navy text-white flex flex-col justify-center px-8 py-16 sm:px-14 lg:px-20 xl:px-24">
            <span className="text-xs font-bold tracking-widest text-unb-amber uppercase mb-2">
              SUSTAINABILITY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Brewing a Better Tomorrow
            </h2>
            <div className="h-0.5 w-12 bg-white/70 mt-3 mb-6" />
            <p className="text-base text-blue-50/90 leading-relaxed mb-8 max-w-lg">
              We are committed to sustainable practices that protect our environment, support local communities, and build a better future for generations to come.
            </p>
            <div>
              <Button href="/sustainability" variant="primary">
                SEE OUR IMPACT
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CAREERS & NEWS TEASERS SECTION matching PDF Page 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-stretch">
            
            {/* Careers Teaser (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col justify-between lg:pr-8 lg:border-r lg:border-unb-navy/20">
              <SectionHeader
                categoryTag="CAREERS"
                title="Grow With Us"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start flex-grow">
                <div className="flex flex-col justify-between h-full">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    From brewing and production to distribution and leadership, our people are at the heart of everything we do. Discover opportunities to grow, learn, and make an impact.
                  </p>
                  <div className="pt-6 mt-auto">
                    <Button href="/careers" variant="navy">
                      VIEW OPPORTUNITIES
                    </Button>
                  </div>
                </div>

                <div className="w-full aspect-square rounded-xl overflow-hidden shadow-xs border border-gray-100">
                  <img
                    src="/images/unb-reference/home-careers.jpg"
                    alt="UNB Brewery Team Member"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* Latest News (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between lg:pl-4">
              <div>
                <SectionHeader
                  categoryTag="NEWS & MEDIA"
                  title="Latest News"
                />

                <div className="space-y-6">
                  {latestNews.map((news) => (
                    <div key={news.slug} className="pl-4 border-l-4 border-[#6E4720] py-1">
                      <h4 className="text-base font-black text-unb-navy">{news.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed inline">
                        {news.summary}{' '}
                        <a href={`/news/${news.slug}`} className="text-xs font-bold text-unb-navy hover:text-unb-amber uppercase tracking-wider ml-1 whitespace-nowrap">
                          READ MORE →
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-auto">
                <Button href="/news" variant="navy">
                  VIEW ALL NEWS
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

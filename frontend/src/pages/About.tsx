import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { ValueCard } from '../components/cards/ValueCard';
import { Eye, Target } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      title: 'OUR PEOPLE ARE OUR ENDURING ADVANTAGE',
      description: 'We invest in our people and believe that our success is built on the talent, passion, and dedication of our teams.',
      iconName: 'Users' as const,
    },
    {
      title: 'ACCOUNTABILITY IS CLEAR AND PERSONAL',
      description: 'We take ownership of our actions, honour our commitments, and hold ourselves to the highest standards.',
      iconName: 'Shield' as const,
    },
    {
      title: 'WE WORK AND WIN IN TEAMS',
      description: 'Collaboration drives our success. We achieve more when we work together toward a common goal.',
      iconName: 'Network' as const,
    },
    {
      title: 'WE UNDERSTAND AND RESPECT OUR CUSTOMERS AND CONSUMERS',
      description: 'We listen, learn, and continuously strive to meet the needs of the people who trust our brands.',
      iconName: 'UserCheck' as const,
    },
    {
      title: 'OUR REPUTATION IS INDIVISIBLE',
      description: 'We protect our reputation through integrity, ethical conduct, and responsible business practices.',
      iconName: 'Award' as const,
    },
    {
      title: 'WE DO OUR BEST FOR OUR LOCAL COMMUNITIES',
      description: 'We are committed to creating positive impact and supporting the communities in which we operate.',
      iconName: 'Heart' as const,
    },
  ];

  return (
    <Layout>
      {/* 1. HERO SECTION matching PDF Page 2 */}
      <PageHero
        categoryTag="ABOUT US"
        title="Rooted in Heritage. Focused on the Future."
        description="For generations, United National Breweries has brought people together through authentic African brewing traditions, quality beverages, and a commitment to the communities we serve."
        backgroundImageUrl="/images/unb-reference/about-hero.jpg"
      />

      {/* 2. COMPANY OVERVIEW - OUR STORY matching PDF Page 2 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <SectionHeader
                categoryTag="COMPANY OVERVIEW"
                title="Our Story"
              />
              <p className="text-sm text-gray-700 leading-relaxed">
                United National Breweries (UNB) is a leading producer of traditional African beverages, recognised for its rich heritage, trusted brands, and deep connection to local communities.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                For decades, we have proudly crafted quality sorghum beers and other affordable beverages that reflect authentic African brewing traditions and consumer preferences.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our business is built on a commitment to operational excellence, ethical conduct, and delivering value to our customers, partners, and communities. Through experienced leadership, skilled teams, and established distribution networks, UNB continues to serve diverse markets across South Africa.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-4/3 rounded-xs overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/images/unb-reference/about-facility.jpg"
                  alt="UNB Brewery Facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STATEMENT BANNER matching PDF Page 2 */}
      <section className="py-16 bg-unb-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-unb-amber leading-snug">
            "Celebrating African heritage. Connecting communities through quality traditional beverages."
          </p>
        </div>
      </section>

      {/* 4. VISION & MISSION SECTION matching PDF Page 2 */}
      <section className="py-16 bg-unb-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            categoryTag="VISION & MISSION"
            title="The principles that guide our business, our brands, and our commitment to the communities we serve."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* OUR VISION CARD */}
            <div className="bg-white p-8 border border-gray-100 rounded-xs shadow-xs flex items-start gap-5 border-t-4 border-t-unb-navy">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-unb-navy flex items-center justify-center shrink-0">
                <Eye className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black tracking-widest text-unb-navy uppercase">OUR VISION</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  To be the market leader in traditional African beverages, recognised for innovation, quality, and operational excellence while celebrating our rich African heritage.
                </p>
              </div>
            </div>

            {/* OUR MISSION CARD */}
            <div className="bg-white p-8 border border-gray-100 rounded-xs shadow-xs flex items-start gap-5 border-t-4 border-t-unb-amber">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-unb-amber flex items-center justify-center shrink-0">
                <Target className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black tracking-widest text-unb-navy uppercase">OUR MISSION</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  To craft affordable, high-quality beverages that bring people together while preserving heritage, supporting communities, and creating sustainable growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR VALUES 6-CARD GRID matching PDF Page 2 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            categoryTag="OUR VALUES"
            title="The values that shape our culture, guide our decisions, and define how we work together."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {values.map((val, idx) => (
              <ValueCard
                key={idx}
                title={val.title}
                description={val.description}
                iconName={val.iconName}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. THREE-COLUMN DEEP DIVE SECTION matching PDF Page 2 / User Picture 2 */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
            
            {/* 1. OUR HERITAGE */}
            <div className="flex flex-col">
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-xs border border-gray-100 mb-6 bg-gray-50">
                <img
                  src="/images/unb-reference/about-heritage.jpg"
                  alt="Our Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-unb-amber uppercase tracking-widest mb-1.5">
                OUR HERITAGE
              </span>
              <h3 className="text-xl font-black text-unb-navy leading-tight mb-2">
                Celebrating Generations of African Brewing Tradition
              </h3>
              <div className="h-0.5 w-12 bg-unb-amber mb-4" />
              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  For decades, United National Breweries has been a trusted name in traditional African beverages. Our brands have become part of everyday life, bringing people together through authentic brewing traditions, shared experiences, and a deep connection to community.
                </p>
                <p>
                  While our business has evolved over time, our commitment to quality, heritage, and affordability remains unchanged. We continue to honour the traditions that shaped our brands while embracing opportunities for growth and innovation.
                </p>
              </div>
            </div>

            {/* 2. PARTNERSHIPS */}
            <div className="flex flex-col">
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-xs border border-gray-100 mb-6 bg-gray-50">
                <img
                  src="/images/unb-reference/about-partnerships.jpg"
                  alt="Partnerships"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-unb-amber uppercase tracking-widest mb-1.5">
                PARTNERSHIPS
              </span>
              <h3 className="text-xl font-black text-unb-navy leading-tight mb-2">
                Stronger Together
              </h3>
              <div className="h-0.5 w-12 bg-unb-amber mb-4" />
              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  Our success is built on meaningful partnerships with suppliers, distributors, retailers, farmers, and communities across South Africa.
                </p>
                <p>
                  By working collaboratively with our partners, we strengthen local value chains, support economic development, and ensure our products remain accessible to the consumers who enjoy them every day.
                </p>
                <p>
                  Together, we create opportunities, build sustainable relationships, and contribute to long-term growth.
                </p>
              </div>
            </div>

            {/* 3. POLICIES & PRINCIPLES */}
            <div className="flex flex-col">
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-xs border border-gray-100 mb-6 bg-gray-50">
                <img
                  src="/images/unb-reference/about-governance.jpg"
                  alt="Policies and Principles"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-unb-amber uppercase tracking-widest mb-1.5">
                POLICIES & PRINCIPLES
              </span>
              <h3 className="text-xl font-black text-unb-navy leading-tight mb-2">
                Guided by Responsibility
              </h3>
              <div className="h-0.5 w-12 bg-unb-amber mb-4" />
              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  United National Breweries is committed to conducting business with integrity, transparency, and accountability.
                </p>
                <p>
                  Our policies and principles provide the framework for responsible decision-making, ethical conduct, employee wellbeing, product quality, environmental stewardship, and regulatory compliance.
                </p>
                <p>
                  These standards guide how we operate, helping us build trust with our employees, customers, partners, and communities.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

import React from 'react';
import { UtilityBar } from './UtilityBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CTABanner } from '../sections/CTABanner';

interface LayoutProps {
  children: React.ReactNode;
  showCTABanner?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showCTABanner = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UtilityBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {showCTABanner && <CTABanner />}
      <Footer />
    </div>
  );
};

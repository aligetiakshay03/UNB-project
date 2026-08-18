import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export const NotFound: React.FC = () => {
  return (
    <Layout showCTABanner={false}>
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <span className="text-6xl font-black text-[#D99B26]">404</span>
        <h1 className="text-3xl font-black text-[#132B5B]">Page Not Found</h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-block bg-[#132B5B] hover:bg-[#1B365D] text-white px-6 py-3 rounded-xs text-xs font-bold tracking-wider"
          >
            RETURN TO HOMEPAGE →
          </Link>
        </div>
      </div>
    </Layout>
  );
};

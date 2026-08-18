import React from 'react';
import { Link } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#132B5B] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xs shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#D99B26] mx-auto flex items-center justify-center font-bold text-white text-xl shadow-sm" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
            <span className="mt-2 text-xs text-[#132B5B]">UNB</span>
          </div>
          <h1 className="text-2xl font-black text-[#132B5B] tracking-tight">UNB ADMIN PORTAL</h1>
          <p className="text-xs text-gray-500 font-medium">Sign in to manage products, news & careers</p>
        </div>
        
        <div className="text-center py-4 border-t border-b border-gray-100">
          <p className="text-xs text-gray-500">Admin Portal Shell (Phase 5 CMS Implementation)</p>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs font-bold text-[#132B5B] hover:text-[#D99B26]">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

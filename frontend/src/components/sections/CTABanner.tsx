import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

interface CTABannerProps {
  title?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  title = "Get In Touch",
  text = "Questions, enquiries or trade opportunities? We'd love to hear from you.",
  buttonText = "CONTACT US →",
  buttonLink = "/contact"
}) => {
  return (
    <div className="bg-unb-amber text-unb-navy py-4 px-4 border-t border-b border-unb-amber/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 bg-unb-navy/10 flex items-center justify-center shrink-0 hidden sm:flex">
            <Mail className="w-4 h-4 text-unb-navy" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide mr-2 uppercase">{title} |</span>
            <span className="text-xs font-semibold">{text}</span>
          </div>
        </div>
        <Link
          to={buttonLink}
          className="bg-unb-navy hover:bg-unb-navy-dark text-white px-6 py-3 text-xs font-bold tracking-wider transition-colors shrink-0"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

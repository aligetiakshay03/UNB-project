import React from 'react';
import { Button } from '../ui/Button';

interface HeroAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'navy';
}

interface PageHeroProps {
  categoryTag?: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImageUrl: string;
  actions?: HeroAction[];
  height?: 'compact' | 'full';
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImageUrl,
  actions = [],
  height = 'compact',
}) => {
  const minHeightClass = height === 'full' ? 'min-h-[500px] lg:min-h-[560px]' : 'min-h-[280px] sm:min-h-[340px]';

  return (
    <div className={`relative w-full ${minHeightClass} flex items-center overflow-hidden`}>
      {/* HD Background Image — using <img> for crisp native-resolution rendering */}
      <img
        src={backgroundImageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />
      {/* Lighter gradient for text contrast while keeping the image clear and vivid */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-white z-10">
        <div className="max-w-2xl">
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl font-bold text-white leading-snug mt-3">
              {subtitle}
            </p>
          )}

          {/* Signature amber accent line */}
          <div className="h-0.5 w-14 bg-unb-amber my-4" />

          {description && (
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
              {description}
            </p>
          )}

          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-6">
              {actions.map((action, index) => {
                if (action.variant === 'outline') {
                  return (
                    <a
                      key={index}
                      href={action.href}
                      className="inline-flex items-center justify-center font-bold tracking-wider text-xs px-5 py-2.5 border-2 border-unb-amber text-white hover:bg-unb-amber/20 transition-colors uppercase"
                    >
                      {action.label}
                    </a>
                  );
                }
                return (
                  <Button
                    key={index}
                    href={action.href}
                    variant={action.variant || 'primary'}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface SectionHeaderProps {
  categoryTag?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  darkBg?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  categoryTag,
  title,
  description,
  align = 'left',
  darkBg = false,
}) => {
  const alignmentClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col mb-8 ${alignmentClass}`}>
      {categoryTag && (
        <span className="text-xs font-bold tracking-widest text-unb-amber uppercase mb-1">
          {categoryTag}
        </span>
      )}
      <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${darkBg ? 'text-white' : 'text-unb-navy'}`}>
        {title}
      </h2>
      <div className={`h-0.5 w-12 mt-2 mb-3 ${darkBg ? 'bg-white/70' : 'bg-unb-amber'}`} />
      {description && (
        <p className={`mt-2 text-xs sm:text-sm max-w-3xl leading-relaxed ${darkBg ? 'text-blue-100' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
};

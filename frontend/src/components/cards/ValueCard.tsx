import React from 'react';
import * as Icons from 'lucide-react';

interface ValueCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Icons;
}

export const ValueCard: React.FC<ValueCardProps> = ({
  title,
  description,
  iconName,
}) => {
  // Dynamically resolve icon from lucide-react with fallback
  const IconComponent = (Icons[iconName] as React.FC<{ className?: string }>) || Icons.Shield;

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xs shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group border-t-2 hover:border-t-[#D99B26]">
      <div className="w-14 h-14 rounded-full bg-blue-50 text-[#132B5B] flex items-center justify-center mb-4 group-hover:bg-[#132B5B] group-hover:text-[#D99B26] transition-colors duration-300 shadow-inner">
        <IconComponent className="w-7 h-7" />
      </div>

      <h3 className="text-xs font-black tracking-widest text-[#132B5B] uppercase mb-2 leading-tight min-h-[32px] flex items-center">
        {title}
      </h3>

      <p className="text-xs text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

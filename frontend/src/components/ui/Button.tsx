import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wider transition-colors duration-200 focus:outline-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';
  
  const variants = {
    primary: 'bg-unb-amber hover:bg-amber-600 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-unb-navy border border-gray-200',
    outline: 'border-2 border-white hover:bg-white hover:text-unb-navy text-white',
    navy: 'bg-unb-navy hover:bg-unb-navy-dark text-white',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2',
    md: 'text-xs px-5 py-2.5',
    lg: 'text-sm px-6 py-3',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

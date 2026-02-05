import React from 'react';
import { cn } from '../../lib/utils';

interface EnergyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'brand' | 'rainbow' | 'eco'; 
  glowIntensity?: 'normal' | 'high';
  className?: string;
}

export const EnergyButton: React.FC<EnergyButtonProps> = ({ 
  children, 
  variant = 'brand', 
  glowIntensity = 'normal',
  className,
  ...props 
}) => {
  
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3 font-heading font-bold transition-all duration-200 hover:scale-105 active:scale-95 rounded-xl disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    brand: "bg-brand-orange text-white hover:bg-brand-rust shadow-md shadow-brand-orange/20",
    eco: "bg-brand-green text-white hover:bg-brand-darkGreen shadow-md shadow-brand-green/20",
    rainbow: "btn-rainbow text-black shadow-lg" // Uses the global CSS class for animation
  };

  return (
    <button 
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="z-10 relative flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};
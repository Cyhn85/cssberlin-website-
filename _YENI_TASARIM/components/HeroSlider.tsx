import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../constants';

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  }, [isAnimating]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    // UPDATED HEIGHT: h-full to fill the grid cell
    <div className="relative w-full h-full overflow-hidden rounded-[24px] shadow-inner group bg-gray-200 dark:bg-zinc-800 transition-all duration-300">
      {/* Slides */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
          
          {/* Caption */}
          <div className="absolute bottom-8 left-8 z-10 max-w-lg">
             <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white mb-3 uppercase tracking-wider">
               Featured Collection
             </span>
             <h3 className="text-white font-heading font-bold text-2xl md:text-3xl drop-shadow-lg leading-tight mb-2">
               {slide.title}
             </h3>
             <p className="text-white/90 text-sm md:text-base line-clamp-2">
                {slide.subtitle}
             </p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-brand-orange hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-brand-orange hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => !isAnimating && setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
              index === currentSlide 
                ? 'w-8 bg-brand-orange' 
                : 'w-2 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
import React from 'react';
import { Truck, TreePine, Recycle, Star, Zap } from 'lucide-react';

const TopTicker: React.FC = () => {
  const messages = [
    { text: "Kostenloser Versand ab 50€", icon: <Truck className="w-3 h-3 md:w-4 md:h-4" />, link: "#shipping" },
    { text: "100% Klimaneutraler Versand", icon: <TreePine className="w-3 h-3 md:w-4 md:h-4" />, link: "#eco" },
    { text: "Geprüfte Qualität aus zweiter Hand", icon: <Star className="w-3 h-3 md:w-4 md:h-4" />, link: "#quality" },
    { text: "Verkaufe deine alten Schätze gebührenfrei", icon: <Recycle className="w-3 h-3 md:w-4 md:h-4" />, link: "#sell" },
    { text: "Neu: Express-Lieferung in Berlin verfügbar", icon: <Zap className="w-3 h-3 md:w-4 md:h-4" />, link: "#express" },
  ];

  // We duplicate the array to ensure seamless scrolling without gaps
  const displayMessages = [...messages, ...messages, ...messages];

  return (
    // UPDATED: Background gradient Orange -> Green
    <div className="relative w-full bg-gradient-to-r from-brand-orange to-brand-green text-white overflow-hidden h-10 flex items-center z-50 border-b border-brand-green/30">
      
      {/* Overlay Gradients for fade effect on edges (Adjusted colors) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-brand-orange to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-brand-green to-transparent z-10 pointer-events-none"></div>

      {/* The Moving Track - Slower Animation (120s) */}
      <div 
        className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap items-center"
        style={{ animationDuration: '120s' }}
      >
        {displayMessages.map((msg, index) => (
          <a 
            key={index} 
            href={msg.link}
            className="flex items-center gap-2 mx-6 md:mx-10 opacity-90 hover:opacity-100 transition-all cursor-pointer group"
          >
            <span className="text-white group-hover:scale-110 transition-transform duration-300">{msg.icon}</span>
            <span className="text-[10px] md:text-xs font-heading font-bold tracking-wider uppercase group-hover:text-white transition-colors">
              {msg.text}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/20 ml-6 md:ml-10 group-hover:bg-white"></div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopTicker;
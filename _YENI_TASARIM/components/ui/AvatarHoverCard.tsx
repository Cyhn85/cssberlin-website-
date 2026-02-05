import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react'; // Using the existing motion import
import { CalendarDays, Star, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EnergyButton } from './EnergyButton';

interface SellerProps {
  name: string;
  avatar: string;
  rating: number;
  joinedDate?: string;
  bio?: string;
  location?: string;
}

interface AvatarHoverCardProps {
  seller: SellerProps;
}

export const AvatarHoverCard: React.FC<AvatarHoverCardProps> = ({ seller }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate a handle from the name if not provided
  const handle = `@${seller.name.replace(/\s+/g, '').toLowerCase()}`;
  const displayBio = seller.bio || "Passionate about sustainable fashion and vintage electronics. Collecting memories, one item at a time.";
  const displayDate = seller.joinedDate || "December 2021";
  const displayLocation = seller.location || "Berlin, DE";

  return (
    <div 
      className="relative z-30 inline-block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* TRIGGER COMPONENT ( The Compact Row visible by default) */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-100 dark:bg-zinc-800/50 mb-8 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-brand-orange/30">
        <div className="flex items-center gap-3">
            <div className="relative">
                <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-700 object-cover" />
                <div className="absolute -bottom-1 -right-1 bg-brand-orange text-white text-[9px] font-bold p-1 rounded-full border border-white dark:border-zinc-900">PRO</div>
            </div>
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm hover:underline decoration-brand-orange underline-offset-2">{seller.name}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-brand-green dark:text-brand-orange">{handle}</span>
                </div>
            </div>
        </div>
        
        {/* Rating Badge */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg border border-gray-100 dark:border-zinc-700">
             <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
             <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{seller.rating}</span>
        </div>
      </div>

      {/* HOVER CARD CONTENT (The Popup) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 bottom-full mb-2 w-full md:w-[340px] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-5 overflow-hidden"
            style={{ zIndex: 100 }}
          >
            {/* Header: Large Avatar & Follow Button */}
            <div className="flex justify-between items-start mb-3">
              <div className="relative group">
                 <img 
                   src={seller.avatar} 
                   alt={seller.name} 
                   className="w-16 h-16 rounded-full border-4 border-gray-50 dark:border-zinc-900 object-cover shadow-sm group-hover:scale-105 transition-transform" 
                 />
                 <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" title="Online"></span>
              </div>
              
              {/* Using EnergyButton (Eco Variant) for Follow */}
              <EnergyButton 
                 variant="eco" 
                 className="!px-4 !py-2 !h-8 !text-xs !rounded-lg"
                 onClick={(e) => { e.stopPropagation(); alert(`Following ${handle}`); }}
              >
                 Follow
              </EnergyButton>
            </div>

            {/* Content */}
            <div className="space-y-3">
              {/* Identity */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{seller.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{handle}</p>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {displayBio}
              </p>

              {/* Stats / Meta */}
              <div className="flex items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 mt-3">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                  <span>Joined {displayDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                  <span>{displayLocation}</span>
                </div>
              </div>
              
              {/* Followers Count Mockup */}
              <div className="flex gap-4 text-sm mt-1">
                 <div className="flex gap-1 hover:text-brand-orange cursor-pointer transition-colors">
                    <span className="font-bold text-gray-900 dark:text-white">1,240</span> 
                    <span className="text-gray-500">Following</span>
                 </div>
                 <div className="flex gap-1 hover:text-brand-orange cursor-pointer transition-colors">
                    <span className="font-bold text-gray-900 dark:text-white">856</span> 
                    <span className="text-gray-500">Followers</span>
                 </div>
              </div>
            </div>
            
            {/* Decoration Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-white to-brand-green opacity-80"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

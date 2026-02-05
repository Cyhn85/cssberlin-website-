import React from 'react';
import { Heart, ShoppingCart, MessageCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { EnergyButton } from './ui/EnergyButton';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Dispatch event for Header to pick up
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <div className="relative group rounded-3xl p-[2px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      
      {/* 
         ANIMATED BORDER LAYER 
         This div sits behind the content and spins its gradient on hover.
         Gradient: Orange -> White -> Green (defined in index.html as .eco-gradient-border)
      */}
      <div className="absolute inset-0 bg-transparent group-hover:eco-gradient-border group-hover:animate-eco-flow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* CARD CONTENT CONTAINER (White/Dark Background) */}
      <div 
          className="relative h-full w-full bg-white dark:bg-zinc-900 rounded-[22px] p-3 flex flex-col gap-3 cursor-pointer overflow-hidden"
          onClick={() => onClick && onClick(product)}
      >
        
        {/* 1. IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-800 shadow-inner group-image">
          
          {/* Main Image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Overlay: Condition (Top Left) */}
          <div className="absolute top-3 left-3 z-10">
             {product.isNew ? (
               <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                 Neu
               </span>
             ) : (
               <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded border border-white/10">
                 {product.condition}
               </span>
             )}
          </div>

          {/* Overlay: Shopping Cart (Bottom Left - Replaces Carbon) */}
          <button 
             onClick={handleAddToCart}
             className="absolute bottom-3 left-3 z-20 p-2.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl text-gray-700 dark:text-gray-200 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:hover:text-white transition-all shadow-sm hover:scale-110 active:scale-95"
             title="In den Warenkorb"
          >
             <ShoppingCart className="w-4 h-4" />
          </button>

          {/* Overlay: Wishlist Heart (Bottom Right - Moved from Info Area) */}
          <button 
             onClick={(e) => { e.stopPropagation(); }}
             className="absolute bottom-3 right-3 z-20 p-2.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl text-gray-700 dark:text-gray-200 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm hover:scale-110 active:scale-95 group/heart"
             title="Merken"
          >
             <Heart className="w-4 h-4 group-hover/heart:fill-red-500 transition-colors" />
          </button>

        </div>

        {/* 2. INFO AREA */}
        <div className="px-1 flex flex-col gap-2 flex-grow">
          
          {/* Row A: Price & Brand */}
          <div className="flex justify-between items-start">
             <div className="flex flex-col">
               <span className="text-xl font-heading font-black text-brand-green dark:text-brand-orange leading-none group-hover:scale-105 transition-transform origin-left">
                  {product.price.toFixed(0)}€
               </span>
               {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through mt-0.5">
                    {product.originalPrice}€
                  </span>
               )}
             </div>
             
             {/* Brand Tag */}
             <span className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                {product.brand}
             </span>
          </div>

          {/* Row B: Name */}
          <div className="flex-grow">
             <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-snug group-hover:text-brand-green dark:group-hover:text-brand-orange transition-colors line-clamp-2">
               {product.name}
             </p>
          </div>

          {/* Row C: Seller */}
          <div className="flex items-center gap-2 mb-1">
             <div className="relative">
               <img 
                 src={product.seller.avatar} 
                 alt={product.seller.name} 
                 className="w-5 h-5 rounded-full border border-white dark:border-zinc-900"
               />
             </div>
             <span className="text-[10px] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
               {product.seller.name}
             </span>
          </div>
          
          {/* ENERGY BUTTONS (Symmetrical & Animated) */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
               
               {/* LEFT: Verhandeln (Secondary - Outline Style with Hover Fill) */}
               <EnergyButton 
                  variant="brand" 
                  className="w-full !p-0 !h-10 bg-transparent border-2 border-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white hover:border-brand-orange !shadow-none transition-all duration-300"
                  onClick={(e) => { e.stopPropagation(); alert('Verhandeln clicked'); }}
               >
                   <span className="text-[10px] font-bold uppercase flex items-center justify-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> <span className="truncate">Chat</span>
                   </span>
               </EnergyButton>

               {/* RIGHT: Kaufen (Primary - Rainbow Animation) */}
               <EnergyButton 
                 variant="rainbow" 
                 className="w-full !p-0 !h-10 !rounded-xl"
                 onClick={handleAddToCart}
               >
                   <span className="text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 text-black">
                      <ShoppingBag className="w-3.5 h-3.5" /> Kaufen
                   </span>
               </EnergyButton>
               
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;
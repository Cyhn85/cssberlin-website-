import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, Info, Leaf, MapPin, MessageCircle, ShieldCheck, Share2, Star, Truck, Clock, Hash, Ruler, Tag, Check } from 'lucide-react';
import { Product } from '../types';
import { FEATURED_PRODUCTS } from '../constants';
import { EnergyButton } from './ui/EnergyButton';
import { AvatarHoverCard } from './ui/AvatarHoverCard';
import ProductCard from './ProductCard'; 
import { cn } from '../lib/utils';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const [activeImage, setActiveImage] = useState(0);
  
  // Create a larger image set for the gallery demo (up to 10 images)
  const images = useMemo(() => {
    const baseImages = [
      product.imageUrl,
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
    ];
    // Duplicate to reach ~10 for grid demonstration
    return [...baseImages, ...baseImages].slice(0, 10);
  }, [product.imageUrl]);

  const relatedProducts = useMemo(() => {
    return [...FEATURED_PRODUCTS]
      .filter(p => p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }, [product.id]);

  // Helper for Compact Künye Rows
  const CompactRow = ({ label, value, icon: Icon, isPrice = false }: { label: string, value: React.ReactNode, icon?: any, isPrice?: boolean }) => (
    <div className={cn(
        "flex justify-between items-center py-2.5 px-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors",
        isPrice ? "bg-brand-orange/5 dark:bg-brand-orange/10 py-3" : ""
    )}>
        <span className="text-gray-500 dark:text-gray-400 text-xs font-medium flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
            {label}
        </span>
        <span className={cn(
            "font-bold text-sm text-right text-gray-900 dark:text-white",
            isPrice ? "text-xl text-brand-orange" : ""
        )}>
            {value}
        </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Zurück
            </button>
            <div className="flex gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* MAIN GRID: Left (Images+Desc) & Right (Info+Künye) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            
            {/* --- LEFT COLUMN: Images & Description --- */}
            <div className="flex flex-col gap-8">
                
                {/* 1. Main Image */}
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm group">
                    <img 
                        src={images[activeImage]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-brand-green/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                            <Leaf className="w-3.5 h-3.5" /> -{product.co2Savings}kg CO₂
                        </span>
                    </div>
                </div>

                {/* 2. Thumbnails (Grid of up to 10) */}
                <div className="grid grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={cn(
                                "aspect-square rounded-xl overflow-hidden border-2 transition-all relative",
                                activeImage === idx ? "border-brand-orange ring-2 ring-brand-orange/20" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* 3. Description (Moved to Left Column) */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm mt-4">
                    <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-brand-orange" /> Beschreibung
                    </h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        <p>
                            Hallo! Ich verkaufe hier mein {product.name} von {product.brand}.
                            {'\n\n'}
                            Der Artikel befindet sich in einem <strong>{product.condition}en Zustand</strong> und wurde stets pfleglich behandelt. 
                            Es handelt sich um ein Originalprodukt. Perfekt für den Alltag oder die Sammlung.
                            {'\n\n'}
                            Die Details im Überblick:
                            - Originalverpackung vorhanden: Ja
                            - Kaufdatum: 2022
                            - Rauchfreier Haushalt
                            {'\n\n'}
                            ✅ Tierfreier Nichtraucherhaushalt.<br/>
                            ✅ Schneller Versand aus Berlin.<br/>
                            ✅ Bei Fragen einfach melden!
                        </p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: Info, Seller, Compact Künye (Buttons Inside) --- */}
            <div className="flex flex-col h-full gap-6">
                
                {/* 1. Header Info */}
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-brand-orange font-bold uppercase tracking-widest text-xs border border-brand-orange/20 px-2 py-0.5 rounded">{product.brand}</span>
                        <span className="text-gray-400 text-[10px] flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded-full"><Clock className="w-3 h-3"/> Vor 2 Std.</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white leading-tight">
                        {product.name}
                    </h1>
                </div>

                {/* 2. Seller Card */}
                <AvatarHoverCard seller={product.seller} />

                {/* 3. CONSOLIDATED KÜNYE (Spec Card) with Price & Buttons */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                    
                    {/* Header: Title */}
                    <div className="bg-gray-50 dark:bg-zinc-950/50 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                            <Tag className="w-4 h-4 text-brand-orange" /> Produktdetails
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">#CSS-{product.id*84}</span>
                    </div>

                    {/* The Rows */}
                    <div className="flex flex-col">
                        {/* PRICE ROW (Highlighted) */}
                        <CompactRow 
                            label="Preis" 
                            value={
                                <div className="flex items-end justify-end gap-2">
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through font-normal">{product.originalPrice}€</span>
                                    )}
                                    <span>{product.price.toFixed(2)} €</span>
                                </div>
                            } 
                            isPrice={true} 
                        />
                        
                        {/* Attribute Rows */}
                        <CompactRow label="Marke" value={product.brand} icon={Star} />
                        <CompactRow label="Größe" value={product.size} icon={Ruler} />
                        <CompactRow 
                            label="Zustand" 
                            value={<span className="text-green-600 dark:text-green-400">{product.condition}</span>} 
                            icon={Check} 
                        />
                        <CompactRow label="Farbe" value="Original" icon={Hash} />
                        <CompactRow label="Standort" value="Berlin, DE" icon={MapPin} />
                        <CompactRow label="Versand" value="ab 4,99 €" icon={Truck} />
                        <CompactRow 
                            label="Käuferschutz" 
                            value={<span className="flex items-center gap-1 text-brand-green"><ShieldCheck className="w-3 h-3" /> Aktiv</span>} 
                            icon={ShieldCheck} 
                        />
                    </div>

                    {/* Footer: BUTTONS */}
                    <div className="p-4 bg-gray-50 dark:bg-zinc-950/30 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-3">
                        
                        {/* PRIMARY: Rainbow Animation (Only this one has animation as requested) */}
                        <EnergyButton 
                            variant="rainbow" 
                            glowIntensity="high" 
                            className="w-full text-base py-3.5 shadow-lg"
                            onClick={() => alert("Produkt wurde in den Warenkorb gelegt!")}
                        >
                            <span className="flex items-center gap-2">
                               <Truck className="w-5 h-5" /> Jetzt Kaufen
                            </span>
                        </EnergyButton>

                        {/* SECONDARY: Standard Brand (No Rainbow) */}
                        <EnergyButton 
                            variant="brand" 
                            className="w-full text-sm py-3 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-2 border-brand-orange hover:bg-brand-orange hover:text-white hover:border-brand-orange !shadow-none"
                            onClick={() => alert("Verhandlungs-Chat gestartet")}
                        >
                            <span className="flex items-center gap-2">
                               <MessageCircle className="w-4 h-4" /> Preis Verhandeln
                            </span>
                        </EnergyButton>

                        <p className="text-center text-[10px] text-gray-400 mt-1">
                            Sichere Bezahlung via CSS Pay. 14 Tage Rückgaberecht.
                        </p>
                    </div>
                </div>

            </div>
        </div>

        {/* BOTTOM SECTION: Related Products Grid */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-16 pb-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-brand-orange text-white rounded-lg shadow-lg rotate-3">
                   <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <h2 className="text-2xl font-heading font-black text-gray-900 dark:text-white">
                        Das könnte dir auch gefallen
                    </h2>
                    <p className="text-gray-500 text-sm">Basierend auf deiner Auswahl</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {relatedProducts.map((relatedProduct) => (
                    <ProductCard 
                        key={relatedProduct.id} 
                        product={relatedProduct} 
                        onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); }} 
                    />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
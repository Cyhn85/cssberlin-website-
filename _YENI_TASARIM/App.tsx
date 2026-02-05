import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import { ArgentLoopInfiniteSlider } from './components/ui/ArgentLoopInfiniteSlider';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import TopTicker from './components/TopTicker';
import AIAssistant from './components/AIAssistant';
import { FEATURED_PRODUCTS } from './constants';
import { Leaf, ShieldCheck, Recycle, X, ArrowRight, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Product } from './types';

const App: React.FC = () => {
  // CHANGED: Intro overlay default set to false (Pop up kapatildi)
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (showIntroOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showIntroOverlay]);

  // Handle Navigation
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  // --- RENDER: PRODUCT DETAIL PAGE ---
  if (selectedProduct) {
      return (
          <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-200 transition-colors duration-300 relative">
            <div className="relative z-10">
                <TopTicker />
                <ProductDetailPage product={selectedProduct} onBack={handleBackToHome} />
                <AIAssistant />
            </div>
          </div>
      );
  }

  // --- RENDER: HOME PAGE ---
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-200 transition-colors duration-300 relative">
      
      <div className="relative z-10">
        {/* 1. Top Ticker (The Flowing Strip) */}
        <TopTicker />

        {/* 2. Main Header */}
        <Header />
        
        {/* --- AI ASSISTANT (Global Floating Component) --- */}
        <AIAssistant />
        
        {/* --- INTRO / HERO OVERLAY (POP-UP) --- */}
        {showIntroOverlay && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-brand-darkGreen/80 backdrop-blur-md" onClick={() => setShowIntroOverlay(false)}></div>
            
            {/* The Modal Container */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-5xl h-auto max-h-[90vh] md:h-[65vh] rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors duration-300 ring-1 ring-white/10">
                <button 
                onClick={() => setShowIntroOverlay(false)}
                className="absolute top-4 right-4 z-[60] p-2 bg-white/90 dark:bg-zinc-800/90 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:text-gray-200 rounded-full transition-all duration-300 shadow-xl border border-gray-100 dark:border-zinc-700 group transform hover:scale-105"
                >
                <X className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-white" strokeWidth={2.5} />
                </button>
                {/* Simplified Content for Popup... */}
                <div className="p-10 flex flex-col items-center justify-center w-full text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to CSS Berlin</h2>
                    <button onClick={() => setShowIntroOverlay(false)} className="px-6 py-2 bg-brand-orange text-white rounded-full">Enter Site</button>
                </div>
            </div>
            </div>
        )}

        <main className="flex-grow pt-6">
            
            {/* --- HERO SECTION (SPLIT LAYOUT) --- */}
            <section className="px-4 max-w-[95%] mx-auto mb-10">
               {/* UPDATED HEIGHT: 320px / 380px */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[320px] md:h-[380px]">
                  
                  {/* LEFT: Argent Infinite Loop Slider (Social Hub) */}
                  <div className="h-full w-full rounded-[24px] overflow-hidden shadow-lg border border-gray-200 dark:border-zinc-800 bg-black">
                     <ArgentLoopInfiniteSlider />
                  </div>

                  {/* RIGHT: Existing Hero Slider (Campaigns) */}
                  <div className="h-full w-full">
                     <HeroSlider />
                  </div>
               </div>
            </section>

            {/* MAIN PRODUCT SHOWCASE */}
            <section className="pb-24">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-100 dark:border-white/10 pb-6">
                <div>
                    <span className="text-brand-orange font-bold text-xs tracking-widest uppercase mb-1 block">Aktuelle Kollektion</span>
                    <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                    Frisch Eingetroffen
                    </h2>
                </div>
                
                {/* Filter / Sort Mockup */}
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-brand-panelBase border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium hover:border-brand-green dark:text-gray-300 dark:hover:border-brand-orange transition-colors">Alle Filter</button>
                    <button className="px-4 py-2 bg-white dark:bg-brand-panelBase border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium hover:border-brand-green dark:text-gray-300 dark:hover:border-brand-orange transition-colors">Sortieren</button>
                </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-10">
                {FEATURED_PRODUCTS.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={handleProductClick}
                    />
                ))}
                {FEATURED_PRODUCTS.map(product => (
                    <ProductCard 
                        key={`${product.id}-dup`} 
                        product={{...product, id: product.id + 100, name: product.name + " (Refurbished)"}} 
                        onClick={handleProductClick}
                    />
                ))}
                </div>
                
                <div className="mt-16 text-center">
                <button className="px-8 py-3 bg-gradient-to-r from-brand-orange to-brand-rust hover:from-brand-green hover:to-brand-darkGreen text-white font-bold rounded-full transition-all duration-300 shadow-lg transform hover:-translate-y-0.5">
                    Mehr Produkte laden
                </button>
                </div>
            </div>
            </section>

            {/* COMPACT FOOTER */}
            <footer className="bg-gradient-to-r from-brand-orange to-brand-green text-white pt-12 pb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <span className="font-heading font-extrabold text-xl tracking-tighter text-white">
                        CSS<span className="text-white/80">Berlin</span>
                        </span>
                        <p className="mt-2 text-xs text-white/70 leading-relaxed max-w-xs">
                        Der Marktplatz für bewussten Konsum. Kaufe und verkaufe Gebrauchtes sicher.
                        </p>
                        <div className="flex gap-3 mt-4">
                        <a href="#" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-green transition-colors"><Instagram className="w-4 h-4"/></a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-green transition-colors"><Linkedin className="w-4 h-4"/></a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-green transition-colors"><Twitter className="w-4 h-4"/></a>
                        </div>
                    </div>
                    {/* Simplified Footer Columns */}
                    <div>
                        <h4 className="font-bold text-white text-sm mb-3">Stöbern</h4>
                        <ul className="space-y-2 text-xs text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">Kleidung</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Elektronik</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm mb-3">Über Uns</h4>
                        <ul className="space-y-2 text-xs text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">Mission</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Nachhaltigkeitsbericht</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm mb-3">Hilfe</h4>
                        <ul className="space-y-2 text-xs text-white/70">
                        <li><a href="#" className="hover:text-white transition-colors">Käuferschutz</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] text-white/50">
                    <p>© 2024 CSS Berlin. All rights reserved.</p>
                </div>
            </div>
            </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
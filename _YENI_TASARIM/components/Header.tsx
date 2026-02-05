import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Gavel, Heart, Globe, Mic, ChevronDown, ChevronRight, SlidersHorizontal, Check, Camera, Loader2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import AnimatedAuthForm from './AnimatedAuthForm';

// --- DATA STRUCTURES ---

// 1. Search Bar Categories
const SEARCH_CATEGORIES = [
  { name: 'Alle Kategorien', subcategories: [] },
  { name: 'Kleidung', subcategories: ['Vintage', 'Designer', 'Streetwear'] },
  { name: 'Elektronik', subcategories: ['Phones', 'Laptops', 'Kameras'] },
  { name: 'Möbel', subcategories: ['Stühle', 'Tische', 'Lampen'] },
];

// 2. Main Navigation Menu
const NAV_MENU_ITEMS = [
  { 
    title: 'Damen', 
    link: '#damen',
    subcategories: ['Kleider', 'Blusen', 'Hosen', 'Röcke', 'Schuhe', 'Taschen', 'Accessoires', 'Sport']
  },
  { 
    title: 'Herren', 
    link: '#herren',
    subcategories: ['Hemden', 'T-Shirts', 'Jeans', 'Anzüge', 'Schuhe', 'Uhren', 'Sport', 'Jacken']
  },
  { 
    title: 'Kinder', 
    link: '#kinder',
    subcategories: ['Mädchen', 'Jungen', 'Baby', 'Spielzeug', 'Schuhe', 'Schulbedarf']
  },
  { 
    title: 'Elektronik', 
    link: '#elektronik',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Kameras', 'Audio', 'Gaming', 'Haushalt']
  },
  { 
    title: 'Sale', 
    link: '#sale',
    subcategories: ['Damen Sale', 'Herren Sale', 'Tech Deals', 'Last Chance', 'Unter 20€', 'Unter 50€'],
    highlight: true 
  },
  { 
    title: 'Wie funktioniert\'s', 
    link: '#how-it-works',
    subcategories: ['Kaufen', 'Verkaufen', 'Versand', 'Echtheitsprüfung', 'Rückgabe', 'Gebühren']
  }
];

// 3. Quick Filter Data
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const languages = ['DE', 'EN', 'FR', 'ES'];

const Header: React.FC = () => {
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('DE');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Cart State
  const [cartCount, setCartCount] = useState(2);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // Search Category State
  const [selectedSearchCategory, setSelectedSearchCategory] = useState(SEARCH_CATEGORIES[0].name);
  const [isSearchCatOpen, setIsSearchCatOpen] = useState(false);
  const searchCatRef = useRef<HTMLDivElement>(null);

  // Quick Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(500);
  const filterRef = useRef<HTMLDivElement>(null);

  // Nav Menu State
  const [activeHoverNav, setActiveHoverNav] = useState<string | null>(null);

  // Visual Search State
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(prev => prev + 1);
      setIsCartAnimating(true);
      setTimeout(() => setIsCartAnimating(false), 500);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchCatRef.current && !searchCatRef.current.contains(event.target as Node)) {
        setIsSearchCatOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVisualSearchClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAnalyzingImage(true);
      setTimeout(() => {
        setIsAnalyzingImage(false);
        alert(`Görsel analiz edildi: "${file.name}". (Simülasyon)`);
      }, 2000);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-sm transition-colors duration-300">
        
        {/* =========================================================================
            ROW 1: BRANDING & USER ACTIONS
           ========================================================================= */}
        <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md relative z-20 transition-colors duration-300">
          <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6"> 
            <div className="flex justify-between items-center h-20 md:h-24">
              
              {/* LOGO - CSSberlin (Small b) */}
              <div className="flex-shrink-0 flex items-center cursor-pointer group">
                <span className="font-heading font-extrabold text-4xl md:text-5xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-green drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                  CSSberlin
                </span>
              </div>

              {/* RIGHT GROUP: User Actions (Symmetrical Buttons) */}
              <div className="flex items-center gap-8 flex-shrink-0">
                
                {/* Desktop User Icons */}
                <div className="hidden md:flex items-center gap-4">
                  
                  {/* Button 1: Wishlist */}
                  <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-all border border-transparent hover:border-brand-orange/20" title="Wunschliste">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Button 2: Offers */}
                  <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-brand-green hover:bg-brand-green/10 transition-all relative border border-transparent hover:border-brand-green/20" title="Meine Angebote">
                    <Gavel className="w-5 h-5" />
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                    </span>
                  </button>

                  {/* Button 3: Cart */}
                  <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-all relative group border border-transparent hover:border-brand-orange/20">
                    <ShoppingCart className={`w-5 h-5 ${isCartAnimating ? 'animate-bounce text-brand-orange' : ''}`} />
                    <span className={`absolute -top-1 -right-1 bg-brand-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 transition-transform ${isCartAnimating ? 'scale-125' : 'scale-100'}`}>
                      {cartCount}
                    </span>
                  </button>

                  <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700 mx-2"></div>

                  {/* Button 4: LOGIN - CHANGED TO ORANGE -> GREEN */}
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-gradient-to-r from-brand-orange to-brand-green hover:from-brand-rust hover:to-brand-darkGreen text-white h-12 px-8 rounded-full font-heading font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Anmelden
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center md:hidden gap-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-600 dark:text-gray-300 hover:text-brand-green"
                  >
                    {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ROW 2: CONTROLS & SEARCH COMPLEX
           ========================================================================= */}
        <div className="hidden md:flex items-center justify-center bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 py-6 px-4 relative z-20 transition-colors duration-300">
          
          {/* 1. LEFT: Controls */}
          <div className="absolute left-6 lg:left-12 flex items-center gap-3 z-30">
              <ThemeToggle />
              <div className="relative">
                {/* LANGUAGE BUTTON - UPDATED: Standard White + Black Text + Green Border */}
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 text-black dark:text-white bg-white dark:bg-zinc-900 border border-brand-green hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors font-bold text-xs uppercase px-4 py-3 rounded-xl shadow-sm"
                >
                  <Globe className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                  <span>{currentLang}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-24 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 overflow-hidden py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setCurrentLang(lang); setIsLangMenuOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 ${currentLang === lang ? 'text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          </div>

          {/* 2. CENTER: The Search Complex */}
          <div className="w-full max-w-5xl flex items-center gap-3 z-20 mx-auto">
            
            {/* A. MAIN SEARCH BAR */}
            <div className="flex-grow h-14 flex items-stretch shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl group/search">
                
                {/* Category Dropdown (Left) */}
                <div className="relative z-50" ref={searchCatRef}>
                    <button 
                        onClick={() => setIsSearchCatOpen(!isSearchCatOpen)}
                        className="h-full pl-6 pr-4 flex items-center gap-2 bg-white dark:bg-zinc-900 border border-brand-green rounded-l-2xl text-sm font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all min-w-[180px] justify-between"
                    >
                        <span className="truncate max-w-[140px]">{selectedSearchCategory}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSearchCatOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {isSearchCatOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                            {SEARCH_CATEGORIES.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setSelectedSearchCategory(cat.name); setIsSearchCatOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-brand-green dark:hover:text-brand-orange transition-colors ${selectedSearchCategory === cat.name ? 'text-brand-orange font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                            >
                                {cat.name}
                            </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input Field (Middle/Right) */}
                <div className="relative flex-grow z-10">
                    <input
                        type="text"
                        className="block w-full h-full pl-6 pr-24 bg-white dark:bg-zinc-900 rounded-r-2xl border-y border-r border-brand-green leading-5 placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-inset focus:ring-1 focus:ring-brand-green/20 transition-all text-base font-heading font-bold tracking-wide text-black dark:text-white"
                        placeholder="CLIMATE SMART SOLUTIONS"
                    />
                    
                    <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-brand-orange transition-colors" title="Sprachsuche">
                           <Mic className="w-5 h-5 hover:scale-110 transition-transform" />
                        </button>
                        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <button 
                            onClick={handleVisualSearchClick}
                            className="p-2 text-gray-400 hover:text-brand-green dark:hover:text-brand-orange transition-all"
                            title="Bildsuche"
                        >
                            {isAnalyzingImage ? <Loader2 className="w-5 h-5 animate-spin text-brand-orange" /> : <Camera className="w-5 h-5 hover:scale-110 transition-transform" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* B. FILTER BUTTON */}
            <div className="relative h-14" ref={filterRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="h-full flex items-center gap-2 px-6 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 bg-white dark:bg-zinc-900 text-black dark:text-white border border-brand-green"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                    {selectedSizes.length > 0 && <span className="flex h-2 w-2 rounded-full bg-brand-orange ml-1 shadow-sm"></span>}
                </button>

                {/* Quick Filter Popover */}
                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-700 p-5 z-50 animate-in zoom-in-95 origin-top-right">
                        <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm text-gray-800 dark:text-white">Schnellfilter</span>
                        <button onClick={() => { setSelectedSizes([]); setPriceRange(500); }} className="text-[10px] text-brand-orange hover:underline">Zurücksetzen</button>
                        </div>
                        <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-500 mb-2 block">Größe</label>
                        <div className="flex flex-wrap gap-2">
                            {SIZES.map(size => (
                                <button 
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${selectedSizes.includes(size) ? 'bg-brand-green text-white border-brand-green' : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-brand-orange'}`}
                                >
                                {size}
                                </button>
                            ))}
                        </div>
                        </div>
                        <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-semibold text-gray-500">Max. Preis</label>
                            <span className="text-xs font-bold text-brand-orange">{priceRange}€</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1000" 
                            value={priceRange} 
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                        />
                        </div>
                        <button onClick={() => setIsFilterOpen(false)} className="w-full py-2 bg-brand-green text-white rounded-xl text-xs font-bold hover:bg-brand-darkGreen transition-colors flex items-center justify-center gap-2">
                        <Check className="w-3.5 h-3.5" /> Filter anwenden
                        </button>
                    </div>
                )}
            </div>

            {/* C. SEARCH BUTTON */}
            <button className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-brand-green px-8 transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 active:scale-95">
               <Search className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            ROW 3: SMART NAVIGATION TABS
           ========================================================================= */}
        <div className="hidden md:block bg-gradient-to-r from-brand-orange to-brand-green shadow-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-center space-x-12 py-0">
              {NAV_MENU_ITEMS.map((item) => (
                <div 
                  key={item.title} 
                  className="relative group/nav"
                  onMouseEnter={() => setActiveHoverNav(item.title)}
                  onMouseLeave={() => setActiveHoverNav(null)}
                >
                  <a
                    href={item.link}
                    className={`block py-4 font-heading font-bold text-sm uppercase tracking-widest transition-colors duration-300 relative z-20 
                      ${activeHoverNav === item.title 
                        ? 'text-brand-green bg-white rounded-t-lg shadow-lg transform -translate-y-1' 
                        : 'text-white hover:text-white/90'
                      }`}
                  >
                    <span className={`px-4 ${item.highlight ? 'text-white bg-red-500/20 px-2 py-0.5 rounded ml-1 border border-white/20' : ''}`}>
                      {item.title}
                    </span>
                  </a>

                  {/* Dropdown */}
                  {activeHoverNav === item.title && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-64 bg-white dark:bg-zinc-900 rounded-b-xl rounded-tr-xl shadow-2xl border-t-0 border border-gray-100 dark:border-zinc-700 overflow-hidden z-10 animate-in fade-in slide-in-from-top-1 duration-200">
                       <div className="h-1 bg-brand-green w-full"></div>
                       <div className="p-4 grid gap-2">
                          {item.subcategories.map((sub, subIdx) => (
                             <a 
                               key={subIdx} 
                               href="#" 
                               className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-brand-green dark:hover:text-brand-orange rounded-lg transition-colors flex justify-between group/sub"
                             >
                               {sub}
                               <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 text-brand-orange transition-opacity" />
                             </a>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 shadow-xl z-30 h-screen overflow-y-auto">
             <div className="p-6">
               <button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold">Anmelden</button>
             </div>
          </div>
        )}
      </header>

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-brand-darkGreen/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsAuthModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl w-full max-w-md h-[600px] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20 dark:border-zinc-700/50 flex flex-col">
            
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatedAuthForm 
               initialMode="login" 
               onClose={() => setIsAuthModalOpen(false)} 
            />
            
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
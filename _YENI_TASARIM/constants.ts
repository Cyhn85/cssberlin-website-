import { SlideData, Product } from './types';

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "Willkommensgeschenk: 10% Rabatt",
    subtitle: "Melde dich jetzt an und erhalte 10% Rabatt auf deine erste Bestellung. Code: HELLO10",
    ctaText: "Rabatt sichern",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Kostenloser Versand ab 50€",
    subtitle: "Nachhaltig shoppen lohnt sich. Wir übernehmen die Versandkosten für alle Bestellungen über 50€.",
    ctaText: "Jetzt stöbern",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Technik, die weiterlebt",
    subtitle: "Geprüfte Elektronik und Kameras mit 12 Monaten Garantie. Weniger Elektroschrott.",
    ctaText: "Elektronik ansehen",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop"
  }
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "M6 Analog Kamera",
    brand: "Leica",
    price: 2499.00,
    originalPrice: 3200.00,
    category: "Fotografie",
    size: "N/A",
    condition: "Sehr gut",
    co2Savings: 14.5,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "AnalogPro_Berlin", avatar: "https://i.pravatar.cc/150?u=1", rating: 4.9 },
    isNew: false 
  },
  {
    id: 102,
    name: "Lounge Chair (Original)",
    brand: "Eames",
    price: 4500.00,
    originalPrice: 8900.00,
    category: "Möbel",
    size: "Standard",
    condition: "Gut",
    co2Savings: 128.0,
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "DesignHunter", avatar: "https://i.pravatar.cc/150?u=2", rating: 5.0 }
  },
  {
    id: 103,
    name: "iPhone 13 Pro",
    brand: "Apple",
    price: 680.00,
    category: "Elektronik",
    size: "256GB",
    condition: "Wie Neu",
    co2Savings: 56.2,
    imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "TechReborn", avatar: "https://i.pravatar.cc/150?u=3", rating: 4.7 },
    isNew: true
  },
  {
    id: 104,
    name: "Klassischer Trenchcoat",
    brand: "Burberry",
    price: 350.00,
    originalPrice: 1800.00,
    category: "Mode",
    size: "M / 38",
    condition: "Zufriedenstellend",
    co2Savings: 8.4,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "VintageVibes", avatar: "https://i.pravatar.cc/150?u=4", rating: 4.8 },
    isNew: true
  },
  {
    id: 105,
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 4200.00,
    category: "Uhren",
    size: "42mm",
    condition: "Sehr gut",
    co2Savings: 2.1,
    imageUrl: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "WatchCollector", avatar: "https://i.pravatar.cc/150?u=5", rating: 5.0 }
  },
  {
    id: 106,
    name: "Denim Jacke 90s",
    brand: "Levi's",
    price: 45.00,
    category: "Mode",
    size: "L",
    condition: "Gut",
    co2Savings: 12.0,
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "MaxMustermann", avatar: "https://i.pravatar.cc/150?u=6", rating: 4.2 }
  },
  {
    id: 107,
    name: "MacBook Air M1",
    brand: "Apple",
    price: 750.00,
    originalPrice: 1100.00,
    category: "Elektronik",
    size: "13 Zoll",
    condition: "Sehr gut",
    co2Savings: 180.5,
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "Student_Berlin", avatar: "https://i.pravatar.cc/150?u=7", rating: 4.9 },
    isNew: true
  },
  {
    id: 108,
    name: "Ledertasche Birkin Style",
    brand: "Vintage",
    price: 120.00,
    category: "Accessoires",
    size: "One Size",
    condition: "Gut",
    co2Savings: 6.8,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
    seller: { name: "Fashionista", avatar: "https://i.pravatar.cc/150?u=8", rating: 4.5 }
  }
];
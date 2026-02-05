export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string; // Added brand
  price: number;
  originalPrice?: number; // To show comparison
  category: string;
  imageUrl: string;
  size: string; // e.g. "M", "42", "One Size"
  condition: 'Neu mit Etikett' | 'Wie Neu' | 'Sehr gut' | 'Gut' | 'Zufriedenstellend';
  co2Savings: number; // in kg
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  isNew?: boolean; // Just listed
}

export enum ThemeColors {
  ORANGE = '#FF8C42',
  GREEN = '#2D5016',
  WHITE = '#FFFFFF'
}
export type ThemeColor = 'dragonball' | 'neutro' | 'rosa' | 'azul';

export type GiftCategory = 
  | 'Pañales y aseo' 
  | 'Ropa' 
  | 'Alimentación' 
  | 'Habitación' 
  | 'Paseo' 
  | 'Otros';

export interface BabyShowerEvent {
  id: string;
  babyName?: string;
  parentsNames: string;
  date: string;
  location?: string;
  locationUrl?: string;
  welcomeMessage: string;
  theme: ThemeColor;
  coverImageUrl?: string;
  ownerUid: string;
  createdAt?: any;
}

export interface Gift {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: GiftCategory;
  link?: string;
  quantityRequested: number;
  quantityRemaining: number;
  order: number;
  createdAt?: any;
}

export interface Claim {
  id: string;
  giftId: string;
  giftName: string;
  guestName: string;
  quantity: number;
  message?: string;
  createdAt: any;
}

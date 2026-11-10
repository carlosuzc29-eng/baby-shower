import React from 'react';
import { GiftCategory } from '../../types';

interface CategoryIconProps {
  category: GiftCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "w-6 h-6" }) => {
  switch (category) {
    case 'Pañales y aseo':
      // SVG tierno de pañal / baño
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 6h16a2 2 0 0 1 2 2v2c0 6-4 10-10 10S2 16 2 10V8a2 2 0 0 1 2-2Z" />
          <path d="M6 10a4 4 0 0 0 4 4" />
          <path d="M18 10a4 4 0 0 1-4 4" />
          <circle cx="8" cy="8" r="1" fill="currentColor" />
          <circle cx="16" cy="8" r="1" fill="currentColor" />
        </svg>
      );
    case 'Ropa':
      // SVG de mameluco / body de bebé
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 3a3 3 0 0 0 6 0l4 2-1.5 5-2.5-1V19a2 2 0 0 1-2 2h-2v-4h-2v4H7a2 2 0 0 1-2-2V9L2.5 10 1 5l4-2a3 3 0 0 0 4 0" />
        </svg>
      );
    case 'Alimentación':
      // SVG de biberón
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M10 2h4v2h-4z" />
          <path d="M9 4h6v2H9z" />
          <path d="M8 6h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
          <line x1="10" y1="11" x2="14" y2="11" />
          <line x1="10" y1="15" x2="14" y2="15" />
        </svg>
      );
    case 'Habitación':
      // SVG de cuna de bebé
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 8v12M21 8v12M3 13h18M3 17h18" />
          <path d="M6 8v5M10 8v5M14 8v5M18 8v5" />
          <path d="M3 10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3" />
        </svg>
      );
    case 'Paseo':
      // SVG de cochecito de bebé
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="8" cy="20" r="2" />
          <circle cx="17" cy="20" r="2" />
          <path d="M3 4h3l3 9a4 4 0 0 0 4 3h5" />
          <path d="M6 13h12a3 3 0 0 0 3-3l-1.5-6H10" />
        </svg>
      );
    case 'Otros':
    default:
      // SVG de caja de regalo
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="8" width="18" height="14" rx="2" />
          <path d="M12 8v14" />
          <path d="M3 13h18" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5c2 0 4.5 5 4.5 5s2.5-5 4.5-5a2.5 2.5 0 0 1 0 5" />
        </svg>
      );
  }
};

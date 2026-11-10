import React from 'react';
import { GiftCategory } from '../../types';
import { CategoryIcon } from '../ui/CategoryIcon';
import { clsx } from 'clsx';

const CATEGORIES: ('Todas' | GiftCategory)[] = [
  'Todas',
  'Pañales y aseo',
  'Ropa',
  'Alimentación',
  'Habitación',
  'Paseo',
  'Otros',
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  countsByCategory?: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(cat)}
              className={clsx(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap min-h-[40px] cursor-pointer border transition-[transform,background-color,border-color,color,box-shadow] duration-200 active:scale-[0.97] select-none',
                isSelected
                  ? 'bg-gradient-to-r from-[#5880A4] to-[#4A7296] text-white border-transparent shadow-[0_4px_14px_-2px_rgba(74,114,150,0.35)]'
                  : 'bg-white/95 text-[#1C2D42] border-[#D8E6F3] hover:bg-[#EBF3FA] hover:border-[#5880A4]/40 shadow-[0_1px_4px_rgba(28,45,66,0.03)]'
              )}
            >
              {cat !== 'Todas' && (
                <CategoryIcon
                  category={cat}
                  className={clsx(
                    'w-4 h-4',
                    isSelected ? 'text-white' : 'text-[#5880A4]'
                  )}
                />
              )}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Gift } from '../../types';
import { CategoryIcon } from '../ui/CategoryIcon';
import { DragonBall } from '../ui/DragonBall';
import { ExternalLink, Star } from 'lucide-react';

interface GiftCardProps {
  gift: Gift;
  onClaim: (gift: Gift) => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, onClaim }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white rounded-[22px] border border-[#D8E6F3] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(28,45,66,0.12)]"
      style={{
        boxShadow: '0 1px 2px rgba(34,53,74,0.04), 0 10px 30px -18px rgba(34,53,74,0.22)',
      }}
    >
      <div>
        {/* Imagen del regalo (aspect-[4/3] object-cover) */}
        <div className="relative w-full aspect-[4/3] bg-[#EBF3FA] flex items-center justify-center overflow-hidden border-b border-[#D8E6F3]">
          {gift.imageUrl && !imageError ? (
            <img
              src={gift.imageUrl}
              alt={gift.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-[#556E88] p-4">
              <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center text-[#F7931E] shadow-2xs border border-[#D8E6F3]">
                <CategoryIcon category={gift.category} className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold">{gift.category}</span>
            </div>
          )}

          {/* Badge arriba a la derecha: píldora con DragonBall y Disponible (sin marcador numérico) */}
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold border border-[#D8E6F3] shadow-xs flex items-center gap-1.5 select-none">
            <DragonBall stars={Math.min(gift.quantityRemaining, 7)} className="w-[18px] h-[18px]" />
            <span className="text-[#556E88] text-[11px] font-semibold">Disponible</span>
          </div>
        </div>

        {/* Información del regalo */}
        <div className="p-4 sm:p-5">
          {/* Categoría en uppercase 11px, tracking .12em, color #5880A4 */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5880A4] mb-1.5">
            <CategoryIcon category={gift.category} className="w-3.5 h-3.5 text-[#F7931E]" />
            <span>{gift.category}</span>
          </div>

          {/* Nombre en Fredoka 600 19px con capitalize */}
          <h3 className="font-heading font-semibold text-[19px] capitalize text-[#1C2D42] leading-snug mb-2">
            {gift.name.toLowerCase()}
          </h3>

          {gift.description && (
            <p className="text-xs sm:text-sm text-[#556E88] line-clamp-2 mb-3 leading-relaxed">
              {gift.description}
            </p>
          )}

          {/* Enlace de referencia / sugerencia */}
          {gift.link && (
            <a
              href={gift.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#E2650F] hover:underline mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Ver referencia de compra</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Botón "Lo regalo yo" con estrella y degradado naranja vibrante */}
      <div className="p-4 sm:p-5 pt-0">
        <button
          type="button"
          onClick={() => onClaim(gift)}
          className="w-full inline-flex items-center justify-center gap-2 text-white font-bold text-sm sm:text-base rounded-[14px] min-h-[46px] bg-gradient-to-r from-[#F9A030] via-[#F7931E] to-[#E2650F] shadow-[0_8px_20px_-6px_rgba(226,101,15,0.65)] hover:shadow-[0_10px_24px_-6px_rgba(226,101,15,0.8)] active:scale-[0.97] transition-all duration-200 cursor-pointer [@media(hover:hover)_and_(pointer:fine)]:hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#A8D1EE] focus:ring-offset-2"
        >
          <Star className="w-4 h-4 fill-white text-white" />
          <span>Lo regalo yo</span>
        </button>
      </div>
    </div>
  );
};

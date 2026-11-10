import React from 'react';
import { DragonBall } from './DragonBall';

interface ProgressBarProps {
  claimed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ claimed, total, className = '' }) => {
  // Las esferas encendidas son floor(claimed / total * 7)
  const activeSpheres = total > 0 ? Math.min(7, Math.floor((claimed / total) * 7)) : 0;
  const isComplete = activeSpheres >= 7 || (total > 0 && claimed >= total);

  return (
    <div
      className={`w-full max-w-2xl sm:max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-[28px] border border-[#D8E6F3] p-5 sm:p-7 shadow-[0_12px_36px_-10px_rgba(28,45,66,0.08)] ${className}`}
    >
      {/* Cabecera centrada y limpia sin marcadores numéricos */}
      <div className="flex items-center justify-center gap-2.5 mb-4 sm:mb-5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F7931E] shadow-[0_0_10px_rgba(247,147,30,0.9)]" />
        <h3 className="font-heading font-semibold text-lg sm:text-xl text-[#1C2D42] tracking-tight">
          Las 7 Esferas del Dragón
        </h3>
        <span className="w-2.5 h-2.5 rounded-full bg-[#F7931E] shadow-[0_0_10px_rgba(247,147,30,0.9)]" />
      </div>

      {/* Bandeja de exhibición de las 7 esferas del dragón con pedestales individuales */}
      <div className="bg-gradient-to-b from-[#F8FBFE] to-[#EFF6FC] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#D8E6F3] mb-4 shadow-inner">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3.5 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((stars) => {
            const isLit = stars <= activeSpheres;
            return (
              <div
                key={stars}
                className="flex flex-col items-center justify-center relative group"
              >
                {/* Pedestal individual circular con acabado en cristal / resina */}
                <div
                  className={`relative flex items-center justify-center p-1 sm:p-1.5 rounded-2xl sm:rounded-full transition-all duration-500 ${
                    isLit
                      ? 'bg-gradient-to-b from-[#FFF6EC] to-[#FFE7CA] border border-[#F7931E]/40 shadow-[0_4px_16px_rgba(247,147,30,0.22)]'
                      : 'bg-white/60 border border-[#D8E6F3]/60'
                  }`}
                >
                  {/* Halo luminoso cálido para esferas reunidas */}
                  {isLit && (
                    <div className="absolute inset-0 rounded-full bg-[#F7931E]/25 blur-md pointer-events-none animate-pulse duration-1000" />
                  )}

                  <div
                    className="relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      filter: isLit
                        ? 'drop-shadow(0 8px 18px rgba(247, 147, 30, 0.55))'
                        : 'grayscale(1) brightness(1.22) opacity(0.32)',
                      transform: isLit ? 'scale(1.06)' : 'scale(0.88)',
                    }}
                    title={
                      isLit
                        ? `Esfera de ${stars} estrellas (Reunida)`
                        : `Esfera de ${stars} estrellas (Pendiente)`
                    }
                  >
                    <DragonBall
                      stars={stars}
                      className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nota inferior explicativa */}
      <p className="text-xs sm:text-sm text-[#556E88] font-medium text-center leading-snug">
        {isComplete
          ? '¡Las 7 esferas reunidas! La lista está completa. Gracias de corazón.'
          : 'Reuniendo las 7 esferas del dragón para la llegada de nuestro bebé'}
      </p>
    </div>
  );
};

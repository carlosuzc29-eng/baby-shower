import React from 'react';
import { DragonBall } from './DragonBall';

// Nube vectorial estilizada con gradiente suave y sombra sutil
const StylizedCloud: React.FC<{
  className?: string;
  flip?: boolean;
}> = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 280 130"
    className={`select-none pointer-events-none ${flip ? '-scale-x-100' : ''} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cloudFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="65%" stopColor="#F5FAFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#E2EEF8" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id="cloudStrokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#C9DFF0" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Forma orgánica de nube tierna y esponjosa */}
    <path
      d="M 50 100 
         Q 30 100 20 85 
         Q 10 70 25 55 
         Q 30 35 55 35 
         Q 75 10 115 15 
         Q 145 0 180 15 
         Q 215 10 235 32 
         Q 265 35 265 65 
         Q 275 85 255 100 
         Z"
      fill="url(#cloudFillGrad)"
      stroke="url(#cloudStrokeGrad)"
      strokeWidth="1.5"
    />
  </svg>
);

// Destello mágico de 4 puntas (estrellitas doradas y celestes)
const Stardust: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 16, color = '#F7931E' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`pointer-events-none select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
      fill={color}
    />
  </svg>
);

export const DragonSky: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      style={{
        background: `
          radial-gradient(ellipse 95% 65% at 50% -8%, rgba(184, 222, 248, 0.42) 0%, transparent 68%),
          radial-gradient(ellipse 75% 45% at 50% 28%, rgba(255, 243, 228, 0.52) 0%, transparent 64%),
          radial-gradient(circle at 6% 48%, rgba(168, 209, 238, 0.3) 0%, transparent 42%),
          radial-gradient(circle at 94% 72%, rgba(254, 220, 180, 0.35) 0%, transparent 45%),
          linear-gradient(180deg, #F4F8FD 0%, #EEF5FA 50%, #E8F1F8 100%)
        `,
      }}
      aria-hidden="true"
    >
      {/* 4 Nubes ilustradas de alta definición colocadas armónicamente */}
      <div className="absolute -top-4 -left-10 w-72 sm:w-96 opacity-85 animate-float-2">
        <StylizedCloud />
      </div>

      <div className="absolute top-10 -right-12 w-80 sm:w-[420px] opacity-80 animate-float-1">
        <StylizedCloud flip />
      </div>

      <div className="hidden sm:block absolute top-[44%] -left-14 w-72 opacity-70 animate-float-3">
        <StylizedCloud />
      </div>

      <div className="absolute -bottom-6 -right-8 w-80 sm:w-[400px] opacity-85 animate-float-2">
        <StylizedCloud flip />
      </div>

      {/* Destellos mágicos / Polvo de estrellas cósmico (sutiles y tiernos) */}
      <div className="absolute top-[8%] left-[16%] opacity-60 animate-pulse duration-700">
        <Stardust size={14} color="#F7931E" />
      </div>
      <div className="absolute top-[16%] right-[14%] opacity-50 animate-pulse duration-1000">
        <Stardust size={18} color="#A8D1EE" />
      </div>
      <div className="hidden sm:block absolute top-[38%] left-[8%] opacity-40">
        <Stardust size={12} color="#F7931E" />
      </div>
      <div className="hidden sm:block absolute top-[62%] right-[10%] opacity-50 animate-pulse duration-1000">
        <Stardust size={16} color="#F7931E" />
      </div>
      <div className="absolute bottom-[18%] left-[12%] opacity-45">
        <Stardust size={14} color="#A8D1EE" />
      </div>

      {/* 7 Esferas del Dragón perfectamente distribuidas y enmarcando el contenido */}

      {/* Esfera 1 (1 Estrella): Lateral superior izquierdo */}
      <div className="absolute top-[6%] left-[2%] sm:left-[3.5%] xl:left-[max(1.5rem,calc(50vw-640px))] animate-float-1">
        <div className="relative group">
          <div className="absolute -inset-2.5 rounded-full bg-[#F7931E]/25 blur-lg pointer-events-none" />
          <DragonBall
            stars={1}
            className="w-13 h-13 sm:w-20 sm:h-20 lg:w-24 lg:h-24 drop-shadow-[0_12px_28px_rgba(247,147,30,0.4)] transition-transform duration-300"
          />
        </div>
      </div>

      {/* Esfera 2 (2 Estrellas): Lateral izquierdo medio-alto */}
      <div className="absolute top-[32%] left-[1.5%] sm:left-[2.5%] xl:left-[max(1.5rem,calc(50vw-660px))] animate-float-2">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-[#F7931E]/20 blur-md pointer-events-none" />
          <DragonBall
            stars={2}
            className="w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-90 drop-shadow-[0_10px_24px_rgba(247,147,30,0.32)]"
          />
        </div>
      </div>

      {/* Esfera 3 (3 Estrellas): Lateral izquierdo medio-bajo */}
      <div className="absolute top-[58%] left-[2%] sm:left-[3.5%] xl:left-[max(1.5rem,calc(50vw-640px))] animate-float-3">
        <div className="relative">
          <div className="absolute -inset-2.5 rounded-full bg-[#F7931E]/22 blur-lg pointer-events-none" />
          <DragonBall
            stars={3}
            className="w-12 h-12 sm:w-18 sm:h-18 lg:w-22 lg:h-22 opacity-90 drop-shadow-[0_10px_26px_rgba(247,147,30,0.35)]"
          />
        </div>
      </div>

      {/* Esfera 4 (4 Estrellas - La emblemática de Goku): Lateral superior derecho */}
      <div className="absolute top-[7%] right-[2%] sm:right-[3.5%] xl:right-[max(1.5rem,calc(50vw-640px))] animate-float-4">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[#F7931E]/30 blur-xl pointer-events-none" />
          <DragonBall
            stars={4}
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 drop-shadow-[0_16px_36px_rgba(247,147,30,0.48)]"
          />
        </div>
      </div>

      {/* Esfera 5 (5 Estrellas): Lateral derecho medio-alto */}
      <div className="absolute top-[35%] right-[1.5%] sm:right-[2.5%] xl:right-[max(1.5rem,calc(50vw-660px))] animate-float-5">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-[#F7931E]/20 blur-md pointer-events-none" />
          <DragonBall
            stars={5}
            className="w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-90 drop-shadow-[0_10px_24px_rgba(247,147,30,0.32)]"
          />
        </div>
      </div>

      {/* Esfera 6 (6 Estrellas): Lateral derecho medio-bajo */}
      <div className="absolute top-[62%] right-[2%] sm:right-[3.5%] xl:right-[max(1.5rem,calc(50vw-640px))] animate-float-6">
        <div className="relative">
          <div className="absolute -inset-2.5 rounded-full bg-[#F7931E]/22 blur-lg pointer-events-none" />
          <DragonBall
            stars={6}
            className="w-12 h-12 sm:w-18 sm:h-18 lg:w-22 lg:h-22 opacity-90 drop-shadow-[0_10px_26px_rgba(247,147,30,0.35)]"
          />
        </div>
      </div>

      {/* Esfera 7 (7 Estrellas): Lateral inferior izquierdo */}
      <div className="absolute bottom-[6%] left-[3%] sm:left-[5%] xl:left-[max(2rem,calc(50vw-600px))] animate-float-7">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-[#F7931E]/25 blur-lg pointer-events-none" />
          <DragonBall
            stars={7}
            className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-95 drop-shadow-[0_14px_30px_rgba(247,147,30,0.4)]"
          />
        </div>
      </div>
    </div>
  );
};

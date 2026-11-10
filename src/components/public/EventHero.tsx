import React from 'react';
import { BabyShowerEvent } from '../../types';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface EventHeroProps {
  event: BabyShowerEvent;
}

export const EventHero: React.FC<EventHeroProps> = ({ event }) => {
  const mapUrl = event.locationUrl || "https://maps.app.goo.gl/8Zq5jnmNza4u2ZMD9";

  return (
    <header className="pt-10 pb-8 px-4 text-center max-w-2xl mx-auto">
      {/* 1. Pastilla "Baby Shower · Lista de regalos" con detalle de destello sutil */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#D8E6F3] text-xs font-bold uppercase tracking-[0.14em] text-[#5880A4] shadow-[0_2px_10px_-2px_rgba(28,45,66,0.06)] mb-3">
        <span className="w-2 h-2 rounded-full bg-[#F7931E] shadow-[0_0_8px_rgba(247,147,30,0.8)]" />
        <span>Baby Shower · Lista de regalos</span>
      </div>

      {/* 2. "Bebé en camino" en Yellowtail con degradado sunset cálido y brillo natural */}
      <div
        className="font-script text-[clamp(2.8rem,7vw,4.8rem)] leading-[1.05] select-none mb-2 tracking-wide"
        style={{
          background: 'linear-gradient(135deg, #F9A030 0%, #F7931E 45%, #E2650F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 18px rgba(247, 147, 30, 0.28))',
        }}
      >
        Bebé en camino
      </div>

      {/* 3. Título del evento / nombre del bebé si es específico */}
      {event.babyName &&
        !event.babyName.toLowerCase().includes('bebé en camino') &&
        !event.babyName.toLowerCase().includes('bebe en camino') && (
          <h1 className="font-heading font-semibold text-2xl sm:text-4xl text-[#1C2D42] tracking-tight leading-tight mb-2">
            {event.babyName}
          </h1>
        )}

      {/* 4. "Con amor, {parentsNames}" */}
      <p className="text-sm sm:text-base font-medium text-[#556E88] mb-3">
        Con amor, {event.parentsNames}
      </p>

      {/* 5. Mensaje de bienvenida en texto muted (máx. 52ch, sin caja ni comillas) */}
      {event.welcomeMessage && (
        <p className="text-sm sm:text-base text-[#556E88] max-w-[52ch] mx-auto leading-relaxed mb-6 font-normal">
          {event.welcomeMessage}
        </p>
      )}

      {/* 6. Chips de fecha y ubicación blancos con borde suave y "Cómo llegar ↗" en naranja */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-[#1C2D42]">
        {event.date && (
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-[#D8E6F3] px-4 py-2.5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(28,45,66,0.05)]">
            <Calendar className="w-4 h-4 text-[#F7931E] shrink-0" />
            <span>{event.date}</span>
          </div>
        )}
        {(event.location || event.locationUrl) && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir ubicación en Google Maps (Cómo llegar)"
            className="group inline-flex items-center gap-2.5 bg-white/95 hover:bg-white backdrop-blur-xs border border-[#D8E6F3] hover:border-[#F7931E]/60 px-4 py-2.5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(28,45,66,0.05)] transition-all duration-200 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#F7931E] shrink-0" />
            <span className="font-semibold text-[#1C2D42]">
              {event.location || "Ver ubicación del evento"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E2650F] group-hover:underline shrink-0 bg-[#FFF2E2] px-2.5 py-0.5 rounded-lg border border-[#F7931E]/20">
              Cómo llegar
              <ExternalLink className="w-3 h-3 text-[#E2650F]" />
            </span>
          </a>
        )}
      </div>
    </header>
  );
};

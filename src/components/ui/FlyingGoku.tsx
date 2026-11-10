import React from 'react';

export const FlyingGoku: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute left-0 top-0 w-max animate-shooting-nimbus">
        <div className="relative inline-flex items-end animate-nimbus-float">
          {/* Goku de niño sobre la Nube Voladora amarilla (Kinto'un) */}
          <img
            src="/images/goku_nimbus_yellow.png"
            alt="Goku niño en la Nube Voladora"
            className="w-28 sm:w-36 h-auto drop-shadow-[0_8px_20px_rgba(247,147,30,0.45)] select-none pointer-events-none block"
            loading="eager"
            decoding="async"
          />

          {/* Estela mágica dorada que nace DIRECTAMENTE detrás de la nube voladora */}
          <div className="absolute right-2 sm:right-3 bottom-1 sm:bottom-2 translate-x-full pointer-events-none overflow-visible">
            <svg
              className="w-48 sm:w-72 h-12 overflow-visible select-none"
              viewBox="0 0 280 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="nimbusWakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.85" />
                  <stop offset="25%" stopColor="#FFA000" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#FFCA28" stopOpacity="0.25" />
                  <stop offset="85%" stopColor="#FFE082" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#FFE082" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="puffGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFD54F" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Cono aerodinámico de velocidad que se desvanece suavemente a 0% */}
              <path
                d="M 0 14 Q 110 19 260 25 Q 110 31 0 36 Z"
                fill="url(#nimbusWakeGrad)"
              />

              {/* Nubesitas y volutas suaves de Kinto'un que se van disipando */}
              <circle cx="28" cy="23" r="9" fill="#FFF9C4" opacity="0.5" />
              <circle cx="36" cy="27" r="7" fill="#FFE082" opacity="0.45" />
              <circle cx="75" cy="22" r="7" fill="#FFF9C4" opacity="0.32" />
              <circle cx="86" cy="26" r="6" fill="#FFD54F" opacity="0.25" />
              <circle cx="130" cy="24" r="5" fill="#FFE082" opacity="0.16" />
              <circle cx="175" cy="25" r="3.5" fill="#FFCA28" opacity="0.08" />

              {/* Chispitas y destellos de estrella fugaz */}
              <circle cx="16" cy="25" r="2.5" fill="#FFFFFF" opacity="0.95" />
              <circle cx="52" cy="18" r="2.2" fill="#FFF" opacity="0.85" />
              <circle cx="98" cy="28" r="2" fill="#FFE082" opacity="0.75" />
              <circle cx="150" cy="22" r="1.8" fill="#FFF" opacity="0.65" />
              <circle cx="205" cy="26" r="1.5" fill="#FFD54F" opacity="0.45" />
              <circle cx="250" cy="25" r="1.2" fill="#FFE082" opacity="0.25" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};


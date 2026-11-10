import React, { useId } from 'react';

export interface DragonBallProps extends React.SVGAttributes<SVGSVGElement> {
  stars?: number;
  className?: string;
}

// Generador de polígono para estrella de 5 puntas con radio interior = 0.45 * radio exterior
function getStarPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  const innerR = r * 0.45;
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : innerR;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

// Configuración de posiciones y radios de estrellas para 1 a 7 esferas
const STAR_CONFIGS: Record<number, { pos: [number, number]; r: number }[]> = {
  1: [{ pos: [50, 52], r: 13 }],
  2: [
    { pos: [39, 52], r: 10 },
    { pos: [61, 52], r: 10 },
  ],
  3: [
    { pos: [50, 40], r: 9 },
    { pos: [39, 60], r: 9 },
    { pos: [61, 60], r: 9 },
  ],
  4: [
    { pos: [39, 41], r: 8.5 },
    { pos: [61, 41], r: 8.5 },
    { pos: [39, 62], r: 8.5 },
    { pos: [61, 62], r: 8.5 },
  ],
  5: [
    { pos: [50, 35], r: 8 },
    { pos: [35, 48], r: 8 },
    { pos: [65, 48], r: 8 },
    { pos: [41, 65], r: 8 },
    { pos: [59, 65], r: 8 },
  ],
  6: [
    { pos: [36, 42], r: 7 },
    { pos: [50, 42], r: 7 },
    { pos: [64, 42], r: 7 },
    { pos: [36, 61], r: 7 },
    { pos: [50, 61], r: 7 },
    { pos: [64, 61], r: 7 },
  ],
  7: [
    { pos: [50, 52], r: 7 },
    { pos: [50, 34], r: 7 },
    { pos: [65, 43], r: 7 },
    { pos: [65, 61], r: 7 },
    { pos: [50, 70], r: 7 },
    { pos: [35, 61], r: 7 },
    { pos: [35, 43], r: 7 },
  ],
};

export const DragonBall: React.FC<DragonBallProps> = ({
  stars = 1,
  className = 'w-10 h-10',
  ...props
}) => {
  const rawId = useId();
  const gradId = `db-grad-${rawId.replace(/:/g, '')}`;
  const glowId = `db-glow-${rawId.replace(/:/g, '')}`;

  const clampedStars = Math.max(1, Math.min(7, Math.round(stars)));
  const starList = STAR_CONFIGS[clampedStars] || STAR_CONFIGS[1];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Esfera del Dragón de ${clampedStars} ${clampedStars === 1 ? 'estrella' : 'estrellas'}`}
      {...props}
    >
      <defs>
        {/* Gradiente radial rico: ámbar cálido con profundidad de cristal */}
        <radialGradient id={gradId} cx="38%" cy="32%" r="64%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="28%" stopColor="#FFC56B" />
          <stop offset="55%" stopColor="#F7931E" />
          <stop offset="85%" stopColor="#E06A10" />
          <stop offset="100%" stopColor="#C44B08" />
        </radialGradient>

        {/* Gradiente sutil para el halo interior */}
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* Sombra de contacto suave interna */}
      <circle cx="50" cy="50" r="46" fill={`url(#${gradId})`} />

      {/* Halo de borde cristalino */}
      <circle cx="50" cy="50" r="45.5" fill={`url(#${glowId})`} />
      <circle
        cx="50"
        cy="50"
        r="45.5"
        fill="none"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1"
      />

      {/* Reflejo inferior suave (luz de rebote) */}
      <ellipse
        cx="58"
        cy="76"
        rx="18"
        ry="6"
        fill="#FFE8C7"
        opacity="0.35"
        transform="rotate(-14 58 76)"
      />

      {/* Estrellas rojas suspendidas en el interior */}
      {starList.map(({ pos, r }, idx) => (
        <g key={idx}>
          {/* Sombra sutil de la estrella dentro de la resina */}
          <polygon
            points={getStarPoints(pos[0] + 0.6, pos[1] + 1, r)}
            fill="#8B1B15"
            opacity="0.28"
          />
          {/* Estrella roja viva */}
          <polygon
            points={getStarPoints(pos[0], pos[1], r)}
            fill="#D2322A"
          />
          {/* Pequeño brillo en el vértice superior de la estrella */}
          <circle
            cx={pos[0]}
            cy={pos[1] - r + 1.2}
            r="0.9"
            fill="#FFA49F"
            opacity="0.75"
          />
        </g>
      ))}

      {/* Brillo principal de cristal (elipse blanca curvada) */}
      <ellipse
        cx="36"
        cy="26"
        rx="14"
        ry="8"
        fill="#FFFFFF"
        opacity="0.6"
        transform="rotate(-28 36 26)"
      />

      {/* Segundo destello especular puntual (glint de cristal animado / anime) */}
      <circle cx="48" cy="20" r="2.8" fill="#FFFFFF" opacity="0.65" />
      <circle cx="28" cy="38" r="1.6" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
};

import React from 'react';
import NumberFlow from '@number-flow/react';
import { Users, CheckCircle2, Package } from 'lucide-react';

interface KpiCardsProps {
  totalRequested: number;
  totalClaimed: number;
  totalRemaining: number;
  uniqueGuestsCount: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalRequested,
  totalClaimed,
  uniqueGuestsCount,
}) => {
  const percentage = totalRequested > 0 ? Math.round((totalClaimed / totalRequested) * 100) : 0;

  // Cálculo de circunferencia para el anillo SVG animado
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* KPI 1: % Completado con Anillo animado */}
      <div className="bg-white p-5 rounded-3xl border border-theme shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-xs font-bold text-theme-muted uppercase tracking-wider block mb-1">
            Progreso
          </span>
          <div className="text-2xl font-serif font-bold text-theme flex items-center">
            <NumberFlow value={percentage} />%
          </div>
          <span className="text-xs text-theme-muted">de la lista</span>
        </div>

        {/* Anillo de progreso SVG */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="text-theme-secondary/40 stroke-current"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="text-theme-accent stroke-current transition-all duration-500 ease-out"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
        </div>
      </div>

      {/* KPI 2: Unidades regaladas */}
      <div className="bg-white p-5 rounded-3xl border border-theme shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
            Regalados
          </span>
          <div className="w-8 h-8 rounded-xl bg-theme-accent-light flex items-center justify-center text-theme-accent">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="text-2xl font-serif font-bold text-theme">
          <NumberFlow value={totalClaimed} />
        </div>
        <span className="text-xs text-theme-muted">unidades reservadas</span>
      </div>

      {/* KPI 3: Total pedidas */}
      <div className="bg-white p-5 rounded-3xl border border-theme shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
            Total pedidos
          </span>
          <div className="w-8 h-8 rounded-xl bg-theme-secondary-light flex items-center justify-center text-theme-muted">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-serif font-bold text-theme">
          <NumberFlow value={totalRequested} />
        </div>
        <span className="text-xs text-theme-muted">artículos en total</span>
      </div>

      {/* KPI 4: Invitados participantes */}
      <div className="bg-white p-5 rounded-3xl border border-theme shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
            Invitados
          </span>
          <div className="w-8 h-8 rounded-xl bg-theme-accent-light flex items-center justify-center text-theme-accent">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-serif font-bold text-theme">
          <NumberFlow value={uniqueGuestsCount} />
        </div>
        <span className="text-xs text-theme-muted">personas han participado</span>
      </div>
    </div>
  );
};

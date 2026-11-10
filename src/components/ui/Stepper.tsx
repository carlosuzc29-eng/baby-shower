import React from 'react';
import { Minus, Plus } from 'lucide-react';
import NumberFlow from '@number-flow/react';

interface StepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  min = 1,
  max,
  onChange,
  label = "Cantidad a regalar"
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="text-xs font-semibold text-theme-muted tracking-wide uppercase">
          {label}
        </span>
      )}
      <div className="flex items-center bg-theme-bg p-1.5 rounded-2xl border border-theme">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Disminuir cantidad"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-theme shadow-xs btn-interactive disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="w-14 text-center font-bold text-xl text-theme">
          <NumberFlow value={value} />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Aumentar cantidad"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-theme shadow-xs btn-interactive disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import { DragonBall } from '../ui/DragonBall';
import { Sparkles } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  guestName: string;
  giftName: string;
  quantity: number;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  guestName,
  giftName,
  quantity,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Disparo suave de confetti respetando prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
          colors: ['#F7931E', '#A8D1EE', '#6F8FAF', '#FFFFFF', '#D2322A'],
          disableForReducedMotion: true,
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dialog-backdrop">
      <div className="bg-white rounded-[24px] p-6 sm:p-7 max-w-sm w-full text-center border border-theme shadow-2xl dialog-popup">
        {/* Esfera de 7 estrellas en lugar del corazón */}
        <DragonBall
          stars={7}
          className="w-16 h-16 mx-auto mb-4 drop-shadow-[0_4px_14px_rgba(247,147,30,0.4)]"
        />

        <h3 className="font-heading font-semibold text-2xl text-theme mb-2">
          ¡Gracias, {guestName}!
        </h3>

        <p className="text-theme-muted text-sm sm:text-base leading-relaxed mb-4">
          Los papás van a estar felices con tu detalle de{' '}
          <strong className="text-theme">
            {quantity > 1 ? `${quantity}× ${giftName}` : giftName}
          </strong>.
        </p>

        <div className="bg-theme-secondary-light/60 p-3 rounded-2xl border border-theme mb-6 flex items-center justify-center gap-2 text-xs font-semibold text-theme-muted">
          <Sparkles className="w-4 h-4 text-[#F7931E]" />
          <span>Tu regalo ya quedó reservado</span>
        </div>

        <Button variant="primary" fullWidth onClick={onClose}>
          Elegir otro regalo
        </Button>
      </div>
    </div>
  );
};

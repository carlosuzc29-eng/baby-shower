import React, { useState, useEffect } from 'react';
import { Dialog } from '@base-ui-components/react';
import { Gift } from '../../types';
import { Button } from '../ui/Button';
import { Stepper } from '../ui/Stepper';
import { DragonBall } from '../ui/DragonBall';
import { X, Star, MessageSquare } from 'lucide-react';
import { useGuestName } from '../../hooks/useGuestName';

interface ClaimDialogProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (guestName: string, quantity: number, message: string) => Promise<void>;
  isSubmitting: boolean;
}

export const ClaimDialog: React.FC<ClaimDialogProps> = ({
  gift,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  const { guestName: savedGuestName, setGuestName: saveGuestName } = useGuestName();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && gift) {
      setName(savedGuestName);
      setQuantity(1);
      setMessage('');
      setError(null);
    }
  }, [isOpen, gift, savedGuestName]);

  if (!gift) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError('Por favor escribe tu nombre (mínimo 2 letras) para que los papás sepan quién los acompaña.');
      return;
    }

    saveGuestName(trimmedName);
    setError(null);
    await onConfirm(trimmedName, quantity, message.trim());
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 dialog-backdrop z-50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-theme z-50 dialog-popup max-h-[90vh] overflow-y-auto focus:outline-none">
          {/* Header con botón de cierre */}
          <div className="flex items-center justify-between pb-3 border-b border-theme/60 mb-4">
            <div className="inline-flex items-center gap-1.5 text-[#E2650F] text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#F7931E] text-[#F7931E]" />
              <span>Confirmar regalo</span>
            </div>
            <Dialog.Close
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full flex items-center justify-center text-theme-muted hover:bg-neutral-100 btn-interactive"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* Resumen del regalo */}
          <div className="bg-theme-secondary-light/60 p-4 rounded-2xl border border-theme mb-5 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#F7931E] shrink-0 shadow-2xs border border-theme/60">
              <DragonBall stars={Math.min(gift.quantityRemaining, 7)} className="w-9 h-9" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-heading font-semibold text-base text-theme truncate capitalize">
                {gift.name.toLowerCase()}
              </h4>
              <p className="text-xs text-[#556E88]">
                Regalo especial para el Baby Shower
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Tu nombre */}
            <div>
              <label htmlFor="guestName" className="block text-xs font-bold text-theme uppercase tracking-wider mb-1.5">
                Tu nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="guestName"
                type="text"
                required
                minLength={2}
                disabled={isSubmitting}
                placeholder="Ej. Tía María o Carlos Gómez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-theme bg-white text-theme placeholder:text-theme-muted/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A8D1EE] transition-all text-sm font-medium"
              />
              {error && (
                <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>
              )}
            </div>

            {/* Stepper de cantidad: Ahora libre para que regalen cuantas unidades deseen */}
            <div className="py-2">
              <Stepper
                value={quantity}
                min={1}
                max={99}
                onChange={setQuantity}
                label="¿Cuántas unidades deseas regalar?"
              />
            </div>

            {/* Mensaje opcional para los papás */}
            <div>
              <label htmlFor="guestMessage" className="flex items-center gap-1.5 text-xs font-bold text-theme uppercase tracking-wider mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#F7931E]" />
                <span>Mensaje para los papás (opcional)</span>
              </label>
              <textarea
                id="guestMessage"
                rows={2}
                disabled={isSubmitting}
                placeholder="¡Qué emoción conocer a este bebé! Con mucho amor..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-theme bg-white text-theme placeholder:text-theme-muted/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A8D1EE] transition-all text-sm font-medium resize-none"
              />
            </div>

            {/* Botones de acción */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                className="order-1 sm:order-2"
              >
                {isSubmitting ? 'Apartando regalo...' : 'Confirmar regalo'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="order-2 sm:order-1 text-sm"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

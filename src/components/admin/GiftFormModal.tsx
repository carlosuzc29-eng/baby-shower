import React, { useState } from 'react';
import { Gift, GiftCategory } from '../../types';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Stepper } from '../ui/Stepper';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface GiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (giftData: Partial<Gift>) => Promise<void>;
  initialGift?: Gift | null;
  claimedCount?: number;
}

const CATEGORIES: GiftCategory[] = [
  'Pañales y aseo',
  'Ropa',
  'Alimentación',
  'Habitación',
  'Paseo',
  'Otros'
];

export const GiftFormModal: React.FC<GiftFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGift,
  claimedCount = 0
}) => {
  const [name, setName] = useState(initialGift?.name || '');
  const [description, setDescription] = useState(initialGift?.description || '');
  const [category, setCategory] = useState<GiftCategory>(initialGift?.category || 'Pañales y aseo');
  const [imageUrl, setImageUrl] = useState(initialGift?.imageUrl || '');
  const [link, setLink] = useState(initialGift?.link || '');
  const [quantityRequested, setQuantityRequested] = useState(initialGift?.quantityRequested || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(initialGift?.name || '');
      setDescription(initialGift?.description || '');
      setCategory(initialGift?.category || 'Pañales y aseo');
      setImageUrl(initialGift?.imageUrl || '');
      setLink(initialGift?.link || '');
      setQuantityRequested(initialGift?.quantityRequested || 1);
      setPreviewError(false);
    }
  }, [isOpen, initialGift]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      // Si se edita quantityRequested, recalcula quantityRemaining = quantityRequested - total regalado, nunca menor que 0
      const newRemaining = Math.max(0, quantityRequested - claimedCount);

      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        imageUrl: imageUrl.trim() || undefined,
        link: link.trim() || undefined,
        quantityRequested,
        quantityRemaining: newRemaining,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dialog-backdrop">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-theme shadow-2xl dialog-popup max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-theme/60 mb-4">
          <h3 className="font-serif font-bold text-xl text-theme">
            {initialGift ? 'Editar regalo' : 'Nuevo regalo'}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-theme-muted hover:bg-neutral-100 btn-interactive"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Nombre del artículo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Pañales Etapa 2 (Caja x 80)"
              className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GiftCategory)}
              className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Cantidad pedida con Stepper */}
          <div className="bg-theme-bg/40 p-3 rounded-2xl border border-theme">
            <Stepper
              value={quantityRequested}
              min={Math.max(1, claimedCount)}
              max={100}
              onChange={setQuantityRequested}
              label={`Cantidad total pedida ${claimedCount > 0 ? `(Ya regalados: ${claimedCount})` : ''}`}
            />
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Descripción o detalles (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Talla 3-6 meses, marca Huggies, color neutro..."
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          {/* Imagen (solo URL externa, plan Spark) con Vista Previa */}
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              URL de imagen externa (opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://ejemplo.com/foto-regalo.jpg"
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />

            {/* Vista previa en vivo de la URL */}
            <div className="mt-2 flex items-center gap-3 p-2 bg-theme-bg rounded-xl border border-theme">
              <div className="w-14 h-14 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0 border border-theme/60">
                {imageUrl && !previewError ? (
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div className="text-theme-muted/70 flex flex-col items-center">
                    <CategoryIcon category={category} className="w-6 h-6 text-theme-accent" />
                  </div>
                )}
              </div>
              <div className="text-xs text-theme-muted">
                {imageUrl && !previewError ? (
                  <span className="text-green-600 font-semibold">Vista previa de la imagen cargada con éxito</span>
                ) : (
                  <span>
                    {imageUrl && previewError
                      ? 'No se pudo cargar la URL; se usará el ícono de categoría como respaldo'
                      : 'Si no pegas URL, se mostrará el ícono de la categoría automáticamente'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Enlace de referencia */}
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Enlace de referencia / sugerencia de compra (opcional)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://tienda.com/producto"
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          {/* Acciones */}
          <div className="pt-3 flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : initialGift ? 'Actualizar regalo' : 'Crear regalo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

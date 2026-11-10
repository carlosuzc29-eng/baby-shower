import React, { useState } from 'react';
import { Gift, Claim } from '../../types';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Button } from '../ui/Button';
import { Plus, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { GiftFormModal } from './GiftFormModal';

interface GiftManagerProps {
  gifts: Gift[];
  claims: Claim[];
  onAddGift: (data: Partial<Gift>) => Promise<void>;
  onEditGift: (giftId: string, data: Partial<Gift>) => Promise<void>;
  onDeleteGift: (giftId: string) => Promise<void>;
}

export const GiftManager: React.FC<GiftManagerProps> = ({
  gifts,
  claims,
  onAddGift,
  onEditGift,
  onDeleteGift,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // Mapeo de reclamos por giftId para calcular totales regalados
  const claimedCountByGift = React.useMemo(() => {
    const map: Record<string, number> = {};
    claims.forEach((c) => {
      map[c.giftId] = (map[c.giftId] || 0) + c.quantity;
    });
    return map;
  }, [claims]);

  const handleOpenCreate = () => {
    setEditingGift(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gift: Gift) => {
    setEditingGift(gift);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Gift>) => {
    if (editingGift) {
      await onEditGift(editingGift.id, data);
    } else {
      await onAddGift(data);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-theme p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-serif font-bold text-xl text-theme">
            Lista de regalos ({gifts.length})
          </h3>
          <p className="text-xs text-theme-muted">
            Monitorea el avance por regalo o añade nuevos artículos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo regalo</span>
        </Button>
      </div>

      {gifts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-theme-muted mb-3">Aún no has agregado regalos a la lista.</p>
          <Button variant="outline" size="sm" onClick={handleOpenCreate}>
            Agregar el primer regalo
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {gifts.map((gift) => {
            const claimed = claimedCountByGift[gift.id] || 0;
            const requested = gift.quantityRequested;
            const percentage = requested > 0 ? Math.min(100, Math.round((claimed / requested) * 100)) : 0;
            const isComplete = gift.quantityRemaining === 0;
            const isUntouched = claimed === 0;

            return (
              <div
                key={gift.id}
                className="p-4 rounded-2xl bg-theme-bg/60 border border-theme flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Info principal del regalo */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-theme-accent shrink-0 border border-theme/60 overflow-hidden">
                    {gift.imageUrl ? (
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <CategoryIcon category={gift.category} className="w-6 h-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-theme truncate">
                        {gift.name}
                      </h4>
                      {/* Badge de estado */}
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Completo
                        </span>
                      ) : isUntouched ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-600">
                          Sin elegir
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          En progreso
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-theme-muted block">
                      {gift.category} {gift.description ? `· ${gift.description}` : ''}
                    </span>
                  </div>
                </div>

                {/* Barra de progreso individual */}
                <div className="w-full md:w-56 flex flex-col justify-center">
                  <div className="flex justify-between text-xs font-semibold text-theme mb-1">
                    <span>
                      {claimed} de {requested} regaladas
                    </span>
                    <span className="text-theme-muted">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-theme-secondary/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-theme-accent rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Acciones de edición y eliminación */}
                <div className="flex items-center gap-1 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(gift)}
                    title="Editar regalo"
                    className="p-2 rounded-xl text-theme-muted hover:text-theme hover:bg-white border border-transparent hover:border-theme btn-interactive"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar "${gift.name}"?`)) {
                        onDeleteGift(gift.id);
                      }
                    }}
                    title="Eliminar regalo"
                    className="p-2 rounded-xl text-theme-muted hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 btn-interactive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de formulario */}
      <GiftFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialGift={editingGift}
        claimedCount={editingGift ? claimedCountByGift[editingGift.id] || 0 : 0}
      />
    </div>
  );
};

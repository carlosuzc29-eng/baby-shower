import React from 'react';
import { Claim } from '../../types';
import { Clock, MessageSquare, Trash2 } from 'lucide-react';

interface ClaimsFeedProps {
  claims: Claim[];
  onCancelClaim?: (claim: Claim) => void;
  isCancelling?: boolean;
}

export const ClaimsFeed: React.FC<ClaimsFeedProps> = ({ claims, onCancelClaim, isCancelling }) => {
  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'recientemente';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (claims.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-theme text-center py-10">
        <Clock className="w-10 h-10 text-theme-muted/50 mx-auto mb-2" />
        <h4 className="font-serif font-bold text-lg text-theme mb-1">Aún no hay regalos registrados</h4>
        <p className="text-xs text-theme-muted">
          A medida que los invitados elijan regalos desde su celular, aparecerán aquí en tiempo real.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-theme p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-lg text-theme">
          Actividad reciente
        </h3>
        <span className="text-xs font-semibold text-theme-muted">
          {claims.length} regalos registrados
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="p-3.5 rounded-2xl bg-theme-bg border border-theme/70 flex items-start justify-between gap-3 text-sm"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-theme font-bold">{claim.guestName}</strong>
                <span className="text-theme-muted text-xs">regaló</span>
                <span className="bg-white px-2 py-0.5 rounded-lg border border-theme text-xs font-bold text-theme-accent">
                  {claim.quantity > 1 ? `${claim.quantity}× ` : ''}{claim.giftName}
                </span>
                <span className="text-[11px] text-theme-muted/80 ml-auto">
                  {formatTimeAgo(claim.createdAt)}
                </span>
              </div>

              {claim.message && (
                <div className="mt-2 text-xs text-theme italic bg-white/70 p-2.5 rounded-xl border border-theme/50 flex items-start gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-theme-accent shrink-0 mt-0.5" />
                  <span>"{claim.message}"</span>
                </div>
              )}
            </div>

            {/* Opción de anular claim por si alguien se equivocó */}
            {onCancelClaim && (
              <button
                onClick={() => onCancelClaim(claim)}
                disabled={isCancelling}
                title="Anular regalo (devolverá las unidades a la lista pública)"
                className="text-theme-muted hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition-colors btn-interactive shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

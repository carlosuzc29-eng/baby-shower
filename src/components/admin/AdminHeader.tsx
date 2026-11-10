import React from 'react';
import { BabyShowerEvent } from '../../types';
import { Button } from '../ui/Button';
import { Share2, LogOut, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface AdminHeaderProps {
  event: BabyShowerEvent | null;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ event, onLogout }) => {
  const publicUrl = event ? `${window.location.origin}/e/${event.id}` : '';

  const handleCopyWhatsAppLink = () => {
    if (!publicUrl) return;
    const shareText = `¡Hola! Los invitamos con mucho amor al Baby Shower de ${event?.babyName || 'nuestro bebé'}. Pueden ver la lista de regalitos aquí: ${publicUrl}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('¡Enlace para WhatsApp copiado al portapapeles! 📋');
      }).catch(() => {
        toast.info(publicUrl);
      });
    }
  };

  return (
    <header className="bg-white border-b border-theme sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-theme-accent">
            Panel de los papás
          </span>
          <h1 className="font-serif font-bold text-xl text-theme">
            {event?.babyName ? `Baby Shower: ${event.babyName}` : 'Gestión de Baby Shower'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {event && (
            <>
              <a
                href={`/e/${event.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-theme-muted hover:text-theme bg-theme-bg rounded-xl border border-theme btn-interactive"
              >
                <span>Ver lista pública</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyWhatsAppLink}
                className="gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copiar para WhatsApp</span>
              </Button>
            </>
          )}

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-theme-muted hover:bg-neutral-100 border border-transparent hover:border-theme btn-interactive"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

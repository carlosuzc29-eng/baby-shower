import React from 'react';
import { Claim } from '../../types';
import { Download, Heart, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

interface GuestListProps {
  claims: Claim[];
}

interface GroupedGuest {
  name: string;
  totalGiftsCount: number;
  items: {
    giftName: string;
    quantity: number;
    message?: string;
    date: string;
  }[];
}

export const GuestList: React.FC<GuestListProps> = ({ claims }) => {
  // Agrupar claims por nombre de invitado
  const groupedGuests = React.useMemo(() => {
    const map = new Map<string, GroupedGuest>();

    claims.forEach((c) => {
      const normalizedName = c.guestName.trim();
      const existing = map.get(normalizedName) || {
        name: normalizedName,
        totalGiftsCount: 0,
        items: []
      };

      const dateStr = c.createdAt?.toDate
        ? c.createdAt.toDate().toLocaleDateString('es-ES')
        : 'Reciente';

      existing.totalGiftsCount += c.quantity;
      existing.items.push({
        giftName: c.giftName,
        quantity: c.quantity,
        message: c.message,
        date: dateStr
      });

      map.set(normalizedName, existing);
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [claims]);

  // Exportar a CSV para los papás
  const handleExportCSV = () => {
    if (claims.length === 0) return;

    const headers = ['Invitado', 'Regalo', 'Cantidad', 'Mensaje', 'Fecha'];
    const rows = claims.map((c) => {
      const dateStr = c.createdAt?.toDate ? c.createdAt.toDate().toISOString() : '';
      return [
        `"${c.guestName.replace(/"/g, '""')}"`,
        `"${c.giftName.replace(/"/g, '""')}"`,
        c.quantity,
        `"${(c.message || '').replace(/"/g, '""')}"`,
        `"${dateStr}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `regalos_baby_shower_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-theme p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-serif font-bold text-xl text-theme">
            Por invitado ({groupedGuests.length})
          </h3>
          <p className="text-xs text-theme-muted">
            Lista agrupada para escribir las tarjetas de agradecimiento.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          disabled={claims.length === 0}
          className="gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar a CSV</span>
        </Button>
      </div>

      {groupedGuests.length === 0 ? (
        <p className="text-center py-6 text-xs text-theme-muted">
          Aún no hay invitados registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedGuests.map((guest) => (
            <div
              key={guest.name}
              className="p-4 rounded-2xl bg-theme-bg border border-theme flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-theme-accent fill-current" />
                    <h4 className="font-bold text-sm text-theme">{guest.name}</h4>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-theme text-theme-accent">
                    {guest.totalGiftsCount} {guest.totalGiftsCount === 1 ? 'regalo' : 'regalos'}
                  </span>
                </div>

                <div className="space-y-1.5 mt-2">
                  {guest.items.map((item, idx) => (
                    <div key={idx} className="text-xs bg-white/70 p-2 rounded-xl border border-theme/40">
                      <div className="flex justify-between items-center font-semibold text-theme">
                        <span>{item.quantity > 1 ? `${item.quantity}× ` : ''}{item.giftName}</span>
                        <span className="text-[10px] text-theme-muted">{item.date}</span>
                      </div>
                      {item.message && (
                        <p className="text-[11px] text-theme-muted italic mt-1 flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 text-theme-accent shrink-0 mt-0.5" />
                          <span>"{item.message}"</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

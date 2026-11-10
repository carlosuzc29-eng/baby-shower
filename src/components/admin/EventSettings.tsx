import React, { useState } from 'react';
import { BabyShowerEvent, ThemeColor } from '../../types';
import { Button } from '../ui/Button';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EventSettingsProps {
  event: BabyShowerEvent;
  onUpdateEvent: (data: Partial<BabyShowerEvent>) => Promise<void>;
}

export const EventSettings: React.FC<EventSettingsProps> = ({ event, onUpdateEvent }) => {
  const { setTheme } = useTheme();
  const [babyName, setBabyName] = useState(event.babyName || '');
  const [parentsNames, setParentsNames] = useState(event.parentsNames || '');
  const [date, setDate] = useState(event.date || '');
  const [location, setLocation] = useState(event.location || '');
  const [locationUrl, setLocationUrl] = useState(event.locationUrl || 'https://maps.app.goo.gl/8Zq5jnmNza4u2ZMD9');
  const [welcomeMessage, setWelcomeMessage] = useState(event.welcomeMessage || '');
  const [coverImageUrl, setCoverImageUrl] = useState(event.coverImageUrl || '');
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(event.theme || 'neutro');
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (t: ThemeColor) => {
    setSelectedTheme(t);
    setTheme(t); // Vista previa en vivo del tema
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateEvent({
        babyName: babyName.trim() || undefined,
        parentsNames: parentsNames.trim(),
        date: date.trim(),
        location: location.trim() || undefined,
        locationUrl: locationUrl.trim() || undefined,
        welcomeMessage: welcomeMessage.trim(),
        coverImageUrl: coverImageUrl.trim() || undefined,
        theme: selectedTheme,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-theme p-6 shadow-xs mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-theme-accent" />
        <h3 className="font-serif font-bold text-xl text-theme">
          Configuración del evento y diseño
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Tema de color */}
        <div>
          <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-2">
            Tema de color
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'dragonball' as ThemeColor, label: 'Dragon Ball', colorClass: 'bg-[#F7931E]' },
              { id: 'neutro' as ThemeColor, label: 'Neutro', colorClass: 'bg-[#A8BFA3]' },
              { id: 'rosa' as ThemeColor, label: 'Rosa', colorClass: 'bg-[#F2B8C6]' },
              { id: 'azul' as ThemeColor, label: 'Azul', colorClass: 'bg-[#A9C7E8]' },
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold btn-interactive ${
                  selectedTheme === t.id
                    ? 'border-theme-accent ring-2 ring-theme-accent/20 bg-theme-bg'
                    : 'border-theme bg-white hover:bg-neutral-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${t.colorClass}`} />
                <span>{t.label}</span>
                {selectedTheme === t.id && <Check className="w-3.5 h-3.5 text-theme-accent ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Nombre del bebé (opcional)
            </label>
            <input
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Ej. Bebé Sofía o Nuestra bendición"
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Nombres de los papás <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={parentsNames}
              onChange={(e) => setParentsNames(e.target.value)}
              placeholder="Ej. Carlos & María"
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Fecha del evento
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ej. Sábado 15 de Noviembre, 4:00 PM"
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Lugar / Dirección (opcional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Casa de los abuelos, Calle 10 #23"
              className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
            Enlace de ubicación en Google Maps (Cómo llegar)
          </label>
          <input
            type="url"
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
            Mensaje de bienvenida
          </label>
          <textarea
            rows={2}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Estamos muy felices de compartir este momento contigo..."
            className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
            URL de portada externa (opcional, Plan Spark)
          </label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/portada-babyshower.jpg"
            className="w-full px-4 py-2 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Guardando cambios...' : 'Guardar configuración'}
          </Button>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth, DEFAULT_ADMIN_PIN } from '../context/AuthContext';
import { BabyShowerEvent, Gift, Claim } from '../types';
import { INITIAL_GIFTS_MOCK } from '../data/initialGifts';
import { DragonBall } from '../components/ui/DragonBall';
import { GiftFormModal } from '../components/admin/GiftFormModal';
import {
  Heart,
  MessageSquare,
  Gift as GiftIcon,
  Users,
  Search,
  ExternalLink,
  LogOut,
  Trash2,
  Download,
  Calendar,
  Lock,
  Plus,
  Edit2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminDashboardPageProps {
  eventId: string;
}

type TabType = 'feed' | 'guests' | 'catalog' | 'settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ eventId }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [event, setEvent] = useState<BabyShowerEvent>({
    id: eventId,
    babyName: "Bebé en camino",
    parentsNames: "Alejandro y Valentina",
    date: "Domingo 15 de Noviembre · 2:30 PM",
    location: "Reunión Familiar de Baby Shower",
    locationUrl: "https://maps.app.goo.gl/8Zq5jnmNza4u2ZMD9",
    welcomeMessage: "¡Nos llena de alegría celebrar la llegada de nuestro bebé contigo! Gracias por acompañarnos.",
    theme: "dragonball",
    coverImageUrl: "",
    ownerUid: "owner",
  });
  const [gifts, setGifts] = useState<Gift[]>(INITIAL_GIFTS_MOCK);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWithMessagesOnly, setFilterWithMessagesOnly] = useState(false);

  // Estados de edición de regalos y settings
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // Estados de configuración de evento
  const [parentsNames, setParentsNames] = useState('');
  const [babyName, setBabyName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [customPin, setCustomPin] = useState(() => localStorage.getItem('baby_shower_custom_pin') || DEFAULT_ADMIN_PIN);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 1. Escuchar datos del evento
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const eventRef = doc(db, 'events', eventId);
    const unsub = onSnapshot(eventRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() } as BabyShowerEvent;
        setEvent(data);
        setParentsNames(data.parentsNames || '');
        setBabyName(data.babyName || '');
        setEventDate(data.date || '');
        setLocation(data.location || '');
        setLocationUrl(data.locationUrl || '');
        setWelcomeMessage(data.welcomeMessage || '');
      }
    });
    return unsub;
  }, [eventId]);

  // 2. Escuchar regalos en tiempo real
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const giftsRef = collection(db, 'events', eventId, 'gifts');
    const unsub = onSnapshot(giftsRef, (snapshot) => {
      const list: Gift[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Gift);
      });
      if (list.length > 0) {
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setGifts(list);
      }
    });
    return unsub;
  }, [eventId]);

  // 3. Escuchar reclamos (claims) en tiempo real
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const claimsRef = collection(db, 'events', eventId, 'claims');
    const q = query(claimsRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: Claim[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Claim);
        });
        setClaims(list);
      },
      (err) => {
        console.warn('Error al leer claims:', err);
      }
    );
    return unsub;
  }, [eventId]);

  // Formato relativo de tiempo
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Recientemente';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Hace un momento';
    if (diffSec < 3600) return `Hace ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `Hace ${Math.floor(diffSec / 3600)} h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Filtrado de reclamos (búsqueda por nombre de invitado o regalo)
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      const matchesSearch =
        c.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.giftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.message && c.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = filterWithMessagesOnly ? Boolean(c.message && c.message.trim().length > 0) : true;
      return matchesSearch && matchesFilter;
    });
  }, [claims, searchQuery, filterWithMessagesOnly]);

  // Agrupado por invitado
  const groupedGuests = useMemo(() => {
    const map = new Map<string, { guestName: string; totalItems: number; items: { giftName: string; quantity: number; message?: string; time: string }[] }>();

    claims.forEach((c) => {
      const key = c.guestName.trim();
      const existing = map.get(key) || {
        guestName: key,
        totalItems: 0,
        items: []
      };

      existing.totalItems += c.quantity;
      existing.items.push({
        giftName: c.giftName,
        quantity: c.quantity,
        message: c.message,
        time: formatTime(c.createdAt)
      });
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.totalItems - a.totalItems);
  }, [claims]);

  // Métricas
  const totalGiftsCount = claims.reduce((acc, c) => acc + c.quantity, 0);
  const totalGuestsCount = groupedGuests.length;
  const totalMessagesCount = claims.filter((c) => c.message && c.message.trim().length > 0).length;

  // Anular claim
  const handleDeleteClaim = async (claimId: string, guestName: string, giftName: string) => {
    if (!confirm(`¿Deseas eliminar este registro de "${guestName}" (${giftName})?`)) return;

    try {
      const claimRef = doc(db, 'events', eventId, 'claims', claimId);
      await deleteDoc(claimRef);
      toast.success('Registro eliminado.');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar el registro.');
    }
  };

  // Guardar configuración del evento
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      // Guardar PIN en localStorage
      if (customPin.trim()) {
        localStorage.setItem('baby_shower_custom_pin', customPin.trim());
      }

      if (isFirebaseConfigured) {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, {
          parentsNames: parentsNames.trim(),
          babyName: babyName.trim(),
          date: eventDate.trim(),
          location: location.trim(),
          locationUrl: locationUrl.trim(),
          welcomeMessage: welcomeMessage.trim(),
        });
      }
      toast.success('¡Configuración guardada con éxito! 💛');
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar la configuración.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    if (claims.length === 0) {
      toast.error('Aún no hay regalos registrados para exportar.');
      return;
    }

    const headers = ['Invitado', 'Regalo', 'Cantidad', 'Mensaje', 'Fecha'];
    const rows = claims.map((c) => {
      const dateStr = c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString('es-ES') : '';
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
    toast.success('Archivo CSV descargado con éxito.');
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-24 sm:pb-12 text-[#1C2D42]">
      {/* 1. Header Móvil y Desktop */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D8E6F3] px-4 py-3 shadow-[0_2px_10px_-2px_rgba(28,45,66,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFF6EC] to-[#FFE7CA] border border-[#F7931E]/40 flex items-center justify-center shrink-0 shadow-2xs">
              <DragonBall stars={4} className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7931E] block">
                Panel de los Papás
              </span>
              <h1 className="font-heading font-semibold text-base sm:text-lg leading-tight truncate max-w-[200px] sm:max-w-none">
                {event.parentsNames ? event.parentsNames : "Baby Shower"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#556E88] hover:text-[#1C2D42] bg-[#EBF3FA] hover:bg-[#D8E6F3] px-3 py-2 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F7931E]" />
              <span className="hidden sm:inline">Ver web pública</span>
              <span className="sm:hidden">Web</span>
            </a>
            <button
              type="button"
              onClick={logout}
              className="p-2 text-[#556E88] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Tarjetas de Métricas Resumen (Touch Friendly) */}
      <section className="max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#D8E6F3] shadow-xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#FFF6EC] to-[#FFE7CA] text-[#F7931E] flex items-center justify-center mb-1">
              <GiftIcon className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-xl sm:text-2xl text-[#1C2D42] leading-tight">
              {totalGiftsCount}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#556E88]">
              Regalos
            </span>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#D8E6F3] shadow-xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#EBF3FA] text-[#5880A4] flex items-center justify-center mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-xl sm:text-2xl text-[#1C2D42] leading-tight">
              {totalGuestsCount}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#556E88]">
              Invitados
            </span>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#D8E6F3] shadow-xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#E24A68] flex items-center justify-center mb-1">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="font-heading font-bold text-xl sm:text-2xl text-[#1C2D42] leading-tight">
              {totalMessagesCount}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#556E88]">
              Mensajes
            </span>
          </div>
        </div>
      </section>

      {/* 3. Selector de Pestañas (Desktop y Tablet) */}
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-2 hidden sm:block">
        <div className="flex bg-[#E8F2FA] p-1.5 rounded-2xl border border-[#D8E6F3]">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'feed'
                ? 'bg-white text-[#1C2D42] shadow-xs'
                : 'text-[#556E88] hover:text-[#1C2D42]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#F7931E]" />
            <span>Regalos y Mensajes ({claims.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guests')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'guests'
                ? 'bg-white text-[#1C2D42] shadow-xs'
                : 'text-[#556E88] hover:text-[#1C2D42]'
            }`}
          >
            <Users className="w-4 h-4 text-[#5880A4]" />
            <span>Por Invitado ({totalGuestsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-white text-[#1C2D42] shadow-xs'
                : 'text-[#556E88] hover:text-[#1C2D42]'
            }`}
          >
            <GiftIcon className="w-4 h-4 text-[#F7931E]" />
            <span>Catálogo ({gifts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-white text-[#1C2D42] shadow-xs'
                : 'text-[#556E88] hover:text-[#1C2D42]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#5880A4]" />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      {/* 4. Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 pt-2">
        {/* TAB 1: REGALOS Y MENSAJES RECIBIDOS (FEED) */}
        {activeTab === 'feed' && (
          <div className="space-y-3">
            {/* Barra de Búsqueda y Filtro */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#556E88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por invitado o regalo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#D8E6F3] text-xs sm:text-sm text-[#1C2D42] placeholder:text-[#556E88]/60 focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>
              <button
                type="button"
                onClick={() => setFilterWithMessagesOnly(!filterWithMessagesOnly)}
                className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterWithMessagesOnly
                    ? 'bg-[#FFF6EC] border-[#F7931E] text-[#E2650F]'
                    : 'bg-white border-[#D8E6F3] text-[#556E88] hover:bg-[#F8FBFE]'
                }`}
                title="Mostrar solo dedicatorias con mensaje"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Con mensaje</span>
              </button>
            </div>

            {/* Listado de Tarjetas */}
            {filteredClaims.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#D8E6F3] p-8 text-center my-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF6EC] text-[#F7931E] flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#1C2D42] mb-1">
                  {claims.length === 0 ? 'Aún no hay regalos registrados' : 'No se encontraron resultados'}
                </h3>
                <p className="text-xs sm:text-sm text-[#556E88] max-w-sm mx-auto leading-relaxed">
                  {claims.length === 0
                    ? 'Cuando tus invitados elijan un regalo desde la web, aquí verás en tiempo real su nombre, qué te regalaron y su dedicatoria.'
                    : 'Intenta con otro término en la barra de búsqueda.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-[#D8E6F3] p-4 sm:p-5 shadow-[0_4px_16px_-4px_rgba(28,45,66,0.05)] transition-all hover:border-[#BBD8F0]"
                  >
                    {/* Header de la tarjeta: Nombre del invitado + Hora */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EBF3FA] to-[#D8E6F3] text-[#1C2D42] font-bold text-sm flex items-center justify-center shrink-0 border border-[#C5DCF0]">
                          {claim.guestName.trim().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-base text-[#1C2D42] capitalize leading-tight">
                            {claim.guestName}
                          </h4>
                          <span className="text-[11px] text-[#556E88] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#718BA5]" />
                            <span>{formatTime(claim.createdAt)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Botón anular discreto */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClaim(claim.id, claim.guestName, claim.giftName)}
                        className="p-1.5 text-[#718BA5] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Regalo elegido */}
                    <div className="bg-[#F8FBFE] p-3 rounded-2xl border border-[#D8E6F3]/80 mb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <GiftIcon className="w-4 h-4 text-[#F7931E] shrink-0" />
                        <span className="font-semibold text-xs sm:text-sm text-[#1C2D42] capitalize truncate">
                          {claim.giftName.toLowerCase()}
                        </span>
                      </div>
                      <span className="shrink-0 bg-white text-[#E2650F] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#F7931E]/30 shadow-2xs">
                        {claim.quantity} {claim.quantity > 1 ? 'unidades' : 'unidad'}
                      </span>
                    </div>

                    {/* Mensaje de dedicatoria tipo burbuja de chat */}
                    {claim.message && claim.message.trim().length > 0 ? (
                      <div className="relative bg-[#FFF9F2] p-3.5 rounded-2xl border border-[#F7931E]/25 text-xs sm:text-sm text-[#4A321A] leading-relaxed">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E2650F] mb-1">
                          <MessageSquare className="w-3 h-3 text-[#F7931E]" />
                          <span>Dedicatoria:</span>
                        </div>
                        <p className="italic">"{claim.message}"</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#718BA5] italic block pl-1">
                        Sin mensaje adjunto
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESUMEN POR INVITADO */}
        {activeTab === 'guests' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#D8E6F3]">
              <div>
                <h3 className="font-heading font-semibold text-sm sm:text-base">
                  {totalGuestsCount} Invitados han participado
                </h3>
                <span className="text-xs text-[#556E88]">
                  Total: {totalGiftsCount} regalos aportados
                </span>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 bg-[#EBF3FA] hover:bg-[#D8E6F3] text-[#1C2D42] text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#F7931E]" />
                <span>Descargar CSV</span>
              </button>
            </div>

            {groupedGuests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#D8E6F3] p-8 text-center my-4">
                <Users className="w-10 h-10 text-[#556E88] mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm text-[#556E88]">Aún no hay invitados registrados.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {groupedGuests.map((guest, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-[#D8E6F3] shadow-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#EBF3FA] text-[#1C2D42] font-bold text-xs flex items-center justify-center">
                          {guest.guestName.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="font-heading font-semibold text-sm sm:text-base capitalize">
                          {guest.guestName}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-[#E2650F] bg-[#FFF6EC] border border-[#F7931E]/30 px-2.5 py-0.5 rounded-full">
                        {guest.totalItems} {guest.totalItems > 1 ? 'detalles' : 'detalle'}
                      </span>
                    </div>

                    {/* Detalle de regalos de este invitado */}
                    <div className="pl-10 space-y-1">
                      {guest.items.map((it, iIdx) => (
                        <div key={iIdx} className="text-xs text-[#556E88] flex items-center justify-between border-t border-[#F0F5FA] pt-1">
                          <span className="capitalize">
                            • {it.quantity}× {it.giftName.toLowerCase()}
                          </span>
                          <span className="text-[10px] text-[#718BA5]">{it.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATÁLOGO DE REGALOS */}
        {activeTab === 'catalog' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#D8E6F3]">
              <div>
                <h3 className="font-heading font-semibold text-sm sm:text-base">
                  Catálogo de Regalos ({gifts.length})
                </h3>
                <span className="text-xs text-[#556E88]">
                  Modo Ilimitado activado: todos permanecen disponibles
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingGift(null);
                  setIsGiftModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F9A030] to-[#E2650F] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {gifts.map((g) => {
                const totalGivenForThisGift = claims
                  .filter((c) => c.giftId === g.id || c.giftName.toLowerCase() === g.name.toLowerCase())
                  .reduce((acc, c) => acc + c.quantity, 0);

                return (
                  <div
                    key={g.id}
                    className="bg-white p-3.5 rounded-2xl border border-[#D8E6F3] shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-[#EBF3FA] overflow-hidden shrink-0 border border-[#D8E6F3]">
                        {g.imageUrl ? (
                          <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                        ) : (
                          <GiftIcon className="w-6 h-6 m-auto text-[#556E88]" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7931E] block">
                          {g.category}
                        </span>
                        <h4 className="font-heading font-semibold text-sm capitalize truncate">
                          {g.name.toLowerCase()}
                        </h4>
                        <span className="text-[11px] text-[#556E88]">
                          {totalGivenForThisGift > 0 ? (
                            <strong className="text-emerald-700">{totalGivenForThisGift} regalados</strong>
                          ) : (
                            'Disponible para regalar'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGift(g);
                          setIsGiftModalOpen(true);
                        }}
                        className="p-2 text-[#556E88] hover:text-[#1C2D42] hover:bg-[#EBF3FA] rounded-xl transition-all cursor-pointer"
                        title="Editar regalo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: AJUSTES Y CONFIGURACIÓN */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-5 rounded-3xl border border-[#D8E6F3] shadow-xs space-y-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-[#1C2D42] mb-1">
                Datos del Baby Shower
              </h3>
              <p className="text-xs text-[#556E88]">
                Modifica los datos principales que verán tus invitados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1">
                  Nombres de los Papás
                </label>
                <input
                  type="text"
                  value={parentsNames}
                  onChange={(e) => setParentsNames(e.target.value)}
                  placeholder="Ej. Alejandro y Valentina"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E6F3] text-sm focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1">
                  Nombre del Bebé (opcional)
                </label>
                <input
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="Ej. Bebé en camino o el nombre elegido"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E6F3] text-sm focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1">
                  Fecha y Hora
                </label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Ej. Domingo 15 de Noviembre · 2:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E6F3] text-sm focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1">
                  Lugar del Evento
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Casa Familiar o Salón de eventos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E6F3] text-sm focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1">
                  Enlace de Google Maps ("Cómo llegar")
                </label>
                <input
                  type="url"
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E6F3] text-sm focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1">
                  Mensaje de bienvenida para los invitados
                </label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Mensaje de agradecimiento y bienvenida..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E6F3] text-sm focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>
            </div>

            {/* Configurar PIN de acceso */}
            <div className="pt-4 border-t border-[#D8E6F3]">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#F7931E]" />
                <h4 className="font-heading font-semibold text-sm">
                  PIN de Acceso a este Panel
                </h4>
              </div>
              <p className="text-xs text-[#556E88] mb-3">
                Puedes cambiar tu PIN numérico para entrar rápido desde el celular.
              </p>
              <div className="max-w-xs">
                <input
                  type="text"
                  maxLength={6}
                  value={customPin}
                  onChange={(e) => setCustomPin(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8E6F3] text-sm font-bold tracking-widest text-[#1C2D42] focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#F9A030] to-[#E2650F] text-white font-bold text-sm shadow-md cursor-pointer hover:brightness-105 active:scale-95 transition-all"
              >
                {isSavingSettings ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* 5. Barra Inferior Fija para Celular (Bottom Navigation Bar) */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#D8E6F3] z-40 py-2 px-3 flex justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'feed' ? 'text-[#E2650F] font-bold' : 'text-[#718BA5]'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Mensajes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guests')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'guests' ? 'text-[#E2650F] font-bold' : 'text-[#718BA5]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Invitados</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'catalog' ? 'text-[#E2650F] font-bold' : 'text-[#718BA5]'
          }`}
        >
          <GiftIcon className="w-5 h-5" />
          <span className="text-[10px]">Regalos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'settings' ? 'text-[#E2650F] font-bold' : 'text-[#718BA5]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Ajustes</span>
        </button>
      </nav>

      {/* Modal para agregar/editar regalo */}
      <GiftFormModal
        isOpen={isGiftModalOpen}
        initialGift={editingGift}
        onClose={() => setIsGiftModalOpen(false)}
        onSave={async (giftData) => {
          try {
            if (editingGift) {
              const giftRef = doc(db, 'events', eventId, 'gifts', editingGift.id);
              await updateDoc(giftRef, giftData);
              toast.success('Regalo modificado.');
            } else {
              const giftsRef = collection(db, 'events', eventId, 'gifts');
              await addDoc(giftsRef, {
                ...giftData,
                order: gifts.length + 1,
                createdAt: serverTimestamp(),
              });
              toast.success('¡Regalo creado con éxito! 🎁');
            }
            setIsGiftModalOpen(false);
          } catch (e) {
            console.error(e);
            toast.error('Error al guardar el regalo.');
          }
        }}
      />
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { BabyShowerEvent, Gift } from '../types';
import { INITIAL_GIFTS_MOCK } from '../data/initialGifts';
import { EventHero } from '../components/public/EventHero';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CategoryFilter } from '../components/public/CategoryFilter';
import { GiftGrid } from '../components/public/GiftGrid';
import { ClaimDialog } from '../components/public/ClaimDialog';
import { SuccessModal } from '../components/public/SuccessModal';
import { DragonSky } from '../components/ui/DragonSky';
import { FlyingGoku } from '../components/ui/FlyingGoku';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface GuestViewPageProps {
  eventId: string;
}

export const GuestViewPage: React.FC<GuestViewPageProps> = ({ eventId }) => {
  const { setTheme } = useTheme();
  const [event, setEvent] = useState<BabyShowerEvent>({
    id: eventId,
    babyName: "Bebé en camino",
    parentsNames: "Alejandro y Valentina",
    date: "Domingo 15 de Noviembre · 2:30 PM",
    location: "Reunión Familiar de Baby Shower",
    locationUrl: "https://maps.app.goo.gl/8Zq5jnmNza4u2ZMD9",
    welcomeMessage: "¡Nos llena de alegría celebrar la llegada de nuestro bebé contigo! Gracias por acompañarnos y elegir con amor un detalle especial de nuestra lista de regalos.",
    theme: "dragonball",
    coverImageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    ownerUid: "owner",
  });
  const [gifts, setGifts] = useState<Gift[]>(INITIAL_GIFTS_MOCK);
  const [allGiftsCount, setAllGiftsCount] = useState<{ requested: number; remaining: number }>({
    requested: INITIAL_GIFTS_MOCK.reduce((acc, g) => acc + g.quantityRequested, 0),
    remaining: INITIAL_GIFTS_MOCK.reduce((acc, g) => acc + g.quantityRemaining, 0),
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedGiftForClaim, setSelectedGiftForClaim] = useState<Gift | null>(null);
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado del modal de agradecimiento
  const [successInfo, setSuccessInfo] = useState<{
    isOpen: boolean;
    guestName: string;
    giftName: string;
    quantity: number;
  }>({
    isOpen: false,
    guestName: '',
    giftName: '',
    quantity: 1,
  });

  // 1. Escuchar datos del evento
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const eventRef = doc(db, 'events', eventId);
    const unsub = onSnapshot(
      eventRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as BabyShowerEvent;
          setEvent(data);
          if (data.theme) {
            setTheme(data.theme);
          }
        }
      },
      (error) => {
        console.warn('Error cargando evento de Firestore:', error);
      }
    );
    return unsub;
  }, [eventId, setTheme]);

  // 2. Escuchar todos los regalos en tiempo real (modo ilimitado: nunca se ocultan ni agotan)
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const giftsRef = collection(db, 'events', eventId, 'gifts');

    const unsub = onSnapshot(
      giftsRef,
      (snapshot) => {
        const list: Gift[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Gift);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setGifts(list);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firestore offline o no configurado:', error);
        setIsLoading(false);
      }
    );
    return unsub;
  }, [eventId]);

  // 3. Escuchar todos los regalos para calcular el progreso global (total pedidos vs total restantes)
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const giftsRef = collection(db, 'events', eventId, 'gifts');
    const unsub = onSnapshot(giftsRef, (snapshot) => {
      let requested = 0;
      let remaining = 0;
      if (!snapshot.empty) {
        snapshot.forEach((d) => {
          const g = d.data();
          requested += g.quantityRequested || 0;
          remaining += g.quantityRemaining || 0;
        });
        setAllGiftsCount({ requested, remaining });
      }
    });
    return unsub;
  }, [eventId]);

  // Filtrado de regalos por categoría
  const filteredGifts = useMemo(() => {
    if (selectedCategory === 'Todas') return gifts;
    return gifts.filter((g) => g.category === selectedCategory);
  }, [gifts, selectedCategory]);

  // Conteo de regalos disponibles por categoría para los chips de filtro
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    gifts.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [gifts]);

  // 4. LÓGICA: Registro del regalo en claims (modo ilimitado: los productos nunca se agotan)
  const handleConfirmClaim = async (guestName: string, quantity: number, message: string) => {
    if (!selectedGiftForClaim || !event) return;

    setIsClaimSubmitting(true);
    const giftId = selectedGiftForClaim.id;
    const giftName = selectedGiftForClaim.name;

    try {
      if (isFirebaseConfigured) {
        // En Firestore: registramos el reclamo en la subcolección claims
        const newClaimRef = doc(collection(db, 'events', event.id, 'claims'));
        await setDoc(newClaimRef, {
          giftId,
          giftName,
          guestName,
          quantity,
          message: message || '',
          createdAt: serverTimestamp(),
        });
      }

      // Transacción exitosa
      setSelectedGiftForClaim(null);
      toast.success('¡Regalo confirmado con éxito! 🎉');
      setSuccessInfo({
        isOpen: true,
        guestName,
        giftName,
        quantity,
      });
    } catch (err: any) {
      console.error('Error al registrar el regalo:', err);
      toast.error('Ocurrió un problema de conexión al apartar el regalo. Intenta de nuevo.');
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  const totalClaimedSoFar = Math.max(0, allGiftsCount.requested - allGiftsCount.remaining);

  return (
    <div className="min-h-screen bg-theme-bg pb-12 selection:bg-theme-accent/20 overflow-x-hidden relative">
      {/* Capa de fondo fija con cielo y 7 esferas del dragón */}
      <DragonSky />

      {/* Nube Voladora con Goku de niño pasando como estrella fugaz cada 25s */}
      <FlyingGoku />

      <div className="relative z-10">
        {/* Hero tierno Dragon Ball × Baby Shower */}
        {event ? (
          <EventHero event={event} />
        ) : (
          <header className="pt-12 pb-6 px-4 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 border-4 border-[#F7931E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <h1 className="text-xl font-heading font-bold text-theme">Cargando Baby Shower...</h1>
          </header>
        )}

        {/* Barra de progreso / Esferas reunidas */}
        {allGiftsCount.requested > 0 && (
          <div className="px-4 mb-8">
            <ProgressBar
              claimed={totalClaimedSoFar}
              total={allGiftsCount.requested}
            />
          </div>
        )}

        {/* Filtro por categoría */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          countsByCategory={countsByCategory}
        />

        {/* Grid de regalos con animaciones de entrada, layout y salida */}
        <GiftGrid
          gifts={filteredGifts}
          onClaim={(gift) => setSelectedGiftForClaim(gift)}
          isLoading={isLoading}
        />

        {/* Dialog de confirmación (Base UI accesible) */}
        <ClaimDialog
          gift={selectedGiftForClaim}
          isOpen={Boolean(selectedGiftForClaim)}
          onClose={() => setSelectedGiftForClaim(null)}
          onConfirm={handleConfirmClaim}
          isSubmitting={isClaimSubmitting}
        />

        {/* Modal de agradecimiento con confeti suave */}
        <SuccessModal
          isOpen={successInfo.isOpen}
          guestName={successInfo.guestName}
          giftName={successInfo.giftName}
          quantity={successInfo.quantity}
          onClose={() => setSuccessInfo((prev) => ({ ...prev, isOpen: false }))}
        />

        {/* Footer delicado */}
        <footer className="text-center text-xs text-[#556E88] mt-14 pb-8 px-4 select-none space-y-2">
          <p className="font-medium">Hecho con amor para nuestro Baby Shower</p>
          <p className="text-[11px] text-[#718BA5] tracking-wide">
            Design by{' '}
            <a
              href="https://instagram.com/orlog.code"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1C2D42] hover:text-[#F7931E] transition-colors duration-200 underline decoration-[#D8E6F3] hover:decoration-[#F7931E]"
            >
              @orlog.code
            </a>
          </p>
          <div className="pt-2">
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5880A4] hover:text-[#E2650F] py-1.5 px-3.5 rounded-full bg-white/80 border border-[#D8E6F3] shadow-2xs transition-all hover:bg-white"
            >
              <span>🔒 Panel de los Papás</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

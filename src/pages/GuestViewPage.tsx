import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  query,
  where,
  orderBy
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

  // 2. Escuchar solo regalos con quantityRemaining > 0 en tiempo real
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const giftsRef = collection(db, 'events', eventId, 'gifts');

    // Consulta en tiempo real: cuando un regalo llega a 0 sale automáticamente de esta lista
    const q = query(giftsRef, where('quantityRemaining', '>', 0), orderBy('quantityRemaining', 'desc'));
    
    const unsub = onSnapshot(
      q,
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

  // 4. LÓGICA CRÍTICA: Descuento atómico con runTransaction
  const handleConfirmClaim = async (guestName: string, quantity: number, message: string) => {
    if (!selectedGiftForClaim || !event) return;

    setIsClaimSubmitting(true);
    const giftId = selectedGiftForClaim.id;
    const giftName = selectedGiftForClaim.name;

    try {
      if (isFirebaseConfigured) {
        await runTransaction(db, async (transaction) => {
          const giftRef = doc(db, 'events', event.id, 'gifts', giftId);
          const giftSnap = await transaction.get(giftRef);

          if (!giftSnap.exists()) {
            throw new Error('NOT_FOUND');
          }

          const currentData = giftSnap.data();
          const currentRemaining = currentData.quantityRemaining ?? 0;

          // Validar que la cantidad solicitada aún esté disponible
          if (quantity > currentRemaining || currentRemaining <= 0) {
            throw new Error('OUT_OF_STOCK');
          }

          // Restar unidades
          const newRemaining = currentRemaining - quantity;
          transaction.update(giftRef, {
            quantityRemaining: newRemaining,
          });

          // Crear documento en la subcolección claims dentro de la misma transacción atómica
          const newClaimRef = doc(collection(db, 'events', event.id, 'claims'));
          transaction.set(newClaimRef, {
            giftId,
            giftName,
            guestName,
            quantity,
            message: message || '',
            createdAt: serverTimestamp(),
          });
        });
      } else {
        // Modo demostración local / offline instantáneo si aún no se ha enlazado el proyecto de Firebase
        setGifts((prevGifts) => {
          return prevGifts
            .map((g) => {
              if (g.id === giftId) {
                const newRem = Math.max(0, g.quantityRemaining - quantity);
                return { ...g, quantityRemaining: newRem };
              }
              return g;
            })
            .filter((g) => g.quantityRemaining > 0);
        });

        setAllGiftsCount((prev) => ({
          ...prev,
          remaining: Math.max(0, prev.remaining - quantity),
        }));
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
      console.error('Error en la transacción de claim:', err);
      if (err.message === 'OUT_OF_STOCK') {
        toast.error('¡Uy! Alguien acaba de elegir este regalo justo ahora 💛');
        setSelectedGiftForClaim(null);
      } else {
        toast.error('Ocurrió un problema de conexión al apartar el regalo. Intenta de nuevo.');
      }
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
        <footer className="text-center text-xs text-[#556E88] mt-14 pb-8 px-4 select-none space-y-1.5">
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
        </footer>
      </div>
    </div>
  );
};

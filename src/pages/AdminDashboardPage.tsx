import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { BabyShowerEvent, Gift, Claim } from '../types';
import { INITIAL_GIFTS_MOCK } from '../data/initialGifts';
import { AdminHeader } from '../components/admin/AdminHeader';
import { KpiCards } from '../components/admin/KpiCards';
import { ClaimsFeed } from '../components/admin/ClaimsFeed';
import { GuestList } from '../components/admin/GuestList';
import { GiftManager } from '../components/admin/GiftManager';
import { EventSettings } from '../components/admin/EventSettings';
import { toast } from 'sonner';

interface AdminDashboardPageProps {
  eventId: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ eventId }) => {
  const { logout } = useAuth();
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
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // 1. Escuchar datos del evento
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const eventRef = doc(db, 'events', eventId);
    const unsub = onSnapshot(eventRef, (snapshot) => {
      if (snapshot.exists()) {
        setEvent({ id: snapshot.id, ...snapshot.data() } as BabyShowerEvent);
      }
      setLoading(false);
    });
    return unsub;
  }, [eventId]);

  // 2. Escuchar regalos en tiempo real
  useEffect(() => {
    if (!eventId || !isFirebaseConfigured) return;
    const giftsRef = collection(db, 'events', eventId, 'gifts');
    const q = query(giftsRef, orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Gift[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Gift);
      });
      if (list.length > 0) {
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
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Claim[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Claim);
      });
      setClaims(list);
    });
    return unsub;
  }, [eventId]);

  // Totales para KPIs
  const totalRequested = gifts.reduce((acc, g) => acc + g.quantityRequested, 0);
  const totalRemaining = gifts.reduce((acc, g) => acc + g.quantityRemaining, 0);
  const totalClaimed = claims.reduce((acc, c) => acc + c.quantity, 0);
  const uniqueGuestsCount = new Set(claims.map((c) => c.guestName.trim().toLowerCase())).size;

  // Acciones CRUD de Regalos
  const handleAddGift = async (data: Partial<Gift>) => {
    try {
      const giftsRef = collection(db, 'events', eventId, 'gifts');
      await addDoc(giftsRef, {
        ...data,
        order: gifts.length + 1,
        createdAt: serverTimestamp(),
      });
      toast.success('¡Regalo agregado con éxito! 🎁');
    } catch (e) {
      console.error(e);
      toast.error('Error al agregar el regalo.');
    }
  };

  const handleEditGift = async (giftId: string, data: Partial<Gift>) => {
    try {
      const giftRef = doc(db, 'events', eventId, 'gifts', giftId);
      await updateDoc(giftRef, data);
      toast.success('Regalo actualizado.');
    } catch (e) {
      console.error(e);
      toast.error('Error al actualizar el regalo.');
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    try {
      const giftRef = doc(db, 'events', eventId, 'gifts', giftId);
      await deleteDoc(giftRef);
      toast.success('Regalo eliminado.');
    } catch (e) {
      console.error(e);
      toast.error('Error al eliminar el regalo.');
    }
  };

  // Anulación Atómica de Claim: devuelve las unidades al regalo en una transacción
  const handleCancelClaim = async (claim: Claim) => {
    if (!confirm(`¿Deseas anular el regalo de "${claim.guestName}" (${claim.quantity}× ${claim.giftName})? Las unidades volverán a estar disponibles en la lista pública.`)) {
      return;
    }

    setIsCancelling(true);
    try {
      await runTransaction(db, async (transaction) => {
        const giftRef = doc(db, 'events', eventId, 'gifts', claim.giftId);
        const claimRef = doc(db, 'events', eventId, 'claims', claim.id);

        const giftSnap = await transaction.get(giftRef);
        if (giftSnap.exists()) {
          const currentRemaining = giftSnap.data().quantityRemaining || 0;
          const newRemaining = currentRemaining + claim.quantity;
          transaction.update(giftRef, { quantityRemaining: newRemaining });
        }

        // Eliminar el claim
        transaction.delete(claimRef);
      });

      toast.success(`Regalo de ${claim.guestName} anulado. Unidades restablecidas con éxito.`);
    } catch (e) {
      console.error(e);
      toast.error('Hubo un error al anular el regalo.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleUpdateEvent = async (data: Partial<BabyShowerEvent>) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, data);
      toast.success('Configuración del Baby Shower guardada 💛');
    } catch (e) {
      console.error(e);
      toast.error('Error al guardar la configuración.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-theme-muted">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg pb-16">
      <AdminHeader event={event} onLogout={logout} />

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* KPIs Resumen con Anillo animado */}
        <KpiCards
          totalRequested={totalRequested}
          totalClaimed={totalClaimed}
          totalRemaining={totalRemaining}
          uniqueGuestsCount={uniqueGuestsCount}
        />

        {/* Lista y Gestión de Regalos */}
        <GiftManager
          gifts={gifts}
          claims={claims}
          onAddGift={handleAddGift}
          onEditGift={handleEditGift}
          onDeleteGift={handleDeleteGift}
        />

        {/* Vista por Invitado (tarjetas de agradecimiento y exportación CSV) */}
        <GuestList claims={claims} />

        {/* Feed de Actividad reciente */}
        <div className="mb-8">
          <ClaimsFeed
            claims={claims}
            onCancelClaim={handleCancelClaim}
            isCancelling={isCancelling}
          />
        </div>

        {/* Configuración del Evento y Tema de color */}
        {event && (
          <EventSettings event={event} onUpdateEvent={handleUpdateEvent} />
        )}
      </main>
    </div>
  );
};

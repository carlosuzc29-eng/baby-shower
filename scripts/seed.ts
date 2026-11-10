import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Configuración leída de entorno o predeterminada
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "baby-shower-demo.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "baby-shower-demo",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "baby-shower-demo.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const EVENT_ID = "evento-baby-shower-demo";

// Lista exacta de 20 regalos solicitada por el usuario con cantidades e imágenes en miniatura
export const GIFTS_LIST = [
  {
    id: "termometro",
    name: "TERMOMETRO",
    description: "Termómetro digital para bebé, lectura rápida y precisa.",
    category: "Otros" as const,
    imageUrl: "/images/gifts/termometro.jpg",
    quantityRequested: 1,
    quantityRemaining: 1,
    order: 1,
  },
  {
    id: "aspirador-nasal",
    name: "ASPIRADOR NASAL",
    description: "Aspirador nasal suave de silicona para despejar la naricita del bebé.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/aspirador_nasal.jpg",
    quantityRequested: 1,
    quantityRemaining: 1,
    order: 2,
  },
  {
    id: "banera",
    name: "BAÑERA",
    description: "Bañera ergonómica y segura con soporte para recién nacido.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/banera.jpg",
    quantityRequested: 1,
    quantityRemaining: 1,
    order: 3,
  },
  {
    id: "termo-termico",
    name: "TERMO TERMICO",
    description: "Termo térmico para mantener el agua tibia de sus alimentos y tomas.",
    category: "Alimentación" as const,
    imageUrl: "/images/gifts/termo.jpg",
    quantityRequested: 1,
    quantityRemaining: 1,
    order: 4,
  },
  {
    id: "teteros",
    name: "TETEROS",
    description: "Biberones anticólicos con tetina de silicona ultrasuave.",
    category: "Alimentación" as const,
    imageUrl: "/images/gifts/teteros.jpg",
    quantityRequested: 4,
    quantityRemaining: 4,
    order: 5,
  },
  {
    id: "cobija",
    name: "COBIJA",
    description: "Cobija suave y abrigadita de algodón para sus horas de sueño.",
    category: "Habitación" as const,
    imageUrl: "/images/gifts/cobija.jpg",
    quantityRequested: 2,
    quantityRemaining: 2,
    order: 6,
  },
  {
    id: "almohaditas",
    name: "ALMOHADITAS",
    description: "Almohaditas anatómicas para el cuidado de la cabecita del bebé.",
    category: "Habitación" as const,
    imageUrl: "/images/gifts/almohaditas.jpg",
    quantityRequested: 2,
    quantityRemaining: 2,
    order: 7,
  },
  {
    id: "baberos",
    name: "BABEROS",
    description: "Baberos impermeables fáciles de limpiar y suaves al cuello.",
    category: "Alimentación" as const,
    imageUrl: "/images/gifts/baberos.jpg",
    quantityRequested: 5,
    quantityRemaining: 5,
    order: 8,
  },
  {
    id: "monitos-6-12",
    name: "MONITOS DE 6 A 12",
    description: "Monitos / enterizos cómodos para etapa de 6 a 12 meses.",
    category: "Ropa" as const,
    imageUrl: "/images/gifts/monitos_6_12.jpg",
    quantityRequested: 20,
    quantityRemaining: 20,
    order: 9,
  },
  {
    id: "monitos-3-6",
    name: "MONITOS DE 3 A 6",
    description: "Monitos / enterizos suaves de algodón para etapa de 3 a 6 meses.",
    category: "Ropa" as const,
    imageUrl: "/images/gifts/monitos_3_6.jpg",
    quantityRequested: 20,
    quantityRemaining: 20,
    order: 10,
  },
  {
    id: "medias",
    name: "MEDIAS",
    description: "Par de medias antideslizantes y calentitas para sus piececitos.",
    category: "Ropa" as const,
    imageUrl: "/images/gifts/medias.jpg",
    quantityRequested: 20,
    quantityRemaining: 20,
    order: 11,
  },
  {
    id: "bodys",
    name: "BODYS",
    description: "Bodys de algodón manga corta o larga, básicos imprescindibles.",
    category: "Ropa" as const,
    imageUrl: "/images/gifts/bodys.jpg",
    quantityRequested: 20,
    quantityRemaining: 20,
    order: 12,
  },
  {
    id: "toallas-bano",
    name: "TOALLAS DE BAÑO",
    description: "Toallitas con capucha suaves y absorbentes para la salida del baño.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/toallas.jpg",
    quantityRequested: 3,
    quantityRemaining: 3,
    order: 13,
  },
  {
    id: "conjuntos-ropita",
    name: "CONJUNTOS DE ROPITA",
    description: "Conjuntos de pantalón y camiseta/chaquetica para salir de paseo.",
    category: "Ropa" as const,
    imageUrl: "/images/gifts/conjuntos.jpg",
    quantityRequested: 20,
    quantityRemaining: 20,
    order: 14,
  },
  {
    id: "gorros",
    name: "GORROS",
    description: "Gorritos de algodón elásticos para mantener calentita su cabecita.",
    category: "Ropa" as const,
    imageUrl: "/images/gifts/gorros.jpg",
    quantityRequested: 20,
    quantityRemaining: 20,
    order: 15,
  },
  {
    id: "rasca-encias",
    name: "RASCA ENCIAS",
    description: "Mordedor de silicona alimentaria para calmar las encías en dentición.",
    category: "Otros" as const,
    imageUrl: "/images/gifts/rasca_encias.jpg",
    quantityRequested: 3,
    quantityRemaining: 3,
    order: 16,
  },
  {
    id: "gel-bano",
    name: "GEL DE BAÑO",
    description: "Gel de baño hipoalergénico especial para piel delicada de bebé.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/gel_bano.jpg",
    quantityRequested: 3,
    quantityRemaining: 3,
    order: 17,
  },
  {
    id: "crema-corporal",
    name: "CREMA CORPORAL",
    description: "Crema hidratante nutritiva y suave para después del baño.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/crema_corporal.jpg",
    quantityRequested: 3,
    quantityRemaining: 3,
    order: 18,
  },
  {
    id: "panales-talla-m",
    name: "PAÑALES TALLA M EN ADELANTE",
    description: "Paquetes de pañales desechables talla M en adelante.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/panales.jpg",
    quantityRequested: 10,
    quantityRemaining: 10,
    order: 19,
  },
  {
    id: "shampu",
    name: "SHAMPU",
    description: "Shampoo suave sin lágrimas con extracto natural de manzanilla.",
    category: "Pañales y aseo" as const,
    imageUrl: "/images/gifts/shampu.jpg",
    quantityRequested: 3,
    quantityRemaining: 3,
    order: 20,
  }
];

async function seedDatabase() {
  console.log("🌱 Iniciando script de siembra (seed) con la lista exacta de regalos...");

  // 1. Crear documento del Evento
  const eventRef = doc(db, "events", EVENT_ID);
  await setDoc(eventRef, {
    babyName: "Bebé en camino",
    parentsNames: "Alejandro y Valentina",
    date: "Domingo 15 de Noviembre · 2:30 PM",
    location: "Reunión Familiar de Baby Shower",
    locationUrl: "https://maps.app.goo.gl/8Zq5jnmNza4u2ZMD9",
    welcomeMessage: "¡Nos llena de alegría celebrar la llegada de nuestro bebé contigo! Gracias por acompañarnos y elegir con tanto amor un detalle especial de nuestra lista de regalos.",
    theme: "dragonball",
    coverImageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    ownerUid: "ADMIN_OWNER_UID_PLACEHOLDER",
    createdAt: serverTimestamp(),
  });
  console.log(`✅ Evento creado en /events/${EVENT_ID}`);

  // 2. Crear los 20 regalos en la subcolección /events/{EVENT_ID}/gifts
  for (const gift of GIFTS_LIST) {
    const giftRef = doc(db, "events", EVENT_ID, "gifts", gift.id);
    await setDoc(giftRef, {
      ...gift,
      createdAt: serverTimestamp(),
    });
    console.log(`   🎁 [${gift.order}/20] ${gift.name} -> ${gift.quantityRequested} unidades (Imagen: ${gift.imageUrl})`);
  }

  console.log("\n🎉 ¡Sembrado completado con éxito! Los 20 regalos con sus miniaturas han sido cargados.");
}

seedDatabase().catch((err) => {
  console.error("❌ Error sembrando datos:", err);
});

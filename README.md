# 🍼 Lista de Regalos para Baby Shower (Web App)

Web app mobile-first, cálida, accesible y elegante para que los invitados de un baby shower elijan regalos fácilmente y los futuros papás administren la lista en tiempo real.

---

## ✨ Características Principales

- **Mobile-First & Ultra Fácil:** Diseñada para que abuelas, tíos y amigos entiendan cada pantalla en 3 segundos.
- **Descuento Atómico (`runTransaction`):** Si dos invitados intentan apartar la última unidad a la vez, solo uno lo logra y al otro se le informa con cariño.
- **Desaparición con Animación:** Al llegar a 0 unidades restantes, el regalo sale con una suave transición `AnimatePresence` y la cuadrícula se reacomoda fluidamente.
- **Sin cuentas para invitados:** Solo colocan su nombre (mínimo 2 caracteres), el cual se recuerda de forma segura en `localStorage`.
- **100% Plan Gratuito Spark de Firebase:**
  - Base de datos: **Cloud Firestore**.
  - Autenticación: **Firebase Auth** (email/password) solo para el panel de los papás.
  - Hospedaje: **Firebase Hosting**.
  - **Sin Firebase Storage ni Cloud Functions** (las imágenes usan URLs externas con respaldo visual automático de iconos por categoría).
- **Diseño Tierno y Personalizable:**
  - Tipografías: **Fraunces** (títulos elegantes y cálidos) + **Nunito** (lectura suave).
  - 3 temas de color dinámicos: **Neutro** (crema, salvia, arena), **Rosa** y **Azul**.
  - Microinteracciones ágiles (escala en `:active`, curvas `--ease-out`, `@number-flow/react`, `sonner`, `@base-ui-components/react`).

---

## 🚀 Guía de Puesta en Marcha (Paso a Paso)

### 1. Crear el proyecto en Firebase (Plan Spark Gratuito)
1. Ve a la [Consola de Firebase](https://console.firebase.google.com/) y haz clic en **"Agregar proyecto"**.
2. Asigna un nombre al proyecto (ej. `mi-baby-shower-2026`).
3. Desactiva Google Analytics si deseas simplificar la configuración.
4. Asegúrate de mantener el plan en **Spark (Gratis)**.

### 2. Activar Cloud Firestore
1. En el menú lateral izquierdo, ve a **Compilación > Firestore Database**.
2. Haz clic en **Crear base de datos**.
3. Selecciona la ubicación más cercana (ej. `us-central1` o `southamerica-east1`).
4. Inicia en **Modo producción** (las reglas de seguridad las subiremos desde el proyecto).

### 3. Activar Firebase Authentication
1. En el menú lateral izquierdo, ve a **Compilación > Authentication**.
2. Haz clic en **Comenzar**.
3. En la pestaña **Método de acceso (Sign-in method)**, activa **Correo electrónico/Contraseña** y guarda.
4. En la pestaña **Users (Usuarios)**, haz clic en **Agregar usuario** y crea el correo y contraseña que usarán los papás para administrar el baby shower (ej. `papas@babyshower.com` / `TuClaveSegura123`). Copia el `UID` generado para ese usuario.

### 4. Registrar la Web App en Firebase
1. En la página principal de la consola de Firebase, haz clic en el ícono web `</>` para registrar una aplicación.
2. Nómbrala `Baby Shower Web`.
3. Firebase te mostrará el bloque `firebaseConfig` con:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 5. Configurar el archivo `.env` en tu computadora
Crea un archivo `.env` en la raíz del proyecto copiando `.env.example`:
```bash
cp .env.example .env
```
Pega allí las claves obtenidas en el paso anterior:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:...
```

---

## 📦 Sembrar Datos de Prueba (`seed`)

Para cargar un evento de demostración completo con **12 regalos realistas** (pañales etapa 1 y 2, toallitas, bodies, mamelucos, biberones, cobija, bañera, fular, lámpara, etc.):

1. Abre el archivo `scripts/seed.ts` y reemplaza `"ADMIN_OWNER_UID_PLACEHOLDER"` por el UID del usuario admin que creaste en el paso 3.
2. Ejecuta:
```bash
npm run seed
```

---

## 💻 Desarrollo Local

Para iniciar el servidor de desarrollo rápido:
```bash
npm run dev
```
- **Vista pública del invitado:** `http://localhost:5173/e/evento-baby-shower-demo`
- **Panel privado de los papás:** `http://localhost:5173/admin`

---

## 🔒 Desplegar Reglas de Seguridad y Sitio a Producción

1. Instala Firebase CLI si no lo tienes globalmente:
```bash
npx -y firebase-tools@latest login
```
2. Asocia tu proyecto:
```bash
npx -y firebase-tools@latest use --add
```
(Selecciona tu proyecto recién creado).

3. Despliega las reglas de Firestore y el frontend compilado:
```bash
npm run build
npx -y firebase-tools@latest deploy
```

¡Listo! Firebase te entregará la URL pública (ejemplo: `https://tu-proyecto.web.app/e/evento-baby-shower-demo`) lista para compartir en WhatsApp.

import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';
import { GuestViewPage } from './pages/GuestViewPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listener para sincronizar navegación sencilla sin recargar página
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Extraer eventId si la URL es /e/:eventId o por defecto el id del evento principal
  const defaultEventId = 'evento-baby-shower-demo';
  let eventId = defaultEventId;

  if (currentPath.startsWith('/e/')) {
    const parts = currentPath.split('/');
    if (parts[2]) {
      eventId = parts[2];
    }
  }

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#22354A',
            color: '#FFFFFF',
            border: '1px solid #334A65',
            borderRadius: '1.25rem',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.875rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          },
        }}
      />

      {/* Enrutamiento amigable */}
      {currentPath.startsWith('/admin') ? (
        isAdminAuthenticated ? (
          <AdminDashboardPage eventId={eventId} />
        ) : (
          <AdminLoginPage onSuccess={() => navigateTo('/admin')} />
        )
      ) : currentPath.startsWith('/login') ? (
        <AdminLoginPage onSuccess={() => navigateTo('/admin')} />
      ) : (
        <GuestViewPage eventId={eventId} />
      )}
    </>
  );
};

export default App;

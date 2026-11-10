import { useState } from 'react';

const STORAGE_KEY = 'baby_shower_guest_name';

export function useGuestName() {
  const [guestName, setGuestNameState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch (e) {
      console.warn('LocalStorage no disponible:', e);
      return '';
    }
  });

  const setGuestName = (name: string) => {
    setGuestNameState(name);
    try {
      localStorage.setItem(STORAGE_KEY, name.trim());
    } catch (e) {
      console.warn('Error al guardar en LocalStorage:', e);
    }
  };

  return { guestName, setGuestName };
}

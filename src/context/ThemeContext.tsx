import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeColor } from '../types';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dragonball',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode; defaultTheme?: ThemeColor }> = ({
  children,
  defaultTheme = 'dragonball',
}) => {
  const [theme, setTheme] = useState<ThemeColor>(defaultTheme);

  useEffect(() => {
    // Aplica el atributo data-theme en el documento raíz para actualizar los tokens CSS
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

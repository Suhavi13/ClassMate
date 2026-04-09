// Provides light/dark theme colors based on the signed-in user setting.
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import { useAuth } from '../auth/AuthProvider';
import { darkTheme, lightTheme, type ThemeColors } from './theme';

type ThemeContextValue = {
  colors: ThemeColors;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const { state, actions } = useAuth();
  const darkMode = Boolean(state.user?.darkMode);
  const colors = darkMode ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      darkMode,
      setDarkMode: (enabled) => {
        actions.setDarkMode(enabled).catch(() => {});
      },
    }),
    [actions, colors, darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

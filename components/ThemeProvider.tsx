"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { lightTheme, darkTheme } from "@/styles/theme";
import { ThemeMode, ThemeContextValue } from "@/types/theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    // Add smooth transition for theme changes
    document.documentElement.style.setProperty(
      "transition",
      "background-color 0.3s ease, color 0.3s ease",
    );

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;

    if (savedTheme) {
      setMode(savedTheme);
    } else {
      // Detect system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setMode(mediaQuery.matches ? "dark" : "light");

      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent): void => {
        // Only update if user hasn't set a manual preference
        if (!localStorage.getItem("theme")) {
          setMode(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const toggleTheme = (): void => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  const theme = mode === "light" ? lightTheme : darkTheme;

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      mode,
      toggleTheme,
    }),
    [theme, mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

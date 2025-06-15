"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "light" | "dark" | "auto";
export type FontSize = "small" | "medium" | "large" | "extra-large";

interface AppearanceSettings {
  theme: Theme;
  fontSize: FontSize;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateTheme: (theme: Theme) => void;
  updateFontSize: (fontSize: FontSize) => void;
  updateSettings: (settings: Partial<AppearanceSettings>) => void;
  resolvedTheme: "light" | "dark"; // The actual theme being used (resolves 'auto')
}

const defaultSettings: AppearanceSettings = {
  theme: "light",
  fontSize: "medium",
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined
);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appearance-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load appearance settings:", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("appearance-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save appearance settings:", error);
    }
  }, [settings]);

  // Handle system theme detection and resolved theme calculation
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (settings.theme === "auto") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setResolvedTheme(prefersDark ? "dark" : "light");
      } else {
        setResolvedTheme(settings.theme);
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateResolvedTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateResolvedTheme);
    };
  }, [settings.theme]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Apply font size class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      "font-small",
      "font-medium",
      "font-large",
      "font-extra-large"
    );
    root.classList.add(`font-${settings.fontSize}`);
  }, [settings.fontSize]);

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const updateFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const updateSettings = (newSettings: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const value: AppearanceContextType = {
    settings,
    updateTheme,
    updateFontSize,
    updateSettings,
    resolvedTheme,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}

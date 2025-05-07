"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface ElectronContextType {
  isElectron: boolean;
  isLoading: boolean;
}

const ElectronContext = createContext<ElectronContextType>({
  isElectron: false,
  isLoading: true,
});

export const useElectron = () => useContext(ElectronContext);

// Simple props type
type Props = {
  children: any;
};

export default function ElectronProvider({ children }: Props) {
  const [state, setState] = useState<ElectronContextType>({
    isElectron: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if we're in Electron
    const hasWindow = typeof window !== "undefined";
    const hasElectronProperty = hasWindow && "electron" in window;
    const electronValue =
      hasWindow && hasElectronProperty ? (window as any).electron : null;
    const isElectron = Boolean(electronValue);

    setState({
      isElectron,
      isLoading: false,
    });
  }, []);

  return (
    <ElectronContext.Provider value={state}>
      {state.isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading application...</h2>
            <p className="text-gray-500">
              Please wait while we initialize the environment
            </p>
          </div>
        </div>
      ) : (
        <>
          {!state.isElectron && (
            <div className="bg-amber-100 p-4 text-amber-800 text-sm">
              <strong>Note:</strong> This application is designed to run as a
              desktop app with local data storage. Some features may not be
              available when running in a browser environment.
            </div>
          )}
          {children}
        </>
      )}
    </ElectronContext.Provider>
  );
}

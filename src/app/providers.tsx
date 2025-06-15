"use client";

import ElectronProvider from "@/components/ElectronProvider";
import { AppearanceProvider } from "@/stores/AppearanceContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ElectronProvider>
      <AppearanceProvider>{children}</AppearanceProvider>
    </ElectronProvider>
  );
}

'use client'

import ElectronProvider from "@/components/ElectronProvider";
import { HeroUIProvider } from "@heroui/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ElectronProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </ElectronProvider>
  );
}
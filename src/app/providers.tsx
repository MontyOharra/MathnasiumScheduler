'use client'

import ElectronProvider from "@/components/ElectronProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ElectronProvider>
      {children}
    </ElectronProvider>
  );
}
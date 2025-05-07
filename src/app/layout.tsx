import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ElectronProvider from "@/components/ElectronProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mathnasium Scheduler",
  description: "A scheduling application for Mathnasium centers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ElectronProvider>
          <div className="flex h-screen">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </ElectronProvider>
      </body>
    </html>
  );
}

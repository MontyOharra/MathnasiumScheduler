"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNavigation = [
  {
    name: "Appearance",
    href: "/dashboard/settings/appearance",
    description: "Customize the look and feel of your application",
  },
  {
    name: "Scheduling",
    href: "/dashboard/settings/scheduling",
    description: "Configure scheduling preferences and rules",
  },
  {
    name: "Center Settings",
    href: "/dashboard/settings/center",
    description: "Manage center-specific configurations",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Settings Navigation Header */}
      <div className="border-b border-border bg-white">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Settings
          </h1>
          <nav className="flex space-x-8">
            {settingsNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname === "/dashboard/settings" &&
                  item.href === "/dashboard/settings/appearance");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "pb-2 border-b-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

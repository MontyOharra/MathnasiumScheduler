"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Schedules", href: "/dashboard/schedules" },
  { name: "Students", href: "/dashboard/students" },
  { name: "Instructors", href: "/dashboard/instructors" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full w-64 bg-background border-r border-border">
      <div className="flex h-16 items-center px-4 border-b border-border">
        <h1 className="text-xl text-primary font-semibold">
          Mathnasium Scheduler
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-primary-light text-text"
                  : "text-text-muted hover:bg-primary-light hover:text-text"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

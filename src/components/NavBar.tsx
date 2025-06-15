"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Users,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Schedules",
    href: "/dashboard/schedules",
    icon: Calendar,
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    name: "Instructors",
    href: "/dashboard/instructors",
    icon: GraduationCap,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const COLLAPSE_BREAKPOINT = 1024; // px

export default function NavBar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAutoCollapsed, setIsAutoCollapsed] = useState(false);

  // Handle window resize and auto-collapse
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Clear existing timeout
      clearTimeout(timeoutId);

      // Debounce the resize handler
      timeoutId = setTimeout(() => {
        const windowWidth = window.innerWidth;

        if (windowWidth < COLLAPSE_BREAKPOINT) {
          // Auto-collapse when window is too narrow
          if (!isAutoCollapsed) {
            setIsExpanded(false);
            setIsAutoCollapsed(true);
          }
        } else {
          // Allow expansion when window is wide enough
          if (isAutoCollapsed) {
            setIsExpanded(true);
            setIsAutoCollapsed(false);
          }
        }
      }, 150); // 150ms debounce
    };

    // Check initial window size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [isAutoCollapsed]);

  const toggleExpanded = () => {
    // Don't allow manual toggle when auto-collapsed
    if (isAutoCollapsed) return;

    setIsExpanded(!isExpanded);
  };

  return (
    <nav
      className={cn(
        "flex flex-col h-full bg-background border-r border-border transition-all duration-300 ease-in-out select-none overflow-x-hidden",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center px-4 border-b border-border overflow-x-hidden">
        {isExpanded && (
          <h1 className="text-lg text-red-600 font-medium truncate select-none">
            Mathnasium Scheduler
          </h1>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-modern-thin py-4">
        <div className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            // Fix: Use startsWith for better route matching
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                draggable={false}
                className={cn(
                  "nav-item flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative group select-none",
                  isActive && "active",
                  !isExpanded && "justify-center px-2"
                )}
                title={!isExpanded ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-current"
                  )}
                />

                {isExpanded && (
                  <span className="truncate select-none">{item.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 select-none">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer with collapse button */}
      <div className="p-4 border-t border-border overflow-x-hidden">
        <div
          className={cn("flex", isExpanded ? "justify-end" : "justify-center")}
        >
          {!isExpanded && isAutoCollapsed ? (
            <div className="flex flex-col items-center gap-1">
              <Menu className="h-4 w-4 text-gray-400 select-none" />
              <div
                className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                title="Auto-collapsed due to window size"
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              disabled={isAutoCollapsed}
              className={cn(
                "p-2 hover:bg-accent select-none transition-opacity",
                isAutoCollapsed && "opacity-50 cursor-not-allowed"
              )}
              draggable={false}
              title={
                isAutoCollapsed
                  ? "Expand disabled - window too narrow"
                  : isExpanded
                  ? "Collapse sidebar"
                  : "Expand sidebar"
              }
            >
              {isExpanded ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

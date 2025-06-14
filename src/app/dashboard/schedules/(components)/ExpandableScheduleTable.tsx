"use client";

import { WeeklySchedule } from "@/types/main";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import WeeklyScheduleTable from "./WeeklyScheduleTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandableScheduleTableProps {
  title: string;
  weeklySchedules: WeeklySchedule[];
  onEdit: (weeklySchedule: WeeklySchedule) => void;
  onPrint: (weeklySchedule: WeeklySchedule) => void;
  onDelete: (weeklySchedule: WeeklySchedule) => void;
}

export default function ExpandableScheduleTable({
  title,
  weeklySchedules,
  onEdit,
  onPrint,
  onDelete,
}: ExpandableScheduleTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-t-lg border border-gray-200 hover:bg-red-50 transition-colors"
      >
        <h2 className="text-lg font-semibold text-red-500">{title}</h2>
        <ChevronDownIcon
          className={cn(
            "h-5 w-5 text-red-500 transition-transform duration-200",
            isExpanded ? "rotate-0" : "-rotate-90"
          )}
        />
      </Button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-[2000px]" : "max-h-0"
        )}
      >
        <WeeklyScheduleTable
          weeklySchedules={weeklySchedules}
          onEdit={onEdit}
          onPrint={onPrint}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

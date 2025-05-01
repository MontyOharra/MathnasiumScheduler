"use client";

import { Schedule } from "@/types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import SchedulesTable from "./SchedulesTable";

interface ExpandableScheduleTableProps {
  title: string;
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onPrint: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export default function ExpandableScheduleTable({
  title,
  schedules,
  onEdit,
  onPrint,
  onDelete,
}: ExpandableScheduleTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-t-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-lg font-semibold text-red-500">{title}</h2>
        <ChevronDownIcon
          className={`h-5 w-5 text-red-500 transition-transform duration-200 ${
            isExpanded ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <SchedulesTable
          schedules={schedules}
          onEdit={onEdit}
          onPrint={onPrint}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

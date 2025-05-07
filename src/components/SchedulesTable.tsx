"use client";

import { Schedule } from "@/types/main";
import { format } from "date-fns";
import {
  PencilIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface SchedulesTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onPrint: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export default function SchedulesTable({
  schedules,
  onEdit,
  onPrint,
  onDelete,
}: SchedulesTableProps) {
  const formatDate = (date: Date) => {
    return format(date, "EEE, MM/dd/yy");
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Template
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Last Edited
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Added By
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(schedule.scheduleDate)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {0}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(schedule.dateLastModified)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {schedule.addedBy.firstName} {schedule.addedBy.lastName}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(schedule)}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onPrint(schedule)}
                    className="text-gray-900 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50"
                    title="Print"
                  >
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(schedule)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

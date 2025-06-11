"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WeeklySchedule } from "@/types/main";
import WeeklyScheduleTableRow from "./WeeklyScheduleTableRow";
import { WeeklyScheduleModal } from "./WeeklyScheduleModal";
import { useState } from "react";

interface WeeklyScheduleTableProps {
  weeklySchedules: WeeklySchedule[];
  onEdit: (weeklySchedule: WeeklySchedule) => void;
  onPrint: (weeklySchedule: WeeklySchedule) => void;
  onDelete: (weeklySchedule: WeeklySchedule) => void;
}

const columnClasses = {
  date: "w-[30%]",
  lastModified: "w-[30%]",
  actions: "w-[40%]",
};

export default function WeeklyScheduleTable({
  weeklySchedules,
  onEdit,
  onPrint,
  onDelete,
}: WeeklyScheduleTableProps) {
  const [selectedSchedule, setSelectedSchedule] =
    useState<WeeklySchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (weeklySchedule: WeeklySchedule) => {
    setSelectedSchedule(weeklySchedule);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={columnClasses.date}>
              Week Start Date
            </TableHead>
            <TableHead className={columnClasses.lastModified}>
              Last Modified
            </TableHead>
            <TableHead className={`${columnClasses.actions} text-right`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeklySchedules.map((weeklySchedule) => (
            <WeeklyScheduleTableRow
              key={weeklySchedule.id}
              weeklySchedule={weeklySchedule}
              onEdit={handleEdit}
              onPrint={onPrint}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>

      {selectedSchedule && (
        <WeeklyScheduleModal
          weeklySchedule={selectedSchedule}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

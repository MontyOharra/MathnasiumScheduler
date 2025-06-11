"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WeeklySchedule } from "@/types/main";
import WeeklyScheduleTableRow from "./WeeklyScheduleTableRow";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={columnClasses.date}>Week Start Date</TableHead>
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
            onEdit={onEdit}
            onPrint={onPrint}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}

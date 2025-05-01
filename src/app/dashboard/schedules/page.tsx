"use client";

import NewScheduleButton from "@/components/NewScheduleButton";
import ExpandableScheduleTable from "@/components/ExpandableScheduleTable";
import { schedules } from "@/data/schedules";
import { format } from "date-fns";

export default function SchedulesPage() {
  const handleEdit = (schedule: any) => {
    console.log("Edit schedule:", schedule);
    // TODO: Implement edit functionality
  };

  const handlePrint = (schedule: any) => {
    console.log("Print schedule:", schedule);
    // TODO: Implement print functionality
  };

  const handleDelete = (schedule: any) => {
    console.log("Delete schedule:", schedule);
    // TODO: Implement delete functionality
  };

  // Filter schedules by date
  const today = new Date();
  const pastSchedules = schedules.filter(
    (schedule) => schedule.scheduleDate < today
  );
  const upcomingSchedules = schedules.filter(
    (schedule) => schedule.scheduleDate >= today
  );

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text">Schedules</h1>
        <NewScheduleButton />
      </div>
      <div className="space-y-6">
        <ExpandableScheduleTable
          title="Upcoming Schedules"
          schedules={upcomingSchedules}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onDelete={handleDelete}
        />
        <ExpandableScheduleTable
          title="Past Schedules"
          schedules={pastSchedules}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

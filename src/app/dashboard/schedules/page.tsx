"use client";

import NewScheduleButton from "@/components/NewScheduleButton";
import ExpandableScheduleTable from "@/components/ExpandableScheduleTable";
import { schedules } from "@/data/schedules";
import { Schedule } from "@/types/main";
import { useState, useEffect } from "react";

export default function SchedulesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [schedulesData, setSchedulesData] = useState<Schedule[]>([]);

  useEffect(() => {
    // In a real app, you would fetch data from your API or database
    // For now, just use the mock data
    setSchedulesData(schedules || []);
    setIsLoaded(true);
  }, []);

  const handleEdit = (schedule: Schedule) => {
    console.log("Edit schedule:", schedule);
    // TODO: Implement edit functionality
  };

  const handlePrint = (schedule: Schedule) => {
    console.log("Print schedule:", schedule);
    // TODO: Implement print functionality
  };

  const handleDelete = (schedule: Schedule) => {
    console.log("Delete schedule:", schedule);
    // TODO: Implement delete functionality
  };

  // Filter schedules by date
  const today = new Date();
  const pastSchedules = schedulesData.filter(
    (schedule: Schedule) => new Date(schedule.scheduleDate) < today
  );
  const upcomingSchedules = schedulesData.filter(
    (schedule: Schedule) => new Date(schedule.scheduleDate) >= today
  );

  if (!isLoaded) {
    return <div>Loading schedules...</div>;
  }

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

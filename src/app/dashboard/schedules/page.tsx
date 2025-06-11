"use client";

import NewScheduleButton from "@/app/dashboard/schedules/(components)/NewScheduleButton";
import ExpandableScheduleTable from "@/app/dashboard/schedules/(components)/ExpandableScheduleTable";
import { Schedule, WeeklySchedule } from "@/types/main";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dbService from "@/lib/db-service";
import { useElectron } from "@/components/ElectronProvider";

export default function SchedulesPage() {
  const router = useRouter();
  const { isElectron } = useElectron();
  const [isLoaded, setIsLoaded] = useState(false);
  const [weeklySchedulesData, setWeeklySchedulesData] = useState<WeeklySchedule[]>([]);

  const fetchSchedules = async () => {
    try {
      const weeklySchedules = await dbService.getWeeklySchedulesByCenterId(1);
      setWeeklySchedulesData(weeklySchedules || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setWeeklySchedulesData([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleEdit = (weeklySchedule: WeeklySchedule) => {
    console.log("Edit schedule:", weeklySchedule);
    router.push(`/dashboard/schedules/${weeklySchedule.id}/edit`);
  };

  const handlePrint = (weeklySchedule: WeeklySchedule) => {
    console.log("Print schedule:", weeklySchedule);
    // TODO: Implement print functionality
  };

  const handleDelete = (weeklySchedule: WeeklySchedule) => {
    console.log("Delete schedule:", weeklySchedule);
    // TODO: Implement delete functionality
  };

  // Filter schedules by date
  const today = new Date();
  const pastSchedules = weeklySchedulesData.filter(
    (weeklySchedule: WeeklySchedule) => new Date(weeklySchedule.weekStartDate) < today
  );
  const upcomingSchedules = weeklySchedulesData.filter(
    (weeklySchedule: WeeklySchedule) => new Date(weeklySchedule.weekStartDate) >= today
  );

  if (!isLoaded) {
    return <div>Loading schedules...</div>;
  }

  if (!isElectron) {
    return (
      <div className="w-full max-w-full">
        <div className="flex flex-row items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-text">Schedules</h1>
        </div>
        <div className="bg-amber-100 p-4 text-amber-800 rounded-md">
          <p>This feature requires the desktop application to be running.</p>
          <p>
            Please launch the application using Electron to access schedules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text">Schedules</h1>
        <NewScheduleButton onScheduleCreated={fetchSchedules} />
      </div>
      <div className="space-y-6">
        <ExpandableScheduleTable
          title="Upcoming Schedules"
          weeklySchedules={upcomingSchedules}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onDelete={handleDelete}
        />
        <ExpandableScheduleTable
          title="Past Schedules"
          weeklySchedules={pastSchedules}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

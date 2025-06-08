"use client";

import NewScheduleButton from "@/components/NewScheduleButton";
import ExpandableScheduleTable from "@/components/ExpandableScheduleTable";
import { Schedule } from "@/types/main";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dbService from "@/lib/db-service";
import { useElectron } from "@/components/ElectronProvider";

export default function SchedulesPage() {
  const router = useRouter();
  const { isElectron } = useElectron();
  const [isLoaded, setIsLoaded] = useState(false);
  const [schedulesData, setSchedulesData] = useState<Schedule[]>([]);

  const fetchSchedules = async () => {
    try {
      const schedules = await dbService.getSchedulesByCenterId(1);
      setSchedulesData(schedules || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedulesData([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleEdit = (schedule: Schedule) => {
    console.log("Edit schedule:", schedule);
    router.push(`/dashboard/schedules/${schedule.id}/edit`);
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

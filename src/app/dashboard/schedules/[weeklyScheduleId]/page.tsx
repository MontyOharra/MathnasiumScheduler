"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import { Schedule } from "../(components)/Schedule";
import dbService from "@/lib/db-service";
import { Schedule as ScheduleType } from "@/types/main";

export default function WeeklySchedulePage() {
  const params = useParams();
  const weeklyScheduleId = parseInt(params.weeklyScheduleId as string);

  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [templateConfig, setTemplateConfig] = useState<
    Record<
      number,
      {
        startTime: string;
        endTime: string;
        numPods: number;
        intervalLength: number;
      }
    >
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch schedules
        const schedulesData = await dbService.getSchedulesByWeeklyScheduleId(
          weeklyScheduleId
        );
        setSchedules(schedulesData);

        // Fetch weekly schedule to get template ID
        const weeklyScheduleData = await dbService.getScheduleWithDetails(
          weeklyScheduleId,
          1 // TODO: Get actual center ID from context
        );

        // Fetch template configuration for each unique weekday
        const templateConfigData: Record<
          number,
          {
            startTime: string;
            endTime: string;
            numPods: number;
            intervalLength: number;
          }
        > = {};

        const uniqueWeekdayIds = [
          ...new Set(schedulesData.map((s) => s.weekdayId)),
        ];

        for (const weekdayId of uniqueWeekdayIds) {
          const config = await dbService.getTemplateWeekdayByTemplateAndWeekday(
            weeklyScheduleData.templateId,
            weekdayId
          );
          if (config) {
            templateConfigData[weekdayId] = config;
          }
        }

        setTemplateConfig(templateConfigData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load schedule data");
      } finally {
        setIsLoading(false);
      }
    };

    if (weeklyScheduleId) {
      fetchData();
    }
  }, [weeklyScheduleId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading schedules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">No schedules found</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Weekly Schedule {weeklyScheduleId}
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
          <Download size={18} />
          Import Weekly Sessions
        </button>
      </div>

      <div className="space-y-6 w-full">
        {schedules.map((schedule) => {
          const config = templateConfig[schedule.weekdayId];
          return (
            <Schedule
              key={schedule.id}
              scheduleId={schedule.id}
              scheduleDate={
                typeof schedule.scheduleDate === "string"
                  ? new Date(schedule.scheduleDate)
                  : schedule.scheduleDate
              }
              weekdayId={schedule.weekdayId}
              numPods={config?.numPods || 0}
              startTime={config?.startTime || ""}
              endTime={config?.endTime || ""}
              intervalLength={config?.intervalLength || 30}
            />
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useParams } from "next/navigation";
import dbService from "@/lib/db-service";
import {
  WeeklyScheduleTemplate,
  WeeklyScheduleTemplateWeekday,
  Cell,
} from "@/types/main";

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

interface CellWithNames extends Cell {
  instructorFirstName: string;
  instructorLastName: string;
  studentFirstName: string;
  studentLastName: string;
}

const Schedule: React.FC = () => {
  const params = useParams();
  const scheduleId = params.scheduleId as string;
  const [scheduleData, setScheduleData] = useState<{
    template: WeeklyScheduleTemplate;
    weekday: WeeklyScheduleTemplateWeekday;
    cells: CellWithNames[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true);
        // Fetch schedule details including template info
        const scheduleDetails = await dbService.getScheduleWithDetails(
          scheduleId
        );

        // Fetch cells (assignments) for this schedule
        const cells = (await dbService.getCellsForSchedule(
          scheduleId
        )) as CellWithNames[];

        // Fetch the template
        const template = await dbService
          .getScheduleTemplates()
          .then((templates) =>
            templates.find((t) => t.id === scheduleDetails.templateId)
          );

        if (!template) {
          throw new Error("Template not found");
        }

        // Get the weekday data from the template
        const weekday = await dbService
          .customQuery<WeeklyScheduleTemplateWeekday>(
            "SELECT * FROM weekly_schedule_template_weekday WHERE template_id = ? AND weekday_id = ?",
            [template.id, new Date(scheduleDetails.scheduleDate).getDay()]
          )
          .then((weekdays) => weekdays[0]);

        if (!weekday) {
          throw new Error("Weekday data not found");
        }

        setScheduleData({
          template,
          weekday,
          cells,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleData();
    }
  }, [scheduleId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!scheduleData) {
    return <div>No schedule data found</div>;
  }

  const { weekday, cells } = scheduleData;
  const timeStart = parseTimeToMinutes(weekday.startTime);
  const timeEnd = parseTimeToMinutes(weekday.endTime);
  const timeInterval = 30;

  // Calculate number of rows based on time range and interval
  const totalMinutes = timeEnd - timeStart;
  const numRows = Math.ceil(totalMinutes / timeInterval);

  // Generate time labels for each row
  const timeLabels = Array.from({ length: numRows }, (_, i) => {
    const minutes = timeStart + i * timeInterval;
    const hours = Math.floor(minutes / 60) % 12;
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  });

  // Helper function to find cell content for a specific time and column
  const getCellContent = (time: string, columnIndex: number) => {
    const cell = cells.find(
      (c) =>
        c.timeStart.toString() === time && c.columnNumber === columnIndex + 1
    );

    if (cell) {
      return (
        <div className="p-2">
          <div className="font-bold">
            {cell.instructorFirstName} {cell.instructorLastName}
          </div>
          <div>
            {cell.studentFirstName} {cell.studentLastName}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div>Weekday, 01/01/1970</div>
        <Button>import</Button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-black">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-white p-2 text-left text-black">
                Time
              </th>
              {Array.from({ length: weekday.numColumns }, (_, i) => (
                <th
                  key={i}
                  className="border border-gray-300 bg-gray-50 p-2 text-left text-black"
                >
                  Column {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeLabels.map((time, rowIndex) => (
              <tr key={rowIndex} className="h-[100px]">
                <td className="border border-gray-300 bg-white p-2 text-black">
                  {time}
                </td>
                {Array.from({ length: weekday.numColumns }, (_, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 bg-gray-50 p-2 text-black"
                  >
                    {getCellContent(time, colIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;

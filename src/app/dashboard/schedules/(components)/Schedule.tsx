import { useEffect, useState } from "react";
import { Cell } from "@/app/dashboard/schedules/(components)/Cell";
import { format, parse, addMinutes } from "date-fns";
import dbService from "@/lib/db-service";

interface ScheduleProps {
  weeklyScheduleId: string;
  weekdayId: number;
  startTime: string;
  endTime: string;
  numColumns: number;
}

interface ScheduleData {
  id: number;
  scheduleDate: string;
  cells: {
    id: number;
    instructorId: number;
    studentId: number;
    timeStart: string;
    timeEnd: string;
    columnNumber: number;
    instructorFirstName: string;
    instructorLastName: string;
    studentFirstName: string;
    studentLastName: string;
  }[];
}

export function Schedule({
  weeklyScheduleId,
  weekdayId,
  startTime,
  endTime,
  numColumns,
}: ScheduleProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        // First get the schedule for this weekday
        const schedules = await dbService.customQuery<ScheduleData>(
          `SELECT s.id, s.schedule_date as scheduleDate
           FROM schedule s
           JOIN weekly_schedule ws ON s.weekly_schedule_id = ws.id
           WHERE ws.id = ? AND strftime('%w', s.schedule_date) = ?`,
          [weeklyScheduleId, weekdayId.toString()]
        );

        if (schedules.length === 0) {
          setIsLoading(false);
          return;
        }

        const schedule = schedules[0];

        // Then get the cells for this schedule
        const cells = await dbService.customQuery(
          `SELECT c.*, 
           i.first_name as instructor_first_name, i.last_name as instructor_last_name,
           s.first_name as student_first_name, s.last_name as student_last_name
           FROM cell c
           LEFT JOIN instructor i ON c.instructor_id = i.id
           LEFT JOIN student s ON c.student_id = s.id
           WHERE c.schedule_id = ?
           ORDER BY c.time_start, c.column_number`,
          [schedule.id]
        );

        setScheduleData({
          ...schedule,
          cells: cells.map((cell: any) => ({
            id: cell.id,
            instructorId: cell.instructor_id,
            studentId: cell.student_id,
            timeStart: cell.time_start,
            timeEnd: cell.time_end,
            columnNumber: cell.column_number,
            instructorFirstName: cell.instructor_first_name,
            instructorLastName: cell.instructor_last_name,
            studentFirstName: cell.student_first_name,
            studentLastName: cell.student_last_name,
          })),
        });
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, [weeklyScheduleId, weekdayId]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-full" />;
  }

  if (!scheduleData) {
    return (
      <div className="border rounded-lg p-4">No schedule data available</div>
    );
  }

  // Generate time slots
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());
  const timeSlots = [];
  let currentTime = start;
  while (currentTime < end) {
    timeSlots.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, 30); // Assuming 30-minute intervals
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">
        {format(new Date(scheduleData.scheduleDate), "EEEE, MMMM d")}
      </h3>
      <div className="grid grid-rows-[auto_1fr] gap-2">
        {/* Time slots */}
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="w-20" /> {/* Time column spacer */}
          <div className="grid grid-cols-${numColumns} gap-2">
            {Array.from({ length: numColumns }, (_, i) => (
              <div key={i} className="text-center font-medium">
                Column {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-[auto_1fr] gap-2">
          {/* Time labels */}
          <div className="grid grid-rows-[repeat(${timeSlots.length},minmax(60px,1fr))] gap-2">
            {timeSlots.map((time) => (
              <div key={time} className="text-sm text-gray-500">
                {time}
              </div>
            ))}
          </div>

          {/* Cells grid */}
          <div className="grid grid-cols-${numColumns} gap-2">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-${numColumns} gap-2">
                {Array.from({ length: numColumns }, (_, colIndex) => {
                  const cell = scheduleData.cells.find(
                    (c) =>
                      c.timeStart.startsWith(time) &&
                      c.columnNumber === colIndex + 1
                  );
                  return (
                    <Cell
                      key={`${time}-${colIndex}`}
                      cell={cell}
                      timeSlot={time}
                      columnNumber={colIndex + 1}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

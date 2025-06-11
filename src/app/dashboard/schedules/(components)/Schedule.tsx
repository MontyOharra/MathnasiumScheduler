import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Printer, Download } from "lucide-react";
import dbService from "@/lib/db-service";
import { ScheduleCell } from "./ScheduleCell";

interface ScheduleProps {
  scheduleId: number;
  scheduleDate: Date;
  weekdayId: number;
  numPods: number;
  startTime: string;
  endTime: string;
  intervalLength: number;
}

export function Schedule({
  scheduleDate,
  weekdayId,
  numPods,
  startTime,
  endTime,
  intervalLength,
}: ScheduleProps) {
  const [weekdayName, setWeekdayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeekdayName = async () => {
      try {
        const weekday = await dbService.getWeekdayById(weekdayId);
        if (weekday) {
          setWeekdayName(weekday.name.substring(0, 3)); // Get first 3 letters
        }
      } catch (error) {
        console.error("Failed to fetch weekday:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeekdayName();
  }, [weekdayId]);

  // Helper function to add minutes to a time string
  const addMinutes = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to convert 24-hour time to 12-hour format without AM/PM
  const convertTo12Hour = (timeString: string): string => {
    const [hours, mins] = timeString.split(":").map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hour12}:${mins.toString().padStart(2, "0")}`;
  };

  // Generate time slots based on start time, end time, and interval
  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    intervalMinutes: number
  ) => {
    const slots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const nextTime = addMinutes(currentTime, intervalMinutes);
      slots.push({
        start: currentTime,
        end: nextTime,
      });
      currentTime = nextTime;
    }

    return slots;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formattedDate = format(scheduleDate, "MM/dd/yyyy");
  const timeSlots = generateTimeSlots(startTime, endTime, intervalLength);

  return (
    <div className="p-4 border border-gray-500 rounded-lg w-full max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {weekdayName} - {formattedDate}
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
            <Printer size={16} />
            Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
            <Download size={16} />
            Import Sessions
          </button>
        </div>
      </div>

      {/* Horizontally scrollable grid container */}
      <div className="rounded w-full overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden h-auto custom-scrollbar pb-6">
          <div className="min-w-fit">
            {/* Two-level header: Pods and Student Slots */}
            {/* Top level: Pod headers */}
            <div className="flex">
              <div className="w-20 h-8 border border-gray-400 bg-gray-200 flex items-center justify-center text-xs font-bold">
                Time
              </div>
              {Array.from({ length: numPods }, (_, podIndex) => (
                <div
                  key={podIndex}
                  className="flex border-r-2 border-r-gray-500"
                >
                  <div className="w-72 h-8 border border-gray-400 bg-gray-200 flex items-center justify-center text-xs font-bold">
                    Pod {podIndex + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Second level: Student slot headers */}
            <div className="flex">
              <div className="w-20 h-6 border border-gray-400 bg-gray-100 flex items-center justify-center text-xs font-semibold"></div>
              {Array.from({ length: numPods }, (_, podIndex) => (
                <div
                  key={`pod-${podIndex}`}
                  className="flex border-r-2 border-r-gray-500"
                >
                  {Array.from({ length: 3 }, (_, studentIndex) => (
                    <div
                      key={`${podIndex}-${studentIndex}`}
                      className="w-24 h-6 border border-gray-400 bg-gray-100 flex items-center justify-center text-xs font-semibold"
                    >
                      S{studentIndex + 1}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Time slots rows */}
            {timeSlots.map((timeSlot) => (
              <div key={`${timeSlot.start}-${timeSlot.end}`} className="flex">
                {/* Time label column */}
                <div className="w-20 h-12 border border-gray-400 bg-gray-50 flex items-center justify-center text-xs font-medium">
                  {convertTo12Hour(timeSlot.start)}
                </div>

                {/* Schedule cells for this time slot */}
                {Array.from({ length: numPods }, (_, podIndex) => (
                  <div
                    key={`pod-${podIndex}-${timeSlot.start}`}
                    className="flex border-r-2 border-r-gray-500"
                  >
                    {Array.from({ length: 3 }, (_, studentIndex) => (
                      <ScheduleCell
                        key={`${timeSlot.start}-${podIndex}-${studentIndex}`}
                        timeStart={timeSlot.start}
                        timeEnd={timeSlot.end}
                        columnNumber={podIndex * 3 + studentIndex + 1}
                        podNumber={podIndex + 1}
                        studentSlot={studentIndex + 1}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

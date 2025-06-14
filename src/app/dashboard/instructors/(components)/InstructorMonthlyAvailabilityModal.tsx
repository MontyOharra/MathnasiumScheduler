import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dbService from "@/lib/db-service";
import InstructorSimpleAvailabilityModal from "./InstructorSimpleAvailabilityModal";

interface InstructorMonthlyAvailabilityModalProps {
  instructorId: number;
  instructorName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface DayAvailability {
  date: string; // YYYY-MM-DD format
  isAvailable: boolean;
  hasSpecialAvailability: boolean;
  isDefaultAvailable: boolean; // Based on weekday default
  startTime: string | null;
  endTime: string | null;
}

interface WeekdayAvailability {
  weekdayId: number;
  isAvailable: boolean;
  startTime: string | null;
  endTime: string | null;
}

export default function InstructorMonthlyAvailabilityModal({
  instructorId,
  instructorName,
  isOpen,
  onClose,
}: InstructorMonthlyAvailabilityModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [dayAvailabilities, setDayAvailabilities] = useState<
    Map<string, DayAvailability>
  >(new Map());
  const [defaultAvailability, setDefaultAvailability] = useState<
    WeekdayAvailability[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDayEditModal, setShowDayEditModal] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const fetchAvailabilityData = async () => {
    if (!isOpen || instructorId <= 0) return;

    try {
      setIsLoading(true);

      // Fetch default weekly availability
      const defaultData = await dbService.getInstructorDefaultAvailability(
        instructorId
      );
      setDefaultAvailability(defaultData);

      // Fetch special availability for the current month
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Create date strings in consistent format
      const startDateStr = `${startOfMonth.getFullYear()}-${(
        startOfMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${startOfMonth
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      const endDateStr = `${endOfMonth.getFullYear()}-${(
        endOfMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${endOfMonth.getDate().toString().padStart(2, "0")}`;

      const specialData = await dbService.getInstructorSpecialAvailability(
        instructorId,
        startDateStr,
        endDateStr
      );

      // Build day availability map
      const dayMap = new Map<string, DayAvailability>();

      // Generate all days in the month
      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        // Create consistent date string format
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const weekdayId = date.getDay() + 1; // Convert to 1-7 format

        // Check default availability for this weekday
        const defaultForWeekday = defaultData.find(
          (d) => d.weekdayId === weekdayId
        );
        const isDefaultAvailable = defaultForWeekday?.isAvailable || false;

        // Check for special availability override
        const specialForDate = specialData.find((s) => s.date === dateStr);
        const hasSpecialAvailability = !!specialForDate;

        let isAvailable = isDefaultAvailable;
        let startTime: string | null = null;
        let endTime: string | null = null;

        if (hasSpecialAvailability) {
          // Use special availability data
          isAvailable = specialForDate.isAvailable;
          startTime = specialForDate.startTime;
          endTime = specialForDate.endTime;
        } else {
          // Use default availability data
          startTime = defaultForWeekday?.startTime || null;
          endTime = defaultForWeekday?.endTime || null;
        }

        dayMap.set(dateStr, {
          date: dateStr,
          isAvailable,
          hasSpecialAvailability,
          isDefaultAvailable,
          startTime,
          endTime,
        });
      }

      setDayAvailabilities(dayMap);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilityData();
  }, [isOpen, instructorId, currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDates(new Set());
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDates(new Set());
  };

  const handleDateClick = (dateStr: string) => {
    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const handleDateDoubleClick = (dateStr: string) => {
    setEditingDate(dateStr);
    setShowDayEditModal(true);
  };

  const handleMakeUnavailable = async () => {
    if (selectedDates.size === 0) return;

    try {
      for (const dateStr of selectedDates) {
        // Only set override if the day is typically available
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        const weekdayId = date.getDay() + 1;
        const defaultForWeekday = defaultAvailability.find(
          (d) => d.weekdayId === weekdayId
        );

        if (defaultForWeekday?.isAvailable) {
          await dbService.setInstructorSpecialAvailability(
            instructorId,
            dateStr,
            {
              isAvailable: false,
              startTime: null,
              endTime: null,
            }
          );
        }
      }

      // Refresh data
      await fetchAvailabilityData();
      setSelectedDates(new Set());
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleRemoveOverride = async () => {
    if (selectedDates.size === 0) return;

    try {
      for (const dateStr of selectedDates) {
        await dbService.deleteInstructorSpecialAvailability(
          instructorId,
          dateStr
        );
      }

      // Refresh data - revert to default availability
      await fetchAvailabilityData();
      setSelectedDates(new Set());
    } catch (error) {
      console.error("Error removing availability override:", error);
    }
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startOfCalendar = new Date(startOfMonth);
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay());

    const days = [];
    const currentCalendarDate = new Date(startOfCalendar);

    // Generate 6 weeks of calendar
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        // Create date string in local timezone to avoid timezone issues
        const year = currentCalendarDate.getFullYear();
        const month = (currentCalendarDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const dayOfMonth = currentCalendarDate
          .getDate()
          .toString()
          .padStart(2, "0");
        const dateStr = `${year}-${month}-${dayOfMonth}`;

        const isCurrentMonth =
          currentCalendarDate.getMonth() === currentDate.getMonth();
        const dayAvailability = dayAvailabilities.get(dateStr);
        const isSelected = selectedDates.has(dateStr);

        let dayClasses =
          "h-16 border border-gray-200 cursor-pointer transition-colors text-xs relative p-1 ";

        if (!isCurrentMonth) {
          dayClasses += "text-gray-400 bg-gray-100 border-gray-100 ";
        } else if (isSelected) {
          dayClasses += "bg-blue-500 text-white ";
        } else if (dayAvailability?.isAvailable) {
          dayClasses += "bg-white text-gray-900 hover:bg-gray-50 ";
        } else {
          dayClasses += "bg-gray-200 text-gray-500 ";
        }

        // Format availability times for display
        const formatAvailabilityTimes = (dateStr: string) => {
          const dayAvail = dayAvailabilities.get(dateStr);

          if (dayAvail?.isAvailable && dayAvail.startTime && dayAvail.endTime) {
            const formatTime = (time: string) => {
              // Validate time format before processing
              if (!time || !time.includes(":")) {
                return "";
              }
              const [hours, minutes] = time.split(":").map(Number);
              // Validate parsed values
              if (isNaN(hours) || isNaN(minutes)) {
                return "";
              }
              const period = hours >= 12 ? "PM" : "AM";
              const displayHours =
                hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
              return `${displayHours}:${minutes
                .toString()
                .padStart(2, "0")}${period}`;
            };

            const startTimeFormatted = formatTime(dayAvail.startTime);
            const endTimeFormatted = formatTime(dayAvail.endTime);

            // Only return formatted string if both times are valid
            if (startTimeFormatted && endTimeFormatted) {
              return `${startTimeFormatted}-${endTimeFormatted}`;
            }
          }

          return "";
        };

        days.push(
          <div
            key={dateStr}
            className={dayClasses}
            onClick={() => isCurrentMonth && handleDateClick(dateStr)}
            onDoubleClick={() =>
              isCurrentMonth && handleDateDoubleClick(dateStr)
            }
          >
            {/* Date number in top-left */}
            <span className="absolute top-1 left-1 font-medium">
              {currentCalendarDate.getDate()}
            </span>

            {/* Special availability indicator */}
            {dayAvailability?.hasSpecialAvailability && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
            )}

            {/* Availability times in center - only show if truly available with valid times */}
            {isCurrentMonth &&
              dayAvailability?.isAvailable &&
              dayAvailability.startTime &&
              dayAvailability.endTime && (
                <div className="flex items-center justify-center h-full pt-3 text-center">
                  <span className="text-xs leading-tight">
                    {formatAvailabilityTimes(dateStr)}
                  </span>
                </div>
              )}
          </div>
        );

        currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
      }
    }

    return days;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Monthly Availability - {instructorName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading availability data...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Monthly Availability - {instructorName}</DialogTitle>
            <div className="text-sm text-gray-600">
              <p>Click to select days, double-click to edit specific day</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveOverride}
                disabled={selectedDates.size === 0}
              >
                Remove Override
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMakeUnavailable}
                disabled={selectedDates.size === 0}
              >
                Make Unavailable
              </Button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar */}
            <div className="border rounded-lg overflow-hidden">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 bg-gray-50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center font-medium text-sm border-r border-gray-200 last:border-r-0"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">{renderCalendar()}</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day-specific availability modal */}
      {showDayEditModal && editingDate && (
        <InstructorSimpleAvailabilityModal
          instructorId={instructorId}
          instructorName={`${instructorName} - ${new Date(
            editingDate
          ).toLocaleDateString()}`}
          isOpen={showDayEditModal}
          onClose={() => {
            setShowDayEditModal(false);
            setEditingDate(null);
          }}
          onSave={async () => {
            setShowDayEditModal(false);
            setEditingDate(null);
            // Refresh the monthly view by refetching data
            await fetchAvailabilityData();
          }}
          specificDate={editingDate}
        />
      )}
    </>
  );
}

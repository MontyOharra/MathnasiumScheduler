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
import InstructorAvailabilityModal from "./InstructorAvailabilityModal";

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

  const weekdays = [
    { id: 1, name: "Sunday" },
    { id: 2, name: "Monday" },
    { id: 3, name: "Tuesday" },
    { id: 4, name: "Wednesday" },
    { id: 5, name: "Thursday" },
    { id: 6, name: "Friday" },
    { id: 7, name: "Saturday" },
  ];

  useEffect(() => {
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

        const specialData = await dbService.getInstructorSpecialAvailability(
          instructorId,
          startOfMonth.toISOString().split("T")[0],
          endOfMonth.toISOString().split("T")[0]
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
          const dateStr = date.toISOString().split("T")[0];
          const weekdayId = date.getDay() + 1; // Convert to 1-7 format

          // Check default availability for this weekday
          const defaultForWeekday = defaultData.find(
            (d) => d.weekdayId === weekdayId
          );
          const isDefaultAvailable = defaultForWeekday?.isAvailable || false;

          // Check for special availability override
          const specialForDate = specialData.find((s) => s.date === dateStr);
          const hasSpecialAvailability = !!specialForDate;
          const isAvailable = hasSpecialAvailability
            ? specialForDate.isAvailable
            : isDefaultAvailable;

          dayMap.set(dateStr, {
            date: dateStr,
            isAvailable,
            hasSpecialAvailability,
            isDefaultAvailable,
          });
        }

        setDayAvailabilities(dayMap);
      } catch (error) {
        console.error("Error fetching availability data:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

      // Refresh data
      const updatedMap = new Map(dayAvailabilities);
      selectedDates.forEach((dateStr) => {
        const existing = updatedMap.get(dateStr);
        if (existing) {
          updatedMap.set(dateStr, {
            ...existing,
            isAvailable: false,
            hasSpecialAvailability: true,
          });
        }
      });
      setDayAvailabilities(updatedMap);
      setSelectedDates(new Set());
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleMakeAvailable = async () => {
    if (selectedDates.size === 0) return;

    try {
      for (const dateStr of selectedDates) {
        const date = new Date(dateStr);
        const weekdayId = date.getDay() + 1;
        const defaultForWeekday = defaultAvailability.find(
          (d) => d.weekdayId === weekdayId
        );

        if (defaultForWeekday?.isAvailable) {
          // Use default availability
          await dbService.setInstructorSpecialAvailability(
            instructorId,
            dateStr,
            {
              isAvailable: true,
              startTime: defaultForWeekday.startTime,
              endTime: defaultForWeekday.endTime,
            }
          );
        } else {
          // Set basic availability (9 AM - 5 PM as default)
          await dbService.setInstructorSpecialAvailability(
            instructorId,
            dateStr,
            {
              isAvailable: true,
              startTime: "09:00",
              endTime: "17:00",
            }
          );
        }
      }

      // Refresh data
      const updatedMap = new Map(dayAvailabilities);
      selectedDates.forEach((dateStr) => {
        const existing = updatedMap.get(dateStr);
        if (existing) {
          updatedMap.set(dateStr, {
            ...existing,
            isAvailable: true,
            hasSpecialAvailability: true,
          });
        }
      });
      setDayAvailabilities(updatedMap);
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
      const updatedMap = new Map(dayAvailabilities);
      selectedDates.forEach((dateStr) => {
        const existing = updatedMap.get(dateStr);
        if (existing) {
          updatedMap.set(dateStr, {
            ...existing,
            isAvailable: existing.isDefaultAvailable,
            hasSpecialAvailability: false,
          });
        }
      });
      setDayAvailabilities(updatedMap);
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
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startOfCalendar = new Date(startOfMonth);
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay());

    const days = [];
    const currentCalendarDate = new Date(startOfCalendar);

    // Generate 6 weeks of calendar
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const dateStr = currentCalendarDate.toISOString().split("T")[0];
        const isCurrentMonth =
          currentCalendarDate.getMonth() === currentDate.getMonth();
        const dayAvailability = dayAvailabilities.get(dateStr);
        const isSelected = selectedDates.has(dateStr);
        const isToday = dateStr === new Date().toISOString().split("T")[0];

        let dayClasses =
          "h-12 border border-gray-200 cursor-pointer transition-colors flex items-center justify-center text-sm relative ";

        if (!isCurrentMonth) {
          dayClasses += "text-gray-300 bg-gray-50 ";
        } else if (isSelected) {
          dayClasses += "bg-red-500 text-white ";
        } else if (dayAvailability?.isAvailable) {
          dayClasses += "bg-red-100 text-red-800 hover:bg-red-200 ";
        } else {
          dayClasses += "bg-gray-100 text-gray-600 hover:bg-gray-200 ";
        }

        if (isToday) {
          dayClasses += "ring-2 ring-red-400 ";
        }

        days.push(
          <div
            key={dateStr}
            className={dayClasses}
            onClick={() => isCurrentMonth && handleDateClick(dateStr)}
            onDoubleClick={() =>
              isCurrentMonth && handleDateDoubleClick(dateStr)
            }
          >
            <span>{currentCalendarDate.getDate()}</span>
            {dayAvailability?.hasSpecialAvailability && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></div>
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
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Red: Available, Gray: Unavailable, Red dot: Special override
              </p>
              <p>Click to select days, double-click to edit specific day</p>
            </div>
          </DialogHeader>

          <div className="space-y-4">
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

            {/* Action buttons */}
            {selectedDates.size > 0 && (
              <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 mr-4">
                  {selectedDates.size} day{selectedDates.size !== 1 ? "s" : ""}{" "}
                  selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMakeAvailable}
                >
                  Make Available
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMakeUnavailable}
                >
                  Make Unavailable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemoveOverride}
                >
                  Remove Override
                </Button>
              </div>
            )}
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
        <InstructorAvailabilityModal
          instructorId={instructorId}
          instructorName={`${instructorName} - ${new Date(
            editingDate
          ).toLocaleDateString()}`}
          isOpen={showDayEditModal}
          onClose={() => {
            setShowDayEditModal(false);
            setEditingDate(null);
          }}
          onSave={() => {
            setShowDayEditModal(false);
            setEditingDate(null);
            // Refresh the monthly view by refetching data
            const fetchData = async () => {
              try {
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

                const specialData =
                  await dbService.getInstructorSpecialAvailability(
                    instructorId,
                    startOfMonth.toISOString().split("T")[0],
                    endOfMonth.toISOString().split("T")[0]
                  );

                // Update the day availability map
                const updatedMap = new Map(dayAvailabilities);
                const dayAvailability = updatedMap.get(editingDate);
                if (dayAvailability) {
                  const specialForDate = specialData.find(
                    (s) => s.date === editingDate
                  );
                  if (specialForDate) {
                    updatedMap.set(editingDate, {
                      ...dayAvailability,
                      isAvailable: specialForDate.isAvailable,
                      hasSpecialAvailability: true,
                    });
                  }
                }
                setDayAvailabilities(updatedMap);
              } catch (error) {
                console.error("Error refreshing availability:", error);
              }
            };
            fetchData();
          }}
          specificDate={editingDate}
        />
      )}
    </>
  );
}

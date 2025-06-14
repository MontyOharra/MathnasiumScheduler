import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dbService from "@/lib/db-service";

interface InstructorAvailabilityModalProps {
  instructorId: number;
  instructorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onAvailabilityChange?: (selectedSlots: Set<string>) => void;
  specificDate?: string; // YYYY-MM-DD format for date-specific editing
}

interface TimeSlot {
  hour: number;
  minute: number;
  display: string;
}

interface AvailabilitySlot {
  weekdayId: number;
  timeSlot: string;
  isSelected: boolean;
}

interface WeekdayAvailability {
  weekdayId: number;
  weekdayName: string;
  isAvailable: boolean;
  startTime: string | null;
  endTime: string | null;
}

export default function InstructorAvailabilityModal({
  instructorId,
  instructorName,
  isOpen,
  onClose,
  onSave,
  onAvailabilityChange,
  specificDate,
}: InstructorAvailabilityModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState<WeekdayAvailability[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");
  const [dragStart, setDragStart] = useState<{
    weekdayId: number;
    timeSlot: string;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{
    weekdayId: number;
    timeSlot: string;
  } | null>(null);
  const [baseSlotsBeforeDrag, setBaseSlotsBeforeDrag] = useState<Set<string>>(
    new Set()
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate time slots from 8:00 AM to 10:00 PM in 30-minute intervals
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 22 && minute > 0) break; // Stop at 10:00 PM

      // Convert to 12-hour format
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? "AM" : "PM";
      const display = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;

      timeSlots.push({ hour, minute, display });
    }
  }

  const weekdays = [
    { id: 1, name: "Sunday", short: "Sun" },
    { id: 2, name: "Monday", short: "Mon" },
    { id: 3, name: "Tuesday", short: "Tue" },
    { id: 4, name: "Wednesday", short: "Wed" },
    { id: 5, name: "Thursday", short: "Thu" },
    { id: 6, name: "Friday", short: "Fri" },
    { id: 7, name: "Saturday", short: "Sat" },
  ];

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!isOpen) return;

      try {
        setIsLoading(true);

        // For new instructors (instructorId = -1), start with empty availability
        if (instructorId <= 0) {
          const weekdayAvailability: WeekdayAvailability[] = weekdays.map(
            (weekday) => ({
              weekdayId: weekday.id,
              weekdayName: weekday.name,
              isAvailable: false,
              startTime: null,
              endTime: null,
            })
          );

          setAvailability(weekdayAvailability);
          setSelectedSlots(new Set<string>());
          setIsLoading(false);
          return;
        }

        // If editing a specific date, load that date's availability
        if (specificDate) {
          const date = new Date(specificDate);
          const weekdayId = date.getDay() + 1;

          // Try to get special availability for this date first
          const specialData = await dbService.getInstructorSpecialAvailability(
            instructorId,
            specificDate,
            specificDate
          );

          const specialForDate = specialData.find(
            (s) => s.date === specificDate
          );

          if (specialForDate) {
            // Use special availability
            const weekdayAvailability: WeekdayAvailability[] = [
              {
                weekdayId,
                weekdayName:
                  weekdays.find((w) => w.id === weekdayId)?.name || "",
                isAvailable: specialForDate.isAvailable,
                startTime: specialForDate.startTime,
                endTime: specialForDate.endTime,
              },
            ];

            setAvailability(weekdayAvailability);

            // Convert to selected slots
            const slots = new Set<string>();
            if (
              specialForDate.isAvailable &&
              specialForDate.startTime &&
              specialForDate.endTime
            ) {
              const startHour = parseInt(
                specialForDate.startTime.split(":")[0]
              );
              const startMinute = parseInt(
                specialForDate.startTime.split(":")[1]
              );
              const endHour = parseInt(specialForDate.endTime.split(":")[0]);
              const endMinute = parseInt(specialForDate.endTime.split(":")[1]);

              for (const slot of timeSlots) {
                const slotTime = slot.hour * 60 + slot.minute;
                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;

                if (slotTime >= startTime && slotTime < endTime) {
                  slots.add(`${weekdayId}-${slot.display}`);
                }
              }
            }
            setSelectedSlots(slots);
          } else {
            // Fall back to default availability for this weekday
            const defaultData =
              await dbService.getInstructorDefaultAvailability(instructorId);
            const defaultForWeekday = defaultData.find(
              (d) => d.weekdayId === weekdayId
            );

            const weekdayAvailability: WeekdayAvailability[] = [
              {
                weekdayId,
                weekdayName:
                  weekdays.find((w) => w.id === weekdayId)?.name || "",
                isAvailable: defaultForWeekday?.isAvailable || false,
                startTime: defaultForWeekday?.startTime || null,
                endTime: defaultForWeekday?.endTime || null,
              },
            ];

            setAvailability(weekdayAvailability);

            // Convert to selected slots
            const slots = new Set<string>();
            if (
              defaultForWeekday?.isAvailable &&
              defaultForWeekday.startTime &&
              defaultForWeekday.endTime
            ) {
              const startHour = parseInt(
                defaultForWeekday.startTime.split(":")[0]
              );
              const startMinute = parseInt(
                defaultForWeekday.startTime.split(":")[1]
              );
              const endHour = parseInt(defaultForWeekday.endTime.split(":")[0]);
              const endMinute = parseInt(
                defaultForWeekday.endTime.split(":")[1]
              );

              for (const slot of timeSlots) {
                const slotTime = slot.hour * 60 + slot.minute;
                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;

                if (slotTime >= startTime && slotTime < endTime) {
                  slots.add(`${weekdayId}-${slot.display}`);
                }
              }
            }
            setSelectedSlots(slots);
          }

          setIsLoading(false);
          return;
        }

        // Default behavior - load weekly availability
        const availabilityData =
          await dbService.getInstructorDefaultAvailability(instructorId);

        // Convert to our format and fill in missing weekdays
        const weekdayAvailability: WeekdayAvailability[] = weekdays.map(
          (weekday) => {
            const existing = availabilityData.find(
              (a) => a.weekdayId === weekday.id
            );
            return {
              weekdayId: weekday.id,
              weekdayName: weekday.name,
              isAvailable: existing?.isAvailable || false,
              startTime: existing?.startTime || null,
              endTime: existing?.endTime || null,
            };
          }
        );

        setAvailability(weekdayAvailability);

        // Convert to selected slots for the grid
        const slots = new Set<string>();
        weekdayAvailability.forEach((day) => {
          if (day.isAvailable && day.startTime && day.endTime) {
            const startHour = parseInt(day.startTime.split(":")[0]);
            const startMinute = parseInt(day.startTime.split(":")[1]);
            const endHour = parseInt(day.endTime.split(":")[0]);
            const endMinute = parseInt(day.endTime.split(":")[1]);

            // Add all time slots between start and end
            for (const slot of timeSlots) {
              const slotTime = slot.hour * 60 + slot.minute;
              const startTime = startHour * 60 + startMinute;
              const endTime = endHour * 60 + endMinute;

              if (slotTime >= startTime && slotTime < endTime) {
                slots.add(`${day.weekdayId}-${slot.display}`);
              }
            }
          }
        });

        setSelectedSlots(slots);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [isOpen, instructorId, specificDate]);

  const getSlotKey = (weekdayId: number, timeSlot: string) =>
    `${weekdayId}-${timeSlot}`;

  const getSlotIndices = (weekdayId: number, timeSlot: string) => {
    const weekdayIndex = weekdays.findIndex((w) => w.id === weekdayId);
    const timeIndex = timeSlots.findIndex((t) => t.display === timeSlot);
    return { weekdayIndex, timeIndex };
  };

  const getRectangularSelection = (
    start: { weekdayId: number; timeSlot: string },
    end: { weekdayId: number; timeSlot: string }
  ) => {
    const startIndices = getSlotIndices(start.weekdayId, start.timeSlot);
    const endIndices = getSlotIndices(end.weekdayId, end.timeSlot);

    const minWeekday = Math.min(
      startIndices.weekdayIndex,
      endIndices.weekdayIndex
    );
    const maxWeekday = Math.max(
      startIndices.weekdayIndex,
      endIndices.weekdayIndex
    );
    const minTime = Math.min(startIndices.timeIndex, endIndices.timeIndex);
    const maxTime = Math.max(startIndices.timeIndex, endIndices.timeIndex);

    const selectedKeys = new Set<string>();

    for (let w = minWeekday; w <= maxWeekday; w++) {
      for (let t = minTime; t <= maxTime; t++) {
        const weekday = weekdays[w];
        const timeSlot = timeSlots[t];
        if (weekday && timeSlot) {
          selectedKeys.add(getSlotKey(weekday.id, timeSlot.display));
        }
      }
    }

    return selectedKeys;
  };

  const handleSlotMouseDown = (weekdayId: number, timeSlot: string) => {
    setIsDragging(true);
    setDragStart({ weekdayId, timeSlot });
    setDragEnd({ weekdayId, timeSlot });
    setBaseSlotsBeforeDrag(new Set(selectedSlots));

    // Determine drag mode based on current selection state
    const key = getSlotKey(weekdayId, timeSlot);
    const isCurrentlySelected = selectedSlots.has(key);
    setDragMode(isCurrentlySelected ? "deselect" : "select");
  };

  const handleSlotMouseEnter = (
    weekdayId: number,
    timeSlot: string,
    event: React.MouseEvent
  ) => {
    if (!isDragging || !dragStart) return;

    setDragEnd({ weekdayId, timeSlot });

    // Handle auto-scrolling when dragging near edges
    handleAutoScroll(event.nativeEvent);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setBaseSlotsBeforeDrag(new Set());

    // Clear auto-scroll when dragging stops
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  const handleAutoScroll = (event: MouseEvent) => {
    if (!scrollContainerRef.current || !isDragging) return;

    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollZone = 50; // pixels from edge to trigger scroll
    const scrollSpeed = 5; // pixels per scroll

    // Clear existing auto-scroll
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    const mouseY = event.clientY;
    const containerTop = rect.top;
    const containerBottom = rect.bottom;

    if (mouseY < containerTop + scrollZone) {
      // Scroll up
      autoScrollIntervalRef.current = setInterval(() => {
        container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed);
      }, 16); // ~60fps
    } else if (mouseY > containerBottom - scrollZone) {
      // Scroll down
      autoScrollIntervalRef.current = setInterval(() => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTop = Math.min(
          maxScroll,
          container.scrollTop + scrollSpeed
        );
      }, 16); // ~60fps
    }
  };

  // Apply rectangular selection when drag state changes
  useEffect(() => {
    if (isDragging && dragStart && dragEnd) {
      const rectangularKeys = getRectangularSelection(dragStart, dragEnd);

      // Start with the base state before this drag operation
      const newSelectedSlots = new Set(baseSlotsBeforeDrag);

      if (dragMode === "select") {
        rectangularKeys.forEach((key) => newSelectedSlots.add(key));
      } else {
        rectangularKeys.forEach((key) => newSelectedSlots.delete(key));
      }

      setSelectedSlots(newSelectedSlots);
    }
  }, [dragStart, dragEnd, dragMode, isDragging, baseSlotsBeforeDrag]);

  // Cleanup auto-scroll on unmount
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      // For new instructors (instructorId <= 0), just close the modal
      // The availability will be saved when the instructor is actually created
      if (instructorId <= 0) {
        console.log(
          "Availability configured for new instructor:",
          selectedSlots
        );
        if (onAvailabilityChange) {
          onAvailabilityChange(selectedSlots);
        }
        onSave();
        onClose();
        return;
      }

      // If editing a specific date, save as special availability
      if (specificDate) {
        const date = new Date(specificDate);
        const weekdayId = date.getDay() + 1;

        // Convert selected slots to time ranges for this specific date
        const slotsForDate = Array.from(selectedSlots).filter((slot) =>
          slot.startsWith(`${weekdayId}-`)
        );

        if (slotsForDate.length === 0) {
          // No availability for this date
          await dbService.setInstructorSpecialAvailability(
            instructorId,
            specificDate,
            {
              isAvailable: false,
              startTime: null,
              endTime: null,
            }
          );
        } else {
          // Find continuous time blocks
          const times = slotsForDate.map((slot) => slot.split("-")[1]).sort();
          const startTime = times[0];

          // Find the end time (last consecutive slot + 30 minutes)
          let endTime = times[0];
          for (let i = 0; i < times.length; i++) {
            const currentSlot = timeSlots.find(
              (slot) => slot.display === times[i]
            );
            if (currentSlot) {
              const nextSlotTime = new Date();
              nextSlotTime.setHours(
                currentSlot.hour,
                currentSlot.minute + 30,
                0,
                0
              );
              endTime = `${nextSlotTime
                .getHours()
                .toString()
                .padStart(2, "0")}:${nextSlotTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
            }
          }

          await dbService.setInstructorSpecialAvailability(
            instructorId,
            specificDate,
            {
              isAvailable: true,
              startTime,
              endTime,
            }
          );
        }

        onSave();
        onClose();
        return;
      }

      // Default behavior - save weekly availability
      // Convert selected slots back to availability data
      const weekdayAvailabilityMap = new Map<
        number,
        { slots: string[]; times: string[] }
      >();

      // Group slots by weekday
      selectedSlots.forEach((slotKey) => {
        const [weekdayIdStr, timeSlot] = slotKey.split("-");
        const weekdayId = parseInt(weekdayIdStr);

        if (!weekdayAvailabilityMap.has(weekdayId)) {
          weekdayAvailabilityMap.set(weekdayId, { slots: [], times: [] });
        }

        weekdayAvailabilityMap.get(weekdayId)!.slots.push(slotKey);
        weekdayAvailabilityMap.get(weekdayId)!.times.push(timeSlot);
      });

      // Save availability for each weekday
      for (const weekday of weekdays) {
        const dayData = weekdayAvailabilityMap.get(weekday.id);

        if (!dayData || dayData.times.length === 0) {
          // No availability for this day
          await dbService.setInstructorDefaultAvailability(
            instructorId,
            weekday.id,
            {
              isAvailable: false,
              startTime: null,
              endTime: null,
            }
          );
        } else {
          // Find continuous time blocks
          const sortedTimes = dayData.times.sort();
          const startTime = sortedTimes[0];

          // Find the end time (last consecutive slot + 30 minutes)
          let endTime = sortedTimes[0];
          for (let i = 0; i < sortedTimes.length; i++) {
            const currentSlot = timeSlots.find(
              (slot) => slot.display === sortedTimes[i]
            );
            if (currentSlot) {
              const nextSlotTime = new Date();
              nextSlotTime.setHours(
                currentSlot.hour,
                currentSlot.minute + 30,
                0,
                0
              );
              endTime = `${nextSlotTime
                .getHours()
                .toString()
                .padStart(2, "0")}:${nextSlotTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
            }
          }

          await dbService.setInstructorDefaultAvailability(
            instructorId,
            weekday.id,
            {
              isAvailable: true,
              startTime,
              endTime,
            }
          );
        }
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Configure Availability - {instructorName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading availability...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {specificDate
              ? `Configure Availability - ${instructorName} - ${new Date(
                  specificDate
                ).toLocaleDateString()}`
              : `Configure Weekly Availability - ${instructorName}`}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {specificDate
              ? "Configure availability for this specific date. This will override the default weekly schedule."
              : "Click and drag to select available time slots. Selected slots are shown in red."}
          </p>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto max-h-96 scrollbar-modern"
          onMouseUp={handleMouseUp}
        >
          <div className="grid grid-cols-8 min-w-max">
            {/* Header row */}
            <div className="p-1 text-center font-medium text-xs bg-gray-50 border-b border-r border-gray-300 sticky top-0 z-10">
              Time
            </div>
            {(specificDate
              ? [
                  weekdays.find(
                    (w) => w.id === new Date(specificDate).getDay() + 1
                  ),
                ].filter(Boolean)
              : weekdays
            ).map((weekday) => (
              <div
                key={weekday!.id}
                className="p-1 text-center font-medium text-xs bg-gray-50 border-b border-r border-gray-300 sticky top-0 z-10"
              >
                {weekday!.short}
              </div>
            ))}

            {/* Time slot rows */}
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.display} className="contents">
                {/* Time label */}
                <div className="p-1 text-center text-xs bg-gray-50 border-b border-r border-gray-300 font-mono">
                  {timeSlot.display}
                </div>

                {/* Weekday slots */}
                {(specificDate
                  ? [
                      weekdays.find(
                        (w) => w.id === new Date(specificDate).getDay() + 1
                      ),
                    ].filter(Boolean)
                  : weekdays
                ).map((weekday) => {
                  const slotKey = getSlotKey(weekday!.id, timeSlot.display);
                  const isSelected = selectedSlots.has(slotKey);

                  return (
                    <div
                      key={slotKey}
                      className={`
                        h-6 border-b border-r border-gray-300 cursor-pointer transition-colors select-none
                        ${
                          isSelected
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-white hover:bg-red-50"
                        }
                      `}
                      onMouseDown={() =>
                        handleSlotMouseDown(weekday!.id, timeSlot.display)
                      }
                      onMouseEnter={(e) =>
                        handleSlotMouseEnter(weekday!.id, timeSlot.display, e)
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

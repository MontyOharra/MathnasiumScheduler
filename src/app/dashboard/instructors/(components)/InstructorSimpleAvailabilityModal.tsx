import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatabaseService } from "@/lib/db-service";

interface InstructorSimpleAvailabilityModalProps {
  instructorId: number;
  instructorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onAvailabilityChange?: (availability: WeekdayAvailability[]) => void;
  specificDate?: string; // YYYY-MM-DD format for date-specific editing
}

interface WeekdayAvailability {
  weekdayId: number;
  weekdayName: string;
  isAvailable: boolean;
  startTime: string | null;
  endTime: string | null;
}

const timeOptions = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const weekdays = [
  { id: 1, name: "Sunday", short: "Sun" },
  { id: 2, name: "Monday", short: "Mon" },
  { id: 3, name: "Tuesday", short: "Tue" },
  { id: 4, name: "Wednesday", short: "Wed" },
  { id: 5, name: "Thursday", short: "Thu" },
  { id: 6, name: "Friday", short: "Fri" },
  { id: 7, name: "Saturday", short: "Sat" },
];

export default function InstructorSimpleAvailabilityModal({
  instructorId,
  instructorName,
  isOpen,
  onClose,
  onSave,
  onAvailabilityChange,
  specificDate,
}: InstructorSimpleAvailabilityModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState<WeekdayAvailability[]>([]);
  const dbService = DatabaseService.getInstance();

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!isOpen) return;

      try {
        setIsLoading(true);

        // For new instructors (instructorId <= 0), start with empty availability
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
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [isOpen, instructorId, specificDate]);

  const handleAvailabilityToggle = (
    weekdayId: number,
    isAvailable: boolean
  ) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.weekdayId === weekdayId
          ? {
              ...day,
              isAvailable,
              // Reset times when making unavailable
              startTime: isAvailable ? day.startTime || "09:00" : null,
              endTime: isAvailable ? day.endTime || "17:00" : null,
            }
          : day
      )
    );
  };

  const handleTimeChange = (
    weekdayId: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.weekdayId === weekdayId) {
          const updated = { ...day, [field]: value };

          // Validate the time selection
          if (field === "startTime" && day.endTime) {
            const startMinutes = timeToMinutes(value);
            const endMinutes = timeToMinutes(day.endTime);
            if (startMinutes >= endMinutes) {
              // Clear end time if start time is now >= end time
              updated.endTime = null;
            }
          } else if (field === "endTime" && day.startTime) {
            const startMinutes = timeToMinutes(day.startTime);
            const endMinutes = timeToMinutes(value);
            if (endMinutes <= startMinutes) {
              // Clear start time if end time is now <= start time
              updated.startTime = null;
            }
          }

          return updated;
        }
        return day;
      })
    );
  };

  const handleSave = async () => {
    try {
      // For new instructors (instructorId <= 0), just pass the data back
      if (instructorId <= 0) {
        if (onAvailabilityChange) {
          onAvailabilityChange(availability);
        }
        onSave();
        onClose();
        return;
      }

      // If editing a specific date, save as special availability
      if (specificDate) {
        const dayData = availability[0]; // Only one day for specific date editing

        await dbService.setInstructorSpecialAvailability(
          instructorId,
          specificDate,
          {
            isAvailable: dayData.isAvailable,
            startTime: dayData.isAvailable ? dayData.startTime : null,
            endTime: dayData.isAvailable ? dayData.endTime : null,
          }
        );

        onSave();
        onClose();
        return;
      }

      // Default behavior - save weekly availability
      for (const day of availability) {
        await dbService.setInstructorDefaultAvailability(
          instructorId,
          day.weekdayId,
          {
            isAvailable: day.isAvailable,
            startTime: day.isAvailable ? day.startTime : null,
            endTime: day.isAvailable ? day.endTime : null,
          }
        );
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getValidStartTimes = (endTime: string | null) => {
    if (!endTime) return timeOptions;
    const endMinutes = timeToMinutes(endTime);
    return timeOptions.filter((time) => timeToMinutes(time) < endMinutes);
  };

  const getValidEndTimes = (startTime: string | null) => {
    if (!startTime) return timeOptions;
    const startMinutes = timeToMinutes(startTime);
    return timeOptions.filter((time) => timeToMinutes(time) > startMinutes);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
              ? "Set availability for this specific date. This will override the default weekly schedule."
              : "Set the weekly availability schedule for this instructor."}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {availability.map((day) => (
            <div
              key={day.weekdayId}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  {day.weekdayName}
                </Label>
                <Switch
                  checked={day.isAvailable}
                  onCheckedChange={(checked) =>
                    handleAvailabilityToggle(day.weekdayId, checked)
                  }
                />
              </div>

              {day.isAvailable && (
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`start-${day.weekdayId}`}
                      className="text-sm"
                    >
                      From:
                    </Label>
                    <Select
                      value={day.startTime || ""}
                      onValueChange={(value) =>
                        handleTimeChange(day.weekdayId, "startTime", value)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        {getValidStartTimes(day.endTime).map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`end-${day.weekdayId}`} className="text-sm">
                      To:
                    </Label>
                    <Select
                      value={day.endTime || ""}
                      onValueChange={(value) =>
                        handleTimeChange(day.weekdayId, "endTime", value)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        {getValidEndTimes(day.startTime).map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {!day.isAvailable && (
                <div className="text-sm text-gray-500 ml-4">Not available</div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  WeeklyScheduleTemplate,
  WeeklyScheduleTemplateWeekday,
  Center,
  Weekday,
} from "@/types";

const center: Center = {
  id: 1,
  name: "Main Center",
};

const createWeekdayDetail = (
  weekday: Weekday,
  startTime: string,
  endTime: string
): WeeklyScheduleTemplateWeekday => ({
  templateId: "", // Will be set after template creation
  center,
  weekday,
  startTime,
  endTime,
});

export const scheduleTemplates: WeeklyScheduleTemplate[] = [
  {
    id: "template-1",
    center,
    name: "Standard Afternoon Schedule",
    numPods: 4,
    isDefault: true,
    intervalLength: 30,
    weekdayDetails: [
      createWeekdayDetail("monday", "15:00", "19:00"),
      createWeekdayDetail("tuesday", "15:00", "19:00"),
      createWeekdayDetail("wednesday", "15:00", "19:00"),
      createWeekdayDetail("thursday", "15:00", "19:00"),
      createWeekdayDetail("friday", "15:00", "19:00"),
      createWeekdayDetail("saturday", "09:00", "13:00"),
      createWeekdayDetail("sunday", "09:00", "13:00"),
    ],
  },
  {
    id: "template-2",
    center,
    name: "Extended Hours Schedule",
    numPods: 6,
    isDefault: false,
    intervalLength: 30,
    weekdayDetails: [
      createWeekdayDetail("monday", "14:00", "20:00"),
      createWeekdayDetail("tuesday", "14:00", "20:00"),
      createWeekdayDetail("wednesday", "14:00", "20:00"),
      createWeekdayDetail("thursday", "14:00", "20:00"),
      createWeekdayDetail("friday", "14:00", "20:00"),
      createWeekdayDetail("saturday", "08:00", "14:00"),
      createWeekdayDetail("sunday", "08:00", "14:00"),
    ],
  },
];

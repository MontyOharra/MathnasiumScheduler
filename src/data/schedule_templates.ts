import {
  WeeklyScheduleTemplate,
  WeeklyScheduleTemplateWeekday,
} from "@/types/main";
import { weekdays } from "./static-data/weekdays";

const createWeekdayDetail = (
  weekdayName: string,
  startTime: string,
  endTime: string
): WeeklyScheduleTemplateWeekday => ({
  templateId: "", // Will be set after template creation
  weekdayId:
    weekdays.find((w) => w.name.toLowerCase() === weekdayName.toLowerCase())
      ?.id || 0,
  startTime,
  endTime,
  numColumns: 4,
});

export const scheduleTemplates: WeeklyScheduleTemplate[] = [
  {
    id: "template-1",
    centerId: 0,
    name: "Spring Schedule",
    isDefault: true,
    intervalLength: 30,
  },
  {
    id: "template-2",
    centerId: 0,
    name: "Summer Schedule",
    isDefault: false,
    intervalLength: 30,
  },
];

export const scheduleTemplateWeekdays: WeeklyScheduleTemplateWeekday[] = [
  // Spring Schedule (template-1) weekdays
  createWeekdayDetail("Monday", "15:30", "19:30"),
  createWeekdayDetail("Tuesday", "15:30", "19:30"),
  createWeekdayDetail("Wednesday", "15:30", "19:30"),
  createWeekdayDetail("Thursday", "15:30", "19:30"),
  createWeekdayDetail("Saturday", "10:00", "14:00"),

  // Summer Schedule (template-2) weekdays
  createWeekdayDetail("Monday", "15:30", "19:30"),
  createWeekdayDetail("Tuesday", "15:30", "19:30"),
  createWeekdayDetail("Wednesday", "15:30", "19:30"),
  createWeekdayDetail("Thursday", "15:30", "19:30"),
  createWeekdayDetail("Friday", "15:30", "19:30"),
];

// Set the templateId for each weekday detail
scheduleTemplateWeekdays.forEach((weekday) => {
  if (weekday.weekdayId === weekdays.find((w) => w.name === "Saturday")?.id) {
    weekday.templateId = scheduleTemplates[0].id; // Spring Schedule
  } else if (
    weekday.weekdayId === weekdays.find((w) => w.name === "Friday")?.id
  ) {
    weekday.templateId = scheduleTemplates[1].id; // Summer Schedule
  } else {
    // For Mon-Thu, assign to both templates
    weekday.templateId = scheduleTemplates[0].id;
    // Create a copy for the summer schedule
    scheduleTemplateWeekdays.push({
      ...weekday,
      templateId: scheduleTemplates[1].id,
    });
  }
});

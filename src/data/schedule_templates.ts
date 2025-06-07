import { WeeklyScheduleTemplate }from "@/types/main";

export const scheduleTemplates: WeeklyScheduleTemplate[] = [
  {
    id: "spring-schedule",
    centerId: 0,
    name: "Spring Schedule",
    isDefault: true,
    intervalLength: 30,
  },
  {
    id: "summer-schedule",
    centerId: 0,
    name: "Summer Schedule",
    isDefault: false,
    intervalLength: 30,
  },
];

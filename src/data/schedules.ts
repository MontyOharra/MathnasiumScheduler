import { Schedule, User, Center } from "@/types";
import { scheduleTemplates } from "./schedule_templates";

const center: Center = {
  id: 1,
  name: "Main Center",
};

const adminUser: User = {
  id: 1,
  center,
  role: {
    id: 1,
    code: "admin",
    description: "Administrator",
  },
  email: "admin@mathnasium.com",
  firstName: "Admin",
  lastName: "User",
  isActive: true,
};

// Helper function to create a date with specific time
const createDate = (dateStr: string, hours: number, minutes: number) => {
  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const schedules: Schedule[] = [
  // Past schedules
  {
    id: "schedule-past-1",
    center,
    template: scheduleTemplates[0],
    addedBy: adminUser,
    dateCreated: createDate("2025-02-15", 10, 0),
    dateLastModified: createDate("2025-02-15", 10, 0),
    scheduleDate: createDate("2025-03-01", 0, 0),
  },
  {
    id: "schedule-past-2",
    center,
    template: scheduleTemplates[1],
    addedBy: adminUser,
    dateCreated: createDate("2025-02-20", 11, 0),
    dateLastModified: createDate("2025-02-20", 11, 0),
    scheduleDate: createDate("2025-03-15", 0, 0),
  },
  // Current schedules
  {
    id: "schedule-1",
    center,
    template: scheduleTemplates[0],
    addedBy: adminUser,
    dateCreated: createDate("2025-03-25", 10, 0),
    dateLastModified: createDate("2025-03-25", 10, 0),
    scheduleDate: createDate("2025-04-01", 0, 0),
  },
  {
    id: "schedule-2",
    center,
    template: scheduleTemplates[1],
    addedBy: adminUser,
    dateCreated: createDate("2025-03-26", 11, 0),
    dateLastModified: createDate("2025-03-26", 11, 0),
    scheduleDate: createDate("2025-04-02", 0, 0),
  },
  // Upcoming schedules (after April 28th)
  {
    id: "schedule-upcoming-1",
    center,
    template: scheduleTemplates[0],
    addedBy: adminUser,
    dateCreated: createDate("2025-04-15", 10, 0),
    dateLastModified: createDate("2025-04-15", 10, 0),
    scheduleDate: createDate("2025-05-01", 0, 0),
  },
  {
    id: "schedule-upcoming-2",
    center,
    template: scheduleTemplates[1],
    addedBy: adminUser,
    dateCreated: createDate("2025-04-20", 11, 0),
    dateLastModified: createDate("2025-04-20", 11, 0),
    scheduleDate: createDate("2025-05-15", 0, 0),
  },
  {
    id: "schedule-upcoming-3",
    center,
    template: scheduleTemplates[0],
    addedBy: adminUser,
    dateCreated: createDate("2025-04-25", 14, 0),
    dateLastModified: createDate("2025-04-25", 14, 0),
    scheduleDate: createDate("2025-06-01", 0, 0),
  },
];

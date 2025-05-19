import { Schedule, User } from "@/types/main";
import { scheduleTemplates } from "./schedule_templates";

const adminUser: User = {
  id: 1,
  centerId: 0,
  roleId: 1,
  email: "admin@mathnasium.com",
  firstName: "Admin",
  lastName: "User",
  invitedById: null,
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
    centerId: 0,
    templateId: scheduleTemplates[0].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-02-15", 10, 0),
    dateLastModified: createDate("2025-02-15", 10, 0),
    scheduleDate: createDate("2025-03-01", 0, 0),
  },
  {
    id: "schedule-past-2",
    centerId: 0,
    templateId: scheduleTemplates[1].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-02-20", 11, 0),
    dateLastModified: createDate("2025-02-20", 11, 0),
    scheduleDate: createDate("2025-03-15", 0, 0),
  },
  // Current schedules
  {
    id: "schedule-1",
    centerId: 0,
    templateId: scheduleTemplates[0].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-03-25", 10, 0),
    dateLastModified: createDate("2025-03-25", 10, 0),
    scheduleDate: createDate("2025-04-01", 0, 0),
  },
  {
    id: "schedule-2",
    centerId: 0,
    templateId: scheduleTemplates[1].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-03-26", 11, 0),
    dateLastModified: createDate("2025-03-26", 11, 0),
    scheduleDate: createDate("2025-04-02", 0, 0),
  },
  // Upcoming schedules (after April 28th)
  {
    id: "schedule-upcoming-1",
    centerId: 0,
    templateId: scheduleTemplates[0].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-04-15", 10, 0),
    dateLastModified: createDate("2025-04-15", 10, 0),
    scheduleDate: createDate("2025-05-01", 0, 0),
  },
  {
    id: "schedule-upcoming-2",
    centerId: 0,
    templateId: scheduleTemplates[1].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-04-20", 11, 0),
    dateLastModified: createDate("2025-04-20", 11, 0),
    scheduleDate: createDate("2025-05-15", 0, 0),
  },
  {
    id: "schedule-upcoming-3",
    centerId: 0,
    templateId: scheduleTemplates[0].id,
    addedByUserId: adminUser.id,
    dateCreated: createDate("2025-04-25", 14, 0),
    dateLastModified: createDate("2025-04-25", 14, 0),
    scheduleDate: createDate("2025-06-01", 0, 0),
  },
];

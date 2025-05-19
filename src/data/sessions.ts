import { SessionRow } from "@/types/main";
import { students } from "./students";
import { sessionTypes } from "./static-data/session-types";

// Helper function to create a date for a specific weekday and time
const createSessionDate = (
  weekday: number,
  hour: number,
  minute: number
): Date => {
  const date = new Date();
  // Set to next occurrence of the weekday (0 = Sunday, 1 = Monday, etc.)
  const daysUntilNext = (weekday - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + daysUntilNext);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const sessions: SessionRow[] = [
  // Monday sessions
  {
    id: 1,
    centerId: 0,
    studentId: students[0].id, // Emma Davis
    sessionTypeId: sessionTypes.find((st) => st.code === "REGULAR")?.id || 1,
    date: createSessionDate(1, 15, 30), // Monday 3:30 PM
    lengthMinutes: 60,
  },
  {
    id: 2,
    centerId: 0,
    studentId: students[1].id, // Liam Miller
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(1, 16, 0), // Monday 4:00 PM
    lengthMinutes: 60,
  },
  {
    id: 3,
    centerId: 0,
    studentId: students[2].id, // Olivia Wilson
    sessionTypeId: sessionTypes.find((st) => st.code === "CHECKUP")?.id || 4,
    date: createSessionDate(1, 16, 30), // Monday 4:30 PM
    lengthMinutes: 60,
  },

  // Tuesday sessions
  {
    id: 4,
    centerId: 0,
    studentId: students[3].id, // Noah Moore
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(2, 15, 0), // Tuesday 3:00 PM
    lengthMinutes: 60,
  },
  {
    id: 5,
    centerId: 0,
    studentId: students[4].id, // Ava Taylor
    sessionTypeId: sessionTypes.find((st) => st.code === "ONE-ON-ONE")?.id || 5,
    date: createSessionDate(2, 16, 0), // Tuesday 4:00 PM
    lengthMinutes: 90,
  },

  // Wednesday sessions
  {
    id: 6,
    centerId: 0,
    studentId: students[5].id, // Ethan Anderson
    sessionTypeId:
      sessionTypes.find((st) => st.code === "INITIAL ASSESSMENT")?.id || 3,
    date: createSessionDate(3, 15, 30), // Wednesday 3:30 PM
    lengthMinutes: 90,
  },
  {
    id: 7,
    centerId: 0,
    studentId: students[6].id, // Sophia Thomas
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(3, 16, 30), // Wednesday 4:30 PM
    lengthMinutes: 60,
  },

  // Thursday sessions
  {
    id: 8,
    centerId: 0,
    studentId: students[7].id, // Mason Jackson
    sessionTypeId: sessionTypes.find((st) => st.code === "REGULAR")?.id || 1,
    date: createSessionDate(4, 15, 0), // Thursday 3:00 PM
    lengthMinutes: 60,
  },
  {
    id: 9,
    centerId: 0,
    studentId: students[8].id, // Isabella White
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(4, 16, 0), // Thursday 4:00 PM
    lengthMinutes: 60,
  },

  // Friday sessions
  {
    id: 10,
    centerId: 0,
    studentId: students[9].id, // William Harris
    sessionTypeId: sessionTypes.find((st) => st.code === "REGULAR")?.id || 1,
    date: createSessionDate(5, 15, 30), // Friday 3:30 PM
    lengthMinutes: 60,
  },
  {
    id: 11,
    centerId: 0,
    studentId: students[10].id, // Mia Martin
    sessionTypeId: sessionTypes.find((st) => st.code === "CHECKUP")?.id || 4,
    date: createSessionDate(5, 16, 0), // Friday 4:00 PM
    lengthMinutes: 60,
  },

  // Additional sessions for new students
  {
    id: 12,
    centerId: 0,
    studentId: students[11].id, // James Thompson
    sessionTypeId: sessionTypes.find((st) => st.code === "REGULAR")?.id || 1,
    date: createSessionDate(1, 17, 0), // Monday 5:00 PM
    lengthMinutes: 60,
  },
  {
    id: 13,
    centerId: 0,
    studentId: students[12].id, // Charlotte Garcia
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(2, 17, 0), // Tuesday 5:00 PM
    lengthMinutes: 60,
  },
  {
    id: 14,
    centerId: 0,
    studentId: students[13].id, // Benjamin Martinez
    sessionTypeId: sessionTypes.find((st) => st.code === "ONE-ON-ONE")?.id || 5,
    date: createSessionDate(3, 17, 0), // Wednesday 5:00 PM
    lengthMinutes: 90,
  },
  {
    id: 15,
    centerId: 0,
    studentId: students[14].id, // Amelia Robinson
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(4, 17, 0), // Thursday 5:00 PM
    lengthMinutes: 60,
  },
  {
    id: 16,
    centerId: 0,
    studentId: students[15].id, // Lucas Clark
    sessionTypeId:
      sessionTypes.find((st) => st.code === "INITIAL ASSESSMENT")?.id || 3,
    date: createSessionDate(5, 17, 0), // Friday 5:00 PM
    lengthMinutes: 90,
  },
  {
    id: 17,
    centerId: 0,
    studentId: students[16].id, // Harper Rodriguez
    sessionTypeId: sessionTypes.find((st) => st.code === "ONE-ON-ONE")?.id || 5,
    date: createSessionDate(1, 17, 30), // Monday 5:30 PM
    lengthMinutes: 90,
  },
  {
    id: 18,
    centerId: 0,
    studentId: students[17].id, // Henry Lewis
    sessionTypeId:
      sessionTypes.find((st) => st.code === "HOMEWORK HELP")?.id || 2,
    date: createSessionDate(2, 17, 30), // Tuesday 5:30 PM
    lengthMinutes: 60,
  },
];

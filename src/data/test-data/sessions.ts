import { Session } from "@/types/main";
import { students } from "./students";

export const sessions: Session[] = [
  // Monday sessions
  {
    id: 1,
    centerId: 0,
    studentId: students[0].id, // Emma Davis
    sessionTypeId: 1,
    date: new Date("2025-03-01T15:30:00.000Z"),
  },
  {
    id: 2,
    centerId: 0,
    studentId: students[1].id, // Liam Miller
    sessionTypeId: 1,
    date: new Date("2025-03-01T16:00:00.000Z"),
  },
  {
    id: 3,
    centerId: 0,
    studentId: students[2].id, // Olivia Wilson
    sessionTypeId: 2,
    date: new Date("2025-03-01T16:30:00.000Z"),
  },

  // Tuesday sessions
  {
    id: 4,
    centerId: 0,
    studentId: students[3].id, // Noah Moore
    sessionTypeId: 2,
    date: new Date("2025-03-01T15:00:00.000Z"),
  },
  {
    id: 5,
    centerId: 0,
    studentId: students[4].id, // Ava Taylor
    sessionTypeId: 3,
    date: new Date("2025-03-01T16:00:00.000Z"),
  },

  // Wednesday sessions
  {
    id: 6,
    centerId: 0,
    studentId: students[5].id, // Ethan Anderson
    sessionTypeId: 4,
    date: new Date("2025-03-01T15:30:00.000Z"),
  },
  {
    id: 7,
    centerId: 0,
    studentId: students[6].id, // Sophia Thomas
    sessionTypeId: 4,
    date: new Date("2025-03-01T16:30:00.000Z"),
  },

  // Thursday sessions
  {
    id: 8,
    centerId: 0,
    studentId: students[7].id, // Mason Jackson
    sessionTypeId: 1,
    date: new Date("2025-03-01T15:00:00.000Z"),
  },
  {
    id: 9,
    centerId: 0,
    studentId: students[8].id, // Isabella White
    sessionTypeId: 2,
    date: new Date("2025-03-01T16:00:00.000Z"),
  },

  // Friday sessions
  {
    id: 10,
    centerId: 0,
    studentId: students[9].id, // William Harris
    sessionTypeId: 1,
    date: new Date("2025-03-01T15:30:00.000Z"),
  },
  {
    id: 11,
    centerId: 0,
    studentId: students[10].id, // Mia Martin
    sessionTypeId: 4,
    date: new Date("2025-03-01T16:00:00.000Z"),
  },

  // Additional sessions for new students
  {
    id: 12,
    centerId: 0,
    studentId: students[11].id, // James Thompson
    sessionTypeId: 1,
    date: new Date("2025-03-01T17:00:00.000Z"),
  },
  {
    id: 13,
    centerId: 0,
    studentId: students[12].id, // Charlotte Garcia
    sessionTypeId: 3,
    date: new Date("2025-03-01T17:00:00.000Z"),
  },
  {
    id: 14,
    centerId: 0,
    studentId: students[13].id, // Benjamin Martinez
    sessionTypeId: 3,
    date: new Date("2025-03-01T17:00:00.000Z"),
  },
  {
    id: 15,
    centerId: 0,
    studentId: students[14].id, // Amelia Robinson
    sessionTypeId: 2,
    date: new Date("2025-03-01T17:00:00.000Z"),
  },
  {
    id: 16,
    centerId: 0,
    studentId: students[15].id, // Lucas Clark
    sessionTypeId: 3,
    date: new Date("2025-03-01T17:00:00.000Z"),
  },
  {
    id: 17,
    centerId: 0,
    studentId: students[16].id, // Harper Rodriguez
    sessionTypeId: 4,
    date: new Date("2025-03-01T17:30:00.000Z"),
  },
  {
    id: 18,
    centerId: 0,
    studentId: students[17].id, // Henry Lewis
    sessionTypeId: 2,
    date: new Date("2025-03-01T17:30:00.000Z"),
  },
];

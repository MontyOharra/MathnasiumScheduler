/* ────────────────────────────────────────
   Orgs & Access-Control Layer
   ──────────────────────────────────────── */
export type Center = {
  id: number; // int
  name: string; // varchar
};

export type Role = {
  id: number; // int
  code: string; // varchar
  description: string; // varchar
};

export type User = {
  id: number; // int
  centerId: number; // int → foreign key to Center.id
  roleId: number; // int → foreign key to Role.id
  email: string; // varchar
  firstName: string; // varchar
  lastName: string; // varchar
  invitedById: number | null; // int or null
  isActive: boolean; // boolean
};

/* ────────────────────────────────────────
     Lookups
     ──────────────────────────────────────── */
export type GradeLevel = {
  id: number; // int
  name: GradeLevelName; // varchar
  alias: string; // varchar
  is_basic: boolean; // boolean
};

export type SessionType = {
  id: number; // int
  code: SessionTypeCode; // varchar
  length: number; // int
  styling: string; // string
};

export type Weekday = {
  id: number; // int
  name: WeekdayName; // varchar
};

/* ────────────────────────────────────────
     Core Domain Tables
     ──────────────────────────────────────── */
export type Instructor = {
  id: number; // int
  centerId: number; // int → Center.id
  firstName: string; // varchar
  lastName: string; // varchar
  cellColor: string; // varchar
  isActive: boolean; // boolean
};

export type InstructorGradeLevel = {
  instructorId: number; // int → Instructor.id
  gradeLevelId: number; // int → GradeLevel.id
};

export type Student = {
  id: number; // int
  centerId: number; // int → Center.id
  firstName: string; // varchar
  lastName: string; // varchar
  gradeLevelId: number; // int → GradeLevel.id
  isHomeworkHelp: boolean; // boolean
  defaultSessionTypeId: number; // int → SessionType.id
  isActive: boolean; // boolean
};

/* ────────────────────────────────────────
     Scheduling Structures
     ──────────────────────────────────────── */
export type WeeklyScheduleTemplate = {
  id: number; // int
  centerId: number; // int → Center.id
  name: string; // varchar
  isDefault: boolean; // boolean
  intervalLength: number; // int (minutes)
};

export type WeeklyScheduleTemplateWeekday = {
  templateId: number; // int → WeeklyScheduleTemplate.id
  weekdayId: number; // int → Weekday.id
  startTime: string; // time (e.g. "14:30:00")
  endTime: string; // time
  numPods: number; // int
};

/* ────────────────────────────────────────
     Schedules & Sessions
     ──────────────────────────────────────── */
export type WeeklySchedule = {
  id: number;
  centerId: number;
  templateId: number;
  addedByUserId: number;
  dateCreated: Date;
  dateLastModified: Date;
  weekStartDate: Date;
};

export type Schedule = {
  id: number; // int
  weeklyScheduleId: number; // int → WeeklySchedule.id
  scheduleDate: Date; // date
  weekdayId: number; // int → Weekday.id
};

export type ScheduleSession = {
  scheduleId: number; // int → Schedule.id
  sessionId: number; // int → Session.id
};

export type Session = {
  id: number; // int
  centerId: number; // int → Center.id
  studentId: number; // int → Student.id
  sessionTypeId: number; // int → SessionType.id
  date: Date; // datetime
};

/* ────────────────────────────────────────
     Cells (time-slot assignments)
     ──────────────────────────────────────── */
export type ScheduleCell = {
  id: number; // int
  centerId: number; // int → Center.id
  scheduleId: number; // int → Schedule.id
  instructorId: number | null; // int → Instructor.id (nullable)
  studentId: number | null; // int → Student.id (nullable)
  timeStart: Date; // datetime
  timeEnd: Date; // datetime
  columnNumber: number; // int
};

// Legacy type alias for backwards compatibility
export type Cell = ScheduleCell;

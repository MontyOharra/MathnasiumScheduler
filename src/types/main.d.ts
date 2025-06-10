/* ────────────────────────────────────────
   Orgs & Access-Control Layer
   ──────────────────────────────────────── */
   export type Center = {
    id: number;            // int
    name: string;          // varchar
  };
  
  export type Role = {
    id: number;            // int
    code: string;          // varchar
    description: string;   // varchar
  };
  
  export type User = {
    id: number;                // int
    centerId: number;          // int → foreign key to Center.id
    roleId: number;            // int → foreign key to Role.id
    email: string;             // varchar
    firstName: string;         // varchar
    lastName: string;          // varchar
    invitedById: number | null;// int or null  
    isActive: boolean;         // boolean
  };
  
  
  /* ────────────────────────────────────────
     Lookups
     ──────────────────────────────────────── */
  export type GradeLevel = {
    id: number;    // int
    name: GradeLevelName;  // varchar
  };
  
  export type SessionType = {
    id: number;       // int
    code: SessionTypeCode;     // varchar
    length: number;   // int
    styling: string;  // string
  };
  
  export type Weekday = {
    id: number;    // int
    name: WeekdayName;  // varchar
  };
  
  
  /* ────────────────────────────────────────
     Core Domain Tables
     ──────────────────────────────────────── */
  export type Instructor = {
    id: number;            // int
    centerId: number;      // int → Center.id
    firstName: string;     // varchar
    lastName: string;      // varchar
    cellColor: string;     // varchar
    isActive: boolean;     // boolean
  };
  
  export type InstructorGradeLevel = {
    instructorId: number;  // int → Instructor.id
    gradeLevelId: number;  // int → GradeLevel.id
  };
  
  export type Student = {
    id: number;             // int
    centerId: number;       // int → Center.id
    firstName: string;      // varchar
    lastName: string;       // varchar
    gradeLevelId: number;   // int → GradeLevel.id
    isHomeworkHelp: boolean;// boolean
    defaultSessionTypeId: number; // int → SessionType.id
    isActive: boolean;      // boolean
  };
  
  
  /* ────────────────────────────────────────
     Scheduling Structures
     ──────────────────────────────────────── */
  export type WeeklyScheduleTemplate = {
    id: string;           // varchar (UUID)
    centerId: number;     // int → Center.id
    name: string;         // varchar
    isDefault: boolean;   // boolean
    intervalLength: number; // int (minutes)
  };
  
  export type WeeklyScheduleTemplateWeekday = {
    templateId: string;   // varchar → WeeklyScheduleTemplate.id
    weekdayId: number;    // int → Weekday.id
    startTime: string;    // time (e.g. "14:30:00")
    endTime: string;      // time
    numColumns: number;   // int
  };
  
  
  /* ────────────────────────────────────────
     Schedules & Sessions
     ──────────────────────────────────────── */
  export type Schedule = {
    id: string;             // varchar (UUID)
    centerId: number;       // int → Center.id
    templateId: string;     // varchar → WeeklyScheduleTemplate.id
    addedByUserId: number;  // int → User.id
    dateCreated: Date;      // datetime
    dateLastModified: Date; // datetime
    scheduleDate: Date;     // date
  };
  
  export type ScheduleSession = {
    scheduleId: string;   // varchar → Schedule.id
    sessionId: number;    // int → Session.id
  };
  
  export type Session = {
    id: number;             // int
    centerId: number;       // int → Center.id
    studentId: number;      // int → Student.id
    sessionTypeId: number;  // int → SessionType.id
    date: Date;             // datetime
  };
  
  
  /* ────────────────────────────────────────
     Cells (time-slot assignments)
     ──────────────────────────────────────── */
  export type Cell = {
    id: number;            // int
    centerId: number;      // int → Center.id
    scheduleId: string;    // varchar → Schedule.id
    instructorId: number;  // int → Instructor.id
    studentId: number;     // int → Student.id
    timeStart: Date;       // datetime
    timeEnd: Date;         // datetime
    columnNumber: number;  // int
  };
  
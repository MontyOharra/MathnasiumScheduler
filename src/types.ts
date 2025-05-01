/* ──────────────────────────────
   Lookup / Enum helpers
   ────────────────────────────── */
   export type GradeLevel =
   | "K"
   | "1"
   | "2"
   | "3"
   | "4"
   | "5"
   | "6"
   | "7"
   | "8"
   | "9"
   | "10"
   | "11"
   | "12"
   | "Geometry"
   | "Algebra 1"
   | "Algebra 2"
   | "Pre-Calculus"
   | "AP Calculus AB"
   | "AP Calculus BC";
 
 export type SessionTypeCode = "homework-help" | "one-on-one" | "binder";
 export type Weekday =
   | "monday"
   | "tuesday"
   | "wednesday"
   | "thursday"
   | "friday"
   | "saturday"
   | "sunday";
 
 export type RoleCode = "master" | "admin" | "tutor" | "viewer";
 
 /* ──────────────────────────────
    Orgs & Access-Control layer
    ────────────────────────────── */
 export type Center = {
   id: number;
   name: string;
 };
 
 export type Role = {
   id: number;
   code: RoleCode;
   description: string;
 };
 
 export type User = {
   id: number;
   center: Center;          // home center (tenant key)
   role: Role;
   email: string;
   firstName: string;
   lastName: string;
   invitedById?: number;    // undefined for the first “master” user
   isActive: boolean;
 };
 
 /* ──────────────────────────────
    Core domain entities
    ────────────────────────────── */
 export type Instructor = {
   id: number;
   center: Center;
   firstName: string;
   lastName: string;
   gradeLevelsTaught: GradeLevel[]; // many-to-many via join table
   cellColor: string;
   isActive: boolean;
 };
 
 export type Student = {
   id: number;
   center: Center;
   firstName: string;
   lastName: string;
   gradeLevel: GradeLevel;
   isHomeworkHelp: boolean;
   isActive: boolean;
 };
 
 /** join row for instructor ⇄ grade level, if you need it in code */
 export type InstructorGradeLevel = {
   instructorId: number;
   gradeLevel: GradeLevel;
   center: Center;
 };
 
 /* ──────────────────────────────
    Scheduling structures
    ────────────────────────────── */
 export type WeeklyScheduleTemplateWeekday = {
   templateId: string;
   center: Center;
   weekday: Weekday;
   /** stored as “HH:mm” or a Date clipped to 1970-01-01 - pick your poison */
   startTime: string | Date;
   endTime: string | Date;
 };
 
 export type WeeklyScheduleTemplate = {
   id: string;              // UUID
   center: Center;
   name: string;
   numPods: number;
   isDefault: boolean;
   intervalLength: number;  // minutes
   weekdayDetails: WeeklyScheduleTemplateWeekday[];
 };
 
 export type Schedule = {
   id: string;              // UUID
   center: Center;
   template: WeeklyScheduleTemplate;
   addedBy: User;
   dateCreated: Date;
   dateLastModified: Date;
   scheduleDate: Date;
 };
 
 /* ──────────────────────────────
    Events inside a schedule
    ────────────────────────────── */
 export type Session = {
   id: number;
   center: Center;
   student: Student;
   type: SessionTypeCode;
   scheduleId: string;
   date: Date;
   lengthMinutes: number;
 };
 
 export type Cell = {
   id: number;
   center: Center;
   scheduleId: string;
   instructor: Instructor;
   student: Student;
   timeStart: Date;
   timeEnd: Date;
   podNumber: number;
 };
 
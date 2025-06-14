import {
  Center,
  User,
  Instructor,
  Student,
  WeeklyScheduleTemplate,
  Schedule,
  ScheduleCell,
  GradeLevel,
  WeeklySchedule,
} from "../types/main";

// Define TypeScript interfaces for database results
interface DbResultError {
  error: string;
}

// Type guard to check if result has error
function isErrorResult(result: unknown): result is DbResultError {
  return (
    result !== null &&
    typeof result === "object" &&
    "error" in result &&
    typeof (result as DbResultError).error === "string"
  );
}

// Check if we're in an Electron environment
const isElectron = () => {
  return (
    typeof window !== "undefined" &&
    typeof window.electron !== "undefined" &&
    window.electron !== null
  );
};

// Convert snake_case database fields to camelCase for frontend
function snakeToCamel<T>(obj: Record<string, unknown>): T {
  const newObj: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    // Replace snake_case with camelCase
    const newKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );

    if (key.endsWith("_id")) {
      // For foreign keys, just store the ID value
      const baseKey = newKey.replace(/Id$/, "");
      newObj[baseKey] = obj[key];
      newObj[newKey] = obj[key]; // Also keep the ID property
    } else {
      newObj[newKey] = obj[key];
    }
  });

  return newObj as T;
}

// Convert camelCase front-end fields to snake_case for database
function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    // Replace camelCase with snake_case
    const newKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );

    // Handle nested objects like center: { id: 1 } to center_id: 1
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      obj[key] &&
      typeof obj[key] === "object" &&
      "id" in obj[key]
    ) {
      newObj[`${newKey}_id`] = (obj[key] as { id: unknown }).id;
    } else {
      newObj[newKey] = obj[key];
    }
  });

  return newObj;
}

// Database service class
export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Check if we're in Electron and can access the database
  private checkElectron() {
    if (!isElectron()) {
      // Return empty array or default values instead of throwing error
      return [];
    }
  }

  // Generic error handler
  private handleError<T>(result: T | DbResultError): T {
    if (isErrorResult(result)) {
      throw new Error(result.error);
    }
    return result;
  }

  // Centers
  async getCenters(): Promise<Center[]> {
    this.checkElectron();
    const results = await window.electron.database.getCenters();
    this.handleError(results);
    return results.map((center: Record<string, unknown>) =>
      snakeToCamel<Center>(center)
    );
  }

  async addCenter(center: Omit<Center, "id">): Promise<number> {
    this.checkElectron();
    const dbCenter = camelToSnake(center);
    const result = await window.electron.database.addCenter(dbCenter);
    this.handleError(result);
    return result.id as number;
  }

  // Users
  async getUsers(): Promise<User[]> {
    this.checkElectron();
    const windowLocal = window as Window;
    const results = await windowLocal.electron.database.getAll("users");
    this.handleError(results);
    return results.map((user: Record<string, unknown>) =>
      snakeToCamel<User>(user)
    );
  }

  async getUserById(id: number): Promise<User> {
    this.checkElectron();
    const result = await window.electron.database.getById("users", id);
    this.handleError(result);
    return snakeToCamel<User>(result);
  }

  async addUser(user: Omit<User, "id">): Promise<number> {
    this.checkElectron();
    const dbUser = camelToSnake(user);
    const result = await window.electron.database.insert("users", dbUser);
    this.handleError(result);
    return result.id as number;
  }

  async updateUser(id: number, user: Partial<User>): Promise<boolean> {
    this.checkElectron();
    const dbUser = camelToSnake(user);
    const result = await window.electron.database.update("users", id, dbUser);
    this.handleError(result);
    return result.changes > 0;
  }

  // Instructors
  async getInstructors(centerId: number): Promise<Instructor[]> {
    this.checkElectron();
    const results = await window.electron.database.getInstructors(centerId);
    this.handleError(results);
    return results.map((instructor: Record<string, unknown>) =>
      snakeToCamel<Instructor>(instructor)
    );
  }

  async getActiveInstructors(centerId: number): Promise<Instructor[]> {
    this.checkElectron();
    const results = await window.electron.database.getActiveInstructors(
      centerId
    );
    this.handleError(results);
    return results.map((instructor: Record<string, unknown>) =>
      snakeToCamel<Instructor>(instructor)
    );
  }

  async getInstructorById(id: number): Promise<Instructor | null> {
    this.checkElectron();
    const results = await window.electron.database.customQuery(
      "SELECT * FROM instructor WHERE id = ?",
      [id]
    );
    this.handleError(results);
    if (results.length === 0) return null;
    return snakeToCamel<Instructor>(results[0]);
  }

  async getInstructorGradeLevelIds(instructorId: number): Promise<number[]> {
    this.checkElectron();
    const results = await window.electron.database.customQuery(
      "SELECT grade_level_id FROM instructor_grade_level WHERE instructor_id = ?",
      [instructorId]
    );
    this.handleError(results);
    return results.map((row: any) => row.grade_level_id);
  }

  async updateInstructor(
    id: number,
    instructor: Partial<Instructor>
  ): Promise<boolean> {
    this.checkElectron();
    const dbInstructor = camelToSnake(instructor);
    const result = await window.electron.database.update(
      "instructor",
      id,
      dbInstructor
    );
    this.handleError(result);
    return result.changes > 0;
  }

  async updateInstructorGradeLevels(
    instructorId: number,
    gradeLevelIds: number[]
  ): Promise<void> {
    this.checkElectron();

    // First, delete existing grade level associations
    await window.electron.database.customQuery(
      "DELETE FROM instructor_grade_level WHERE instructor_id = ?",
      [instructorId]
    );

    // Then, insert new grade level associations
    for (const gradeLevelId of gradeLevelIds) {
      await window.electron.database.customQuery(
        "INSERT INTO instructor_grade_level (instructor_id, grade_level_id) VALUES (?, ?)",
        [instructorId, gradeLevelId]
      );
    }
  }

  async getInstructorsWithGradeLevels(
    centerId: number
  ): Promise<Array<Instructor & { gradeLevels: string[] }>> {
    this.checkElectron();

    try {
      // Try the dedicated method first
      const results =
        await window.electron.database.getInstructorsWithGradeLevels(centerId);
      this.handleError(results);

      return results.map((row: Record<string, unknown>) => {
        const instructor = snakeToCamel<Instructor>(row);
        // Use aliases for compact display, fallback to names if aliases not available
        const gradeLevelAliases = row.grade_level_aliases
          ? String(row.grade_level_aliases).split(",")
          : [];
        const gradeLevelNames = row.grade_level_names
          ? String(row.grade_level_names).split(",")
          : [];

        return {
          ...instructor,
          gradeLevels:
            gradeLevelAliases.length > 0 ? gradeLevelAliases : gradeLevelNames,
        };
      });
    } catch (error) {
      // Fallback to custom query if the dedicated method doesn't exist
      console.warn(
        "getInstructorsWithGradeLevels method not available, using fallback",
        error
      );
      const results = await window.electron.database.customQuery(
        `SELECT i.*, 
         GROUP_CONCAT(gl.name) as grade_level_names,
         GROUP_CONCAT(gl.alias) as grade_level_aliases,
         GROUP_CONCAT(igl.grade_level_id) as grade_level_ids
         FROM instructor i
         LEFT JOIN instructor_grade_level igl ON i.id = igl.instructor_id
         LEFT JOIN grade_level gl ON igl.grade_level_id = gl.id
         WHERE i.center_id = ? AND i.is_active = 1
         GROUP BY i.id
         ORDER BY i.last_name, i.first_name`,
        [centerId]
      );
      this.handleError(results);

      return results.map((row: Record<string, unknown>) => {
        const instructor = snakeToCamel<Instructor>(row);
        // Use aliases for compact display, fallback to names if aliases not available
        const gradeLevelAliases = row.grade_level_aliases
          ? String(row.grade_level_aliases).split(",")
          : [];
        const gradeLevelNames = row.grade_level_names
          ? String(row.grade_level_names).split(",")
          : [];

        return {
          ...instructor,
          gradeLevels:
            gradeLevelAliases.length > 0 ? gradeLevelAliases : gradeLevelNames,
        };
      });
    }
  }

  async addInstructor(
    instructor: Omit<Instructor, "id">,
    gradeLevels: GradeLevel[]
  ): Promise<number> {
    this.checkElectron();
    try {
      // Insert instructor
      const dbInstructor = camelToSnake(instructor);
      const instructorResult = await window.electron.database.insert(
        "instructors",
        dbInstructor
      );
      this.handleError(instructorResult);

      const instructorId = instructorResult.id as number;

      // Insert grade levels for instructor
      for (const gradeLevel of gradeLevels) {
        const gradeData = {
          instructor_id: instructorId,
          grade_level: gradeLevel,
          center_id: (instructor as any).center?.id || instructor.centerId,
        };

        await window.electron.database.insert(
          "instructor_grade_levels",
          gradeData
        );
      }

      return instructorId;
    } catch (error) {
      console.error("Error adding instructor:", error);
      throw error;
    }
  }

  // Students
  async getStudents(centerId: number): Promise<Student[]> {
    this.checkElectron();
    const results = await window.electron.database.getStudents(centerId);
    this.handleError(results);
    return results.map((student: Record<string, unknown>) =>
      snakeToCamel<Student>(student)
    );
  }

  async getActiveStudents(centerId: number): Promise<Student[]> {
    this.checkElectron();
    const results = await window.electron.database.getActiveStudents(centerId);
    this.handleError(results);
    return results.map((student: Record<string, unknown>) =>
      snakeToCamel<Student>(student)
    );
  }

  async getStudentsWithDetails(
    centerId: number,
    sort?: {
      field: "firstName" | "lastName" | "gradeLevel" | "sessionType" | null;
      direction: "asc" | "desc";
    }
  ): Promise<
    (Student & {
      gradeLevelName: string;
      sessionTypeCode: string;
      sessionTypeLength: number;
    })[]
  > {
    this.checkElectron();
    try {
      console.log("Sorting with:", sort);
      // @ts-ignore - The preload script accepts two parameters
      const results = await window.electron.database.getStudentsWithDetails(
        centerId,
        sort
      );
      this.handleError(results);
      return results.map((student: Record<string, unknown>) =>
        snakeToCamel<
          Student & {
            gradeLevelName: string;
            sessionTypeCode: string;
            sessionTypeLength: number;
          }
        >(student)
      );
    } catch (error) {
      console.error("Error in getStudentsWithDetails:", error);
      return [];
    }
  }

  async getGradeLevels(): Promise<
    { id: number; name: string; alias: string; is_basic: boolean }[]
  > {
    this.checkElectron();
    const results = await window.electron.database.getGradeLevels();
    this.handleError(results);
    return results.map((gradeLevel: Record<string, unknown>) => ({
      id: gradeLevel.id as number,
      name: gradeLevel.name as string,
      alias: gradeLevel.alias as string,
      is_basic: Boolean(gradeLevel.is_basic),
    }));
  }

  async getSessionTypes(): Promise<
    { id: number; code: string; length: number; sessionAlias: string }[]
  > {
    this.checkElectron();
    const results = await window.electron.database.getAll("session_type");
    this.handleError(results);
    return results.map((sessionType: Record<string, unknown>) => ({
      id: sessionType.id as number,
      code: sessionType.code as string,
      length: sessionType.length as number,
      sessionAlias: sessionType.session_alias as string,
    }));
  }

  async getWeekdayById(id: number): Promise<{ id: number; name: string }> {
    this.checkElectron();
    const result = await window.electron.database.getById("weekday", id);
    this.handleError(result);
    return {
      id: result.id as number,
      name: result.name as string,
    };
  }

  async updateStudent(id: number, student: Partial<Student>): Promise<boolean> {
    this.checkElectron();
    const dbStudent = camelToSnake(student);
    const result = await window.electron.database.updateStudent(id, dbStudent);
    this.handleError(result);
    return result.changes > 0;
  }

  async insertStudent(student: Omit<Student, "id">): Promise<number> {
    this.checkElectron();
    const dbStudent = camelToSnake({
      ...student,
      default_session_type_id: student.defaultSessionTypeId,
      is_homework_help: student.isHomeworkHelp ? 1 : 0,
      is_active: student.isActive ? 1 : 0,
    });
    const result = await window.electron.database.insert("student", dbStudent);
    this.handleError(result);
    return result.id as number;
  }

  // Schedules
  async getScheduleTemplates(
    centerId: number
  ): Promise<WeeklyScheduleTemplate[]> {
    this.checkElectron();
    const results = await window.electron.database.getScheduleTemplates(
      centerId
    );
    this.handleError(results);
    return results.map((template: Record<string, unknown>) =>
      snakeToCamel<WeeklyScheduleTemplate>(template)
    );
  }

  async getWeeklySchedulesByCenterId(centerId: number): Promise<
    (WeeklySchedule & {
      addedByName: string;
      templateName: string;
    })[]
  > {
    this.checkElectron();
    const results = await window.electron.database.getWeeklySchedulesByCenterId(
      centerId
    );
    this.handleError(results);
    return results.map((schedule: Record<string, unknown>) =>
      snakeToCamel<
        WeeklySchedule & {
          addedByName: string;
          templateName: string;
        }
      >(schedule)
    );
  }

  async getSchedulesByCenterId(centerId: number): Promise<Schedule[]> {
    if (!isElectron()) {
      return []; // Return empty array in non-Electron environment
    }
    const results = await window.electron.database.getSchedulesByCenterId(
      centerId
    );
    this.handleError(results);
    return results.map((schedule: Record<string, unknown>) =>
      snakeToCamel<Schedule>(schedule)
    );
  }

  async getSchedulesForDate(
    date: string,
    centerId: number
  ): Promise<Schedule[]> {
    this.checkElectron();
    const results = await window.electron.database.getSchedulesByDate(
      date,
      centerId
    );
    this.handleError(results);
    return results.map((schedule: Record<string, unknown>) =>
      snakeToCamel<Schedule>(schedule)
    );
  }

  async getSchedulesByWeeklyScheduleId(
    weeklyScheduleId: number
  ): Promise<Schedule[]> {
    this.checkElectron();
    const results = await window.electron.database.customQuery(
      "SELECT * FROM schedule WHERE weekly_schedule_id = ?",
      [weeklyScheduleId]
    );
    this.handleError(results);
    return results.map((schedule: Record<string, unknown>) =>
      snakeToCamel<Schedule>(schedule)
    );
  }

  async getTemplateWeekdayByTemplateAndWeekday(
    templateId: number,
    weekdayId: number
  ): Promise<{
    startTime: string;
    endTime: string;
    numPods: number;
    intervalLength: number;
  } | null> {
    this.checkElectron();
    const results = await window.electron.database.customQuery(
      `SELECT wtw.start_time, wtw.end_time, wtw.num_pods, wst.interval_length 
       FROM weekly_schedule_template_weekday wtw 
       JOIN weekly_schedule_template wst ON wtw.template_id = wst.id 
       WHERE wtw.template_id = ? AND wtw.weekday_id = ?`,
      [templateId, weekdayId]
    );
    this.handleError(results);
    if (results.length === 0) return null;
    return snakeToCamel<{
      startTime: string;
      endTime: string;
      numPods: number;
      intervalLength: number;
    }>(results[0]);
  }

  async getScheduleWithDetails(
    id: number,
    centerId: number
  ): Promise<
    WeeklySchedule & {
      templateName: string;
      intervalLength: number;
      addedByName: string;
    }
  > {
    this.checkElectron();
    const result = await window.electron.database.getScheduleWithDetails(
      id,
      centerId
    );
    this.handleError(result);
    return snakeToCamel<
      WeeklySchedule & {
        templateName: string;
        intervalLength: number;
        addedByName: string;
      }
    >(result[0]);
  }

  // Schedule Cells (instructor-student assignments)
  async getScheduleCellsForSchedule(
    scheduleId: number,
    centerId: number
  ): Promise<
    (ScheduleCell & {
      instructorFirstName: string | null;
      instructorLastName: string | null;
      studentFirstName: string | null;
      studentLastName: string | null;
    })[]
  > {
    this.checkElectron();
    const results = await window.electron.database.getScheduleCellsForSchedule(
      scheduleId,
      centerId
    );
    this.handleError(results);
    return results.map((cell: Record<string, unknown>) =>
      snakeToCamel<
        ScheduleCell & {
          instructorFirstName: string | null;
          instructorLastName: string | null;
          studentFirstName: string | null;
          studentLastName: string | null;
        }
      >(cell)
    );
  }

  // Legacy method for backwards compatibility
  async getCellsForSchedule(
    scheduleId: number,
    centerId: number
  ): Promise<
    (ScheduleCell & {
      instructorFirstName: string | null;
      instructorLastName: string | null;
      studentFirstName: string | null;
      studentLastName: string | null;
    })[]
  > {
    return this.getScheduleCellsForSchedule(scheduleId, centerId);
  }

  // Custom queries
  async customQuery<T>(query: string, params: unknown[] = []): Promise<T[]> {
    this.checkElectron();
    const results = await window.electron.database.customQuery(query, params);
    this.handleError(results);
    return results.map((item: Record<string, unknown>) =>
      snakeToCamel<T>(item)
    );
  }

  async insertSession(data: {
    centerId: number;
    studentId: number;
    sessionTypeId: number;
    date: string; // ISO string
  }): Promise<number> {
    this.checkElectron();
    const result = await window.electron.database.insert("session", {
      center_id: data.centerId,
      student_id: data.studentId,
      session_type_id: data.sessionTypeId,
      date: data.date,
    });
    this.handleError(result);
    return result.id as number;
  }

  async insertScheduleCell(data: {
    centerId: number;
    scheduleId: number;
    instructorId: number | null;
    studentId: number;
    timeStart: string; // "HH:mm"
    timeEnd: string; // "HH:mm"
    columnNumber: number;
  }): Promise<number> {
    this.checkElectron();
    const result = await window.electron.database.insert("schedule_cell", {
      center_id: data.centerId,
      schedule_id: data.scheduleId,
      instructor_id: data.instructorId,
      student_id: data.studentId,
      time_start: data.timeStart,
      time_end: data.timeEnd,
      column_number: data.columnNumber,
    });
    this.handleError(result);
    return result.id as number;
  }
}

// Export a singleton instance
const dbService = DatabaseService.getInstance();
export default dbService;

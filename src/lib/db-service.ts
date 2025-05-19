import {
  Center,
  User,
  Instructor,
  Student,
  WeeklyScheduleTemplate,
  Schedule,
  Cell,
  GradeLevel,
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
    typeof window !== "undefined" && typeof window.electron !== "undefined"
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
      throw new Error("This functionality requires Electron runtime");
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
  async getInstructors(): Promise<Instructor[]> {
    this.checkElectron();
    const results = await window.electron.database.getInstructors();
    this.handleError(results);
    return results.map((instructor: Record<string, unknown>) =>
      snakeToCamel<Instructor>(instructor)
    );
  }

  async getActiveInstructors(): Promise<Instructor[]> {
    this.checkElectron();
    const results = await window.electron.database.getActiveInstructors();
    this.handleError(results);
    return results.map((instructor: Record<string, unknown>) =>
      snakeToCamel<Instructor>(instructor)
    );
  }

  async getInstructorWithGradeLevels(
    id: number
  ): Promise<number> {
    this.checkElectron();

    // TODO: Implement this

    return id;
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
  async getStudents(): Promise<Student[]> {
    this.checkElectron();
    const results = await window.electron.database.getStudents();
    this.handleError(results);
    return results.map((student: Record<string, unknown>) =>
      snakeToCamel<Student>(student)
    );
  }

  async getActiveStudents(): Promise<Student[]> {
    this.checkElectron();
    const results = await window.electron.database.getActiveStudents();
    this.handleError(results);
    return results.map((student: Record<string, unknown>) =>
      snakeToCamel<Student>(student)
    );
  }

  // Schedules
  async getScheduleTemplates(): Promise<WeeklyScheduleTemplate[]> {
    this.checkElectron();
    const results = await window.electron.database.getScheduleTemplates();
    this.handleError(results);
    return results.map((template: Record<string, unknown>) =>
      snakeToCamel<WeeklyScheduleTemplate>(template)
    );
  }

  async getSchedulesForDate(date: string): Promise<Schedule[]> {
    this.checkElectron();
    const results = await window.electron.database.getSchedulesByDate(date);
    this.handleError(results);
    return results.map((schedule: Record<string, unknown>) =>
      snakeToCamel<Schedule>(schedule)
    );
  }

  async getScheduleWithDetails(id: string): Promise<
    Schedule & {
      templateName: string;
      numPods: number;
      intervalLength: number;
      addedByName: string;
    }
  > {
    this.checkElectron();
    const result = await window.electron.database.getScheduleWithDetails(id);
    this.handleError(result);
    return snakeToCamel<
      Schedule & {
        templateName: string;
        numPods: number;
        intervalLength: number;
        addedByName: string;
      }
    >(result[0]);
  }

  // Cells (instructor-student assignments)
  async getCellsForSchedule(scheduleId: string): Promise<
    (Cell & {
      instructorFirstName: string;
      instructorLastName: string;
      studentFirstName: string;
      studentLastName: string;
    })[]
  > {
    this.checkElectron();
    const results = await window.electron.database.getCellsForSchedule(
      scheduleId
    );
    this.handleError(results);
    return results.map((cell: Record<string, unknown>) =>
      snakeToCamel<
        Cell & {
          instructorFirstName: string;
          instructorLastName: string;
          studentFirstName: string;
          studentLastName: string;
        }
      >(cell)
    );
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
}

// Export a singleton instance
const dbService = DatabaseService.getInstance();
export default dbService;

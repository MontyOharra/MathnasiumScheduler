// Global type declaration - no imports or exports here

interface ElectronAPI {
  appInfo: {
    name: string;
  };
  database: {
    // Basic CRUD operations
    getAll: (table: string) => Promise<DbQueryResult>;
    getById: (table: string, id: number | string) => Promise<DbRecord>;
    insert: (
      table: string,
      data: Record<string, unknown>
    ) => Promise<{ id: number | string }>;
    update: (
      table: string,
      id: number | string,
      data: Record<string, unknown>
    ) => Promise<{ changes: number }>;
    delete: (
      table: string,
      id: number | string
    ) => Promise<{ changes: number }>;

    // Advanced queries
    customQuery: (query: string, params?: unknown[]) => Promise<DbQueryResult>;

    // Entity-specific operations
    getCenters: () => Promise<DbQueryResult>;
    addCenter: (data: Record<string, unknown>) => Promise<{ id: number }>;

    getInstructors: (centerId: number) => Promise<DbQueryResult>;
    getActiveInstructors: (centerId: number) => Promise<DbQueryResult>;

    getStudents: (centerId: number) => Promise<DbQueryResult>;
    getActiveStudents: (centerId: number) => Promise<DbQueryResult>;
    getStudentsWithDetails: (
      centerId: number,
      sort?: Sort
    ) => Promise<DbQueryResult>;
    updateStudent: (
      studentId: number,
      data: Record<string, unknown>
    ) => Promise<{ changes: number }>;

    getScheduleTemplates: (centerId: number) => Promise<DbQueryResult>;
    getDefaultTemplate: (centerId: number) => Promise<DbQueryResult>;

    getSchedulesByCenterId: (centerId: number) => Promise<DbQueryResult>;
    getSchedulesByDate: (
      date: string,
      centerId: number
    ) => Promise<DbQueryResult>;
    getWeeklySchedulesByCenterId: (centerId: number) => Promise<DbQueryResult>;

    getInstructorWithGradeLevels: (
      instructorId: number,
      centerId: number
    ) => Promise<DbQueryResult>;
    getInstructorsWithGradeLevels: (centerId: number) => Promise<DbQueryResult>;
    getScheduleWithDetails: (
      scheduleId: number,
      centerId: number
    ) => Promise<DbQueryResult>;
    getScheduleCellsForSchedule: (
      scheduleId: number,
      centerId: number
    ) => Promise<DbQueryResult>;
    getCellsForSchedule: (
      scheduleId: number,
      centerId: number
    ) => Promise<DbQueryResult>;
    getGradeLevels: () => Promise<DbQueryResult>;
  };
}

interface Window {
  electron: ElectronAPI;
}

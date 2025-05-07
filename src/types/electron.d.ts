interface DbRecord {
  id: number | string;
  [key: string]: unknown;
}

type DbQueryResult<T = DbRecord> = T[];

interface DbResultSuccess {
  id: number | string;
  changes: number;
}

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

    getInstructors: () => Promise<DbQueryResult>;
    getActiveInstructors: () => Promise<DbQueryResult>;

    getStudents: () => Promise<DbQueryResult>;
    getActiveStudents: () => Promise<DbQueryResult>;

    getScheduleTemplates: () => Promise<DbQueryResult>;
    getDefaultTemplate: (centerId: number) => Promise<DbQueryResult>;

    getSchedulesByDate: (date: string) => Promise<DbQueryResult>;

    getInstructorWithGradeLevels: (
      instructorId: number
    ) => Promise<DbQueryResult>;
    getScheduleWithDetails: (scheduleId: string) => Promise<DbQueryResult>;
    getCellsForSchedule: (scheduleId: string) => Promise<DbQueryResult>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

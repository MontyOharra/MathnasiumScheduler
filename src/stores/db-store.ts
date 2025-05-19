import { create } from "zustand";
import {
  Center,
  GradeLevel,
  Instructor,
  Student,
  Schedule,
  Cell,
} from "../types/main";
import dbService from "../lib/db-service";

interface DatabaseStore {
  // State
  centers: Center[];
  instructors: Instructor[];
  students: Student[];
  schedules: Schedule[];
  cells: Cell[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCenters: () => Promise<void>;
  fetchInstructors: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchSchedulesForDate: (date: string) => Promise<void>;
  fetchCellsForSchedule: (scheduleId: string) => Promise<void>;

  // CRUD operations
  addCenter: (center: Omit<Center, "id">) => Promise<number>;
  addInstructor: (
    instructor: Omit<Instructor, "id">,
    gradeLevels: GradeLevel[]
  ) => Promise<number>;
  addStudent: (student: Omit<Student, "id">) => Promise<number>;

  // Reset functions
  resetError: () => void;
}

const useDbStore = create<DatabaseStore>((set) => ({
  centers: [],
  instructors: [],
  students: [],
  schedules: [],
  cells: [],
  isLoading: false,
  error: null,

  fetchCenters: async () => {
    set({ isLoading: true, error: null });
    try {
      const centers = await dbService.getCenters();
      set({ centers, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred fetching centers",
        isLoading: false,
      });
    }
  },

  fetchInstructors: async () => {
    set({ isLoading: true, error: null });
    try {
      const instructors = await dbService.getInstructors();
      set({ instructors, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred fetching instructors",
        isLoading: false,
      });
    }
  },

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const students = await dbService.getStudents();
      set({ students, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred fetching students",
        isLoading: false,
      });
    }
  },

  fetchSchedulesForDate: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const schedules = await dbService.getSchedulesForDate(date);
      set({ schedules, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred fetching schedules",
        isLoading: false,
      });
    }
  },

  fetchCellsForSchedule: async (scheduleId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cells = await dbService.getCellsForSchedule(scheduleId);
      set({ cells, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred fetching cells",
        isLoading: false,
      });
    }
  },

  addCenter: async (center: Omit<Center, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const centerId = await dbService.addCenter(center);
      set((state) => ({
        centers: [...state.centers, { id: centerId, ...center }],
        isLoading: false,
      }));
      return centerId;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred adding center",
        isLoading: false,
      });
      throw error;
    }
  },

  addInstructor: async (
    instructor: Omit<Instructor, "id">,
    gradeLevels: GradeLevel[]
  ) => {
    set({ isLoading: true, error: null });
    try {
      const instructorId = await dbService.addInstructor(
        instructor,
        gradeLevels
      );
      set((state) => ({
        instructors: [
          ...state.instructors,
          { id: instructorId, ...instructor, gradeLevelsTaught: gradeLevels },
        ],
        isLoading: false,
      }));
      return instructorId;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred adding instructor",
        isLoading: false,
      });
      throw error;
    }
  },

  addStudent: async (student: Omit<Student, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const result = await dbService.customQuery<{ id: number }>(
        "INSERT INTO students (center_id, first_name, last_name, grade_level, is_homework_help, is_active) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
        [
          student.centerId,
          student.firstName,
          student.lastName,
          student.gradeLevelId,
          student.isHomeworkHelp ? 1 : 0,
          1,
        ]
      );
      const studentId = result[0]?.id || 0;

      set((state) => ({
        students: [...state.students, { id: studentId, ...student }],
        isLoading: false,
      }));
      return studentId;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred adding student",
        isLoading: false,
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));

export default useDbStore;

import { contextBridge, ipcRenderer } from "electron";

console.log("Preload script is executing!");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  appInfo: {
    name: "Mathnasium Scheduler",
    isElectron: true,
    timestamp: new Date().toISOString(),
    preloadExecuted: true,
  },
  database: {
    // Basic CRUD operations
    getAll: (table) => ipcRenderer.invoke("db-get-all", table),
    getById: (table, id) => ipcRenderer.invoke("db-get-by-id", table, id),
    insert: (table, data) => ipcRenderer.invoke("db-insert", table, data),
    update: (table, id, data) =>
      ipcRenderer.invoke("db-update", table, id, data),
    delete: (table, id) => ipcRenderer.invoke("db-delete", table, id),

    // Advanced queries
    customQuery: (query, params) =>
      ipcRenderer.invoke("db-custom-query", query, params),

    // Entity-specific operations for convenience
    // Centers
    getCenters: () => ipcRenderer.invoke("db-get-all", "centers"),
    addCenter: (data) => ipcRenderer.invoke("db-insert", "centers", data),

    // Instructors
    getInstructors: () => ipcRenderer.invoke("db-get-all", "instructors"),
    getActiveInstructors: () =>
      ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM instructors WHERE is_active = 1"
      ),

    // Students
    getStudents: () => ipcRenderer.invoke("db-get-all", "students"),
    getActiveStudents: () =>
      ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM students WHERE is_active = 1"
      ),

    // Schedule templates
    getScheduleTemplates: () =>
      ipcRenderer.invoke("db-get-all", "weekly_schedule_templates"),
    getDefaultTemplate: (centerId) =>
      ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM weekly_schedule_templates WHERE center_id = ? AND is_default = 1",
        [centerId]
      ),

    // Schedules
    getSchedulesByCenterId: (centerId) =>
      ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM schedules WHERE center_id = ?",
        [centerId]
      ),

    getSchedulesByDate: (date) =>
      ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM schedules WHERE schedule_date = ?",
        [date]
      ),

    // For relationships that need joins
    getInstructorWithGradeLevels: (instructorId) =>
      ipcRenderer.invoke(
        "db-custom-query",
        `SELECT i.*, GROUP_CONCAT(igl.grade_level) as grade_levels 
         FROM instructors i 
         LEFT JOIN instructor_grade_levels igl ON i.id = igl.instructor_id 
         WHERE i.id = ? 
         GROUP BY i.id`,
        [instructorId]
      ),

    getScheduleWithDetails: (scheduleId) =>
      ipcRenderer.invoke(
        "db-custom-query",
        `SELECT s.*, t.name as template_name, t.num_pods, t.interval_length,
         u.first_name || ' ' || u.last_name as added_by_name
         FROM schedules s
         JOIN weekly_schedule_templates t ON s.template_id = t.id
         JOIN users u ON s.added_by_user_id = u.id
         WHERE s.id = ?`,
        [scheduleId]
      ),

    // Cells (assignments)
    getCellsForSchedule: (scheduleId) =>
      ipcRenderer.invoke(
        "db-custom-query",
        `SELECT c.*,
         i.first_name as instructor_first_name, i.last_name as instructor_last_name,
         s.first_name as student_first_name, s.last_name as student_last_name
         FROM cells c
         JOIN instructors i ON c.instructor_id = i.id
         JOIN students s ON c.student_id = s.id
         WHERE c.schedule_id = ?
         ORDER BY c.time_start, c.pod_number`,
        [scheduleId]
      ),
  },
});

// Export a marker to show that the preload script was loaded
module.exports = { preloadLoaded: true };

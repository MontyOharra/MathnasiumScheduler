const { contextBridge, ipcRenderer } = require("electron");

console.log("[Preload] Preload script is executing!");

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
    getAll: (table) => {
      console.log("[Preload] getAll called with table:", table);
      return ipcRenderer.invoke("db-get-all", table);
    },
    getById: (table, id) => {
      console.log("[Preload] getById called with table:", table, "id:", id);
      return ipcRenderer.invoke("db-get-by-id", table, id);
    },
    insert: (table, data) => {
      console.log("[Preload] insert called with table:", table, "data:", data);
      return ipcRenderer.invoke("db-insert", table, data);
    },
    update: (table, id, data) => {
      console.log(
        "[Preload] update called with table:",
        table,
        "id:",
        id,
        "data:",
        data
      );
      return ipcRenderer.invoke("db-update", table, id, data);
    },
    delete: (table, id) => {
      console.log("[Preload] delete called with table:", table, "id:", id);
      return ipcRenderer.invoke("db-delete", table, id);
    },

    // Advanced queries
    customQuery: (query, params) => {
      console.log(
        "[Preload] customQuery called with query:",
        query,
        "params:",
        params
      );
      return ipcRenderer.invoke("db-custom-query", query, params);
    },

    // Entity-specific operations for convenience
    // Centers
    getCenters: () => {
      console.log("[Preload] getCenters called");
      return ipcRenderer.invoke("db-get-all", "centers");
    },
    addCenter: (data) => {
      console.log("[Preload] addCenter called with data:", data);
      return ipcRenderer.invoke("db-insert", "centers", data);
    },

    // Instructors
    getInstructors: () => {
      console.log("[Preload] getInstructors called");
      return ipcRenderer.invoke("db-get-all", "instructors");
    },
    getActiveInstructors: () => {
      console.log("[Preload] getActiveInstructors called");
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM instructors WHERE is_active = 1"
      );
    },

    // Students
    getStudents: () => {
      console.log("[Preload] getStudents called");
      return ipcRenderer.invoke("db-get-all", "students");
    },
    getActiveStudents: () => {
      console.log("[Preload] getActiveStudents called");
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM students WHERE is_active = 1"
      );
    },

    // Schedule templates
    getScheduleTemplates: () => {
      console.log("[Preload] getScheduleTemplates called");
      return ipcRenderer.invoke("db-get-all", "weekly_schedule_templates");
    },
    getDefaultTemplate: (centerId) => {
      console.log(
        "[Preload] getDefaultTemplate called with centerId:",
        centerId
      );
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM weekly_schedule_templates WHERE center_id = ? AND is_default = 1",
        [centerId]
      );
    },

    // Schedules
    getSchedulesByCenterId: (centerId) => {
      console.log(
        "[Preload] getSchedulesByCenterId called with centerId:",
        centerId
      );
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM schedule WHERE center_id = ?",
        [centerId]
      );
    },
    getSchedulesByDate: (date) => {
      console.log("[Preload] getSchedulesByDate called with date:", date);
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM schedules WHERE schedule_date = ?",
        [date]
      );
    },

    // Schedule details
    getScheduleWithDetails: (scheduleId) => {
      console.log(
        "[Preload] getScheduleWithDetails called with scheduleId:",
        scheduleId
      );
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT s.*, t.name as template_name, t.interval_length,
         (SELECT COUNT(*) FROM cells WHERE schedule_id = s.id) as num_pods,
         u.first_name || ' ' || u.last_name as added_by_name
         FROM schedules s
         LEFT JOIN weekly_schedule_templates t ON s.template_id = t.id
         LEFT JOIN users u ON s.added_by_user_id = u.id
         WHERE s.id = ?`,
        [scheduleId]
      );
    },

    // Cells
    getCellsForSchedule: (scheduleId) => {
      console.log(
        "[Preload] getCellsForSchedule called with scheduleId:",
        scheduleId
      );
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT c.*, i.first_name as instructor_first_name, i.last_name as instructor_last_name,
         s.first_name as student_first_name, s.last_name as student_last_name
         FROM cells c
         LEFT JOIN instructors i ON c.instructor_id = i.id
         LEFT JOIN students s ON c.student_id = s.id
         WHERE c.schedule_id = ?`,
        [scheduleId]
      );
    },
  },
});

console.log("[Preload] Electron API exposed to renderer process");

// Export a marker to show that the preload script was loaded
module.exports = { preloadLoaded: true };

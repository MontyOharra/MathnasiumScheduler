/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

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
      return ipcRenderer.invoke("db-get-all", table);
    },
    getById: (table, id) => {
      return ipcRenderer.invoke("db-get-by-id", table, id);
    },
    insert: (table, data) => {
      return ipcRenderer.invoke("db-insert", table, data);
    },
    update: (table, id, data) => {
      return ipcRenderer.invoke("db-update", table, id, data);
    },
    delete: (table, id) => {
      return ipcRenderer.invoke("db-delete", table, id);
    },

    // Advanced queries
    customQuery: (query, params) => {
      return ipcRenderer.invoke("db-custom-query", query, params);
    },

    // Entity-specific operations for convenience
    // Centers
    getCenters: () => {
      return ipcRenderer.invoke("db-get-all", "center");
    },
    addCenter: (data) => {
      return ipcRenderer.invoke("db-insert", "center", data);
    },

    // Instructors
    getInstructors: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM instructor WHERE center_id = ?",
        [centerId]
      );
    },
    getActiveInstructors: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM instructor WHERE center_id = ? AND is_active = 1",
        [centerId]
      );
    },

    // Students
    getStudents: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM student WHERE center_id = ?",
        [centerId]
      );
    },
    getActiveStudents: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM student WHERE center_id = ? AND is_active = 1",
        [centerId]
      );
    },
    getStudentsWithDetails: async (centerId, sort) => {
      try {
        console.log("Preload received sort:", sort);
        let query = `
          SELECT 
            s.*,
            gl.name as grade_level_name,
            st.code as session_type_code,
            st.length as session_type_length
          FROM student s
          LEFT JOIN grade_level gl ON s.grade_level_id = gl.id
          LEFT JOIN session_type st ON s.default_session_type_id = st.id
          WHERE s.center_id = ?
        `;

        // Add sorting if specified
        if (sort?.field) {
          const sortField = {
            firstName: "s.first_name",
            lastName: "s.last_name",
            gradeLevel: "gl.name",
            sessionType: "st.code",
          }[sort.field];

          if (sortField) {
            const direction = sort.direction.toUpperCase();
            console.log(`Sorting by ${sortField} ${direction}`);
            query += ` ORDER BY ${sortField} ${direction}`;
          }
        } else {
          // Default sort by last name, first name if no sort specified
          query += " ORDER BY s.last_name ASC, s.first_name ASC";
        }

        console.log("Final query:", query);
        const results = await ipcRenderer.invoke("db-custom-query", query, [
          centerId,
        ]);
        console.log("Query results:", results);
        return results;
      } catch (error) {
        console.error("Error in getStudentsWithDetails:", error);
        return { error: error.message };
      }
    },
    updateStudent: (studentId, data) => {
      return ipcRenderer.invoke("db-update", "student", studentId, data);
    },

    // Schedule templates
    getScheduleTemplates: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM weekly_schedule_template WHERE center_id = ?",
        [centerId]
      );
    },
    getDefaultTemplate: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM weekly_schedule_template WHERE center_id = ? AND is_default = 1",
        [centerId]
      );
    },

    // Schedules
    getSchedulesByCenterId: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM schedule WHERE center_id = ?",
        [centerId]
      );
    },
    getSchedulesByDate: (date, centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        "SELECT * FROM schedule WHERE center_id = ? AND schedule_date = ?",
        [centerId, date]
      );
    },
    getWeeklySchedulesByCenterId: (centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT ws.*, 
         u.first_name || ' ' || u.last_name as added_by_name,
         t.name as template_name
         FROM weekly_schedule ws
         LEFT JOIN user u ON ws.added_by_user_id = u.id
         LEFT JOIN weekly_schedule_template t ON ws.template_id = t.id
         WHERE ws.center_id = ?
         ORDER BY ws.week_start_date DESC`,
        [centerId]
      );
    },

    // Schedule details
    getScheduleWithDetails: (scheduleId, centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT ws.*, t.name as template_name, t.interval_length,
         u.first_name || ' ' || u.last_name as added_by_name
         FROM weekly_schedule ws
         LEFT JOIN weekly_schedule_template t ON ws.template_id = t.id
         LEFT JOIN user u ON ws.added_by_user_id = u.id
         WHERE ws.id = ? AND ws.center_id = ?`,
        [scheduleId, centerId]
      );
    },

    // Schedule Cells
    getScheduleCellsForSchedule: (scheduleId, centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT sc.*, i.first_name as instructor_first_name, i.last_name as instructor_last_name,
         s.first_name as student_first_name, s.last_name as student_last_name
         FROM schedule_cell sc
         LEFT JOIN instructor i ON sc.instructor_id = i.id
         LEFT JOIN student s ON sc.student_id = s.id
         WHERE sc.schedule_id = ? AND sc.center_id = ?`,
        [scheduleId, centerId]
      );
    },

    // Legacy method for backwards compatibility
    getCellsForSchedule: (scheduleId, centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT sc.*, i.first_name as instructor_first_name, i.last_name as instructor_last_name,
         s.first_name as student_first_name, s.last_name as student_last_name
         FROM schedule_cell sc
         LEFT JOIN instructor i ON sc.instructor_id = i.id
         LEFT JOIN student s ON sc.student_id = s.id
         WHERE sc.schedule_id = ? AND sc.center_id = ?`,
        [scheduleId, centerId]
      );
    },

    // Instructor with grade levels
    getInstructorWithGradeLevels: (instructorId, centerId) => {
      return ipcRenderer.invoke(
        "db-custom-query",
        `SELECT i.*, GROUP_CONCAT(igl.grade_level_id) as grade_levels
         FROM instructor i
         LEFT JOIN instructor_grade_level igl ON i.id = igl.instructor_id
         WHERE i.id = ? AND i.center_id = ?
         GROUP BY i.id`,
        [instructorId, centerId]
      );
    },
  },
});

// Export a marker to show that the preload script was loaded
module.exports = { preloadLoaded: true };

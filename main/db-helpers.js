/**
 * Database Initialization Helper Functions
 * This file contains functions for setting up and populating the database.
 */

/**
 * Creates all database tables with appropriate schema and constraints
 */
const createTables = (db) => {
  // Orgs & Access-Control Layer
  db.exec(`
    CREATE TABLE IF NOT EXISTS center (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS role (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      invited_by_id INTEGER,
      is_active INTEGER NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id),
      FOREIGN KEY (role_id) REFERENCES role(id),
      FOREIGN KEY (invited_by_id) REFERENCES user(id)
    )
  `);

  // Lookups
  db.exec(`
    CREATE TABLE IF NOT EXISTS grade_level (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS session_type (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      length INTEGER NOT NULL,
      styling TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekday (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  // Core domain tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS instructor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      cell_color TEXT NOT NULL,
      is_active INTEGER NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS instructor_grade_level (
      instructor_id INTEGER NOT NULL,
      grade_level_id INTEGER NOT NULL,
      PRIMARY KEY (instructor_id, grade_level_id),
      FOREIGN KEY (instructor_id) REFERENCES instructor(id),
      FOREIGN KEY (grade_level_id) REFERENCES grade_level(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS student (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      grade_level_id INTEGER NOT NULL,
      is_homework_help INTEGER NOT NULL,
      is_active INTEGER NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id),
      FOREIGN KEY (grade_level_id) REFERENCES grade_level(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_schedule_template (
      id TEXT PRIMARY KEY,
      center_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      is_default INTEGER NOT NULL,
      interval_length INTEGER NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_schedule_template_weekday (
      template_id TEXT NOT NULL,
      weekday_id INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      num_columns INTEGER NOT NULL,
      PRIMARY KEY (template_id, weekday_id),
      FOREIGN KEY (template_id) REFERENCES weekly_schedule_template(id),
      FOREIGN KEY (weekday_id) REFERENCES weekday(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule (
      id TEXT PRIMARY KEY,
      center_id INTEGER NOT NULL,
      template_id TEXT NOT NULL,
      added_by_user_id INTEGER NOT NULL,
      date_created TEXT NOT NULL,
      date_last_modified TEXT NOT NULL,
      schedule_date TEXT NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id),
      FOREIGN KEY (template_id) REFERENCES weekly_schedule_template(id),
      FOREIGN KEY (added_by_user_id) REFERENCES user(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule_session (
      schedule_id TEXT NOT NULL,
      session_id INTEGER NOT NULL,
      PRIMARY KEY (schedule_id, session_id),
      FOREIGN KEY (schedule_id) REFERENCES schedule(id),
      FOREIGN KEY (session_id) REFERENCES session(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      session_type_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      length_minutes INTEGER NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id),
      FOREIGN KEY (student_id) REFERENCES student(id),
      FOREIGN KEY (session_type_id) REFERENCES session_type(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS cell (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      schedule_id TEXT NOT NULL,
      instructor_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      time_start TEXT NOT NULL,
      time_end TEXT NOT NULL,
      column_number INTEGER NOT NULL,
      FOREIGN KEY (center_id) REFERENCES center(id),
      FOREIGN KEY (schedule_id) REFERENCES schedule(id),
      FOREIGN KEY (instructor_id) REFERENCES instructor(id),
      FOREIGN KEY (student_id) REFERENCES student(id)
    )
  `);
};

/**
 * Populates lookup tables with initial values
 */
const populateLookupTables = (db) => {
  // Populate weekdays if empty
  const weekdayCount = db
    .prepare("SELECT COUNT(*) as count FROM weekday")
    .get();

  if (weekdayCount.count === 0) {
    const weekdays = [
      { name: "Sunday" },
      { name: "Monday" },
      { name: "Tuesday" },
      { name: "Wednesday" },
      { name: "Thursday" },
      { name: "Friday" },
      { name: "Saturday" },
    ];

    const insertWeekday = db.prepare("INSERT INTO weekday (name) VALUES (?)");

    for (const weekday of weekdays) {
      insertWeekday.run(weekday.name);
    }

    console.log("Weekdays populated successfully");
  }

  // Populate grade levels if empty
  const gradeLevelCount = db
    .prepare("SELECT COUNT(*) as count FROM grade_level")
    .get();

  if (gradeLevelCount.count === 0) {
    const gradeLevels = [
      // Elementary school (K-5)
      { name: "K" },
      { name: "1" },
      { name: "2" },
      { name: "3" },
      { name: "4" },
      { name: "5" },

      // Middle school (6-8)
      { name: "6" },
      { name: "7" },
      { name: "8" },

      // Core high school math subjects
      { name: "Pre-Algebra" },
      { name: "Algebra 1" },
      { name: "Geometry" },
      { name: "Algebra 2" },
      { name: "Trigonometry" },
      { name: "Pre-Calculus" },
      { name: "AP Pre-Calculus" },
      { name: "Calculus" },
      { name: "AP Calculus AB" },
      { name: "AP Calculus BC" },

      // Additional high school and college math subjects
      { name: "Statistics" },
      { name: "AP Statistics" },
      { name: "Discrete Mathematics" },
      { name: "Linear Algebra" },
      { name: "Differential Equations" },
      { name: "Multivariable Calculus" },
      { name: "Number Theory" },
      { name: "Mathematical Logic" },
      { name: "Abstract Algebra" },
      { name: "Real Analysis" },
      { name: "Complex Analysis" },
      { name: "Topology" },
    ];

    const insertGradeLevel = db.prepare(
      "INSERT INTO grade_level (name) VALUES (?)"
    );

    for (const gradeLevel of gradeLevels) {
      insertGradeLevel.run(gradeLevel.name);
    }

    console.log("Grade levels populated successfully");
  }

  // Optionally populate default roles if empty
  const roleCount = db.prepare("SELECT COUNT(*) as count FROM role").get();

  if (roleCount.count === 0) {
    const roles = [
      { code: "master", description: "Master administrator with full access" },
      {
        code: "admin",
        description: "Administrator with center management capabilities",
      },
      {
        code: "tutor",
        description:
          "Tutor with scheduling and student management capabilities",
      },
      {
        code: "viewer",
        description: "Read-only access to schedules and information",
      },
    ];

    const insertRole = db.prepare(
      "INSERT INTO role (code, description) VALUES (?, ?)"
    );

    for (const role of roles) {
      insertRole.run(role.code, role.description);
    }

    console.log("Default roles populated successfully");
  }
};

module.exports = {
  createTables,
  populateLookupTables,
};

/* eslint-disable @typescript-eslint/no-require-imports */
const { app } = require("electron");

// Use app.log for main process logging
app.log = app.log || console.log;
app.error = app.error || console.error;

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
      is_active INTEGER NOT NULL
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
      is_active INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS instructor_grade_level (
      instructor_id INTEGER NOT NULL,
      grade_level_id INTEGER NOT NULL,
      PRIMARY KEY (instructor_id, grade_level_id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS student (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      grade_level_id INTEGER NOT NULL,
      default_session_type_id INTEGER NOT NULL,
      is_homework_help INTEGER NOT NULL,
      is_active INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_schedule_template (
      id TEXT PRIMARY KEY,
      center_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      is_default INTEGER NOT NULL,
      interval_length INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_schedule_template_weekday (
      template_id TEXT NOT NULL,
      weekday_id INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      num_columns INTEGER NOT NULL,
      PRIMARY KEY (template_id, weekday_id)
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
      schedule_date TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule_session (
      schedule_id TEXT NOT NULL,
      session_id INTEGER NOT NULL,
      PRIMARY KEY (schedule_id, session_id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      session_type_id INTEGER NOT NULL,
      date TEXT NOT NULL
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
      column_number INTEGER NOT NULL
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
  }

  // Populate session types if empty
  const sessionTypeCount = db
    .prepare("SELECT COUNT(*) as count FROM session_type")
    .get();

  if (sessionTypeCount.count === 0) {
    const sessionTypes = [
      {
        id: 1,
        code: "REGULAR",
        length: 60,
        styling: "default",
      },
      {
        id: 2,
        code: "HOMEWORK HELP",
        length: 60,
        styling: "homework-help",
      },
      {
        id: 3,
        code: "INITIAL ASSESSMENT",
        length: 90,
        styling: "initial-assessment",
      },
      {
        id: 4,
        code: "CHECKUP",
        length: 60,
        styling: "checkup",
      },
      {
        id: 5,
        code: "ONE-ON-ONE",
        length: 90,
        styling: "one-on-one",
      },
    ];

    const insertSessionType = db.prepare(
      "INSERT INTO session_type (id, code, length, styling) VALUES (?, ?, ?, ?)"
    );

    for (const sessionType of sessionTypes) {
      insertSessionType.run(
        sessionType.id,
        sessionType.code,
        sessionType.length,
        sessionType.styling
      );
    }
  }
};

/**
 * Populates the database with test data
 */
const populateTestData = (db) => {
  // 1. First, insert the center (parent table)
  const center = {
    id: 1,
    name: "Test Center",
  };
  db.prepare("INSERT INTO center (id, name) VALUES (?, ?)").run(
    center.id,
    center.name
  );

  // 6. Insert admin user (needed for schedules)
  const adminUser = {
    id: 1,
    center_id: center.id,
    role_id: 1, // ADMIN role
    email: "admin@test.com",
    first_name: "Admin",
    last_name: "User",
    invited_by_id: null,
    is_active: 1,
  };
  db.prepare(
    "INSERT INTO user (id, center_id, role_id, email, first_name, last_name, invited_by_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    adminUser.id,
    adminUser.center_id,
    adminUser.role_id,
    adminUser.email,
    adminUser.first_name,
    adminUser.last_name,
    adminUser.invited_by_id,
    adminUser.is_active
  );

  // 7. Insert schedule templates
  const templates = [
    {
      id: "spring-schedule",
      center_id: center.id,
      name: "Spring Schedule",
      is_default: 1,
      interval_length: 30,
    },
    {
      id: "summer-schedule",
      center_id: center.id,
      name: "Summer Schedule",
      is_default: 0,
      interval_length: 30,
    },
  ];
  const insertTemplate = db.prepare(
    "INSERT INTO weekly_schedule_template (id, center_id, name, is_default, interval_length) VALUES (?, ?, ?, ?, ?)"
  );
  templates.forEach((template) => {
    insertTemplate.run(
      template.id,
      template.center_id,
      template.name,
      template.is_default,
      template.interval_length
    );
  });

  // 8. Insert schedule template weekdays
  const templateWeekdays = [
    {
      template_id: "spring-schedule",
      weekday_id: 1,
      start_time: "15:30",
      end_time: "19:30",
      num_columns: 3,
    },
    {
      template_id: "spring-schedule",
      weekday_id: 2,
      start_time: "15:30",
      end_time: "19:30",
      num_columns: 3,
    },
    {
      template_id: "spring-schedule",
      weekday_id: 3,
      start_time: "15:30",
      end_time: "19:30",
      num_columns: 3,
    },
    {
      template_id: "spring-schedule",
      weekday_id: 4,
      start_time: "15:30",
      end_time: "19:30",
      num_columns: 3,
    },
    {
      template_id: "spring-schedule",
      weekday_id: 5,
      start_time: "15:30",
      end_time: "19:30",
      num_columns: 3,
    },
  ];
  const insertTemplateWeekday = db.prepare(
    "INSERT INTO weekly_schedule_template_weekday (template_id, weekday_id, start_time, end_time, num_columns) VALUES (?, ?, ?, ?, ?)"
  );
  templateWeekdays.forEach((weekday) => {
    insertTemplateWeekday.run(
      weekday.template_id,
      weekday.weekday_id,
      weekday.start_time,
      weekday.end_time,
      weekday.num_columns
    );
  });

  // 9. Insert instructors
  const instructors = [
    {
      id: 1,
      center_id: center.id,
      first_name: "John",
      last_name: "Doe",
      cell_color: "#FF0000",
      is_active: 1,
    },
    {
      id: 2,
      center_id: center.id,
      first_name: "Jane",
      last_name: "Smith",
      cell_color: "#00FF00",
      is_active: 1,
    },
    {
      id: 3,
      center_id: center.id,
      first_name: "Bob",
      last_name: "Johnson",
      cell_color: "#0000FF",
      is_active: 1,
    },
    {
      id: 4,
      center_id: center.id,
      first_name: "Alice",
      last_name: "Brown",
      cell_color: "#FFFF00",
      is_active: 1,
    },
    {
      id: 5,
      center_id: center.id,
      first_name: "Charlie",
      last_name: "Wilson",
      cell_color: "#FF00FF",
      is_active: 1,
    },
  ];
  const insertInstructor = db.prepare(
    "INSERT INTO instructor (id, center_id, first_name, last_name, cell_color, is_active) VALUES (?, ?, ?, ?, ?, ?)"
  );
  instructors.forEach((instructor) => {
    insertInstructor.run(
      instructor.id,
      instructor.center_id,
      instructor.first_name,
      instructor.last_name,
      instructor.cell_color,
      instructor.is_active
    );
  });

  // 10. Insert students
  const students = [
    {
      id: 1,
      center_id: center.id,
      first_name: "Emma",
      last_name: "Thompson",
      grade_level_id: 5,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 2,
      center_id: center.id,
      first_name: "Liam",
      last_name: "Anderson",
      grade_level_id: 6,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 3,
      center_id: center.id,
      first_name: "Olivia",
      last_name: "Martinez",
      grade_level_id: 4,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 4,
      center_id: center.id,
      first_name: "Noah",
      last_name: "Taylor",
      grade_level_id: 7,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 5,
      center_id: center.id,
      first_name: "Ava",
      last_name: "Thomas",
      grade_level_id: 5,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 6,
      center_id: center.id,
      first_name: "Ethan",
      last_name: "Hernandez",
      grade_level_id: 6,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 7,
      center_id: center.id,
      first_name: "Sophia",
      last_name: "Moore",
      grade_level_id: 4,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 8,
      center_id: center.id,
      first_name: "Mason",
      last_name: "Martin",
      grade_level_id: 7,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 9,
      center_id: center.id,
      first_name: "Isabella",
      last_name: "Jackson",
      grade_level_id: 5,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 10,
      center_id: center.id,
      first_name: "William",
      last_name: "Thompson",
      grade_level_id: 6,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 11,
      center_id: center.id,
      first_name: "Mia",
      last_name: "White",
      grade_level_id: 4,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 12,
      center_id: center.id,
      first_name: "James",
      last_name: "Harris",
      grade_level_id: 7,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 13,
      center_id: center.id,
      first_name: "Charlotte",
      last_name: "Clark",
      grade_level_id: 5,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 14,
      center_id: center.id,
      first_name: "Benjamin",
      last_name: "Lewis",
      grade_level_id: 6,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 15,
      center_id: center.id,
      first_name: "Amelia",
      last_name: "Robinson",
      grade_level_id: 4,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 16,
      center_id: center.id,
      first_name: "Lucas",
      last_name: "Walker",
      grade_level_id: 7,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
    {
      id: 17,
      center_id: center.id,
      first_name: "Harper",
      last_name: "Young",
      grade_level_id: 5,
      default_session_type_id: 1,
      is_homework_help: 0,
      is_active: 1,
    },
    {
      id: 18,
      center_id: center.id,
      first_name: "Henry",
      last_name: "Allen",
      grade_level_id: 6,
      default_session_type_id: 1,
      is_homework_help: 1,
      is_active: 1,
    },
  ];
  const insertStudent = db.prepare(
    "INSERT INTO student (id, center_id, first_name, last_name, grade_level_id, default_session_type_id, is_homework_help, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  students.forEach((student) => {
    insertStudent.run(
      student.id,
      student.center_id,
      student.first_name,
      student.last_name,
      student.grade_level_id,
      student.default_session_type_id,
      student.is_homework_help,
      student.is_active
    );
  });

  // 11. Insert schedules
  const schedules = [
    {
      id: "2025-03-01",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-01",
    },
    {
      id: "2025-03-02",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-02",
    },
    {
      id: "2025-03-03",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-03",
    },
    {
      id: "2025-03-04",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-04",
    },
    {
      id: "2025-03-05",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-05",
    },
    {
      id: "2025-03-06",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-06",
    },
    {
      id: "2025-03-07",
      center_id: center.id,
      template_id: "spring-schedule",
      added_by_user_id: adminUser.id,
      date_created: "2025-02-15T10:00:00.000Z",
      date_last_modified: "2025-02-15T10:00:00.000Z",
      schedule_date: "2025-03-07",
    },
  ];
  const insertSchedule = db.prepare(
    "INSERT INTO schedule (id, center_id, template_id, added_by_user_id, date_created, date_last_modified, schedule_date) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  schedules.forEach((schedule) => {
    insertSchedule.run(
      schedule.id,
      schedule.center_id,
      schedule.template_id,
      schedule.added_by_user_id,
      schedule.date_created,
      schedule.date_last_modified,
      schedule.schedule_date
    );
  });

  // 12. Insert sessions
  const sessions = [
    {
      id: 1,
      center_id: center.id,
      student_id: 1,
      session_type_id: 1,
      date: "2025-03-01T15:30:00.000Z",
    },
    {
      id: 2,
      center_id: center.id,
      student_id: 2,
      session_type_id: 1,
      date: "2025-03-01T16:00:00.000Z",
    },
    {
      id: 3,
      center_id: center.id,
      student_id: 3,
      session_type_id: 1,
      date: "2025-03-01T16:30:00.000Z",
    },
    {
      id: 4,
      center_id: center.id,
      student_id: 4,
      session_type_id: 1,
      date: "2025-03-01T17:00:00.000Z",
    },
    {
      id: 5,
      center_id: center.id,
      student_id: 5,
      session_type_id: 1,
      date: "2025-03-01T17:30:00.000Z",
    },
    {
      id: 6,
      center_id: center.id,
      student_id: 6,
      session_type_id: 1,
      date: "2025-03-01T18:00:00.000Z",
    },
    {
      id: 7,
      center_id: center.id,
      student_id: 7,
      session_type_id: 1,
      date: "2025-03-01T18:30:00.000Z",
    },
    {
      id: 8,
      center_id: center.id,
      student_id: 8,
      session_type_id: 1,
      date: "2025-03-01T19:00:00.000Z",
    },
    {
      id: 9,
      center_id: center.id,
      student_id: 9,
      session_type_id: 1,
      date: "2025-03-01T15:30:00.000Z",
    },
    {
      id: 10,
      center_id: center.id,
      student_id: 10,
      session_type_id: 1,
      date: "2025-03-01T16:00:00.000Z",
    },
    {
      id: 11,
      center_id: center.id,
      student_id: 11,
      session_type_id: 1,
      date: "2025-03-01T16:30:00.000Z",
    },
    {
      id: 12,
      center_id: center.id,
      student_id: 12,
      session_type_id: 1,
      date: "2025-03-01T17:00:00.000Z",
    },
    {
      id: 13,
      center_id: center.id,
      student_id: 13,
      session_type_id: 1,
      date: "2025-03-01T17:30:00.000Z",
    },
    {
      id: 14,
      center_id: center.id,
      student_id: 14,
      session_type_id: 1,
      date: "2025-03-01T18:00:00.000Z",
    },
    {
      id: 15,
      center_id: center.id,
      student_id: 15,
      session_type_id: 1,
      date: "2025-03-01T18:30:00.000Z",
    },
    {
      id: 16,
      center_id: center.id,
      student_id: 16,
      session_type_id: 1,
      date: "2025-03-01T19:00:00.000Z",
    },
    {
      id: 17,
      center_id: center.id,
      student_id: 17,
      session_type_id: 1,
      date: "2025-03-01T15:30:00.000Z",
    },
    {
      id: 18,
      center_id: center.id,
      student_id: 18,
      session_type_id: 1,
      date: "2025-03-01T16:00:00.000Z",
    },
  ];
  const insertSession = db.prepare(
    "INSERT INTO session (id, center_id, student_id, session_type_id, date) VALUES (?, ?, ?, ?, ?)"
  );
  sessions.forEach((session) => {
    insertSession.run(
      session.id,
      session.center_id,
      session.student_id,
      session.session_type_id,
      session.date
    );
  });

  // 13. Insert schedule sessions
  const scheduleSessions = sessions.map((session) => ({
    schedule_id: "2025-03-01",
    session_id: session.id,
  }));
  const insertScheduleSession = db.prepare(
    "INSERT INTO schedule_session (schedule_id, session_id) VALUES (?, ?)"
  );
  scheduleSessions.forEach((scheduleSession) => {
    insertScheduleSession.run(
      scheduleSession.schedule_id,
      scheduleSession.session_id
    );
  });
};

module.exports = {
  createTables,
  populateLookupTables,
  populateTestData,
};

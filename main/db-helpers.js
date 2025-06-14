/* eslint-disable @typescript-eslint/no-require-imports */
const { app } = require("electron");
const {
  weekdays,
  gradeLevels,
  roles,
  sessionTypes,
} = require("./db-lookup-data");
const {
  center,
  adminUser,
  templates,
  templateWeekdays,
  instructors,
  instructorGradeLevels,
  students,
  weeklySchedules,
  schedules,
  sessions,
  scheduleSessions,
  instructorDefaultAvailability,
  instructorSpecialAvailability,
} = require("./db-test-data");
const { scheduleCells } = require("./db-schedule-cells");

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
      name TEXT NOT NULL,
      alias TEXT NOT NULL,
      is_basic INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS session_type (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      length INTEGER NOT NULL,
      styling TEXT NOT NULL,
      session_alias TEXT NOT NULL
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
      email TEXT,
      phone_number TEXT,
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
    CREATE TABLE IF NOT EXISTS instructor_default_availability (
      instructor_id INTEGER NOT NULL,
      weekday_id INTEGER NOT NULL,
      is_available INTEGER NOT NULL DEFAULT 0,
      start_time TEXT,
      end_time TEXT,
      PRIMARY KEY (instructor_id, weekday_id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS instructor_special_availability (
      instructor_id INTEGER NOT NULL,
      date DATE NOT NULL,
      is_available INTEGER NOT NULL DEFAULT 0,
      start_time TEXT,
      end_time TEXT,
      PRIMARY KEY (instructor_id, date)
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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      is_default INTEGER NOT NULL,
      interval_length INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_schedule_template_weekday (
      template_id INTEGER NOT NULL,
      weekday_id INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      num_pods INTEGER NOT NULL,
      PRIMARY KEY (template_id, weekday_id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      template_id INTEGER NOT NULL,
      added_by_user_id INTEGER NOT NULL,
      date_created DATETIME NOT NULL,
      date_last_modified DATETIME NOT NULL,
      week_start_date DATE NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weekly_schedule_id INTEGER NOT NULL,
      schedule_date DATE NOT NULL,
      weekday_id INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule_session (
      schedule_id INTEGER NOT NULL,
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
      date DATETIME NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule_cell (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_id INTEGER NOT NULL,
      schedule_id INTEGER NOT NULL,
      instructor_id INTEGER,
      student_id INTEGER,
      time_start DATETIME NOT NULL,
      time_end DATETIME NOT NULL,
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
    const insertGradeLevel = db.prepare(
      "INSERT INTO grade_level (name, alias, is_basic) VALUES (?, ?, ?)"
    );
    for (const gradeLevel of gradeLevels) {
      insertGradeLevel.run(
        gradeLevel.name,
        gradeLevel.alias,
        gradeLevel.is_basic || 0
      );
    }
  }

  // Populate roles if empty
  const roleCount = db.prepare("SELECT COUNT(*) as count FROM role").get();

  if (roleCount.count === 0) {
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
    const insertSessionType = db.prepare(
      "INSERT INTO session_type (id, code, length, styling, session_alias) VALUES (?, ?, ?, ?, ?)"
    );
    for (const sessionType of sessionTypes) {
      insertSessionType.run(
        sessionType.id,
        sessionType.code,
        sessionType.length,
        sessionType.styling,
        sessionType.session_alias
      );
    }
  }
};

/**
 * Populates the database with test data
 */
const populateTestData = (db) => {
  // Insert center
  db.prepare("INSERT INTO center (id, name) VALUES (?, ?)").run(
    center.id,
    center.name
  );

  // Insert admin user
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

  // Insert schedule templates
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

  // Insert schedule template weekdays
  const insertTemplateWeekday = db.prepare(
    "INSERT INTO weekly_schedule_template_weekday (template_id, weekday_id, start_time, end_time, num_pods) VALUES (?, ?, ?, ?, ?)"
  );
  templateWeekdays.forEach((weekday) => {
    insertTemplateWeekday.run(
      weekday.template_id,
      weekday.weekday_id,
      weekday.start_time,
      weekday.end_time,
      weekday.num_pods
    );
  });

  // Insert instructors
  const insertInstructor = db.prepare(
    "INSERT INTO instructor (id, center_id, first_name, last_name, email, phone_number, cell_color, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  instructors.forEach((instructor) => {
    insertInstructor.run(
      instructor.id,
      instructor.center_id,
      instructor.first_name,
      instructor.last_name,
      instructor.email,
      instructor.phone_number,
      instructor.cell_color,
      instructor.is_active
    );
  });

  // Insert instructor grade level relationships
  const insertInstructorGradeLevel = db.prepare(
    "INSERT INTO instructor_grade_level (instructor_id, grade_level_id) VALUES (?, ?)"
  );
  instructorGradeLevels.forEach((relationship) => {
    insertInstructorGradeLevel.run(
      relationship.instructor_id,
      relationship.grade_level_id
    );
  });

  // Insert students
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

  // Insert weekly schedules
  const insertWeeklySchedule = db.prepare(
    "INSERT INTO weekly_schedule (id, center_id, template_id, added_by_user_id, date_created, date_last_modified, week_start_date) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  weeklySchedules.forEach((weeklySchedule) => {
    insertWeeklySchedule.run(
      weeklySchedule.id,
      weeklySchedule.center_id,
      weeklySchedule.template_id,
      weeklySchedule.added_by_user_id,
      weeklySchedule.date_created,
      weeklySchedule.date_last_modified,
      weeklySchedule.week_start_date
    );
  });

  // Insert daily schedules
  const insertSchedule = db.prepare(
    "INSERT INTO schedule (id, weekly_schedule_id, schedule_date, weekday_id) VALUES (?, ?, ?, ?)"
  );
  schedules.forEach((schedule) => {
    insertSchedule.run(
      schedule.id,
      schedule.weekly_schedule_id,
      schedule.schedule_date,
      schedule.weekday_id
    );
  });

  // Insert sessions
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

  // Insert schedule sessions
  const insertScheduleSession = db.prepare(
    "INSERT INTO schedule_session (schedule_id, session_id) VALUES (?, ?)"
  );
  scheduleSessions.forEach((scheduleSession) => {
    insertScheduleSession.run(
      scheduleSession.schedule_id,
      scheduleSession.session_id
    );
  });

  // Insert schedule cells
  const insertScheduleCell = db.prepare(
    "INSERT INTO schedule_cell (id, center_id, schedule_id, instructor_id, student_id, time_start, time_end, column_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  scheduleCells.forEach((cell) => {
    insertScheduleCell.run(
      cell.id,
      cell.center_id,
      cell.schedule_id,
      cell.instructor_id,
      cell.student_id,
      cell.time_start,
      cell.time_end,
      cell.column_number
    );
  });

  // Insert instructor default availability
  const insertDefaultAvailability = db.prepare(
    "INSERT INTO instructor_default_availability (instructor_id, weekday_id, is_available, start_time, end_time) VALUES (?, ?, ?, ?, ?)"
  );
  instructorDefaultAvailability.forEach((availability) => {
    insertDefaultAvailability.run(
      availability.instructor_id,
      availability.weekday_id,
      availability.is_available,
      availability.start_time,
      availability.end_time
    );
  });

  // Insert instructor special availability
  const insertSpecialAvailability = db.prepare(
    "INSERT INTO instructor_special_availability (instructor_id, date, is_available, start_time, end_time) VALUES (?, ?, ?, ?, ?)"
  );
  instructorSpecialAvailability.forEach((availability) => {
    insertSpecialAvailability.run(
      availability.instructor_id,
      availability.date,
      availability.is_available,
      availability.start_time,
      availability.end_time
    );
  });
};

module.exports = {
  createTables,
  populateLookupTables,
  populateTestData,
};

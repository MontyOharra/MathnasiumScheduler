# Mathnasium Scheduler Database Schema

This document serves as a reference for the database schema used in the Mathnasium Scheduler application.

## Orgs & Access-Control Layer

### Table: `center`

| Column | Type    | Description                                       |
| ------ | ------- | ------------------------------------------------- |
| `id`   | INTEGER | Primary key, auto-increment                       |
| `name` | TEXT    | Human-readable (e.g., "Downtown Learning Center") |

### Table: `role`

| Column        | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| `id`          | INTEGER | Primary key, auto-increment                    |
| `code`        | TEXT    | 'master' \| 'admin' \| 'tutor' \| 'viewer' ... |
| `description` | TEXT    | Description of the role                        |

### Table: `user`

| Column          | Type    | Description                                           |
| --------------- | ------- | ----------------------------------------------------- |
| `id`            | INTEGER | Primary key, auto-increment                           |
| `center_id`     | INTEGER | Foreign key to center.id (home center)                |
| `role_id`       | INTEGER | Foreign key to role.id                                |
| `email`         | TEXT    | Unique identifier for user                            |
| `first_name`    | TEXT    | User's first name                                     |
| `last_name`     | TEXT    | User's last name                                      |
| `invited_by_id` | INTEGER | Foreign key to user.id (null for first "master" user) |
| `is_active`     | BOOLEAN | Whether the user is active                            |

## Lookups (enums stay unchanged)

### Table: `grade_level`

| Column | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `id`   | INTEGER | Primary key, auto-increment |
| `name` | TEXT    | Name of the grade level     |

### Table: `weekday`

| Column | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `id`   | INTEGER | Primary key, auto-increment |
| `name` | TEXT    | Name of the weekday         |

## Core Domain Tables (scoped by center)

### Table: `session_type`

| Column    | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| `id`      | INTEGER | Primary key, auto-increment       |
| `code`    | TEXT    | Code identifying the session type |
| `length`  | INTEGER | Length of the session             |
| `styling` | TEXT    | CSS styling for the session type  |

### Table: `instructor`

| Column       | Type    | Description                      |
| ------------ | ------- | -------------------------------- |
| `id`         | INTEGER | Primary key, auto-increment      |
| `center_id`  | INTEGER | Foreign key to center.id         |
| `first_name` | TEXT    | Instructor's first name          |
| `last_name`  | TEXT    | Instructor's last name           |
| `cell_color` | TEXT    | Color code for scheduler         |
| `is_active`  | BOOLEAN | Whether the instructor is active |

### Table: `instructor_grade_level`

| Column           | Type    | Description                   |
| ---------------- | ------- | ----------------------------- |
| `instructor_id`  | INTEGER | Foreign key to instructor.id  |
| `grade_level_id` | INTEGER | Foreign key to grade_level.id |

### Table: `student`

| Column             | Type    | Description                            |
| ------------------ | ------- | -------------------------------------- |
| `id`               | INTEGER | Primary key, auto-increment            |
| `center_id`        | INTEGER | Foreign key to center.id               |
| `first_name`       | TEXT    | Student's first name                   |
| `last_name`        | TEXT    | Student's last name                    |
| `grade_level_id`   | INTEGER | Foreign key to grade_level.id          |
| `is_homework_help` | BOOLEAN | Whether student requires homework help |
| `is_active`        | BOOLEAN | Whether the student is active          |

### Table: `weekly_schedule_template`

| Column            | Type    | Description                          |
| ----------------- | ------- | ------------------------------------ |
| `id`              | TEXT    | Primary key (UUID)                   |
| `center_id`       | INTEGER | Foreign key to center.id             |
| `name`            | TEXT    | Template name                        |
| `is_default`      | BOOLEAN | Whether this is the default template |
| `interval_length` | INTEGER | Interval length in minutes           |

### Table: `weekly_schedule_template_weekday`

| Column        | Type    | Description                                |
| ------------- | ------- | ------------------------------------------ |
| `template_id` | TEXT    | Foreign key to weekly_schedule_template.id |
| `weekday_id`  | INTEGER | Foreign key to weekday.id                  |
| `start_time`  | TEXT    | Start time for this weekday                |
| `end_time`    | TEXT    | End time for this weekday                  |
| `num_columns` | INTEGER | Number of columns for this weekday         |

### Table: `weekly_schedule`

| Column               | Type    | Description                                |
| -------------------- | ------- | ------------------------------------------ |
| `id`                 | TEXT    | Primary key (UUID)                         |
| `center_id`          | INTEGER | Foreign key to center.id                   |
| `template_id`        | TEXT    | Foreign key to weekly_schedule_template.id |
| `added_by_user_id`   | INTEGER | Foreign key to user.id                     |
| `date_created`       | TEXT    | Creation datetime                          |
| `date_last_modified` | TEXT    | Last modification datetime                 |
| `week_start_date`    | TEXT    | Date of the schedule                       |

### Table: `schedule`

| Column               | Type     | Description                    |
| -------------------- | -------- | ------------------------------ |
| `id`                 | INTEGER  | Primary key, auto-increment    |
| `weekly_schedule_id` | INTEGER  | Foreign key to center.id       |
| `schedule_date`      | DATETIME | Foreign key to student.id      |

### Table: `schedule_session`

| Column        | Type    | Description                |
| ------------- | ------- | -------------------------- |
| `schedule_id` | TEXT    | Foreign key to schedule.id |
| `session_id`  | INTEGER | Foreign key to session.id  |

### Table: `session`

| Column            | Type    | Description                    |
| ----------------- | ------- | ------------------------------ |
| `id`              | INTEGER | Primary key, auto-increment    |
| `center_id`       | INTEGER | Foreign key to center.id       |
| `student_id`      | INTEGER | Foreign key to student.id      |
| `session_type_id` | INTEGER | Foreign key to session_type.id |
| `date`            | TEXT    | Datetime of the session        |
| `length_minutes`  | INTEGER | Length of session in minutes   |

### Table: `cell`

| Column          | Type    | Description                        |
| --------------- | ------- | ---------------------------------- |
| `id`            | INTEGER | Primary key, auto-increment        |
| `center_id`     | INTEGER | Foreign key to center.id           |
| `schedule_id`   | TEXT    | Foreign key to schedule.id         |
| `instructor_id` | INTEGER | Foreign key to instructor.id       |
| `student_id`    | INTEGER | Foreign key to student.id          |
| `time_start`    | TEXT    | Start datetime                     |
| `time_end`      | TEXT    | End datetime                       |
| `column_number` | INTEGER | Column number in the schedule grid |

## SQL Create Table Statements

```sql
-- Orgs & Access-Control Layer
CREATE TABLE IF NOT EXISTS center (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  description TEXT NOT NULL
);

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
);

-- Lookups
CREATE TABLE IF NOT EXISTS grade_level (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  length INTEGER NOT NULL,
  styling TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weekday (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Core domain tables
CREATE TABLE IF NOT EXISTS instructor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  center_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  cell_color TEXT NOT NULL,
  is_active INTEGER NOT NULL,
  FOREIGN KEY (center_id) REFERENCES center(id)
);

CREATE TABLE IF NOT EXISTS instructor_grade_level (
  instructor_id INTEGER NOT NULL,
  grade_level_id INTEGER NOT NULL,
  PRIMARY KEY (instructor_id, grade_level_id),
  FOREIGN KEY (instructor_id) REFERENCES instructor(id),
  FOREIGN KEY (grade_level_id) REFERENCES grade_level(id)
);

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
);

CREATE TABLE IF NOT EXISTS weekly_schedule_template (
  id TEXT PRIMARY KEY,
  center_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  is_default INTEGER NOT NULL,
  interval_length INTEGER NOT NULL,
  FOREIGN KEY (center_id) REFERENCES center(id)
);

CREATE TABLE IF NOT EXISTS weekly_schedule_template_weekday (
  template_id TEXT NOT NULL,
  weekday_id INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  num_columns INTEGER NOT NULL,
  PRIMARY KEY (template_id, weekday_id),
  FOREIGN KEY (template_id) REFERENCES weekly_schedule_template(id),
  FOREIGN KEY (weekday_id) REFERENCES weekday(id)
);

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
);

CREATE TABLE IF NOT EXISTS schedule_session (
  schedule_id TEXT NOT NULL,
  session_id INTEGER NOT NULL,
  PRIMARY KEY (schedule_id, session_id),
  FOREIGN KEY (schedule_id) REFERENCES schedule(id),
  FOREIGN KEY (session_id) REFERENCES session(id)
);

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
);

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
);
```

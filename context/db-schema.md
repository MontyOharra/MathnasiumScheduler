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
| `is_active`     | INTEGER | Whether the user is active (0 or 1)                   |

## Lookups (enums stay unchanged)

### Table: `grade_level`

| Column     | Type    | Description                              |
| ---------- | ------- | ---------------------------------------- |
| `id`       | INTEGER | Primary key, auto-increment              |
| `name`     | TEXT    | Name of the grade level                  |
| `alias`    | TEXT    | Short alias for display (e.g., "K", "1") |
| `is_basic` | INTEGER | Whether this is a basic level (0 or 1)   |

### Table: `weekday`

| Column | Type    | Description                 |
| ------ | ------- | --------------------------- |
| `id`   | INTEGER | Primary key, auto-increment |
| `name` | TEXT    | Name of the weekday         |

## Core Domain Tables (scoped by center)

### Table: `session_type`

| Column          | Type    | Description                       |
| --------------- | ------- | --------------------------------- |
| `id`            | INTEGER | Primary key, auto-increment       |
| `code`          | TEXT    | Code identifying the session type |
| `length`        | INTEGER | Length of the session             |
| `styling`       | TEXT    | CSS styling for the session type  |
| `session_alias` | TEXT    | Display alias used for CSV import |

### Table: `instructor`

| Column         | Type    | Description                               |
| -------------- | ------- | ----------------------------------------- |
| `id`           | INTEGER | Primary key, auto-increment               |
| `center_id`    | INTEGER | Foreign key to center.id                  |
| `first_name`   | TEXT    | Instructor's first name                   |
| `last_name`    | TEXT    | Instructor's last name                    |
| `email`        | TEXT    | Instructor's email address                |
| `phone_number` | TEXT    | Instructor's phone number                 |
| `cell_color`   | TEXT    | Color code for scheduler                  |
| `is_active`    | INTEGER | Whether the instructor is active (0 or 1) |

### Table: `instructor_grade_level`

| Column           | Type    | Description                   |
| ---------------- | ------- | ----------------------------- |
| `instructor_id`  | INTEGER | Foreign key to instructor.id  |
| `grade_level_id` | INTEGER | Foreign key to grade_level.id |

### Table: `student`

| Column                    | Type    | Description                                     |
| ------------------------- | ------- | ----------------------------------------------- |
| `id`                      | INTEGER | Primary key, auto-increment                     |
| `center_id`               | INTEGER | Foreign key to center.id                        |
| `first_name`              | TEXT    | Student's first name                            |
| `last_name`               | TEXT    | Student's last name                             |
| `grade_level_id`          | INTEGER | Foreign key to grade_level.id                   |
| `default_session_type_id` | INTEGER | Foreign key to session_type.id                  |
| `is_homework_help`        | INTEGER | Whether student requires homework help (0 or 1) |
| `is_active`               | INTEGER | Whether the student is active (0 or 1)          |

### Table: `weekly_schedule_template`

| Column            | Type    | Description                                   |
| ----------------- | ------- | --------------------------------------------- |
| `id`              | INTEGER | Primary key, auto-increment                   |
| `center_id`       | INTEGER | Foreign key to center.id                      |
| `name`            | TEXT    | Template name                                 |
| `is_default`      | INTEGER | Whether this is the default template (0 or 1) |
| `interval_length` | INTEGER | Interval length in minutes                    |

### Table: `weekly_schedule_template_weekday`

| Column        | Type    | Description                                |
| ------------- | ------- | ------------------------------------------ |
| `template_id` | INTEGER | Foreign key to weekly_schedule_template.id |
| `weekday_id`  | INTEGER | Foreign key to weekday.id                  |
| `start_time`  | TEXT    | Start time for this weekday                |
| `end_time`    | TEXT    | End time for this weekday                  |
| `num_pods`    | INTEGER | Number of pods for this weekday            |

### Table: `weekly_schedule`

| Column               | Type     | Description                                |
| -------------------- | -------- | ------------------------------------------ |
| `id`                 | INTEGER  | Primary key, auto-increment                |
| `center_id`          | INTEGER  | Foreign key to center.id                   |
| `template_id`        | INTEGER  | Foreign key to weekly_schedule_template.id |
| `added_by_user_id`   | INTEGER  | Foreign key to user.id                     |
| `date_created`       | DATETIME | Creation datetime                          |
| `date_last_modified` | DATETIME | Last modification datetime                 |
| `week_start_date`    | DATE     | Start date of the schedule week            |

### Table: `schedule`

| Column               | Type    | Description                       |
| -------------------- | ------- | --------------------------------- |
| `id`                 | INTEGER | Primary key, auto-increment       |
| `weekly_schedule_id` | INTEGER | Foreign key to weekly_schedule.id |
| `schedule_date`      | DATE    | Date of this daily schedule       |
| `weekday_id`         | INTEGER | Foreign key to weekday.id         |

### Table: `schedule_session`

| Column        | Type    | Description                |
| ------------- | ------- | -------------------------- |
| `schedule_id` | INTEGER | Foreign key to schedule.id |
| `session_id`  | INTEGER | Foreign key to session.id  |

### Table: `session`

| Column            | Type     | Description                    |
| ----------------- | -------- | ------------------------------ |
| `id`              | INTEGER  | Primary key, auto-increment    |
| `center_id`       | INTEGER  | Foreign key to center.id       |
| `student_id`      | INTEGER  | Foreign key to student.id      |
| `session_type_id` | INTEGER  | Foreign key to session_type.id |
| `date`            | DATETIME | Datetime of the session        |

### Table: `schedule_cell`

| Column          | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| `id`            | INTEGER  | Primary key, auto-increment        |
| `center_id`     | INTEGER  | Foreign key to center.id           |
| `schedule_id`   | INTEGER  | Foreign key to schedule.id         |
| `instructor_id` | INTEGER  | Foreign key to instructor.id       |
| `student_id`    | INTEGER  | Foreign key to student.id          |
| `time_start`    | DATETIME | Start datetime                     |
| `time_end`      | DATETIME | End datetime                       |
| `column_number` | INTEGER  | Column number in the schedule grid |

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
  is_active INTEGER NOT NULL
);

-- Lookups
CREATE TABLE IF NOT EXISTS grade_level (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  alias TEXT NOT NULL,
  is_basic INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS session_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  length INTEGER NOT NULL,
  styling TEXT NOT NULL,
  session_alias TEXT NOT NULL
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
  email TEXT,
  phone_number TEXT,
  cell_color TEXT NOT NULL,
  is_active INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS instructor_grade_level (
  instructor_id INTEGER NOT NULL,
  grade_level_id INTEGER NOT NULL,
  PRIMARY KEY (instructor_id, grade_level_id)
);

CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  center_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade_level_id INTEGER NOT NULL,
  default_session_type_id INTEGER NOT NULL,
  is_homework_help INTEGER NOT NULL,
  is_active INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_schedule_template (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  center_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  is_default INTEGER NOT NULL,
  interval_length INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_schedule_template_weekday (
  template_id INTEGER NOT NULL,
  weekday_id INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  num_pods INTEGER NOT NULL,
  PRIMARY KEY (template_id, weekday_id)
);

CREATE TABLE IF NOT EXISTS weekly_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  center_id INTEGER NOT NULL,
  template_id INTEGER NOT NULL,
  added_by_user_id INTEGER NOT NULL,
  date_created DATETIME NOT NULL,
  date_last_modified DATETIME NOT NULL,
  week_start_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  weekly_schedule_id INTEGER NOT NULL,
  schedule_date DATE NOT NULL,
  weekday_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule_session (
  schedule_id INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  PRIMARY KEY (schedule_id, session_id)
);

CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  center_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  session_type_id INTEGER NOT NULL,
  date DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule_cell (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  center_id INTEGER NOT NULL,
  schedule_id INTEGER NOT NULL,
  instructor_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  time_start DATETIME NOT NULL,
  time_end DATETIME NOT NULL,
  column_number INTEGER NOT NULL
);
```

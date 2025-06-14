const weekdays = [
  { name: "Sunday" },
  { name: "Monday" },
  { name: "Tuesday" },
  { name: "Wednesday" },
  { name: "Thursday" },
  { name: "Friday" },
  { name: "Saturday" },
];

const gradeLevels = [
  // Elementary school (K-5) - Basic levels
  { name: "K", alias: "K", is_basic: 1 },
  { name: "1", alias: "1", is_basic: 1 },
  { name: "2", alias: "2", is_basic: 1 },
  { name: "3", alias: "3", is_basic: 1 },
  { name: "4", alias: "4", is_basic: 1 },
  { name: "5", alias: "5", is_basic: 1 },

  // Middle school (6-8) - Basic levels
  { name: "6", alias: "6", is_basic: 1 },
  { name: "7", alias: "7", is_basic: 1 },
  { name: "8", alias: "8", is_basic: 1 },

  // Core high school math subjects - Basic levels
  { name: "Algebra 1", alias: "Alg 1", is_basic: 1 },
  { name: "Geometry", alias: "Geo", is_basic: 1 },
  { name: "Algebra 2", alias: "Alg 2", is_basic: 1 },
  { name: "Pre-Calculus", alias: "PC", is_basic: 1 },

  // Advanced levels - Not basic
  { name: "AP Pre-Calculus", alias: "AP PC", is_basic: 0 },
  { name: "AP Calculus AB", alias: "Calc AB", is_basic: 0 },
  { name: "AP Calculus BC", alias: "Calc BC", is_basic: 0 },

  // Additional high school and college math subjects - Not basic
  { name: "TSI Prep", alias: "TSI", is_basic: 0 },
  { name: "College Algebra", alias: "C Alg", is_basic: 0 },
  { name: "Statistics", alias: "Stats", is_basic: 0 },
  { name: "AP Statistics", alias: "AP Stats", is_basic: 0 },
  { name: "Discrete Mathematics", alias: "Discrete", is_basic: 0 },
  { name: "Linear Algebra", alias: "Lin Alg", is_basic: 0 },
  { name: "Differential Equations", alias: "Diff Eq", is_basic: 0 },
  { name: "SAT Prep", alias: "SAT", is_basic: 0 },
];

const roles = [
  { code: "master", description: "Master administrator with full access" },
  {
    code: "admin",
    description: "Administrator with center management capabilities",
  },
  {
    code: "tutor",
    description: "Tutor with scheduling and student management capabilities",
  },
  {
    code: "viewer",
    description: "Read-only access to schedules and information",
  },
];

const sessionTypes = [
  {
    id: 1,
    code: "REGULAR",
    length: 60,
    styling: "default",
    session_alias: "1-hour session - 60m",
  },
  {
    id: 2,
    code: "HOMEWORK HELP",
    length: 60,
    styling: "homework-help",
    session_alias: "HW Help - 60m",
  },
  {
    id: 3,
    code: "INITIAL ASSESSMENT",
    length: 90,
    styling: "initial-assessment",
    session_alias: "1-hour session - 90m",
  },
  {
    id: 4,
    code: "CHECKUP",
    length: 60,
    styling: "checkup",
    session_alias: "Checkup - 60m",
  },
  {
    id: 5,
    code: "ONE-ON-ONE",
    length: 90,
    styling: "one-on-one",
    session_alias: "One-on-One - 90m",
  },
];

module.exports = {
  weekdays,
  gradeLevels,
  roles,
  sessionTypes,
};

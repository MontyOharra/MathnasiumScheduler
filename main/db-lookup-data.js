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
  { name: "SAT Prep" },
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

module.exports = {
  weekdays,
  gradeLevels,
  roles,
  sessionTypes,
};

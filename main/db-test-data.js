const center = {
  id: 1,
  name: "Test Center",
};

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

const templates = [
  {
    id: 1,
    center_id: center.id,
    name: "Spring Schedule",
    is_default: 0,
    interval_length: 30,
  },
  {
    id: 2,
    center_id: center.id,
    name: "Summer Schedule",
    is_default: 1,
    interval_length: 30,
  },
];

const templateWeekdays = [
  {
    template_id: 2,
    weekday_id: 2,
    start_time: "15:00",
    end_time: "19:30",
    num_pods: 8,
  },
  {
    template_id: 2,
    weekday_id: 3,
    start_time: "15:00",
    end_time: "19:30",
    num_pods: 8,
  },
  {
    template_id: 2,
    weekday_id: 4,
    start_time: "15:00",
    end_time: "19:30",
    num_pods: 8,
  },
  {
    template_id: 2,
    weekday_id: 5,
    start_time: "15:00",
    end_time: "19:30",
    num_pods: 8,
  },
  {
    template_id: 2,
    weekday_id: 6,
    start_time: "10:00",
    end_time: "14:00",
    num_pods: 4,
  },
];

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
  {
    id: 6,
    center_id: center.id,
    first_name: "Diana",
    last_name: "Rodriguez",
    cell_color: "#00FFFF",
    is_active: 1,
  },
  {
    id: 7,
    center_id: center.id,
    first_name: "Ethan",
    last_name: "Lee",
    cell_color: "#FFA500",
    is_active: 1,
  },
  {
    id: 8,
    center_id: center.id,
    first_name: "Fiona",
    last_name: "Garcia",
    cell_color: "#800080",
    is_active: 1,
  },
  {
    id: 9,
    center_id: center.id,
    first_name: "Gabriel",
    last_name: "Martinez",
    cell_color: "#008000",
    is_active: 1,
  },
  {
    id: 10,
    center_id: center.id,
    first_name: "Hannah",
    last_name: "Thompson",
    cell_color: "#FF1493",
    is_active: 1,
  },
  {
    id: 11,
    center_id: center.id,
    first_name: "Isaac",
    last_name: "Davis",
    cell_color: "#4B0082",
    is_active: 1,
  },
  {
    id: 12,
    center_id: center.id,
    first_name: "Jasmine",
    last_name: "Kim",
    cell_color: "#FF6347",
    is_active: 1,
  },
];

// Instructor Grade Level assignments
// Grade level IDs: K=1, 1=2, 2=3, 3=4, 4=5, 5=6, 6=7, 7=8, 8=9, Pre-Algebra=10,
// Algebra 1=11, Geometry=12, Algebra 2=13, Pre-Calculus=14, AP Pre-Calculus=15,
// AP Calculus AB=16, AP Calculus BC=17, Statistics=18, AP Statistics=19,
// Discrete Mathematics=20, Linear Algebra=21, Differential Equations=22, SAT Prep=23
const instructorGradeLevels = [
  // John Doe - Basic instructor (K-6 only)
  { instructor_id: 1, grade_level_id: 1 }, // K
  { instructor_id: 1, grade_level_id: 2 }, // 1
  { instructor_id: 1, grade_level_id: 3 }, // 2
  { instructor_id: 1, grade_level_id: 4 }, // 3
  { instructor_id: 1, grade_level_id: 5 }, // 4
  { instructor_id: 1, grade_level_id: 6 }, // 5
  { instructor_id: 1, grade_level_id: 7 }, // 6

  // Jane Smith - Elementary + Middle school
  { instructor_id: 2, grade_level_id: 1 }, // K
  { instructor_id: 2, grade_level_id: 2 }, // 1
  { instructor_id: 2, grade_level_id: 3 }, // 2
  { instructor_id: 2, grade_level_id: 4 }, // 3
  { instructor_id: 2, grade_level_id: 5 }, // 4
  { instructor_id: 2, grade_level_id: 6 }, // 5
  { instructor_id: 2, grade_level_id: 7 }, // 6
  { instructor_id: 2, grade_level_id: 8 }, // 7
  { instructor_id: 2, grade_level_id: 9 }, // 8

  // Bob Johnson - Up to Algebra 1
  { instructor_id: 3, grade_level_id: 1 }, // K
  { instructor_id: 3, grade_level_id: 2 }, // 1
  { instructor_id: 3, grade_level_id: 3 }, // 2
  { instructor_id: 3, grade_level_id: 4 }, // 3
  { instructor_id: 3, grade_level_id: 5 }, // 4
  { instructor_id: 3, grade_level_id: 6 }, // 5
  { instructor_id: 3, grade_level_id: 7 }, // 6
  { instructor_id: 3, grade_level_id: 8 }, // 7
  { instructor_id: 3, grade_level_id: 9 }, // 8
  { instructor_id: 3, grade_level_id: 11 }, // Algebra 1

  // Alice Brown - Up to Geometry (following progression)
  { instructor_id: 4, grade_level_id: 1 }, // K
  { instructor_id: 4, grade_level_id: 2 }, // 1
  { instructor_id: 4, grade_level_id: 3 }, // 2
  { instructor_id: 4, grade_level_id: 4 }, // 3
  { instructor_id: 4, grade_level_id: 5 }, // 4
  { instructor_id: 4, grade_level_id: 6 }, // 5
  { instructor_id: 4, grade_level_id: 7 }, // 6
  { instructor_id: 4, grade_level_id: 8 }, // 7
  { instructor_id: 4, grade_level_id: 9 }, // 8
  { instructor_id: 4, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 4, grade_level_id: 12 }, // Geometry

  // Charlie Wilson - Up to Algebra 2 (following progression)
  { instructor_id: 5, grade_level_id: 1 }, // K
  { instructor_id: 5, grade_level_id: 2 }, // 1
  { instructor_id: 5, grade_level_id: 3 }, // 2
  { instructor_id: 5, grade_level_id: 4 }, // 3
  { instructor_id: 5, grade_level_id: 5 }, // 4
  { instructor_id: 5, grade_level_id: 6 }, // 5
  { instructor_id: 5, grade_level_id: 7 }, // 6
  { instructor_id: 5, grade_level_id: 8 }, // 7
  { instructor_id: 5, grade_level_id: 9 }, // 8
  { instructor_id: 5, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 5, grade_level_id: 12 }, // Geometry
  { instructor_id: 5, grade_level_id: 13 }, // Algebra 2

  // Diana Rodriguez - Up to Pre-Calculus + Statistics (branching specialty)
  { instructor_id: 6, grade_level_id: 1 }, // K
  { instructor_id: 6, grade_level_id: 2 }, // 1
  { instructor_id: 6, grade_level_id: 3 }, // 2
  { instructor_id: 6, grade_level_id: 4 }, // 3
  { instructor_id: 6, grade_level_id: 5 }, // 4
  { instructor_id: 6, grade_level_id: 6 }, // 5
  { instructor_id: 6, grade_level_id: 7 }, // 6
  { instructor_id: 6, grade_level_id: 8 }, // 7
  { instructor_id: 6, grade_level_id: 9 }, // 8
  { instructor_id: 6, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 6, grade_level_id: 12 }, // Geometry
  { instructor_id: 6, grade_level_id: 13 }, // Algebra 2
  { instructor_id: 6, grade_level_id: 14 }, // Pre-Calculus
  { instructor_id: 6, grade_level_id: 18 }, // Statistics
  { instructor_id: 6, grade_level_id: 19 }, // AP Statistics

  // Ethan Lee - Calculus track specialist
  { instructor_id: 7, grade_level_id: 1 }, // K
  { instructor_id: 7, grade_level_id: 2 }, // 1
  { instructor_id: 7, grade_level_id: 3 }, // 2
  { instructor_id: 7, grade_level_id: 4 }, // 3
  { instructor_id: 7, grade_level_id: 5 }, // 4
  { instructor_id: 7, grade_level_id: 6 }, // 5
  { instructor_id: 7, grade_level_id: 7 }, // 6
  { instructor_id: 7, grade_level_id: 8 }, // 7
  { instructor_id: 7, grade_level_id: 9 }, // 8
  { instructor_id: 7, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 7, grade_level_id: 12 }, // Geometry
  { instructor_id: 7, grade_level_id: 13 }, // Algebra 2
  { instructor_id: 7, grade_level_id: 14 }, // Pre-Calculus
  { instructor_id: 7, grade_level_id: 15 }, // AP Pre-Calculus
  { instructor_id: 7, grade_level_id: 16 }, // AP Calculus AB
  { instructor_id: 7, grade_level_id: 17 }, // AP Calculus BC

  // Fiona Garcia - Advanced math specialist (college level)
  { instructor_id: 8, grade_level_id: 1 }, // K
  { instructor_id: 8, grade_level_id: 2 }, // 1
  { instructor_id: 8, grade_level_id: 3 }, // 2
  { instructor_id: 8, grade_level_id: 4 }, // 3
  { instructor_id: 8, grade_level_id: 5 }, // 4
  { instructor_id: 8, grade_level_id: 6 }, // 5
  { instructor_id: 8, grade_level_id: 7 }, // 6
  { instructor_id: 8, grade_level_id: 8 }, // 7
  { instructor_id: 8, grade_level_id: 9 }, // 8
  { instructor_id: 8, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 8, grade_level_id: 12 }, // Geometry
  { instructor_id: 8, grade_level_id: 13 }, // Algebra 2
  { instructor_id: 8, grade_level_id: 14 }, // Pre-Calculus
  { instructor_id: 8, grade_level_id: 15 }, // AP Pre-Calculus
  { instructor_id: 8, grade_level_id: 16 }, // AP Calculus AB
  { instructor_id: 8, grade_level_id: 17 }, // AP Calculus BC
  { instructor_id: 8, grade_level_id: 20 }, // Discrete Mathematics
  { instructor_id: 8, grade_level_id: 21 }, // Linear Algebra
  { instructor_id: 8, grade_level_id: 22 }, // Differential Equations

  // Gabriel Martinez - Statistics specialist (doesn't know calculus but knows stats)
  { instructor_id: 9, grade_level_id: 1 }, // K
  { instructor_id: 9, grade_level_id: 2 }, // 1
  { instructor_id: 9, grade_level_id: 3 }, // 2
  { instructor_id: 9, grade_level_id: 4 }, // 3
  { instructor_id: 9, grade_level_id: 5 }, // 4
  { instructor_id: 9, grade_level_id: 6 }, // 5
  { instructor_id: 9, grade_level_id: 7 }, // 6
  { instructor_id: 9, grade_level_id: 8 }, // 7
  { instructor_id: 9, grade_level_id: 9 }, // 8
  { instructor_id: 9, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 9, grade_level_id: 12 }, // Geometry
  { instructor_id: 9, grade_level_id: 13 }, // Algebra 2
  { instructor_id: 9, grade_level_id: 18 }, // Statistics
  { instructor_id: 9, grade_level_id: 19 }, // AP Statistics
  { instructor_id: 9, grade_level_id: 23 }, // SAT Prep

  // Hannah Thompson - SAT Prep specialist with solid foundation
  { instructor_id: 10, grade_level_id: 1 }, // K
  { instructor_id: 10, grade_level_id: 2 }, // 1
  { instructor_id: 10, grade_level_id: 3 }, // 2
  { instructor_id: 10, grade_level_id: 4 }, // 3
  { instructor_id: 10, grade_level_id: 5 }, // 4
  { instructor_id: 10, grade_level_id: 6 }, // 5
  { instructor_id: 10, grade_level_id: 7 }, // 6
  { instructor_id: 10, grade_level_id: 8 }, // 7
  { instructor_id: 10, grade_level_id: 9 }, // 8
  { instructor_id: 10, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 10, grade_level_id: 12 }, // Geometry
  { instructor_id: 10, grade_level_id: 13 }, // Algebra 2
  { instructor_id: 10, grade_level_id: 14 }, // Pre-Calculus
  { instructor_id: 10, grade_level_id: 23 }, // SAT Prep

  // Isaac Davis - Theory specialist (advanced pure math)
  { instructor_id: 11, grade_level_id: 1 }, // K
  { instructor_id: 11, grade_level_id: 2 }, // 1
  { instructor_id: 11, grade_level_id: 3 }, // 2
  { instructor_id: 11, grade_level_id: 4 }, // 3
  { instructor_id: 11, grade_level_id: 5 }, // 4
  { instructor_id: 11, grade_level_id: 6 }, // 5
  { instructor_id: 11, grade_level_id: 7 }, // 6
  { instructor_id: 11, grade_level_id: 8 }, // 7
  { instructor_id: 11, grade_level_id: 9 }, // 8
  { instructor_id: 11, grade_level_id: 11 }, // Algebra 1
  { instructor_id: 11, grade_level_id: 12 }, // Geometry
  { instructor_id: 11, grade_level_id: 13 }, // Algebra 2
  { instructor_id: 11, grade_level_id: 14 }, // Pre-Calculus
  { instructor_id: 11, grade_level_id: 21 }, // Linear Algebra
  { instructor_id: 11, grade_level_id: 22 }, // Differential Equations

  // Jasmine Kim - Middle school specialist
  { instructor_id: 12, grade_level_id: 1 }, // K
  { instructor_id: 12, grade_level_id: 2 }, // 1
  { instructor_id: 12, grade_level_id: 3 }, // 2
  { instructor_id: 12, grade_level_id: 4 }, // 3
  { instructor_id: 12, grade_level_id: 5 }, // 4
  { instructor_id: 12, grade_level_id: 6 }, // 5
  { instructor_id: 12, grade_level_id: 7 }, // 6
  { instructor_id: 12, grade_level_id: 8 }, // 7
  { instructor_id: 12, grade_level_id: 9 }, // 8
];

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

const weeklySchedules = [
  {
    id: 1,
    center_id: center.id,
    template_id: 2,
    added_by_user_id: adminUser.id,
    date_created: "2025-02-15T10:00:00.000Z",
    date_last_modified: "2025-02-15T10:00:00.000Z",
    week_start_date: "2025-06-08",
  },
];

const schedules = [
  {
    id: 1,
    weekly_schedule_id: 1,
    schedule_date: "2025-06-09",
    weekday_id: 2,
  },
  {
    id: 2,
    weekly_schedule_id: 1,
    schedule_date: "2025-06-10",
    weekday_id: 3,
  },
  {
    id: 3,
    weekly_schedule_id: 1,
    schedule_date: "2025-06-11",
    weekday_id: 4,
  },
  {
    id: 4,
    weekly_schedule_id: 1,
    schedule_date: "2025-06-12",
    weekday_id: 5,
  },
  {
    id: 5,
    weekly_schedule_id: 1,
    schedule_date: "2025-06-13",
    weekday_id: 6,
  },
];

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

const scheduleSessions = sessions.map((session) => ({
  schedule_id: 1,
  session_id: session.id,
}));

module.exports = {
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
};

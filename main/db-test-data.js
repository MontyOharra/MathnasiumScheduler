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
    email: "john.doe@mathnasium.com",
    phone_number: "(555) 123-4567",
    cell_color: "#FF0000",
    is_active: 1,
  },
  {
    id: 2,
    center_id: center.id,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@mathnasium.com",
    phone_number: "(555) 234-5678",
    cell_color: "#00FF00",
    is_active: 1,
  },
  {
    id: 3,
    center_id: center.id,
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob.johnson@mathnasium.com",
    phone_number: "(555) 345-6789",
    cell_color: "#0000FF",
    is_active: 1,
  },
  {
    id: 4,
    center_id: center.id,
    first_name: "Alice",
    last_name: "Brown",
    email: "alice.brown@mathnasium.com",
    phone_number: "(555) 456-7890",
    cell_color: "#FFFF00",
    is_active: 1,
  },
  {
    id: 5,
    center_id: center.id,
    first_name: "Charlie",
    last_name: "Wilson",
    email: "charlie.wilson@mathnasium.com",
    phone_number: "(555) 567-8901",
    cell_color: "#FF00FF",
    is_active: 1,
  },
  {
    id: 6,
    center_id: center.id,
    first_name: "Diana",
    last_name: "Rodriguez",
    email: "diana.rodriguez@mathnasium.com",
    phone_number: "(555) 678-9012",
    cell_color: "#00FFFF",
    is_active: 1,
  },
  {
    id: 7,
    center_id: center.id,
    first_name: "Ethan",
    last_name: "Lee",
    email: "ethan.lee@mathnasium.com",
    phone_number: "(555) 789-0123",
    cell_color: "#FFA500",
    is_active: 1,
  },
  {
    id: 8,
    center_id: center.id,
    first_name: "Fiona",
    last_name: "Garcia",
    email: "fiona.garcia@mathnasium.com",
    phone_number: "(555) 890-1234",
    cell_color: "#800080",
    is_active: 1,
  },
  {
    id: 9,
    center_id: center.id,
    first_name: "Gabriel",
    last_name: "Martinez",
    email: "gabriel.martinez@mathnasium.com",
    phone_number: "(555) 901-2345",
    cell_color: "#008000",
    is_active: 1,
  },
  {
    id: 10,
    center_id: center.id,
    first_name: "Hannah",
    last_name: "Thompson",
    email: "hannah.thompson@mathnasium.com",
    phone_number: "(555) 012-3456",
    cell_color: "#FF1493",
    is_active: 1,
  },
  {
    id: 11,
    center_id: center.id,
    first_name: "Isaac",
    last_name: "Davis",
    email: "isaac.davis@mathnasium.com",
    phone_number: "(555) 111-2222",
    cell_color: "#4B0082",
    is_active: 1,
  },
  {
    id: 12,
    center_id: center.id,
    first_name: "Jasmine",
    last_name: "Kim",
    email: "jasmine.kim@mathnasium.com",
    phone_number: "(555) 333-4444",
    cell_color: "#FF6347",
    is_active: 1,
  },
];

// Instructor Grade Level assignments (defined with OLD grade_level_id values)
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
  { instructor_id: 6, grade_level_id: 19 }, // Statistics (old 18 -> new 19)
  { instructor_id: 6, grade_level_id: 20 }, // AP Statistics (old 19 -> 20)

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
  { instructor_id: 7, grade_level_id: 16 }, // AP Calculus AB (old 16 -> 15) wait mapping? we'll adjust later
  { instructor_id: 7, grade_level_id: 17 }, // AP Calculus BC new 16? mapping we know

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
  { instructor_id: 8, grade_level_id: 16 }, // AP Calculus AB new 15? but need mapping
  { instructor_id: 8, grade_level_id: 17 }, // AP Calculus BC new 16
  { instructor_id: 8, grade_level_id: 21 }, // Discrete Mathematics (old 20 -> 21)
  { instructor_id: 8, grade_level_id: 22 }, // Linear Algebra (old 21 -> 22)
  { instructor_id: 8, grade_level_id: 23 }, // Differential Equations (old 22 -> 23)

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
  { instructor_id: 9, grade_level_id: 19 }, // Statistics new 19
  { instructor_id: 9, grade_level_id: 20 }, // AP Statistics new 20
  { instructor_id: 9, grade_level_id: 24 }, // SAT Prep new 24

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
  { instructor_id: 10, grade_level_id: 24 }, // SAT Prep new 24

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
  { instructor_id: 11, grade_level_id: 22 }, // Linear Algebra new 22
  { instructor_id: 11, grade_level_id: 23 }, // Differential Equations new 23

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

// --------------------
//  Student roster seed
// --------------------

// Roster format: ["First", "Last", "Code"] where Code is grade-level abbreviation
const studentEntries = [
  ["Aaliyah", "Webb", "G"],
  ["Abby", "Sela", "7"],
  ["Adam", "Gaskins", "6"],
  ["Addison", "Strockis", "2"],
  ["Addison", "Summers", "G"],
  ["Addison", "Tenney", "5"],
  ["Adeleine", "Bajwa", "3"],
  ["Adley", "Yosha", "4"],
  ["Aidan", "Garza", "6"],
  ["Alexis", "Berson", "A2"],
  ["Aliyna", "Issac", "G"],
  ["Amelia", "Horton", "5"],
  ["Amelia", "McRoberts", "CBC"],
  ["Amelie", "Kentor", "CAB"],
  ["Ami", "Del Vento", "G"],
  ["Ananya", "Parekh", "2"],
  ["Angela", "Allen", "1"],
  ["Anna", "Lowry", "4"],
  ["Apolline", "Beaufreton", "5"],
  ["Ari", "Levin", "3"],
  ["Aria", "Patino", "7"],
  ["Aria", "Rocap", "A1"],
  ["Arlon", "Harris", "A1"],
  ["Atticus", "Staats", "A1"],
  ["Audrey", "Kim", "4"],
  ["Austin", "Bersin", "2"],
  ["Autry", "Wu", "7"],
  ["Avery", "Dillingham", "6"],
  ["Avery", "McElvaney", "A1"],
  ["Barak", "Shraga", "PC"],
  ["Beckett", "Dunham", "5"],
  ["Bela", "Castano", "SAT"],
  ["Bevon", "Francis", "2"],
  ["Breslin", "Canada", "4"],
  ["Brooke", "Robertson", "4"],
  ["Brooks", "Thompson", "5"],
  ["Caleb", "Patino", "5"],
  ["Carina", "Chilcoate", "5"],
  ["Caroline", "Tomkins", "A2"],
  ["Cecilia", "Fuentes", "5"],
  ["Charlie", "Flynn", "8"],
  ["Charlie", "Gilliam", "PC"],
  ["Charlotte", "Harris", "5"],
  ["Charlotte", "Nguyen", "2"],
  ["Charlotte", "Strockis", "5"],
  ["Chloe", "Beaufreton", "7"],
  ["Chloe", "Nguyen", "5"],
  ["Claire", "Ewart", "6"],
  ["Connor", "Truitt", "8"],
  ["Coralie", "Canada", "7"],
  ["Curtis", "McCormick", "A2"],
  ["Dani", "Friesen", "7"],
  ["Drew", "Harris", "A1"],
  ["Dylan", "Bosworth", "A2"],
  ["Elise", "Castano", "PC"],
  ["Ella", "Gonzales", "7"],
  ["Emery", "Ewart", "7"],
  ["Emma", "Crandall", "8"],
  ["Emma", "Gottsch", "5"],
  ["Estella", "Cornett", "G"],
  ["Ethan", "Dugandzic", "3"],
  ["Ethan", "Hartig", "K"],
  ["Eva", "Del Rios-Lee", "PC"],
  ["Everett", "Mabry", "A2"],
  ["Frida", "Wood", "A1"],
  ["Georgia", "Lackey", "8"],
  ["Graham", "Mabry", "PC"],
  ["Grant", "Ratcliffgardy", "A2"],
  ["Gwen", "Kjallbring", "PC"],
  ["Hailey", "Heidmann", "G"],
  ["Hannah", "Schlesinger", "PC"],
  ["Harper", "Daves", "A2"],
  ["Harper", "Heidmann", "8"],
  ["Hayden", "Johnson", "4"],
  ["Henry", "Lersch", "8"],
  ["Ian", "Jaramillo", "A1"],
  ["Ingunn", "Pat-El Litland", "8"],
  ["Isaac", "Marks", "7"],
  ["Isabel", "Garcia", "A1"],
  ["Isabelle", "Horonzy", "SAT"],
  ["Izzy", "Cockrum", "G"],
  ["Jaidev", "Ramadass", "A2"],
  ["James", "Zinda", "6"],
  ["Jeilyn", "Garrick", "6"],
  ["Jenna", "Barta", "5"],
  ["Jocelyn", "Chen", "A1"],
  ["Jojo", "Gordon", "5"],
  ["Jonah", "Meece", "6"],
  ["Josephine", "Bajkowski", "3"],
  ["Julie", "Zoweil", "8"],
  ["Juniper", "Glover", "4"],
  ["Karma", "Saenz", "5"],
  ["Kathryn", "Talley", "CAB"],
  ["Katie", "Douglas", "5"],
  ["Kayan", "Gandhi", "3"],
  ["Kennedy", "Klucznik", "1"],
  ["Keshav", "Ramadass", "6"],
  ["Kinley", "Canada", "G"],
  ["Kinsley", "OBrien", "A1"],
  ["Kira", "Fleming", "5"],
  ["Levi", "Nguyen", "4"],
  ["Lillie", "Parker", "6"],
  ["Livie", "Yosha", "8"],
  ["Logan", "Daves", "PC"],
  ["London", "Smith", "4"],
  ["Lorelei", "Reed", "8"],
  ["Lukas", "James", "5"],
  ["Luke", "Leifeste", "5"],
  ["Lyra", "Milner", "A1"],
  ["Maddox", "Noll", "6"],
  ["Maia", "Kinzy", "PC"],
  ["Mason", "Chen", "CAB"],
  ["Matthew", "Cammack", "TSI"],
  ["Max", "McCormick", "PC"],
  ["Max", "Paver", "5"],
  ["Maxwell", "Short", "4"],
  ["Maya", "Braun", "A1"],
  ["Maya", "Morath", "6"],
  ["Melaina", "Crockett", "A2"],
  ["Melinda", "Manning", "PC"],
  ["Melodi", "Alti", "6"],
  ["Mila", "Oshman", "PC"],
  ["Miles", "Chrzanowski", "8"],
  ["Milo", "Tyler", "CAB"],
  ["Miryam", "Miller", "5"],
  ["Myla", "Matacavage", "5"],
  ["Natalie", "Fennell", "G"],
  ["Nico", "Olivares", "3"],
  ["Nicolas", "Vélez", "6"],
  ["Nora", "Alwais", "3"],
  ["Nora", "Jimenez", "5"],
  ["Oliver", "Carroll", "6"],
  ["Oliver", "Emerson", "5"],
  ["Oliver", "Ferragut", "3"],
  ["Oliver", "Lersch", "7"],
  ["Olivia", "Daniel", "8"],
  ["Owen", "Fleming", "7"],
  ["Owen", "Scott", "A2"],
  ["Paxton", "Penner", "G"],
  ["Pearl", "Ewart", "3"],
  ["Penelope", "Jimenez", "A1"],
  ["Phoebe", "Codina", "4"],
  ["Piper", "Nance", "G"],
  ["Piper", "Tenney", "4"],
  ["Princeton", "Kentor", "A2"],
  ["Quinn", "Williams", "6"],
  ["Reagan", "Rhee", "PC"],
  ["Reese", "Parker", "A2"],
  ["Remy", "Lu", "2"],
  ["Riley", "Pendley", "8"],
  ["Rosalind", "Mann", "PC"],
  ["Roshni", "Dixit", "2"],
  ["Rosie", "Bernazal", "4"],
  ["Ryden", "Matthews", "6"],
  ["Sage", "Martens", "6"],
  ["Sahaana", "Gupta", "7"],
  ["Sama", "Laxminarayan", "5"],
  ["Sarah", "Cantu", "G"],
  ["Sascha", "Polonski", "A2"],
  ["Savannah", "Leifeste", "4"],
  ["Sawyer", "Price", "G"],
  ["Sebastian", "Cooley", "6"],
  ["Sienna", "Amin", "5"],
  ["Skye", "Doane", "2"],
  ["Stella", "Thomaz", "A1"],
  ["Talia", "Grauman", "6"],
  ["Tamar", "Pat-El Litland", "4"],
  ["Tate", "Rhee", "CBC"],
  ["Taylor", "Chen", "4"],
  ["Teya", "Fleming", "G"],
  ["Theo", "Abt", "2"],
  ["Torrey", "Wilkins", "A2"],
  ["Tristan", "Chen", "4"],
  ["Victoria", "Peterson", "7"],
  ["Vincent", "Marks", "A1"],
  ["Vivian", "Leifeste", "7"],
  ["Viviana", "Castano", "PC"],
  ["Wesley", "Fine", "A2"],
  ["Willa", "Bieberdorf", "A1"],
  ["Wilma", "Wood", "G"],
  ["Yang-Fan", "Chau", "CBC"],
  ["Wiley", "Davis", "7"],
  ["Alexa", "Frein", "5"],
  ["Erin", "Wiesman", "A1"],
  ["Liam", "Hartig", "2"],
  ["Andrew", "Bai", "PC"],
  ["Ava", "Laibovitz", "6"],
  ["Addy", "Bautista", "3"],
  ["Sydney", "Durrett", "A2"],
  ["Wren", "Ileks", "10"],
  ["Zadok", "Fielding", "6"],
  ["Lily", "Garza", "9"],
  ["Ava", "Quade", "7"],
  ["Luca", "LaPietra", "5"],
  ["Ruby", "Kirk", "7"],
  ["Carson", "Ileks", "7"],
  ["Lyla", "Schultz", "5"],
  ["Nixon", "Schultz", "5"],
  ["Lennie", "LaPietra", "1"],
  ["Logan", "Durrett", "4"],
];

// Map grade codes to grade_level_id values (aligned with db-lookup-data.js order)
const gradeCodeToId = {
  K: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  A1: 10,
  G: 11,
  A2: 12,
  PC: 13,
  CAB: 15,
  CBC: 16,
  SAT: 24,
  STAT: 19,
  CALG: 18,
  10: 12,
  TSI: 17,
  "★": 21,
};

const students = studentEntries.map(([first, last, code], idx) => ({
  id: idx + 1,
  center_id: center.id,
  first_name: first,
  last_name: last,
  grade_level_id: gradeCodeToId[code] ?? 6, // default to 5th grade if unknown
  default_session_type_id: 1,
  is_homework_help: 0,
  is_active: 1,
}));

const weeklySchedules = [
  {
    id: 1,
    center_id: center.id,
    template_id: 2,
    added_by_user_id: adminUser.id,
    date_created: "2025-02-15T10:00:00.000Z",
    date_last_modified: "2025-02-15T10:00:00.000Z",
    // Week starting Sunday 04/27/2025
    week_start_date: "2025-04-27",
  },
];

const schedules = [
  {
    id: 1,
    weekly_schedule_id: 1,
    schedule_date: "2025-04-28", // Monday
    weekday_id: 2,
  },
  {
    id: 2,
    weekly_schedule_id: 1,
    schedule_date: "2025-04-29", // Tuesday
    weekday_id: 3,
  },
  {
    id: 3,
    weekly_schedule_id: 1,
    schedule_date: "2025-04-30", // Wednesday
    weekday_id: 4,
  },
  {
    id: 4,
    weekly_schedule_id: 1,
    schedule_date: "2025-05-01", // Thursday
    weekday_id: 5,
  },
  {
    id: 5,
    weekly_schedule_id: 1,
    schedule_date: "2025-05-02", // Friday
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

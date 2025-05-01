import { Instructor, Center } from "@/types";

const center: Center = {
  id: 1,
  name: "Main Center",
};

export const instructors: Instructor[] = [
  {
    id: 1,
    center,
    firstName: "John",
    lastName: "Smith",
    gradeLevelsTaught: ["Algebra 1", "Algebra 2", "Geometry"],
    cellColor: "#FFB6C1", // Light pink
    isActive: true,
  },
  {
    id: 2,
    center,
    firstName: "Emily",
    lastName: "Johnson",
    gradeLevelsTaught: ["K", "1", "2", "3", "4"],
    cellColor: "#98FB98", // Pale green
    isActive: true,
  },
  {
    id: 3,
    center,
    firstName: "Michael",
    lastName: "Williams",
    gradeLevelsTaught: ["5", "6", "7", "8"],
    cellColor: "#87CEEB", // Sky blue
    isActive: true,
  },
  {
    id: 4,
    center,
    firstName: "Sarah",
    lastName: "Brown",
    gradeLevelsTaught: ["9", "10", "11", "12", "Pre-Calculus"],
    cellColor: "#DDA0DD", // Plum
    isActive: true,
  },
  {
    id: 5,
    center,
    firstName: "David",
    lastName: "Jones",
    gradeLevelsTaught: ["AP Calculus AB", "AP Calculus BC"],
    cellColor: "#F0E68C", // Khaki
    isActive: true,
  },
];

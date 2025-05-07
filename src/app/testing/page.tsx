"use client";

import { useState } from "react";
import Schedule from "@/components/Schedule";
import { Student, Instructor, Center, Cell as CellType } from "@/types";

// Sample test data
const testCenter: Center = {
  id: 1,
  name: "Test Center",
};

const testStudents: Student[] = [
  {
    id: 1,
    center: testCenter,
    firstName: "John",
    lastName: "Doe",
    gradeLevel: "5",
    isHomeworkHelp: false,
    isActive: true,
  },
  {
    id: 2,
    center: testCenter,
    firstName: "Jane",
    lastName: "Smith",
    gradeLevel: "6",
    isHomeworkHelp: true,
    isActive: true,
  },
  {
    id: 3,
    center: testCenter,
    firstName: "Mike",
    lastName: "Johnson",
    gradeLevel: "7",
    isHomeworkHelp: false,
    isActive: true,
  },
];

const testInstructors: Instructor[] = [
  {
    id: 1,
    center: testCenter,
    firstName: "Sarah",
    lastName: "Williams",
    gradeLevelsTaught: ["5", "6", "7"],
    cellColor: "#FFD1DC", // Light pink
    isActive: true,
  },
  {
    id: 2,
    center: testCenter,
    firstName: "David",
    lastName: "Brown",
    gradeLevelsTaught: ["5", "6", "7"],
    cellColor: "#D1FFD1", // Light green
    isActive: true,
  },
  {
    id: 3,
    center: testCenter,
    firstName: "Emily",
    lastName: "Davis",
    gradeLevelsTaught: ["5", "6", "7"],
    cellColor: "#D1D1FF", // Light blue
    isActive: true,
  },
];

export default function Testing() {
  const [cells, setCells] = useState<CellType[]>([]);

  const handleCellChange = (cell: CellType) => {
    setCells((prevCells) => {
      const existingIndex = prevCells.findIndex((c) => c.id === cell.id);
      if (existingIndex >= 0) {
        const newCells = [...prevCells];
        newCells[existingIndex] = cell;
        return newCells;
      }
      return [...prevCells, cell];
    });
  };

  return (
    <div className="p-8" style={{ color: "black" }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: "black" }}>
        Mathnasium Schedule (Testing)
      </h1>
      <div className="border rounded-lg p-4" style={{ color: "black" }}>
        <Schedule
          students={testStudents}
          instructors={testInstructors}
          timeStart={330} // 5:30 AM
          timeEnd={730} // 12:10 PM
          timeInterval={30}
          onCellChange={handleCellChange}
        />
      </div>

      {/* Debug section to show cell changes */}
      <div className="mt-8" style={{ color: "black" }}>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "black" }}>
          Cell Changes
        </h2>
        <pre className="bg-gray-100 p-4 rounded" style={{ color: "black" }}>
          {JSON.stringify(cells, null, 2)}
        </pre>
      </div>
    </div>
  );
}

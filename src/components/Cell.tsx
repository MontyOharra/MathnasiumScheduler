import React, { useState } from "react";
import { Student, Instructor } from "../types";

interface CellProps {
  student: Student;
  instructors: Instructor[];
  onInstructorChange: (instructor: Instructor) => void;
}

const Cell: React.FC<CellProps> = ({
  student,
  instructors,
  onInstructorChange,
}) => {
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);

  const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const instructor = instructors.find(
      (i) => i.id === parseInt(e.target.value)
    );
    if (instructor) {
      setSelectedInstructor(instructor);
      onInstructorChange(instructor);
    }
  };

  return (
    <div
      className="cell"
      style={{
        backgroundColor: selectedInstructor?.cellColor || "white",
        padding: "8px",
        border: "1px solid #ccc",
        minHeight: "50px",
      }}
    >
      <div style={{ fontWeight: student.isHomeworkHelp ? "bold" : "normal" }}>
        {student.firstName} {student.lastName}
      </div>
      <select
        value={selectedInstructor?.id || ""}
        onChange={handleInstructorChange}
        style={{ marginTop: "4px", width: "100%" }}
      >
        <option value="">Select Instructor</option>
        {instructors.map((instructor) => (
          <option key={instructor.id} value={instructor.id}>
            {instructor.firstName} {instructor.lastName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Cell;

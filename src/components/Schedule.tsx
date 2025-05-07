import React from "react";
import { Student, Instructor, Cell as CellType } from "../types";
import Cell from "./Cell";

interface ScheduleProps {
  students: Student[];
  instructors: Instructor[];
  timeStart: number; // in minutes from midnight (e.g., 330 for 5:30 AM)
  timeEnd: number; // in minutes from midnight (e.g., 730 for 12:10 PM)
  timeInterval: number; // in minutes (e.g., 30)
  onCellChange: (cell: CellType) => void;
}

const Schedule: React.FC<ScheduleProps> = ({
  students,
  instructors,
  timeStart,
  timeEnd,
  timeInterval,
  onCellChange,
}) => {
  // Calculate number of rows based on time range and interval
  const totalMinutes = timeEnd - timeStart;
  const numRows = Math.ceil(totalMinutes / timeInterval);

  // Generate time labels for each row
  const timeLabels = Array.from({ length: numRows }, (_, i) => {
    const minutes = timeStart + i * timeInterval;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  });

  return (
    <div
      className="schedule"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
        <div style={{ width: "100px", padding: "8px", fontWeight: "bold" }}>
          Time
        </div>
        {students.map((student, index) => (
          <div
            key={student.id}
            style={{
              flex: 1,
              padding: "8px",
              borderLeft: "1px solid #ccc",
              fontWeight: "bold",
            }}
          >
            {student.firstName} {student.lastName}
          </div>
        ))}
      </div>

      {timeLabels.map((time, rowIndex) => (
        <div
          key={time}
          style={{ display: "flex", borderBottom: "1px solid #ccc" }}
        >
          <div style={{ width: "100px", padding: "8px" }}>{time}</div>
          {students.map((student) => (
            <div
              key={`${student.id}-${time}`}
              style={{
                flex: 1,
                borderLeft: "1px solid #ccc",
                padding: "4px",
              }}
            >
              <Cell
                student={student}
                instructors={instructors}
                onInstructorChange={(instructor) => {
                  onCellChange({
                    id: rowIndex * students.length + student.id,
                    center: student.center,
                    scheduleId: "", // This should be provided by the parent component
                    instructor,
                    student,
                    timeStart: new Date(
                      0,
                      0,
                      0,
                      Math.floor(timeStart / 60),
                      timeStart % 60
                    ),
                    timeEnd: new Date(
                      0,
                      0,
                      0,
                      Math.floor(timeEnd / 60),
                      timeEnd % 60
                    ),
                    podNumber: 1, // This should be provided by the parent component
                  });
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Schedule;

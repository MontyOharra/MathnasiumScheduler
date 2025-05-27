import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
import {
  Student,
  Instructor,
  Cell as CellType,
  WeeklyScheduleTemplate,
  WeeklyScheduleTemplateWeekday,
  SessionRow,
} from "@/types/main";
import Cell from "./Cell";

interface ScheduleProps {
  template: WeeklyScheduleTemplate;
  weekday: WeeklyScheduleTemplateWeekday;
  sessions: SessionRow[];
  students: Student[];
  instructors: Instructor[];
  onCellChange: (cell: CellType) => void;
}

const Schedule: React.FC<ScheduleProps> = ({
  template,
  weekday,
  sessions,
  students,
  instructors,
  onCellChange,
}) => {
  // Parse time strings to minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const timeStart = parseTimeToMinutes(weekday.startTime);
  const timeEnd = parseTimeToMinutes(weekday.endTime);
  const timeInterval = template.intervalLength;

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

  // Create column definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    const columns: ColDef[] = [
      {
        field: "time",
        headerName: "Time",
        width: 100,
        pinned: "left",
        cellStyle: { backgroundColor: "white" },
      },
    ];

    // Add columns based on weekday.numColumns
    for (let i = 0; i < weekday.numColumns; i++) {
      columns.push({
        field: `column${i + 1}`,
        headerName: `Column ${i + 1}`,
        cellRenderer: (params: any) => {
          const cellData = params.value;
          if (!cellData) return null;

          return (
            <Cell
              student={students[0]} // Temporary: Use first student for testing
              instructors={instructors}
              onInstructorChange={(instructor) => {
                onCellChange({
                  id: cellData.id,
                  centerId: 1,
                  scheduleId: "temp",
                  instructorId: instructor.id,
                  studentId: students[0].id,
                  timeStart: new Date(),
                  timeEnd: new Date(),
                  columnNumber: i + 1,
                });
              }}
            />
          );
        },
      });
    }

    return columns;
  }, [weekday.numColumns, students, instructors]);

  // Create row data
  const rowData = useMemo(() => {
    return timeLabels.map((time, rowIndex) => {
      const row: any = { time };
      for (let i = 0; i < weekday.numColumns; i++) {
        row[`column${i + 1}`] = {
          id: rowIndex * weekday.numColumns + i,
        };
      }
      return row;
    });
  }, [timeLabels, weekday.numColumns]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        {" "}
        {/* Header*/}
        <div>Weekday, 01/01/1970</div>
        <button>import</button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{
          height: 500,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
            cellStyle: { padding: 0 },
          }}
          rowHeight={100}
          headerHeight={40}
          suppressCellFocus={true}
          suppressRowClickSelection={true}
        />
      </div>
    </div>
  );
};

export default Schedule;

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
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

  // Create column helper
  const columnHelper = createColumnHelper<{
    time: string;
    cells: { id: number }[];
  }>();

  // Define columns
  const columns = [
    columnHelper.accessor("time", {
      header: "Time",
      cell: (info) => info.getValue(),
    }),
    // Create columns based on weekday.numColumns
    ...Array.from({ length: weekday.numColumns }, (_, i) =>
      columnHelper.accessor((row) => row.cells[i], {
        id: `column-${i + 1}`,
        header: `Column ${i + 1}`,
        cell: () => null, // Empty cell for now
      })
    ),
  ];

  // Prepare data for the table
  const data = timeLabels.map((time, rowIndex) => ({
    time,
    cells: Array.from({ length: weekday.numColumns }, (_, i) => ({
      id: rowIndex * weekday.numColumns + i,
    })),
  }));

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex flex-row justify-between">
        {" "}
        {/* Header*/}
        <div>Weekday, 01/01/1970</div>
        <button>import</button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;

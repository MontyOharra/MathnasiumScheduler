import { cn } from "@/lib/utils";

interface CellProps {
  cell:
    | {
        id: number;
        instructorId: number;
        studentId: number;
        timeStart: string;
        timeEnd: string;
        columnNumber: number;
        instructorFirstName: string;
        instructorLastName: string;
        studentFirstName: string;
        studentLastName: string;
      }
    | undefined;
  timeSlot: string;
  columnNumber: number;
}

export function Cell({ cell, timeSlot }: CellProps) {
  if (!cell) {
    return (
      <div
        className={cn(
          "border rounded p-2 min-h-[60px]",
          "hover:bg-gray-50 cursor-pointer",
          "transition-colors duration-200"
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "border rounded p-2 min-h-[60px]",
        "bg-white shadow-sm",
        "flex flex-col justify-between"
      )}
    >
      <div className="text-sm font-medium">
        {cell.instructorFirstName} {cell.instructorLastName}
      </div>
      <div className="text-sm text-gray-600">
        {cell.studentFirstName} {cell.studentLastName}
      </div>
      <div className="text-xs text-gray-500">
        {timeSlot} - {cell.timeEnd.split(" ")[1]}
      </div>
    </div>
  );
}

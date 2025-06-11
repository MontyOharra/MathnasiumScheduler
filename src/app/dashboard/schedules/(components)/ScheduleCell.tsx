interface ScheduleCellProps {
  timeStart: string;
  timeEnd: string;
  columnNumber: number;
  podNumber?: number;
  studentSlot?: number;
}

export function ScheduleCell({
  timeStart,
  timeEnd,
  columnNumber,
  podNumber,
  studentSlot,
}: ScheduleCellProps) {
  const tooltipText =
    podNumber && studentSlot
      ? `${timeStart} - ${timeEnd} | Pod ${podNumber}, Student ${studentSlot}`
      : `${timeStart} - ${timeEnd} | Column ${columnNumber}`;

  return (
    <div
      className="border border-gray-300 w-24 h-12 bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-center text-xs"
      title={tooltipText}
    >
      {/* Empty cell for now */}
    </div>
  );
}

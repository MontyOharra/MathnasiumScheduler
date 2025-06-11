import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { WeeklySchedule } from "@/types/main";
import {
  PencilIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface WeeklyScheduleTableRowProps {
  weeklySchedule: WeeklySchedule;
  onEdit: (weeklySchedule: WeeklySchedule) => void;
  onPrint: (weeklySchedule: WeeklySchedule) => void;
  onDelete: (weeklySchedule: WeeklySchedule) => void;
}

const columnClasses = {
  date: "w-[30%]",
  lastModified: "w-[30%]",
  actions: "w-[40%]",
};

export default function WeeklyScheduleTableRow({
  weeklySchedule,
  onEdit,
  onPrint,
  onDelete,
}: WeeklyScheduleTableRowProps) {
  const formatDate = (date: Date) => {
    return format(date, "EEE, MM/dd/yy");
  };

  return (
    <TableRow>
      <TableCell className={`${columnClasses.date} font-medium`}>
        {formatDate(weeklySchedule.weekStartDate)}
      </TableCell>
      <TableCell className={columnClasses.lastModified}>
        {formatDate(weeklySchedule.dateLastModified)}
      </TableCell>
      <TableCell className={`${columnClasses.actions} text-right`}>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(weeklySchedule)}
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPrint(weeklySchedule)}
            className="text-gray-900 hover:text-gray-700 hover:bg-gray-50"
          >
            <PrinterIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(weeklySchedule)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface StudentTableRowProps {
  studentId: number;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  defaultSessionType: string;
  onEdit: () => void;
  onViewSessions: () => void;
}

const columnClasses = {
  firstName: "w-[15%]",
  lastName: "w-[15%]",
  grade: "w-[20%]",
  session: "w-[30%]",
  actions: "w-[20%]",
};

export default function StudentTableRow({
  firstName,
  lastName,
  gradeLevel,
  defaultSessionType,
  onEdit,
  onViewSessions,
}: StudentTableRowProps) {
  return (
    <TableRow>
      <TableCell className={`${columnClasses.firstName} font-medium`}>
        {firstName}
      </TableCell>
      <TableCell className={`${columnClasses.lastName} font-medium`}>
        {lastName}
      </TableCell>
      <TableCell className={columnClasses.grade}>{gradeLevel}</TableCell>
      <TableCell className={columnClasses.session}>
        {defaultSessionType}
      </TableCell>
      <TableCell className={`${columnClasses.actions} text-right`}>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onViewSessions}>
            View Sessions
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

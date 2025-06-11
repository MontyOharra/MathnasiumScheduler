import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getGradeLevels,
  processGradeLevelForStudent,
  type GradeLevelWithBasic,
} from "@/lib/grade-level-utils";

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
  const [gradeLevels, setGradeLevels] = useState<GradeLevelWithBasic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradeLevels = async () => {
      try {
        const levels = await getGradeLevels();
        setGradeLevels(levels);
      } catch (error) {
        console.error("Failed to fetch grade levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradeLevels();
  }, []);

  const displayGradeLevel = loading
    ? gradeLevel
    : processGradeLevelForStudent(gradeLevel, gradeLevels);

  return (
    <TableRow>
      <TableCell className={`${columnClasses.firstName} font-medium`}>
        {firstName}
      </TableCell>
      <TableCell className={`${columnClasses.lastName} font-medium`}>
        {lastName}
      </TableCell>
      <TableCell className={columnClasses.grade}>
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-md border border-red-200">
          {displayGradeLevel}
        </span>
      </TableCell>
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

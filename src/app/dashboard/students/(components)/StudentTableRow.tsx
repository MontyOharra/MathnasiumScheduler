import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { List, Edit } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  firstName: "w-[20%] min-w-[100px]",
  lastName: "w-[20%] min-w-[100px]",
  grade: "w-[20%] min-w-[120px]",
  session: "w-[25%] min-w-[150px]",
  actions: "w-[15%] min-w-[100px]",
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onViewSessions}>
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View session history</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getGradeLevels,
  processGradeLevelsForInstructor,
  type GradeLevelWithBasic,
} from "@/lib/grade-level-utils";

interface InstructorTableRowProps {
  instructorId: number;
  firstName: string;
  lastName: string;
  cellColor: string;
  gradeLevels: string[];
  onEdit: () => void;
  onViewSchedule: () => void;
}

const columnClasses = {
  firstName: "w-[20%]",
  lastName: "w-[20%]",
  color: "w-[15%]",
  gradeLevels: "w-[25%]",
  actions: "w-[20%]",
};

export default function InstructorTableRow({
  firstName,
  lastName,
  cellColor,
  gradeLevels,
  onEdit,
  onViewSchedule,
}: InstructorTableRowProps) {
  const [allGradeLevels, setAllGradeLevels] = useState<GradeLevelWithBasic[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradeLevels = async () => {
      try {
        const levels = await getGradeLevels();
        setAllGradeLevels(levels);
      } catch (error) {
        console.error("Failed to fetch grade levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradeLevels();
  }, []);

  const processedGradeLevels = loading
    ? gradeLevels
    : processGradeLevelsForInstructor(gradeLevels, allGradeLevels);

  return (
    <TableRow>
      <TableCell className={`${columnClasses.firstName} font-medium`}>
        {firstName}
      </TableCell>
      <TableCell className={`${columnClasses.lastName} font-medium`}>
        {lastName}
      </TableCell>
      <TableCell className={columnClasses.color}>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: cellColor }}
          />
          <span className="text-sm text-gray-600">{cellColor}</span>
        </div>
      </TableCell>
      <TableCell className={columnClasses.gradeLevels}>
        <div className="flex flex-wrap gap-1">
          {processedGradeLevels.map((level: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {level}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className={`${columnClasses.actions} text-right`}>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onViewSchedule}>
            View Schedule
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

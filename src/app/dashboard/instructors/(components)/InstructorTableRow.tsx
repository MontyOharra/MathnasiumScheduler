import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Calendar, Edit } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getGradeLevels,
  processGradeLevelsForInstructor,
  type GradeLevelWithBasic,
} from "@/lib/grade-level-utils";
import InstructorMonthlyAvailabilityModal from "./InstructorMonthlyAvailabilityModal";

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
  firstName: "w-[20%] min-w-[100px]",
  lastName: "w-[20%] min-w-[100px]",
  color: "w-[15%] min-w-[120px]",
  gradeLevels: "w-[30%] min-w-[150px]",
  actions: "w-[15%] min-w-[100px]",
};

export default function InstructorTableRow({
  instructorId,
  firstName,
  lastName,
  cellColor,
  gradeLevels,
  onEdit,
}: InstructorTableRowProps) {
  const [allGradeLevels, setAllGradeLevels] = useState<GradeLevelWithBasic[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showMonthlyAvailability, setShowMonthlyAvailability] = useState(false);

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
    <>
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
                className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-md border border-red-200"
              >
                {level}
              </span>
            ))}
          </div>
        </TableCell>
        <TableCell className={`${columnClasses.actions} text-right`}>
          <div className="flex justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMonthlyAvailability(true)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View availability</p>
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

      {/* Monthly Availability Modal */}
      {showMonthlyAvailability && (
        <InstructorMonthlyAvailabilityModal
          instructorId={instructorId}
          instructorName={`${firstName} ${lastName}`}
          isOpen={showMonthlyAvailability}
          onClose={() => setShowMonthlyAvailability(false)}
        />
      )}
    </>
  );
}

// Add the modal at the end - temporarily commented out until modal is created
// export function InstructorTableRowWithModal(props: InstructorTableRowProps) {
//   const [showMonthlyAvailability, setShowMonthlyAvailability] = useState(false);

//   return (
//     <>
//       <InstructorTableRow {...props} />
//       <InstructorMonthlyAvailabilityModal
//         instructorId={props.instructorId}
//         instructorName={`${props.firstName} ${props.lastName}`}
//         isOpen={showMonthlyAvailability}
//         onClose={() => setShowMonthlyAvailability(false)}
//       />
//     </>
//   );
// }

import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Instructor } from "@/types/main";
import { Table, TableBody } from "@/components/ui/table";
import InstructorTableRow from "./InstructorTableRow";
import InstructorTableHeader, {
  SortField,
  SortDirection,
} from "./InstructorTableHeader";
import { DatabaseService } from "@/lib/db-service";
import InstructorEditModal from "./InstructorEditModal";

interface InstructorWithDetails extends Instructor {
  gradeLevels: string[];
}

export interface InstructorTableRef {
  fetchInstructors: () => Promise<void>;
}

interface InstructorTableProps {}

const InstructorTable = forwardRef<InstructorTableRef, InstructorTableProps>(
  (props, ref) => {
    const [centerInstructors, setCenterInstructors] = useState<
      InstructorWithDetails[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInstructorId, setSelectedInstructorId] = useState<
      number | null
    >(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sort, setSort] = useState<{
      field: SortField | null;
      direction: SortDirection;
    }>({
      field: null,
      direction: "asc",
    });

    const fetchInstructors = useCallback(async () => {
      try {
        setIsLoading(true);

        // Debug: Check what methods are available
        if (typeof window !== "undefined" && window.electron?.database) {
          console.log(
            "Available database methods:",
            Object.keys(window.electron.database)
          );
        }

        // Use the actual database service to fetch instructors with grade levels
        const dbService = DatabaseService.getInstance();
        const instructors = await dbService.getInstructorsWithGradeLevels(1); // Using center ID 1 for now
        setCenterInstructors(instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        // Fallback to basic instructor fetch if the new method doesn't exist
        try {
          const dbService = DatabaseService.getInstance();
          const basicInstructors = await dbService.getInstructors(1);
          // Map to expected format with empty grade levels
          const instructorsWithEmptyGrades = basicInstructors.map(
            (instructor) => ({
              ...instructor,
              gradeLevels: [],
            })
          );
          setCenterInstructors(instructorsWithEmptyGrades);
          console.log("Fallback instructors:", instructorsWithEmptyGrades);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      fetchInstructors,
    }));

    useEffect(() => {
      fetchInstructors();
    }, [fetchInstructors]);

    // Debug: Track modal state changes
    useEffect(() => {
      console.log("Modal state changed:", {
        selectedInstructorId,
        isEditModalOpen,
        shouldRenderModal: selectedInstructorId && isEditModalOpen,
      });
    }, [selectedInstructorId, isEditModalOpen]);

    const handleSort = (field: SortField) => {
      console.log("Sort clicked:", field);
      setSort((currentSort) => {
        const newSort = {
          field,
          direction:
            currentSort.field === field && currentSort.direction === "asc"
              ? "desc"
              : ("asc" as SortDirection),
        };
        console.log("New sort state:", newSort);
        return newSort;
      });
    };

    const handleEdit = (instructorId: number) => {
      console.log("handleEdit called with instructorId:", instructorId);
      setSelectedInstructorId(instructorId);
      setIsEditModalOpen(true);
      console.log(
        "Modal state set - selectedInstructorId:",
        instructorId,
        "isEditModalOpen:",
        true
      );
    };

    const handleViewSchedule = (instructorId: number) => {
      console.log("View instructor schedule:", instructorId);
    };

    const handleEditModalClose = () => {
      setIsEditModalOpen(false);
      setSelectedInstructorId(null);
    };

    const handleEditModalSave = async () => {
      await fetchInstructors();
    };

    if (isLoading && centerInstructors.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading instructors...</div>
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col border-3">
        <div className="flex-none">
          <InstructorTableHeader currentSort={sort} onSort={handleSort} />
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
          <Table>
            <TableBody>
              {centerInstructors.map((instructor) => (
                <InstructorTableRow
                  key={instructor.id}
                  instructorId={instructor.id}
                  firstName={instructor.firstName}
                  lastName={instructor.lastName}
                  cellColor={instructor.cellColor}
                  gradeLevels={instructor.gradeLevels}
                  onEdit={() => handleEdit(instructor.id)}
                  onViewSchedule={() => handleViewSchedule(instructor.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedInstructorId && (
          <InstructorEditModal
            instructorId={selectedInstructorId}
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            onSave={handleEditModalSave}
          />
        )}
      </div>
    );
  }
);

InstructorTable.displayName = "InstructorTable";

export default InstructorTable;

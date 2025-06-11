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
import InstructorEditModal from "./InstructorEditModal";

interface InstructorWithDetails extends Instructor {
  gradeLevels: string[];
}

export interface InstructorTableRef {
  fetchInstructors: () => Promise<void>;
}

const InstructorTable = forwardRef<InstructorTableRef, Record<string, never>>(
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
        // TODO: Implement getInstructorsWithDetails in dbService
        // For now, using mock data
        const mockInstructors: InstructorWithDetails[] = [
          {
            id: 1,
            centerId: 1,
            firstName: "Sarah",
            lastName: "Johnson",
            cellColor: "#FF6B6B",
            isActive: true,
            gradeLevels: ["K", "1st", "2nd"],
          },
          {
            id: 2,
            centerId: 1,
            firstName: "Mike",
            lastName: "Chen",
            cellColor: "#4ECDC4",
            isActive: true,
            gradeLevels: ["3rd", "4th", "5th"],
          },
          {
            id: 3,
            centerId: 1,
            firstName: "Emily",
            lastName: "Davis",
            cellColor: "#45B7D1",
            isActive: true,
            gradeLevels: ["6th", "7th", "8th"],
          },
        ];
        setCenterInstructors(mockInstructors);
        console.log("Instructors:", mockInstructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
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
      setSelectedInstructorId(instructorId);
      setIsEditModalOpen(true);
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

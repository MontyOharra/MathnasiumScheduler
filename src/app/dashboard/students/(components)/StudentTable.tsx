import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Student } from "@/types/main";
import dbService from "@/lib/db-service";
import { Table, TableBody } from "@/components/ui/table";
import StudentTableRow from "./StudentTableRow";
import StudentTableHeader, {
  SortField,
  SortDirection,
} from "./StudentTableHeader";
import StudentEditModal from "./StudentEditModal";

interface StudentWithDetails extends Student {
  gradeLevelName: string;
  sessionTypeCode: string;
  sessionTypeLength: number;
}

export interface StudentTableRef {
  fetchStudents: () => Promise<void>;
}

const StudentTable = forwardRef<StudentTableRef, {}>((props, ref) => {
  const [centerStudents, setCenterStudents] = useState<StudentWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sort, setSort] = useState<{
    field: SortField | null;
    direction: SortDirection;
  }>({
    field: null,
    direction: "asc",
  });

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const students = await dbService.getStudentsWithDetails(1, sort);
      setCenterStudents(students);
      console.log("Students:", students);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sort]);

  useImperativeHandle(ref, () => ({
    fetchStudents,
  }));

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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

  const handleEdit = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsEditModalOpen(true);
  };

  const handleViewSessions = (studentId: number) => {
    console.log("View student:", studentId);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedStudentId(null);
  };

  const handleEditModalSave = async () => {
    await fetchStudents();
  };

  if (isLoading && centerStudents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col border-3">
      <div className="flex-none">
        <StudentTableHeader currentSort={sort} onSort={handleSort} />
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
        <Table>
          <TableBody>
            {centerStudents.map((student) => (
              <StudentTableRow
                key={student.id}
                studentId={student.id}
                firstName={student.firstName}
                lastName={student.lastName}
                gradeLevel={student.gradeLevelName}
                defaultSessionType={`${student.sessionTypeCode} (${student.sessionTypeLength} min)`}
                onEdit={() => handleEdit(student.id)}
                onViewSessions={() => handleViewSessions(student.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedStudentId && (
        <StudentEditModal
          studentId={selectedStudentId}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSave={handleEditModalSave}
        />
      )}
    </div>
  );
});

StudentTable.displayName = "StudentTable";

export default StudentTable;

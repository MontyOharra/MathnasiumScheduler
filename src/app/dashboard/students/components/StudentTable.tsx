import { useEffect, useState } from "react";
import { Student } from "@/types/main";
import StudentRow from "./StudentRow";
import dbService from "@/lib/db-service";

interface StudentWithDetails extends Student {
  gradeLevelName: string;
  sessionTypeCode: string;
  sessionTypeLength: number;
}

export default function StudentTable() {
  const [centerStudents, setCenterStudents] = useState<StudentWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const students = await dbService.getStudentsWithDetails(1); // Using center ID 1 for now
        console.log(students);
        setCenterStudents(students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleEdit = (studentId: number) => {
    // TODO: Implement edit functionality
    console.log("Edit student:", studentId);
  };

  const handleView = (studentId: number) => {
    // TODO: Implement view functionality
    console.log("View student:", studentId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grade Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Default Session Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {centerStudents.map((student) => (
            <StudentRow
              key={student.id}
              studentId={student.id}
              name={`${student.firstName} ${student.lastName}`}
              gradeLevel={student.gradeLevelName}
              defaultSessionType={`${student.sessionTypeCode} (${student.sessionTypeLength} min)`}
              onEdit={() => handleEdit(student.id)}
              onView={() => handleView(student.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StudentRowProps {
  studentId: number;
  name: string;
  gradeLevel: string;
  defaultSessionType: string;
  onEdit: () => void;
  onView: () => void;
}

export default function StudentRow({
  name,
  gradeLevel,
  defaultSessionType,
  onEdit,
  onView,
}: StudentRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {gradeLevel}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {defaultSessionType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={onView}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}

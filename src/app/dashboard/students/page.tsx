"use client";

import { useState, useRef } from "react";
import StudentTable from "./(components)/StudentTable";
import StudentAddModal from "./(components)/StudentAddModal";

export default function StudentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const tableRef = useRef<{ fetchStudents: () => Promise<void> }>(null);

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <div className="space-x-4">
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add New
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Import
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <StudentTable ref={tableRef} />
      </div>

      <StudentAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          // Refresh the student list
          tableRef.current?.fetchStudents();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import NewScheduleModal from "./NewScheduleModal";

export default function NewScheduleButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <PlusIcon className="h-5 w-5" />
        <span>New Schedule</span>
      </button>

      <NewScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

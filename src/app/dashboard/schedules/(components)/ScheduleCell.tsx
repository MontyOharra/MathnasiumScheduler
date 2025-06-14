"use client";

import React, { useEffect, useState } from "react";
import dbService from "@/lib/db-service";

interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  cellColor: string;
}

interface ScheduleCellProps {
  timeStart: string;
  timeEnd: string;
  columnNumber: number;
  podNumber?: number;
  studentSlot?: number;
  /**
   * List of full student names (e.g. "James Smith"). Will be abbreviated automatically.
   */
  studentNames?: string[];
  /**
   * Optional list of instructors already fetched by parent to avoid per-cell DB calls.
   */
  instructors?: Instructor[];
  /**
   * Callback when a user chooses a different instructor.
   */
  onInstructorSelect?: (instructorId: number | null) => void;
}

// Utility to abbreviate a full name -> "First L" style
const abbreviateName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${parts[0]} ${lastInitial}`;
};

export const ScheduleCell = React.memo(function ScheduleCell({
  timeStart,
  timeEnd,
  columnNumber,
  podNumber,
  studentSlot,
  studentNames = [],
  instructors: propInstructors,
  onInstructorSelect,
}: ScheduleCellProps) {
  const [instructors, setInstructors] = useState<Instructor[]>(
    propInstructors ?? []
  );
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);
  const [showMenu, setShowMenu] = useState(false);

  // Fetch instructors lazily if none provided
  useEffect(() => {
    const fetchInstructors = async () => {
      if (propInstructors && propInstructors.length > 0) return; // already provided
      try {
        // TODO: replace hard-coded centerId with actual context / prop when available
        const centerId = 1;
        const data = await dbService.getActiveInstructors(centerId);
        setInstructors(
          data.map((d) => ({
            id: d.id,
            firstName: d.firstName,
            lastName: d.lastName,
            cellColor: d.cellColor,
          }))
        );
      } catch (err) {
        console.error("Failed to load instructors", err);
      }
    };
    fetchInstructors();
  }, [propInstructors]);

  const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newId = value === "" ? null : Number(value);
    setSelectedInstructorId(newId);
    onInstructorSelect?.(newId);
  };

  // Determine background color based on selected instructor
  const selectedInstructor = instructors.find(
    (i) => i.id === selectedInstructorId
  );
  const backgroundColor = selectedInstructor
    ? selectedInstructor.cellColor
    : "#f9f9f9";

  const tooltipText =
    podNumber && studentSlot
      ? `${timeStart} - ${timeEnd} | Pod ${podNumber}, Student ${studentSlot}`
      : `${timeStart} - ${timeEnd} | Column ${columnNumber}`;

  return (
    <div
      className="relative border border-gray-300 w-24 h-12 flex overflow-hidden text-xs"
      title={tooltipText}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Instructor bar */}
      <div
        className="relative h-full border-r border-gray-200"
        style={{ width: "24px", backgroundColor }}
      >
        {showMenu && (
          <select
            className="absolute inset-0 w-full h-full text-[11px] bg-white/80 backdrop-blur-sm border border-gray-400 focus:outline-none"
            value={selectedInstructorId ?? ""}
            onChange={handleInstructorChange}
          >
            <option value="">-</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.firstName} {ins.lastName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Student names area */}
      <div className="flex-1 flex flex-col items-center justify-center leading-tight px-0.5 text-center pointer-events-none">
        {studentNames.map((fullName) => (
          <span key={fullName} className="truncate">
            {abbreviateName(fullName)}
          </span>
        ))}
      </div>
    </div>
  );
});

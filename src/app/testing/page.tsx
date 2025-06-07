"use client";

import { useState } from "react";
import Schedule from "@/components/Schedule";
import {
  Student,
  Instructor,
  Center,
  Cell as CellType,
  WeeklyScheduleTemplate,
  WeeklyScheduleTemplateWeekday,
  SessionRow,
} from "@/types/main";

import { students } from "@/data/test-data/students";
import { instructors } from "@/data/test-data/instructors";
import {
  scheduleTemplates,
  scheduleTemplateWeekdays,
} from "@/data/test-data/schedule_templates";
import { sessions } from "@/data/test-data/sessions";

export default function Testing() {
  const [cells, setCells] = useState<CellType[]>([]);

  // For testing, we'll use the first template and its Monday schedule
  const template = scheduleTemplates[0];
  const weekday = scheduleTemplateWeekdays.find(
    (w) => w.templateId === template.id && w.weekdayId === 2 // 2 is Monday
  )!;

  const handleCellChange = (cell: CellType) => {
    setCells((prevCells) => {
      const existingIndex = prevCells.findIndex((c) => c.id === cell.id);
      if (existingIndex >= 0) {
        const newCells = [...prevCells];
        newCells[existingIndex] = cell;
        return newCells;
      }
      return [...prevCells, cell];
    });
  };

  return (
    <div>
      <h1>Mathnasium Schedule (Testing)</h1>
      <div>
        <Schedule
          template={template}
          weekday={weekday}
          sessions={sessions}
          students={students}
          instructors={instructors}
          onCellChange={handleCellChange}
        />
      </div>
    </div>
  );
}

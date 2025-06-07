"use client";

import { scheduleTemplates } from "@/data/schedule_templates";
import { scheduleTemplateWeekdays } from "@/data/schedule_template_weekday";
import Schedule from "@/components/Schedule";
import { Cell } from "@/types/main";

export default function EditSchedulePage() {
  // For testing, we'll use the first template and its Monday schedule
  const template = scheduleTemplates.find((t) => t.id === "spring-schedule");
  const templateWeekday = scheduleTemplateWeekdays.find((w) => w.templateId === "spring-schedule" && w.weekdayId === 1);

  console.log(templateWeekday);

  return (
    <div>
      <h1 className="text-2xl text-red-500 font-bold">Edit Schedule Page</h1>
      <Schedule template={template!} weekday={templateWeekday!} />
    </div>
  );
}

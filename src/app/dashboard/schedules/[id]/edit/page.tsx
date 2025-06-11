"use client";

import Schedule from "@/app/dashboard/schedules/(components)/Schedule";

export default function EditSchedulePage() {
  // For testing, we'll use the first template and its Monday schedule
  return (
    <div>
      <h1 className="text-2xl text-red-500 font-bold">Edit Schedule Page</h1>
      <Schedule />
    </div>
  );
}

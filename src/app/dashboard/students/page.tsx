"use client";

import { useEffect, useState } from "react";
import dbService from "@/lib/db-service";
import { Student } from "@/types/main";
import { gradeLevels } from "@/data/static-data/grade-levels";
import StudentTable from "./components/StudentTable";

export default function StudentsPage() {
  return (
    <StudentTable />
  );
}

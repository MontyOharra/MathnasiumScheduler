"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Link href="/dashboard/instructors"></Link>

      <h1>Dashboard</h1>
    </div>
  );
}

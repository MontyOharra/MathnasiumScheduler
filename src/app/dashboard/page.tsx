"use client";

import { useEffect } from   "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();

    return (
        <div>
            <Link href="/dashboard/instructors"></Link>

            <h1>Dashboard</h1>
        </div>
    )
}

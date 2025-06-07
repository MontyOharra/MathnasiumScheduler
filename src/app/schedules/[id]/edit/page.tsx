"use client";

import { useParams } from "next/navigation";

export default function EditSchedulePage() {
  const params = useParams();
  const id = params.id;

  return <div>Edit Schedule Page for ID: {id}</div>;
}

import { redirect } from "next/navigation";

export default function SettingsPage() {
  // Redirect to appearance settings by default
  redirect("/dashboard/settings/appearance");
}

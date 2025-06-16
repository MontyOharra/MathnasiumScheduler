import GradeLevelsSection from "./(components)/GradeLevelsSection";
import SessionTypesSection from "./(components)/SessionTypesSection";

export default function CenterSettings() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Center Settings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage grade levels, classes taught, and session types
        </p>
      </div>

      <div className="space-y-6">
        <GradeLevelsSection />
        <SessionTypesSection />
      </div>
    </div>
  );
}

"use client";

import { useAppearance } from "@/stores/AppearanceContext";

export default function AppearanceSettings() {
  const { settings, updateTheme, updateFontSize } = useAppearance();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Appearance Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Customize the look and feel of your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Color Scheme
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.theme === "light"}
                    onChange={(e) => updateTheme(e.target.value as "light")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Light</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.theme === "dark"}
                    onChange={(e) => updateTheme(e.target.value as "dark")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Dark</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.theme === "auto"}
                    onChange={(e) => updateTheme(e.target.value as "auto")}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Auto (system preference)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Font Size Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interface Font Size
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fontSize"
                    value="small"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.fontSize === "small"}
                    onChange={(e) => updateFontSize(e.target.value as "small")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Small</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fontSize"
                    value="medium"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.fontSize === "medium"}
                    onChange={(e) => updateFontSize(e.target.value as "medium")}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Medium (Default)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fontSize"
                    value="large"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.fontSize === "large"}
                    onChange={(e) => updateFontSize(e.target.value as "large")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Large</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fontSize"
                    value="extra-large"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    checked={settings.fontSize === "extra-large"}
                    onChange={(e) =>
                      updateFontSize(e.target.value as "extra-large")
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Extra Large
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

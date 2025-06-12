"use client";

import { useState, useEffect } from "react";
import { WeeklyScheduleTemplate } from "@/types/main";
import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewSchedule: () => void;
}

interface DatabaseResult {
  id?: string | number;
  error?: string;
}

export default function NewScheduleModal({
  isOpen,
  onClose,
  onCreateNewSchedule,
}: NewScheduleModalProps) {
  const [templates, setTemplates] = useState<WeeklyScheduleTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WeeklyScheduleTemplate | null>(null);
  const [autoPopulate, setAutoPopulate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch templates when the modal opens
    if (isOpen) {
      const fetchTemplates = async () => {
        try {
          const result = await window.electron.database.customQuery(
            "SELECT * FROM weekly_schedule_template WHERE center_id = ?",
            [1]
          );

          console.log("Database query result:", result);

          // Ensure result is an array
          const templatesArray = Array.isArray(result) ? result : [];
          console.log("Templates array:", templatesArray);

          setTemplates(templatesArray);

          // Set default template if available
          const defaultTemplate = templatesArray.find(
            (template: WeeklyScheduleTemplate) => template.isDefault
          );
          console.log("Default template:", defaultTemplate);

          if (defaultTemplate) {
            setSelectedTemplate(defaultTemplate);
          }
        } catch (error) {
          console.error("Error fetching templates:", error);
        }
      };

      fetchTemplates();
    }
  }, [isOpen]);

  const handleCreateSchedule = async () => {
    if (!selectedTemplate || !selectedDate) {
      alert("Please select both a template and a date");
      return;
    }

    setIsLoading(true);
    try {
      // Create dates in local timezone
      const now = new Date();
      const currentDate = now.toISOString();

      // Format the selected date
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const scheduleData = {
        template_id: selectedTemplate.id,
        center_id: 1,
        added_by_user_id: 1,
        schedule_date: formattedDate,
        date_created: currentDate,
        date_last_modified: currentDate,
      };

      console.log("Creating schedule with data:", scheduleData);
      const result = (await window.electron.database.insert(
        "schedule",
        scheduleData
      )) as DatabaseResult;
      console.log("Schedule creation result:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      // Close modal first to prevent any state updates after unmount
      onClose();

      // Then trigger the refresh
      onCreateNewSchedule();
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("Failed to create schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-background-dark/80" onClick={onClose}>
        <button
          className="absolute top-4 left-4 text-text-light/80 hover:text-text-light transition-colors"
          onClick={onClose}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-text">
            Create New Schedule
          </h2>

          {/* Date Selection Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-text">
              Select Date
            </h3>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  if (date) setSelectedDate(date);
                }}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text pl-10"
                wrapperClassName="w-full"
                popperClassName="z-50"
                popperPlacement="bottom-start"
                customInput={
                  <div className="relative">
                    <CalendarIcon className="h-5 w-5 text-text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                }
              />
            </div>
          </div>

          {/* Schedule Template Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-text">
              Schedule Template
            </h3>
            <select
              value={selectedTemplate?.id || ""}
              onChange={(e) => {
                const template = templates.find(
                  (t) => t.id === Number(e.target.value)
                );
                setSelectedTemplate(template || null);
              }}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
            >
              <option value="" className="text-text">
                Select a template
              </option>
              {templates.map((template) => (
                <option
                  key={template.id}
                  value={template.id}
                  className="text-text"
                >
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-populate Option */}
          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="autoPopulate"
              checked={autoPopulate}
              onChange={(e) => setAutoPopulate(e.target.checked)}
              className="h-5 w-5 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="autoPopulate" className="ml-3 text-text-muted">
              Auto-populate student instructor pairs
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-text-muted border border-border rounded-lg hover:bg-primary-light transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSchedule}
              disabled={isLoading || !selectedTemplate || !selectedDate}
              className="px-6 py-3 bg-primary text-text-light rounded-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

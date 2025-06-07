"use client";

import { useState, useEffect, useRef } from "react";
import { WeeklyScheduleTemplate } from "@/types/main";
import { scheduleTemplates } from "@/data/test-data/schedule_templates";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewScheduleModal({
  isOpen,
  onClose,
}: NewScheduleModalProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<WeeklyScheduleTemplate | null>(null);
  const [autoPopulate, setAutoPopulate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the default template when the modal opens
    if (isOpen) {
      const defaultTemplate = scheduleTemplates.find(
        (template) => template.isDefault
      );
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        console.log("Selected file:", file.name);
      } else {
        alert("Please select a CSV file");
        setSelectedFile(null);
      }
    }
  };

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

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-text">
            Create New Schedule
          </h2>

          {/* Import Data Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-text">
              Import Data
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFileImport}
                className="px-6 py-3 bg-primary text-text-light rounded-lg hover:bg-primary-hover transition-colors shadow-md"
              >
                Select CSV File
              </button>
              {selectedFile && (
                <span className="text-text-muted">
                  Selected: {selectedFile.name}
                </span>
              )}
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
                const template = scheduleTemplates.find(
                  (t) => t.id === e.target.value
                );
                setSelectedTemplate(template || null);
              }}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
            >
              {scheduleTemplates.map((template) => (
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
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement schedule creation
                onClose();
              }}
              className="px-6 py-3 bg-primary text-text-light rounded-lg hover:bg-primary-hover transition-colors shadow-md"
            >
              Create Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useState } from "react";
import { Upload, File } from "lucide-react";

interface ImportScheduleSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export default function ImportScheduleSessionsModal({
  isOpen,
  onClose,
  onImport,
}: ImportScheduleSessionsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const chooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    try {
      setIsLoading(true);
      await onImport(selectedFile);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-96 rounded-lg shadow-xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Import Schedule Sessions
        </h2>

        {/* File selector */}
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-8 cursor-pointer hover:border-red-500 transition-colors"
          onClick={chooseFile}
        >
          <Upload size={32} className="text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-700">
            {selectedFile ? selectedFile.name : "Choose CSV file"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".csv, text/csv, text/tab-separated-values, .tsv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-3 py-2 text-sm rounded border hover:bg-gray-100"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

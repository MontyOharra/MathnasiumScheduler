"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addGradeLevel,
  updateGradeLevel,
  type GradeLevelWithBasic,
} from "@/lib/grade-level-utils";

interface GradeLevelFormData {
  name: string;
  alias: string;
}

interface GradeLevelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGradeLevel: GradeLevelWithBasic | null;
  onSuccess: () => void;
}

export default function GradeLevelModal({
  open,
  onOpenChange,
  editingGradeLevel,
  onSuccess,
}: GradeLevelModalProps) {
  const [formData, setFormData] = useState<GradeLevelFormData>({
    name: "",
    alias: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingGradeLevel;

  // Update form data when editing grade level changes or when modal opens
  useEffect(() => {
    if (editingGradeLevel) {
      setFormData({
        name: editingGradeLevel.name,
        alias: editingGradeLevel.alias,
      });
    } else {
      setFormData({ name: "", alias: "" });
    }
  }, [editingGradeLevel]);

  // Reset form when modal opens
  useEffect(() => {
    if (open && editingGradeLevel) {
      setFormData({
        name: editingGradeLevel.name,
        alias: editingGradeLevel.alias,
      });
    } else if (open && !editingGradeLevel) {
      setFormData({ name: "", alias: "" });
    }
  }, [open, editingGradeLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.alias.trim()) return;
    if (!isEditing && !formData.name.trim()) return;

    try {
      setSubmitting(true);

      if (editingGradeLevel) {
        // When editing, only update the alias
        await updateGradeLevel(editingGradeLevel.id, {
          alias: formData.alias.trim(),
        });
      } else {
        // When adding, include both name and alias
        await addGradeLevel({
          name: formData.name.trim(),
          alias: formData.alias.trim(),
        });
      }

      onOpenChange(false);
      setFormData({ name: "", alias: "" });
      onSuccess();
    } catch (error) {
      console.error("Failed to save grade level:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeDialog = () => {
    onOpenChange(false);
    // Don't clear form data here - let the useEffect handle it when modal reopens
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingGradeLevel ? "Edit Grade Level" : "Add New Grade Level"}
          </DialogTitle>
          <DialogDescription>
            {editingGradeLevel
              ? "Update the grade level alias. The name cannot be changed once created."
              : "Add a new custom grade level or class."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Advanced Calculus"
                required={!isEditing}
                disabled={isEditing}
                className={isEditing ? "bg-gray-50 text-gray-500" : ""}
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Class name cannot be changed once created
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="alias" className="mb-2 block">
                Alias (Short Name)
              </Label>
              <Input
                id="alias"
                value={formData.alias}
                onChange={(e) =>
                  setFormData({ ...formData, alias: e.target.value })
                }
                placeholder="e.g., Adv Calc"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : editingGradeLevel ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

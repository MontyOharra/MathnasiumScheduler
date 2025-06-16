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
  addSessionType,
  updateSessionType,
  type SessionType,
} from "@/lib/session-type-utils";

interface SessionTypeFormData {
  code: string;
  length: number;
  sessionAlias: string;
}

interface SessionTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSessionType: SessionType | null;
  onSuccess: () => void;
}

export default function SessionTypeModal({
  open,
  onOpenChange,
  editingSessionType,
  onSuccess,
}: SessionTypeModalProps) {
  const [formData, setFormData] = useState<SessionTypeFormData>({
    code: "",
    length: 60,
    sessionAlias: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingSessionType;

  // Update form data when editing session type changes
  useEffect(() => {
    if (editingSessionType) {
      setFormData({
        code: editingSessionType.code,
        length: editingSessionType.length,
        sessionAlias: editingSessionType.sessionAlias,
      });
    } else {
      setFormData({ code: "", length: 60, sessionAlias: "" });
    }
  }, [editingSessionType]);

  // Reset form when modal opens
  useEffect(() => {
    if (open && editingSessionType) {
      setFormData({
        code: editingSessionType.code,
        length: editingSessionType.length,
        sessionAlias: editingSessionType.sessionAlias,
      });
    } else if (open && !editingSessionType) {
      setFormData({ code: "", length: 60, sessionAlias: "" });
    }
  }, [open, editingSessionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.code.trim() ||
      !formData.sessionAlias.trim() ||
      formData.length <= 0
    )
      return;

    try {
      setSubmitting(true);

      if (editingSessionType) {
        // When editing, update all fields
        await updateSessionType(editingSessionType.id, {
          code: formData.code.trim(),
          length: formData.length,
          sessionAlias: formData.sessionAlias.trim(),
        });
      } else {
        // When adding, include all fields
        await addSessionType({
          code: formData.code.trim(),
          length: formData.length,
          sessionAlias: formData.sessionAlias.trim(),
        });
      }

      onOpenChange(false);
      setFormData({ code: "", length: 60, sessionAlias: "" });
      onSuccess();
    } catch (error) {
      console.error("Failed to save session type:", error);
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
            {editingSessionType ? "Edit Session Type" : "Add New Session Type"}
          </DialogTitle>
          <DialogDescription>
            {editingSessionType
              ? "Update the session type information."
              : "Add a new custom session type."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code" className="mb-2 block">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., CUSTOM_SESSION"
                required
              />
            </div>
            <div>
              <Label htmlFor="length" className="mb-2 block">
                Length (minutes)
              </Label>
              <Input
                id="length"
                type="number"
                min="1"
                value={formData.length}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    length: parseInt(e.target.value) || 60,
                  })
                }
                placeholder="60"
                required
              />
            </div>
            <div>
              <Label htmlFor="sessionAlias" className="mb-2 block">
                Session Alias
              </Label>
              <Input
                id="sessionAlias"
                value={formData.sessionAlias}
                onChange={(e) =>
                  setFormData({ ...formData, sessionAlias: e.target.value })
                }
                placeholder="e.g., Custom Session - 60m"
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
              {submitting ? "Saving..." : editingSessionType ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

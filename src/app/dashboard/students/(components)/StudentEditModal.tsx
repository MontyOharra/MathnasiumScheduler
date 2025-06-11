import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import dbService from "@/lib/db-service";
import { Student } from "@/types/main";

interface StudentEditModalProps {
  studentId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface StudentWithDetails extends Student {
  gradeLevelName: string;
  sessionTypeCode: string;
  sessionTypeLength: number;
}

interface GradeLevel {
  id: number;
  name: string;
}

interface SessionType {
  id: number;
  code: string;
  length: number;
}

export default function StudentEditModal({
  studentId,
  isOpen,
  onClose,
  onSave,
}: StudentEditModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [student, setStudent] = useState<StudentWithDetails | null>(null);
  const [editedStudent, setEditedStudent] = useState<
    Partial<StudentWithDetails>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [students, levels, types] = await Promise.all([
          dbService.getStudentsWithDetails(1), // Using center ID 1 for now
          dbService.getGradeLevels(),
          dbService.getSessionTypes(),
        ]);

        const foundStudent = students.find((s) => s.id === studentId);
        if (foundStudent) {
          setStudent(foundStudent);
          setEditedStudent(foundStudent);
        }
        setGradeLevels(levels);
        setSessionTypes(types);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && studentId) {
      fetchData();
    }
  }, [isOpen, studentId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (student) {
        // Create updateData object with only changed fields
        const updateData: Record<string, unknown> = {};

        // Only include fields that have changed from the original student data
        if (editedStudent.firstName !== student.firstName) {
          updateData.firstName = editedStudent.firstName;
        }
        if (editedStudent.lastName !== student.lastName) {
          updateData.lastName = editedStudent.lastName;
        }
        if (editedStudent.gradeLevelId !== student.gradeLevelId) {
          updateData.gradeLevelId = editedStudent.gradeLevelId;
        }
        if (
          editedStudent.defaultSessionTypeId !== student.defaultSessionTypeId
        ) {
          updateData.defaultSessionTypeId = editedStudent.defaultSessionTypeId;
        }
        if (editedStudent.isHomeworkHelp !== student.isHomeworkHelp) {
          updateData.isHomeworkHelp = editedStudent.isHomeworkHelp;
        }
        if (editedStudent.isActive !== student.isActive) {
          updateData.isActive = editedStudent.isActive;
        }

        // Only proceed with update if there are actual changes
        if (Object.keys(updateData).length > 0) {
          console.log("updateData", updateData);
          const success = await dbService.updateStudent(studentId, updateData);
          if (success) {
            setIsEditing(false);
            setShowConfirmDialog(false);
            onSave();
            onClose();
          }
        } else {
          // No changes were made, just close the modal
          setIsEditing(false);
          setShowConfirmDialog(false);
          onClose();
        }
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setEditedStudent(student || {});
    setIsEditing(false);
  };

  if (isLoading || !student) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={editedStudent.firstName || ""}
                onChange={(e) =>
                  setEditedStudent({
                    ...editedStudent,
                    firstName: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={editedStudent.lastName || ""}
                onChange={(e) =>
                  setEditedStudent({
                    ...editedStudent,
                    lastName: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gradeLevel" className="text-right">
                Grade Level
              </Label>
              <Select
                disabled={!isEditing}
                value={editedStudent.gradeLevelName}
                onValueChange={(value) => {
                  const selectedGrade = gradeLevels.find(
                    (gl) => gl.name === value
                  );
                  if (selectedGrade) {
                    setEditedStudent({
                      ...editedStudent,
                      gradeLevelId: selectedGrade.id,
                      gradeLevelName: selectedGrade.name,
                    });
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map((gradeLevel) => (
                    <SelectItem key={gradeLevel.id} value={gradeLevel.name}>
                      {gradeLevel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionType" className="text-left">
                Default Session Type
              </Label>
              <Select
                disabled={!isEditing}
                value={editedStudent.sessionTypeCode}
                onValueChange={(value) => {
                  const selectedType = sessionTypes.find(
                    (st) => st.code === value
                  );
                  if (selectedType) {
                    setEditedStudent({
                      ...editedStudent,
                      defaultSessionTypeId: selectedType.id,
                      sessionTypeCode: selectedType.code,
                      sessionTypeLength: selectedType.length,
                    });
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((sessionType) => (
                    <SelectItem key={sessionType.id} value={sessionType.code}>
                      {sessionType.code} ({sessionType.length} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="homeworkHelp" className="text-left">
                Homework Help
              </Label>
              <div className="col-span-3">
                <Switch
                  id="homeworkHelp"
                  checked={editedStudent.isHomeworkHelp}
                  onCheckedChange={(checked) =>
                    setEditedStudent({
                      ...editedStudent,
                      isHomeworkHelp: checked,
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <div className="col-span-3">
                <Switch
                  id="active"
                  checked={editedStudent.isActive}
                  onCheckedChange={(checked) =>
                    setEditedStudent({
                      ...editedStudent,
                      isActive: checked,
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to save these changes?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>Yes, Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

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

interface StudentAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
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

export default function StudentAddModal({
  isOpen,
  onClose,
  onSave,
}: StudentAddModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    gradeLevelId: 0,
    gradeLevelName: "",
    defaultSessionTypeId: 0,
    sessionTypeCode: "",
    sessionTypeLength: 0,
    isHomeworkHelp: false,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [levels, types] = await Promise.all([
          dbService.getGradeLevels(),
          dbService.getSessionTypes(),
        ]);
        setGradeLevels(levels);
        setSessionTypes(types);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      // Create insertData object with all required fields
      const insertData = {
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        gradeLevelId: newStudent.gradeLevelId,
        defaultSessionTypeId: newStudent.defaultSessionTypeId,
        isHomeworkHelp: newStudent.isHomeworkHelp,
        isActive: newStudent.isActive,
        centerId: 1, // Using center ID 1 for now
      };

      const success = await dbService.insertStudent(insertData);
      if (success) {
        setShowConfirmDialog(false);
        onSave();
        onClose();
        // Reset form
        setNewStudent({
          firstName: "",
          lastName: "",
          gradeLevelId: 0,
          gradeLevelName: "",
          defaultSessionTypeId: 0,
          sessionTypeCode: "",
          sessionTypeLength: 0,
          isHomeworkHelp: false,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={newStudent.firstName}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    firstName: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={newStudent.lastName}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    lastName: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gradeLevel" className="text-right">
                Grade Level
              </Label>
              <Select
                value={newStudent.gradeLevelName}
                onValueChange={(value) => {
                  const selectedGrade = gradeLevels.find(
                    (gl) => gl.name === value
                  );
                  if (selectedGrade) {
                    setNewStudent({
                      ...newStudent,
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
                value={newStudent.sessionTypeCode}
                onValueChange={(value) => {
                  const selectedType = sessionTypes.find(
                    (st) => st.code === value
                  );
                  if (selectedType) {
                    setNewStudent({
                      ...newStudent,
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
                  checked={newStudent.isHomeworkHelp}
                  onCheckedChange={(checked) =>
                    setNewStudent({
                      ...newStudent,
                      isHomeworkHelp: checked,
                    })
                  }
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
                  checked={newStudent.isActive}
                  onCheckedChange={(checked) =>
                    setNewStudent({
                      ...newStudent,
                      isActive: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Add Student</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to add this new student?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Yes, Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

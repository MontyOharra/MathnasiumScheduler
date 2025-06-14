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
import { Checkbox } from "@/components/ui/checkbox";
import dbService from "@/lib/db-service";

interface InstructorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface GradeLevel {
  id: number;
  name: string;
}

export default function InstructorAddModal({
  isOpen,
  onClose,
  onSave,
}: InstructorAddModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    firstName: "",
    lastName: "",
    cellColor: "#FF6B6B",
    email: "",
    gradeLevelIds: [] as number[],
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const levels = await dbService.getGradeLevels();
        setGradeLevels(levels);
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
      // TODO: Implement insertInstructor in dbService
      console.log("Would save instructor:", newInstructor);
      setShowConfirmDialog(false);
      onSave();
      onClose();
      // Reset form
      setNewInstructor({
        firstName: "",
        lastName: "",
        cellColor: "#FF6B6B",
        email: "",
        gradeLevelIds: [],
        isActive: true,
      });
    } catch (error) {
      console.error("Error adding instructor:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleGradeLevelChange = (gradeLevelId: number, checked: boolean) => {
    if (checked) {
      setNewInstructor({
        ...newInstructor,
        gradeLevelIds: [...newInstructor.gradeLevelIds, gradeLevelId],
      });
    } else {
      setNewInstructor({
        ...newInstructor,
        gradeLevelIds: newInstructor.gradeLevelIds.filter(
          (id) => id !== gradeLevelId
        ),
      });
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Instructor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={newInstructor.firstName}
                onChange={(e) =>
                  setNewInstructor({
                    ...newInstructor,
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
                value={newInstructor.lastName}
                onChange={(e) =>
                  setNewInstructor({
                    ...newInstructor,
                    lastName: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newInstructor.email}
                onChange={(e) =>
                  setNewInstructor({
                    ...newInstructor,
                    email: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Assignment Color</Label>
              <div className="col-span-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: newInstructor.cellColor }}
                  />
                  <Input
                    type="color"
                    value={newInstructor.cellColor}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        cellColor: e.target.value,
                      })
                    }
                    className="w-20 h-8 p-1 border rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {newInstructor.cellColor}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Grade Levels Taught</Label>
              <div className="col-span-3 space-y-2 max-h-32 overflow-y-auto">
                {gradeLevels.map((gradeLevel) => (
                  <div
                    key={gradeLevel.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`grade-${gradeLevel.id}`}
                      checked={newInstructor.gradeLevelIds.includes(
                        gradeLevel.id
                      )}
                      onCheckedChange={(checked) =>
                        handleGradeLevelChange(
                          gradeLevel.id,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={`grade-${gradeLevel.id}`}
                      className="text-sm font-normal"
                    >
                      {gradeLevel.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Weekly Availability</Label>
              <div className="col-span-3">
                <p className="text-sm text-gray-500 italic">
                  Availability configuration will be implemented in a future
                  update
                </p>
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
              disabled={
                !newInstructor.firstName ||
                !newInstructor.lastName ||
                !newInstructor.email
              }
            >
              Add Instructor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Add Instructor</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to add this instructor?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

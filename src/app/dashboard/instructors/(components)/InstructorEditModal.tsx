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

interface InstructorEditModalProps {
  instructorId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface GradeLevel {
  id: number;
  name: string;
}

const POPULAR_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#A8E6CF",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
];

export default function InstructorEditModal({
  instructorId,
  isOpen,
  onClose,
  onSave,
}: InstructorEditModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [instructor, setInstructor] = useState({
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
        const [levels] = await Promise.all([
          dbService.getGradeLevels(),
          // TODO: Implement getInstructorById and getInstructorGradeLevels
        ]);
        setGradeLevels(levels);

        // TODO: Load instructor data
        // For now, using mock data based on instructorId
        const mockInstructorData = {
          1: {
            firstName: "Sarah",
            lastName: "Johnson",
            cellColor: "#FF6B6B",
            email: "sarah.johnson@mathnasium.com",
            gradeLevelIds: [1, 2, 3], // K, 1st, 2nd
            isActive: true,
          },
          2: {
            firstName: "Mike",
            lastName: "Chen",
            cellColor: "#4ECDC4",
            email: "mike.chen@mathnasium.com",
            gradeLevelIds: [4, 5, 6], // 3rd, 4th, 5th
            isActive: true,
          },
          3: {
            firstName: "Emily",
            lastName: "Davis",
            cellColor: "#45B7D1",
            email: "emily.davis@mathnasium.com",
            gradeLevelIds: [7, 8, 9], // 6th, 7th, 8th
            isActive: true,
          },
        };

        const instructorData =
          mockInstructorData[instructorId as keyof typeof mockInstructorData];
        if (instructorData) {
          setInstructor(instructorData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && instructorId) {
      fetchData();
    }
  }, [isOpen, instructorId]);

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      // TODO: Implement updateInstructor in dbService
      console.log("Would update instructor:", instructorId, instructor);
      setShowConfirmDialog(false);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating instructor:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleGradeLevelChange = (gradeLevelId: number, checked: boolean) => {
    if (checked) {
      setInstructor({
        ...instructor,
        gradeLevelIds: [...instructor.gradeLevelIds, gradeLevelId],
      });
    } else {
      setInstructor({
        ...instructor,
        gradeLevelIds: instructor.gradeLevelIds.filter(
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
            <DialogTitle>Edit Instructor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={instructor.firstName}
                onChange={(e) =>
                  setInstructor({
                    ...instructor,
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
                value={instructor.lastName}
                onChange={(e) =>
                  setInstructor({
                    ...instructor,
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
                value={instructor.email}
                onChange={(e) =>
                  setInstructor({
                    ...instructor,
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
                    style={{ backgroundColor: instructor.cellColor }}
                  />
                  <Input
                    type="color"
                    value={instructor.cellColor}
                    onChange={(e) =>
                      setInstructor({
                        ...instructor,
                        cellColor: e.target.value,
                      })
                    }
                    className="w-20 h-8 p-1 border rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {instructor.cellColor}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular colors:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {POPULAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setInstructor({
                            ...instructor,
                            cellColor: color,
                          })
                        }
                      />
                    ))}
                  </div>
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
                      checked={instructor.gradeLevelIds.includes(gradeLevel.id)}
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
                !instructor.firstName ||
                !instructor.lastName ||
                !instructor.email
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save Changes</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to save these changes to the instructor?</p>
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

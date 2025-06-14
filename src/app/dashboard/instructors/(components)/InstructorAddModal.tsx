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
import { Switch } from "@/components/ui/switch";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  getGradeLevels,
  processGradeLevelsForInstructor,
  type GradeLevelWithBasic,
} from "@/lib/grade-level-utils";
import dbService from "@/lib/db-service";
import InstructorAvailabilityModal from "./InstructorAvailabilityModal";

interface InstructorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

// Helper to get a fresh instructor template
const getEmptyInstructor = () => ({
  firstName: "",
  lastName: "",
  cellColor: "#FF6B6B",
  email: "",
  phoneNumber: "",
  gradeLevelIds: [] as number[],
  isActive: true,
});

export default function InstructorAddModal({
  isOpen,
  onClose,
  onSave,
}: InstructorAddModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newInstructor, setNewInstructor] = useState(getEmptyInstructor());
  const [isLoading, setIsLoading] = useState(true);
  const [gradeLevels, setGradeLevels] = useState<GradeLevelWithBasic[]>([]);
  const [showClassesSelection, setShowClassesSelection] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [tempInstructorId, setTempInstructorId] = useState<number | null>(null);
  const [availabilityData, setAvailabilityData] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const levels = await getGradeLevels();
        setGradeLevels(levels);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      setNewInstructor(getEmptyInstructor());
      setShowClassesSelection(false);
      setTempInstructorId(null);
      setAvailabilityData(new Set());
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
      setNewInstructor(getEmptyInstructor());
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

  const handleClassesTaughtClick = () => {
    setShowClassesSelection(true);
  };

  const handleBackToMain = () => {
    setShowClassesSelection(false);
  };

  const handleAvailabilityClick = async () => {
    // For new instructors, we'll use a negative ID to indicate it's a new instructor
    // The availability modal will handle this case appropriately
    if (!tempInstructorId) {
      setTempInstructorId(-1); // Use -1 to indicate new instructor
    }

    setShowAvailabilityModal(true);
  };

  // Prepare processed grade levels for display (same logic as edit modal)
  const selectedGradeLevelIdentifiers = newInstructor.gradeLevelIds.map(
    (id) => {
      const level = gradeLevels.find((gl) => gl.id === id);
      return level ? level.name : String(id);
    }
  );

  const processedGradeLevels = processGradeLevelsForInstructor(
    selectedGradeLevelIdentifiers,
    gradeLevels
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showClassesSelection ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToMain}
                    className="p-1 h-auto"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  Select Classes Taught
                </div>
              ) : (
                "Add New Instructor"
              )}
            </DialogTitle>
          </DialogHeader>

          {showClassesSelection ? (
            // Classes Selection View
            <div className="grid gap-4 py-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {gradeLevels.map((gradeLevel) => (
                  <div
                    key={gradeLevel.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => {
                      const isCurrentlyChecked =
                        newInstructor.gradeLevelIds.includes(gradeLevel.id);
                      handleGradeLevelChange(
                        gradeLevel.id,
                        !isCurrentlyChecked
                      );
                    }}
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
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label
                      htmlFor={`grade-${gradeLevel.id}`}
                      className="text-sm font-normal flex-1 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {gradeLevel.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Main Add View
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={newInstructor.phoneNumber}
                  onChange={(e) =>
                    setNewInstructor({
                      ...newInstructor,
                      phoneNumber: e.target.value,
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Classes Taught</Label>
                <div
                  className={
                    "col-span-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                  }
                  onClick={handleClassesTaughtClick}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 flex-1">
                      {processedGradeLevels.map(
                        (level: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {level}
                          </span>
                        )
                      )}
                      {processedGradeLevels.length === 0 && (
                        <span className="text-gray-500 text-sm">
                          No classes selected
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="active"
                    checked={newInstructor.isActive}
                    onCheckedChange={(checked) =>
                      setNewInstructor({
                        ...newInstructor,
                        isActive: checked,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Weekly Availability</Label>
                <div
                  className="col-span-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                  onClick={handleAvailabilityClick}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {availabilityData.size > 0 ? (
                        <span className="text-green-600 text-sm">
                          {availabilityData.size} time slots configured
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Configure weekly schedule
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}
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

      <InstructorAvailabilityModal
        instructorId={tempInstructorId || -1}
        instructorName={
          newInstructor.firstName && newInstructor.lastName
            ? `${newInstructor.firstName} ${newInstructor.lastName}`
            : "New Instructor"
        }
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSave={() => {
          console.log("Availability saved successfully for new instructor");
          setShowAvailabilityModal(false);
        }}
        onAvailabilityChange={(selectedSlots) => {
          setAvailabilityData(selectedSlots);
          console.log("Availability data updated:", selectedSlots);
        }}
      />
    </>
  );
}

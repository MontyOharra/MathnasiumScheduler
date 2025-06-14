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

interface InstructorEditModalProps {
  instructorId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface InstructorWithDetails {
  id: number;
  centerId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  cellColor: string;
  gradeLevelIds: number[];
  isActive: boolean;
}

export default function InstructorEditModal({
  instructorId,
  isOpen,
  onClose,
  onSave,
}: InstructorEditModalProps) {
  const isEditing = true;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showClassesSelection, setShowClassesSelection] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [instructor, setInstructor] = useState<InstructorWithDetails | null>(
    null
  );
  const [editedInstructor, setEditedInstructor] = useState<
    Partial<InstructorWithDetails>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [gradeLevels, setGradeLevels] = useState<GradeLevelWithBasic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [levels] = await Promise.all([
          getGradeLevels(),
          // TODO: Implement getInstructorById and getInstructorGradeLevels
        ]);
        setGradeLevels(levels);

        // Load instructor data from database

        console.log("Loading instructor with ID:", instructorId);

        // Fetch instructor data from database
        const [instructorData, gradeLevelIds] = await Promise.all([
          dbService.getInstructorById(instructorId),
          dbService.getInstructorGradeLevelIds(instructorId),
        ]);

        console.log("Found instructor data:", instructorData);
        console.log("Found grade level IDs:", gradeLevelIds);

        if (instructorData) {
          const instructorWithGradeLevels = {
            ...instructorData,
            gradeLevelIds,
          };
          setInstructor(instructorWithGradeLevels);
          setEditedInstructor(instructorWithGradeLevels);
        } else {
          console.warn("No instructor found with ID:", instructorId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && instructorId > 0) {
      console.log("fetchData called with instructorId:", instructorId);
      fetchData();
      setShowClassesSelection(false);
    } else {
      console.log(
        "fetchData NOT called - isOpen:",
        isOpen,
        "instructorId:",
        instructorId
      );
    }
  }, [isOpen, instructorId]);

  const handleSave = async () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (instructor) {
        // Create updateData object with only changed fields
        const updateData: Record<string, unknown> = {};

        // Only include fields that have changed from the original instructor data
        if (editedInstructor.firstName !== instructor.firstName) {
          updateData.firstName = editedInstructor.firstName;
        }
        if (editedInstructor.lastName !== instructor.lastName) {
          updateData.lastName = editedInstructor.lastName;
        }
        if (editedInstructor.cellColor !== instructor.cellColor) {
          updateData.cellColor = editedInstructor.cellColor;
        }
        if (editedInstructor.email !== instructor.email) {
          updateData.email = editedInstructor.email;
        }
        if (editedInstructor.phoneNumber !== instructor.phoneNumber) {
          updateData.phoneNumber = editedInstructor.phoneNumber;
        }
        if (
          JSON.stringify(editedInstructor.gradeLevelIds) !==
          JSON.stringify(instructor.gradeLevelIds)
        ) {
          updateData.gradeLevelIds = editedInstructor.gradeLevelIds;
        }
        if (editedInstructor.isActive !== instructor.isActive) {
          updateData.isActive = editedInstructor.isActive;
        }

        // Only proceed with update if there are actual changes
        if (Object.keys(updateData).length > 0) {
          console.log("updateData", updateData);

          // Separate grade level updates from instructor updates
          const gradeLevelIds = updateData.gradeLevelIds as
            | number[]
            | undefined;
          delete updateData.gradeLevelIds;

          // Update instructor data if there are any instructor field changes
          if (Object.keys(updateData).length > 0) {
            const success = await dbService.updateInstructor(
              instructorId,
              updateData
            );
            if (!success) {
              console.error("Failed to update instructor data");
              return;
            }
          }

          // Update grade levels if they changed
          if (gradeLevelIds !== undefined) {
            await dbService.updateInstructorGradeLevels(
              instructorId,
              gradeLevelIds
            );
          }

          setShowConfirmDialog(false);
          setShowClassesSelection(false);
          onSave();
          onClose();
        } else {
          // No changes were made, just close the modal
          setShowConfirmDialog(false);
          setShowClassesSelection(false);
          onClose();
        }
      }
    } catch (error) {
      console.error("Error updating instructor:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setEditedInstructor(instructor || {});
    setShowClassesSelection(false);
    onClose();
  };

  const handleGradeLevelChange = (gradeLevelId: number, checked: boolean) => {
    const currentIds = editedInstructor.gradeLevelIds || [];
    if (checked) {
      setEditedInstructor({
        ...editedInstructor,
        gradeLevelIds: [...currentIds, gradeLevelId],
      });
    } else {
      setEditedInstructor({
        ...editedInstructor,
        gradeLevelIds: currentIds.filter((id) => id !== gradeLevelId),
      });
    }
  };

  const handleClassesTaughtClick = () => {
    if (isEditing) {
      setShowClassesSelection(true);
    }
  };

  const handleBackToMain = () => {
    setShowClassesSelection(false);
  };

  if (!isOpen) {
    return null;
  }

  if (isLoading || !instructor) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading instructor data...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Convert selected grade-level IDs to their corresponding names so the
  // display logic matches the table row (which works with names / aliases).
  const selectedGradeLevelIdentifiers = (
    editedInstructor.gradeLevelIds || []
  ).map((id) => {
    const level = gradeLevels.find((gl) => gl.id === id);
    return level ? level.name : String(id);
  });

  const processedGradeLevels = processGradeLevelsForInstructor(
    selectedGradeLevelIdentifiers,
    gradeLevels
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto scrollbar-modern">
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
                "Edit Instructor"
              )}
            </DialogTitle>
          </DialogHeader>

          {showClassesSelection ? (
            // Classes Selection View
            <div className="grid gap-4 py-4">
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-modern-thin">
                {gradeLevels.map((gradeLevel) => (
                  <div
                    key={gradeLevel.id}
                    className="flex items-center space-x-2 p-2 hover:bg-red-50 rounded cursor-pointer"
                    onClick={() => {
                      const isCurrentlyChecked =
                        editedInstructor.gradeLevelIds?.includes(
                          gradeLevel.id
                        ) || false;
                      handleGradeLevelChange(
                        gradeLevel.id,
                        !isCurrentlyChecked
                      );
                    }}
                  >
                    <Checkbox
                      id={`grade-${gradeLevel.id}`}
                      checked={
                        editedInstructor.gradeLevelIds?.includes(
                          gradeLevel.id
                        ) || false
                      }
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
            // Main Edit View
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={editedInstructor.firstName || ""}
                  onChange={(e) =>
                    setEditedInstructor({
                      ...editedInstructor,
                      firstName: e.target.value,
                    })
                  }
                  disabled={false}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={editedInstructor.lastName || ""}
                  onChange={(e) =>
                    setEditedInstructor({
                      ...editedInstructor,
                      lastName: e.target.value,
                    })
                  }
                  disabled={false}
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
                  value={editedInstructor.email || ""}
                  onChange={(e) =>
                    setEditedInstructor({
                      ...editedInstructor,
                      email: e.target.value,
                    })
                  }
                  disabled={false}
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
                  value={editedInstructor.phoneNumber || ""}
                  onChange={(e) =>
                    setEditedInstructor({
                      ...editedInstructor,
                      phoneNumber: e.target.value,
                    })
                  }
                  disabled={false}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Assignment Color</Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: editedInstructor.cellColor }}
                    />
                    <Input
                      type="color"
                      value={editedInstructor.cellColor || "#FF6B6B"}
                      onChange={(e) =>
                        setEditedInstructor({
                          ...editedInstructor,
                          cellColor: e.target.value,
                        })
                      }
                      disabled={false}
                      className="w-20 h-8 p-1 border rounded"
                    />
                    <span className="text-sm text-gray-600">
                      {editedInstructor.cellColor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Classes Taught</Label>
                <div
                  className={`col-span-3 p-3 border rounded-md ${"cursor-pointer hover:bg-red-50"}`}
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
                    {isEditing && (
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                    )}
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
                    checked={editedInstructor.isActive}
                    onCheckedChange={(checked) =>
                      setEditedInstructor({
                        ...editedInstructor,
                        isActive: checked,
                      })
                    }
                    disabled={false}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Weekly Availability</Label>
                <div
                  className="col-span-3 p-3 border rounded-md cursor-pointer hover:bg-red-50"
                  onClick={() => {
                    setShowAvailabilityModal(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-gray-500 text-sm">
                        Configure weekly schedule
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={
                  !editedInstructor.firstName ||
                  !editedInstructor.lastName ||
                  !editedInstructor.email
                }
              >
                Save Changes
              </Button>
            </>
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InstructorAvailabilityModal
        instructorId={instructorId}
        instructorName={
          instructor ? `${instructor.firstName} ${instructor.lastName}` : ""
        }
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSave={() => {
          // Optionally refresh instructor data or show success message
          console.log("Availability saved successfully");
        }}
      />
    </>
  );
}

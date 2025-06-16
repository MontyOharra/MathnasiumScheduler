"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import {
  getGradeLevels,
  deleteGradeLevel,
  type GradeLevelWithBasic,
} from "@/lib/grade-level-utils";
import GradeLevelModal from "./GradeLevelModal";

export default function GradeLevelsSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [gradeLevels, setGradeLevels] = useState<GradeLevelWithBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGradeLevel, setEditingGradeLevel] =
    useState<GradeLevelWithBasic | null>(null);

  // Load grade levels
  useEffect(() => {
    loadGradeLevels();
  }, []);

  const loadGradeLevels = async () => {
    try {
      setLoading(true);
      const levels = await getGradeLevels();
      setGradeLevels(levels);
    } catch (error) {
      console.error("Failed to load grade levels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGradeLevel(null);
    setShowModal(true);
  };

  const handleEdit = (gradeLevel: GradeLevelWithBasic) => {
    setEditingGradeLevel(gradeLevel);
    setShowModal(true);
  };

  const handleDelete = async (gradeLevel: GradeLevelWithBasic) => {
    if (gradeLevel.is_basic) return; // Should not happen due to UI restrictions

    if (!confirm(`Are you sure you want to delete "${gradeLevel.name}"?`)) {
      return;
    }

    try {
      await deleteGradeLevel(gradeLevel.id);
      await loadGradeLevels();
    } catch (error) {
      console.error("Failed to delete grade level:", error);
    }
  };

  const handleModalSuccess = () => {
    loadGradeLevels();
  };

  // Separate basic (K-8) and custom grade levels
  const basicGradeLevels = gradeLevels.filter((level) => level.is_basic);
  const customGradeLevels = gradeLevels.filter((level) => !level.is_basic);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
          Grade Levels / Classes Taught
        </h3>
        {isExpanded && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {loading ? (
            <div className="text-center py-4">
              <div className="text-sm text-gray-500">
                Loading grade levels...
              </div>
            </div>
          ) : (
            <>
              {/* Basic Grade Levels (K-8) */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Basic Grade Levels (K-8)
                </h4>
                <div className="rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Name</TableHead>
                        <TableHead className="w-[40%]">Alias</TableHead>
                        <TableHead className="w-[20%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {basicGradeLevels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell className="font-medium">
                            {level.name}
                          </TableCell>
                          <TableCell>{level.alias}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(level)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Custom Grade Levels */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Custom Classes
                </h4>
                <div className="rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Name</TableHead>
                        <TableHead className="w-[40%]">Alias</TableHead>
                        <TableHead className="w-[20%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customGradeLevels.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-gray-500 py-6"
                          >
                            No custom classes added yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        customGradeLevels.map((level) => (
                          <TableRow key={level.id}>
                            <TableCell className="font-medium">
                              {level.name}
                            </TableCell>
                            <TableCell>{level.alias}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(level)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {!level.is_basic && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(level)}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <GradeLevelModal
        open={showModal}
        onOpenChange={setShowModal}
        editingGradeLevel={editingGradeLevel}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

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
  getSessionTypes,
  deleteSessionType,
  type SessionType,
} from "@/lib/session-type-utils";
import SessionTypeModal from "./SessionTypeModal";

export default function SessionTypesSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSessionType, setEditingSessionType] =
    useState<SessionType | null>(null);

  // Load session types
  useEffect(() => {
    loadSessionTypes();
  }, []);

  const loadSessionTypes = async () => {
    try {
      setLoading(true);
      const types = await getSessionTypes();
      setSessionTypes(types);
    } catch (error) {
      console.error("Failed to load session types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSessionType(null);
    setShowModal(true);
  };

  const handleEdit = (sessionType: SessionType) => {
    setEditingSessionType(sessionType);
    setShowModal(true);
  };

  const handleDelete = async (sessionType: SessionType) => {
    if (!confirm(`Are you sure you want to delete "${sessionType.code}"?`)) {
      return;
    }

    try {
      await deleteSessionType(sessionType.id);
      await loadSessionTypes();
    } catch (error) {
      console.error("Failed to delete session type:", error);
    }
  };

  const handleModalSuccess = () => {
    loadSessionTypes();
  };

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
          Session Types
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
            Add Session Type
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="text-sm text-gray-500">
                Loading session types...
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Code</TableHead>
                    <TableHead className="w-[20%]">Length (min)</TableHead>
                    <TableHead className="w-[35%]">Session Alias</TableHead>
                    <TableHead className="w-[15%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionTypes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-6"
                      >
                        No session types found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessionTypes.map((sessionType) => (
                      <TableRow key={sessionType.id}>
                        <TableCell className="font-medium">
                          {sessionType.code}
                        </TableCell>
                        <TableCell>{sessionType.length}</TableCell>
                        <TableCell>{sessionType.sessionAlias}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(sessionType)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(sessionType)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      <SessionTypeModal
        open={showModal}
        onOpenChange={setShowModal}
        editingSessionType={editingSessionType}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

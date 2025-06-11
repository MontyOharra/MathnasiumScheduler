import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

export type SortField = "firstName" | "lastName" | "cellColor";
export type SortDirection = "asc" | "desc";

interface InstructorTableHeaderProps {
  currentSort: {
    field: SortField | null;
    direction: SortDirection;
  };
  onSort: (field: SortField) => void;
}

const columnClasses = {
  firstName: "w-[20%]",
  lastName: "w-[20%]",
  color: "w-[15%]",
  gradeLevels: "w-[25%]",
  actions: "w-[20%]",
};

export default function InstructorTableHeader({
  currentSort,
  onSort,
}: InstructorTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (currentSort.field !== field) return null;
    return currentSort.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="sticky top-0 z-10 bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={columnClasses.firstName}>
              <Button
                variant="ghost"
                onClick={() => onSort("firstName")}
                className="font-medium"
              >
                First Name
                {getSortIcon("firstName")}
              </Button>
            </TableHead>
            <TableHead className={columnClasses.lastName}>
              <Button
                variant="ghost"
                onClick={() => onSort("lastName")}
                className="font-medium"
              >
                Last Name
                {getSortIcon("lastName")}
              </Button>
            </TableHead>
            <TableHead className={columnClasses.color}>
              Assignment Color
            </TableHead>
            <TableHead className={columnClasses.gradeLevels}>
              Grade Levels Taught
            </TableHead>
            <TableHead className={`${columnClasses.actions} text-right`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
}

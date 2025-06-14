import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

export type SortField = "firstName" | "lastName" | "gradeLevel" | "sessionType";
export type SortDirection = "asc" | "desc";

interface StudentTableHeaderProps {
  currentSort: {
    field: SortField | null;
    direction: SortDirection;
  };
  onSort: (field: SortField) => void;
}

const columnClasses = {
  firstName: "w-[20%] min-w-[100px]",
  lastName: "w-[20%] min-w-[100px]",
  grade: "w-[20%] min-w-[120px]",
  session: "w-[25%] min-w-[150px]",
  actions: "w-[15%] min-w-[100px]",
};

export default function StudentTableHeader({
  currentSort,
  onSort,
}: StudentTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (currentSort.field !== field) return null;
    return currentSort.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="sticky top-0 z-10 bg-background shadow-sm min-w-0 w-full">
      <div className="overflow-x-auto scrollbar-modern-thin">
        <Table className="table-fixed-layout">
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
              <TableHead className={columnClasses.grade}>
                <Button
                  variant="ghost"
                  onClick={() => onSort("gradeLevel")}
                  className="font-medium"
                >
                  Grade Level
                  {getSortIcon("gradeLevel")}
                </Button>
              </TableHead>
              <TableHead className={columnClasses.session}>
                <Button
                  variant="ghost"
                  onClick={() => onSort("sessionType")}
                  className="font-medium"
                >
                  Default Session Type
                  {getSortIcon("sessionType")}
                </Button>
              </TableHead>
              <TableHead className={`${columnClasses.actions} text-right`}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Printer, Download } from "lucide-react";
import dbService from "@/lib/db-service";
import { ScheduleCell } from "./ScheduleCell";
import { FixedSizeGrid as Grid } from "react-window";
import type { GridChildComponentProps } from "react-window";
import ImportScheduleSessionsModal from "./ImportScheduleSessionsModal";

interface ScheduleProps {
  scheduleId: number;
  scheduleDate: Date;
  weekdayId: number;
  numPods: number;
  startTime: string;
  endTime: string;
  intervalLength: number;
}

type CellDict = Record<
  string,
  { studentName: string; instructorId: number | null }
>;

export function Schedule({
  scheduleId,
  scheduleDate,
  weekdayId,
  numPods,
  startTime,
  endTime,
  intervalLength,
}: ScheduleProps) {
  const [weekdayName, setWeekdayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [cellDict, setCellDict] = useState<CellDict>({});

  const loadCells = async () => {
    if (!scheduleId) return;
    try {
      // TODO replace with center context
      const centerId = 1;
      const cells = await dbService.getScheduleCellsForSchedule(
        scheduleId,
        centerId
      );
      const dict: CellDict = {};
      cells.forEach((c) => {
        const key = `${c.timeStart}-${c.columnNumber}`;
        const studentName =
          c.studentFirstName && c.studentLastName
            ? `${c.studentFirstName} ${c.studentLastName}`
            : "";
        dict[key] = { studentName, instructorId: c.instructorId ?? null };
      });
      setCellDict(dict);
    } catch (err) {
      console.error("Failed to load schedule cells", err);
    }
  };

  useEffect(() => {
    loadCells();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  useEffect(() => {
    const fetchWeekdayName = async () => {
      try {
        const weekday = await dbService.getWeekdayById(weekdayId);
        if (weekday) {
          setWeekdayName(weekday.name.substring(0, 3)); // Get first 3 letters
        }
      } catch (error) {
        console.error("Failed to fetch weekday:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeekdayName();
  }, [weekdayId]);

  // Helper function to add minutes to a time string
  const addMinutes = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to convert 24-hour time to 12-hour format without AM/PM
  const convertTo12Hour = (timeString: string): string => {
    const [hours, mins] = timeString.split(":").map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hour12}:${mins.toString().padStart(2, "0")}`;
  };

  // Generate time slots based on start time, end time, and interval
  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    intervalMinutes: number
  ) => {
    const slots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const nextTime = addMinutes(currentTime, intervalMinutes);
      slots.push({
        start: currentTime,
        end: nextTime,
      });
      currentTime = nextTime;
    }

    return slots;
  };

  const handleImportClick = () => setShowImportModal(true);

  const closeModal = () => setShowImportModal(false);

  /** Robust CSV/TSV parser handling quoted values */
  const parseCsv = (
    text: string
  ): Array<{
    appointmentDate: string;
    studentName: string;
    sessionType: string;
  }> => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [];

    const delimiter = lines[0].includes("\t") ? "\t" : ",";

    const rows: Array<{
      appointmentDate: string;
      studentName: string;
      sessionType: string;
    }> = [];

    const splitLine = (line: string): string[] => {
      if (delimiter === "\t") {
        return line.split("\t");
      }
      // For commas – split on commas that are not inside double quotes
      const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
      const parts = line.split(regex);
      return parts.map((part) => part.replace(/^"|"$/g, "")); // strip outer quotes
    };

    // Skip header (assumed)
    for (let i = 1; i < lines.length; i++) {
      const cols = splitLine(lines[i]).map((c) => c.trim());
      if (cols.length < 3) continue;
      rows.push({
        appointmentDate: cols[0],
        studentName: cols[1],
        sessionType: cols[2],
      });
    }
    return rows;
  };

  const importCsvFile = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      console.log("Parsed", rows.length, "rows from CSV");

      // Fetch necessary lookup maps
      const sessionTypes = await dbService.getSessionTypes();
      console.log("Loaded", sessionTypes.length, "session types");
      const sessionTypeMap = new Map<string, { id: number; length: number }>();
      sessionTypes.forEach((st) =>
        sessionTypeMap.set(st.sessionAlias.toUpperCase(), {
          id: st.id,
          length: st.length,
        })
      );

      // TODO replace with real center context
      const centerId = 1;
      const students = await dbService.getActiveStudents(centerId);
      console.log("Loaded", students.length, "students for center", centerId);
      const studentMap = new Map<string, number>();
      students.forEach((s) =>
        studentMap.set(
          `${s.firstName.toUpperCase()} ${s.lastName.toUpperCase()}`,
          s.id
        )
      );

      // Build occupancy dictionary { time: studentIds[] }
      const occupancy: Record<string, number[]> = {};

      const scheduleDateStr = format(scheduleDate, "yyyy-MM-dd");

      for (const row of rows) {
        console.log("Processing row", row);
        const dateObj = new Date(row.appointmentDate);
        const dateStr = format(dateObj, "yyyy-MM-dd");
        if (dateStr !== scheduleDateStr) {
          console.log(
            "Skipping row due to date mismatch",
            dateStr,
            "!=",
            scheduleDateStr
          );
          continue; // only this schedule
        }

        const timeStr = format(dateObj, "HH:mm");
        const studentId = studentMap.get(row.studentName.toUpperCase());
        const stInfo = sessionTypeMap.get(row.sessionType.toUpperCase());
        if (!studentId) {
          console.warn("Student not found for", row.studentName);
        }
        if (!stInfo) {
          console.warn("Session type alias not found for", row.sessionType);
        }
        if (!studentId || !stInfo) continue; // skip unknowns

        console.log(
          "Inserting session for studentId",
          studentId,
          "time",
          timeStr
        );
        // Insert session into DB
        await dbService.insertSession({
          centerId,
          studentId,
          sessionTypeId: stInfo.id,
          date: dateObj.toISOString(),
        });

        if (!occupancy[timeStr]) occupancy[timeStr] = [];
        occupancy[timeStr].push(studentId);

        // If session longer than interval, add second slot (supports 60 vs 30)
        if (stInfo.length > intervalLength) {
          const [h, m] = timeStr.split(":").map(Number);
          const startMinutes = h * 60 + m + intervalLength;
          const h2 = Math.floor(startMinutes / 60)
            .toString()
            .padStart(2, "0");
          const m2 = (startMinutes % 60).toString().padStart(2, "0");
          const nextSlot = `${h2}:${m2}`;
          if (!occupancy[nextSlot]) occupancy[nextSlot] = [];
          occupancy[nextSlot].push(studentId);
        }
      }

      console.log("Occupancy dictionary", occupancy);

      // Populate cells sequentially
      const columnsPerTime = numPods * 3;
      const cellPromises: Promise<unknown>[] = [];

      // Sort times so we process chronologically ("HH:mm" strings are zero-padded so lex sort works)
      const sortedTimes = Object.keys(occupancy).sort();

      const activeColumnByStudent = new Map<number, number>(); // persists between consecutive slots

      for (const time of sortedTimes) {
        const studentIds = occupancy[time];

        const usedColumns = new Set<number>();

        // First pass – place students that already have a column assignment
        studentIds.forEach((sId) => {
          const existing = activeColumnByStudent.get(sId);
          if (existing !== undefined) {
            usedColumns.add(existing);
          }
        });

        // Helper to get first free column starting from 1
        const nextFreeColumn = () => {
          for (let c = 1; c <= columnsPerTime; c++) {
            if (!usedColumns.has(c)) return c;
          }
          return undefined;
        };

        // Second pass – assign columns, preserving prior ones when possible
        studentIds.forEach((sId) => {
          let columnNumber = activeColumnByStudent.get(sId);
          if (columnNumber === undefined) {
            const freeCol = nextFreeColumn();
            if (freeCol === undefined) return; // overflow – skip
            columnNumber = freeCol;
            activeColumnByStudent.set(sId, columnNumber);
            usedColumns.add(columnNumber);
          }

          const endTime = addMinutes(time, intervalLength);
          cellPromises.push(
            dbService.insertScheduleCell({
              centerId,
              scheduleId: scheduleId ?? 0,
              instructorId: null,
              studentId: sId,
              timeStart: time,
              timeEnd: endTime,
              columnNumber,
            })
          );
        });

        // Remove students whose session does not continue into next slot
        const stillActive = new Map<number, number>();
        studentIds.forEach((sId) => {
          const col = activeColumnByStudent.get(sId);
          if (col !== undefined) stillActive.set(sId, col);
        });
        activeColumnByStudent.clear();
        stillActive.forEach((col, sId) => activeColumnByStudent.set(sId, col));
      }

      await Promise.all(cellPromises);

      await loadCells();

      alert("Import complete!");
      console.log("Import finished successfully");
      closeModal();
    } catch (err) {
      console.error("Import failed", err);
      alert("Failed to import sessions");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formattedDate = format(scheduleDate, "MM/dd/yyyy");
  const timeSlots = generateTimeSlots(startTime, endTime, intervalLength);

  return (
    <div className="p-4 border border-gray-500 rounded-lg w-full max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {weekdayName} - {formattedDate}
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            <Download size={16} />
            Import Sessions
          </button>
        </div>
      </div>

      {/* Horizontally scrollable grid container */}
      <div className="rounded w-full overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden h-auto custom-scrollbar pb-6">
          <div className="min-w-fit">
            {/* Two-level header: Pods and Student Slots */}
            {/* Top level: Pod headers */}
            <div className="flex">
              <div className="w-20 h-8 border border-gray-400 bg-gray-200 flex items-center justify-center text-xs font-bold">
                Time
              </div>
              {Array.from({ length: numPods }, (_, podIndex) => (
                <div
                  key={podIndex}
                  className="flex border-r-2 border-r-gray-500"
                >
                  <div className="w-72 h-8 border border-gray-400 bg-gray-200 flex items-center justify-center text-xs font-bold">
                    Pod {podIndex + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Second level: Student slot headers */}
            <div className="flex">
              <div className="w-20 h-6 border border-gray-400 bg-gray-100 flex items-center justify-center text-xs font-semibold"></div>
              {Array.from({ length: numPods }, (_, podIndex) => (
                <div
                  key={`pod-${podIndex}`}
                  className="flex border-r-2 border-r-gray-500"
                >
                  {Array.from({ length: 3 }, (_, studentIndex) => (
                    <div
                      key={`${podIndex}-${studentIndex}`}
                      className="w-24 h-6 border border-gray-400 bg-gray-100 flex items-center justify-center text-xs font-semibold"
                    >
                      S{studentIndex + 1}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Time slots rows */}
            {timeSlots.map((timeSlot) => (
              <div key={`${timeSlot.start}-${timeSlot.end}`} className="flex">
                {/* Time label column */}
                <div className="w-20 h-12 border border-gray-400 bg-gray-50 flex items-center justify-center text-xs font-medium">
                  {convertTo12Hour(timeSlot.start)}
                </div>

                {/* Schedule cells for this time slot */}
                {Array.from({ length: numPods }, (_, podIndex) => (
                  <div
                    key={`pod-${podIndex}-${timeSlot.start}`}
                    className="flex border-r-2 border-r-gray-500"
                  >
                    {Array.from({ length: 3 }, (_, studentIndex) => {
                      const columnNumber = podIndex * 3 + studentIndex + 1;
                      const lookupKey = `${timeSlot.start}-${columnNumber}`;
                      const lookup = cellDict[lookupKey];
                      const studentNames =
                        lookup && lookup.studentName
                          ? [lookup.studentName]
                          : [];
                      return (
                        <ScheduleCell
                          key={`${timeSlot.start}-${podIndex}-${studentIndex}`}
                          timeStart={timeSlot.start}
                          timeEnd={timeSlot.end}
                          columnNumber={columnNumber}
                          podNumber={podIndex + 1}
                          studentSlot={studentIndex + 1}
                          studentNames={studentNames}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportScheduleSessionsModal
          isOpen={showImportModal}
          onClose={closeModal}
          onImport={importCsvFile}
        />
      )}
    </div>
  );
}

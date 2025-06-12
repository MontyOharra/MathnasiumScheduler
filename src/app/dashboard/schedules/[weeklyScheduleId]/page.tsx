"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import { Schedule } from "../(components)/Schedule";
import dbService from "@/lib/db-service";
import { Schedule as ScheduleType } from "@/types/main";
import ImportScheduleSessionsModal from "../(components)/ImportScheduleSessionsModal";

export default function WeeklySchedulePage() {
  const params = useParams();
  const weeklyScheduleId = parseInt(params.weeklyScheduleId as string);

  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [templateConfig, setTemplateConfig] = useState<
    Record<
      number,
      {
        startTime: string;
        endTime: string;
        numPods: number;
        intervalLength: number;
      }
    >
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  // token to force remount of child schedules after import
  const [refreshToken, setRefreshToken] = useState(0);

  // Helpers used for parsing and insertion
  const addMinutes = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const newMins = (totalMinutes % 60).toString().padStart(2, "0");
    return `${newHours}:${newMins}`;
  };

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
    const splitLine = (line: string): string[] => {
      if (delimiter === "\t") return line.split("\t");
      const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
      return line.split(regex).map((p) => p.replace(/^"|"$/g, ""));
    };
    const rows = [] as Array<{
      appointmentDate: string;
      studentName: string;
      sessionType: string;
    }>;
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

  const handleImportWeekly = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCsv(text);

      // lookups
      const centerId = 1; // TODO context
      const sessionTypes = await dbService.getSessionTypes();
      const sessionTypeMap = new Map<string, { id: number; length: number }>();
      sessionTypes.forEach((st) =>
        sessionTypeMap.set(st.sessionAlias.toUpperCase(), {
          id: st.id,
          length: st.length,
        })
      );

      const students = await dbService.getActiveStudents(centerId);
      const studentMap = new Map<string, number>();
      students.forEach((s) =>
        studentMap.set(
          `${s.firstName.toUpperCase()} ${s.lastName.toUpperCase()}`,
          s.id
        )
      );

      // Map date string -> schedule meta
      const dateToSchedule = new Map<
        string,
        { scheduleId: number; numPods: number; interval: number }
      >();
      const scheduleMetaById = new Map<
        number,
        { numPods: number; interval: number }
      >();
      schedules.forEach((s) => {
        const dateStr =
          typeof s.scheduleDate === "string"
            ? (s.scheduleDate as string).split("T")[0]
            : (s.scheduleDate as Date).toISOString().split("T")[0];
        const cfg = templateConfig[s.weekdayId];
        const meta = {
          scheduleId: s.id,
          numPods: cfg?.numPods || 0,
          interval: cfg?.intervalLength || 30,
        } as const;
        dateToSchedule.set(dateStr, meta);
        scheduleMetaById.set(s.id, {
          numPods: meta.numPods,
          interval: meta.interval,
        });
      });

      type Occ = Record<string, number[]>; // time -> studentIds
      const occBySchedule: Record<number, Occ> = {};

      for (const row of rows) {
        const dateObj = new Date(row.appointmentDate);
        const dateStr = dateObj.toISOString().split("T")[0];
        const schedMeta = dateToSchedule.get(dateStr);
        if (!schedMeta) continue;

        const timeStr = dateObj.toISOString().substring(11, 16); // HH:MM
        const studentId = studentMap.get(row.studentName.toUpperCase());
        const stInfo = sessionTypeMap.get(row.sessionType.toUpperCase());
        if (!studentId || !stInfo) continue;

        // insert session
        await dbService.insertSession({
          centerId,
          studentId,
          sessionTypeId: stInfo.id,
          date: dateObj.toISOString(),
        });

        if (!occBySchedule[schedMeta.scheduleId])
          occBySchedule[schedMeta.scheduleId] = {};
        const occ = occBySchedule[schedMeta.scheduleId];
        if (!occ[timeStr]) occ[timeStr] = [];
        occ[timeStr].push(studentId);

        if (stInfo.length > schedMeta.interval) {
          const nextSlot = addMinutes(timeStr, schedMeta.interval);
          if (!occ[nextSlot]) occ[nextSlot] = [];
          occ[nextSlot].push(studentId);
        }
      }

      // insert cells
      const cellPromises: Promise<unknown>[] = [];
      for (const schedIdStr in occBySchedule) {
        const schedId = Number(schedIdStr);
        const meta = scheduleMetaById.get(schedId);
        if (!meta) continue;
        const columnsPerTime = meta.numPods * 3;
        const occ = occBySchedule[schedId];
        for (const [time, studentIds] of Object.entries(occ)) {
          studentIds.forEach((sid, idx) => {
            if (idx >= columnsPerTime) return;
            const columnNumber = idx + 1;
            const endTime = addMinutes(time, meta.interval);
            cellPromises.push(
              dbService.insertScheduleCell({
                centerId,
                scheduleId: schedId,
                instructorId: null,
                studentId: sid,
                timeStart: time,
                timeEnd: endTime,
                columnNumber,
              })
            );
          });
        }
      }

      await Promise.all(cellPromises);

      // After DB updates, trigger child re-mounts so they fetch fresh cells
      setRefreshToken((t) => t + 1);

      alert("Weekly import complete!");
      setShowModal(false);
    } catch (err) {
      console.error("Weekly import failed", err);
      alert("Failed to import weekly sessions");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch schedules
        const schedulesData = await dbService.getSchedulesByWeeklyScheduleId(
          weeklyScheduleId
        );
        setSchedules(schedulesData);

        // Fetch weekly schedule to get template ID
        const weeklyScheduleData = await dbService.getScheduleWithDetails(
          weeklyScheduleId,
          1 // TODO: Get actual center ID from context
        );

        // Fetch template configuration for each unique weekday
        const templateConfigData: Record<
          number,
          {
            startTime: string;
            endTime: string;
            numPods: number;
            intervalLength: number;
          }
        > = {};

        const uniqueWeekdayIds = [
          ...new Set(schedulesData.map((s) => s.weekdayId)),
        ];

        for (const weekdayId of uniqueWeekdayIds) {
          const config = await dbService.getTemplateWeekdayByTemplateAndWeekday(
            weeklyScheduleData.templateId,
            weekdayId
          );
          if (config) {
            templateConfigData[weekdayId] = config;
          }
        }

        setTemplateConfig(templateConfigData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load schedule data");
      } finally {
        setIsLoading(false);
      }
    };

    if (weeklyScheduleId) {
      fetchData();
    }
  }, [weeklyScheduleId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading schedules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">No schedules found</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Weekly Schedule {weeklyScheduleId}
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Download size={18} />
          Import Weekly Sessions
        </button>
      </div>

      <div className="space-y-6 w-full">
        {schedules.map((schedule) => {
          const config = templateConfig[schedule.weekdayId];
          const scheduleKey = `${schedule.id}-${refreshToken}`;
          return (
            <Schedule
              key={scheduleKey}
              scheduleId={schedule.id}
              scheduleDate={
                typeof schedule.scheduleDate === "string"
                  ? new Date(schedule.scheduleDate)
                  : schedule.scheduleDate
              }
              weekdayId={schedule.weekdayId}
              numPods={config?.numPods || 0}
              startTime={config?.startTime || ""}
              endTime={config?.endTime || ""}
              intervalLength={config?.intervalLength || 30}
            />
          );
        })}
      </div>

      {showModal && (
        <ImportScheduleSessionsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onImport={handleImportWeekly}
        />
      )}
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WeeklySchedule } from "@/types/main";
import { Schedule } from "./Schedule";
import { useEffect, useState } from "react";
import dbService from "@/lib/db-service";

interface WeeklyScheduleModalProps {
  weeklySchedule: WeeklySchedule;
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleTemplateInfo {
  weekdayId: number;
  startTime: string;
  endTime: string;
  numColumns: number;
}

export function WeeklyScheduleModal({
  weeklySchedule,
  isOpen,
  onClose,
}: WeeklyScheduleModalProps) {
  const [templateInfo, setTemplateInfo] = useState<ScheduleTemplateInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplateInfo = async () => {
      try {
        const info = await dbService.customQuery<ScheduleTemplateInfo>(
          `SELECT weekday_id as weekdayId, start_time as startTime, end_time as endTime, num_columns as numColumns
           FROM weekly_schedule_template_weekday
           WHERE template_id = ?
           ORDER BY weekday_id`,
          [weeklySchedule.templateId]
        );
        setTemplateInfo(info);
      } catch (error) {
        console.error("Error fetching template info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTemplateInfo();
    }
  }, [isOpen, weeklySchedule.templateId]);

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Weekly Schedule</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-7 gap-4 h-full overflow-auto">
          {templateInfo.map((info) => (
            <Schedule
              key={info.weekdayId}
              weeklyScheduleId={weeklySchedule.id}
              weekdayId={info.weekdayId}
              startTime={info.startTime}
              endTime={info.endTime}
              numColumns={info.numColumns}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

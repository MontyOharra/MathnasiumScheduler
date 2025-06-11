// Helper function to add minutes to a time string
const addMinutes = (timeString, minutes) => {
  const [hours, mins] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
};

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
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

// Helper function to create datetime string from date and time
const createDateTime = (dateString, timeString) => {
  return `${dateString}T${timeString}:00.000Z`;
};

// Generate schedule cells for all schedules
const generateScheduleCells = () => {
  const cells = [];
  let cellId = 1;

  // Template configuration (from db-test-data.js)
  const template = {
    id: 2,
    interval_length: 30,
  };

  // Template weekdays configuration
  const templateWeekdays = [
    {
      template_id: 2,
      weekday_id: 2,
      start_time: "15:00",
      end_time: "19:30",
      num_pods: 8,
    },
    {
      template_id: 2,
      weekday_id: 3,
      start_time: "15:00",
      end_time: "19:30",
      num_pods: 8,
    },
    {
      template_id: 2,
      weekday_id: 4,
      start_time: "15:00",
      end_time: "19:30",
      num_pods: 8,
    },
    {
      template_id: 2,
      weekday_id: 5,
      start_time: "15:00",
      end_time: "19:30",
      num_pods: 8,
    },
    {
      template_id: 2,
      weekday_id: 6,
      start_time: "10:00",
      end_time: "14:00",
      num_pods: 4,
    },
  ];

  // Schedules data
  const schedules = [
    {
      id: 1,
      weekly_schedule_id: 1,
      schedule_date: "2025-06-09",
      weekday_id: 2,
    },
    {
      id: 2,
      weekly_schedule_id: 1,
      schedule_date: "2025-06-10",
      weekday_id: 3,
    },
    {
      id: 3,
      weekly_schedule_id: 1,
      schedule_date: "2025-06-11",
      weekday_id: 4,
    },
    {
      id: 4,
      weekly_schedule_id: 1,
      schedule_date: "2025-06-12",
      weekday_id: 5,
    },
    {
      id: 5,
      weekly_schedule_id: 1,
      schedule_date: "2025-06-13",
      weekday_id: 6,
    },
  ];

  // Generate cells for each schedule
  schedules.forEach((schedule) => {
    // Find the template weekday configuration for this schedule
    const templateWeekday = templateWeekdays.find(
      (tw) => tw.weekday_id === schedule.weekday_id
    );

    if (templateWeekday) {
      // Generate time slots
      const timeSlots = generateTimeSlots(
        templateWeekday.start_time,
        templateWeekday.end_time,
        template.interval_length
      );

      // Generate cells for each time slot and column
      timeSlots.forEach((timeSlot) => {
        for (let column = 1; column <= templateWeekday.num_pods; column++) {
          cells.push({
            id: cellId++,
            center_id: 1,
            schedule_id: schedule.id,
            instructor_id: null,
            student_id: null,
            time_start: createDateTime(schedule.schedule_date, timeSlot.start),
            time_end: createDateTime(schedule.schedule_date, timeSlot.end),
            column_number: column,
          });
        }
      });
    }
  });

  return cells;
};

const scheduleCells = generateScheduleCells();

module.exports = {
  scheduleCells,
};

import { SessionType } from "@/types/main";

export const sessionTypes: SessionType[] = [
  {
    id: 1,
    code: "REGULAR",
    length: 60,
    styling: "default",
  },
  {
    id: 2,
    code: "HOMEWORK HELP",
    length: 60,
    styling: "homework-help",
  },
  {
    id: 3,
    code: "INITIAL ASSESSMENT",
    length: 90,
    styling: "initial-assessment",
  },
  {
    id: 4,
    code: "CHECKUP",
    length: 60,
    styling: "checkup",
  },
  {
    id: 5,
    code: "ONE-ON-ONE",
    length: 90,
    styling: "one-on-one",
  },
];

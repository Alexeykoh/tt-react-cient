import { ReactNode } from "react";

export interface GanttTask {
  id: string;
  label: ReactNode;
  start: string; // ISO string
  end: string;   // ISO string
}

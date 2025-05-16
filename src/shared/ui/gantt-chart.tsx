import React from "react";
import { GanttTask } from "../types/gantt.types";

interface GanttChartProps {
  tasks: GanttTask[];
  height?: number;
  className?: string;
}

function getMinMaxDates(tasks: GanttTask[]): { min: number; max: number } {
  const starts = tasks.map((t) => new Date(t.start).getTime());
  const ends = tasks.map((t) => new Date(t.end).getTime());
  const min = Math.min(...starts);
  const max = Math.max(...ends);
  return { min, max };
}

export function GanttChart({ tasks, height = 40, className }: GanttChartProps) {
  if (!tasks.length) return <div>Нет данных для диаграммы Ганта</div>;

  const { min, max } = getMinMaxDates(tasks);
  const total = max - min || 1;

  return (
    <div
      className={className}
      style={{ width: "100%", overflowX: "auto", padding: 8 }}
    >
      <div style={{ position: "relative", height: tasks.length * (height + 8) }}>
        {tasks.map((task, idx) => {
          const start = new Date(task.start).getTime();
          const end = new Date(task.end).getTime();
          const left = ((start - min) / total) * 100;
          const width = ((end - start) / total) * 100;

          return (
            <div
              key={task.id}
              style={{
                position: "absolute",
                top: idx * (height + 8),
                left: `${left}%`,
                width: `${width}%`,
                height,
                background: "var(--color-primary, #3b82f6)",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                color: "#fff",
                paddingLeft: 8,
                fontSize: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                minWidth: 40,
              }}
              title={`${task.label}: ${task.start} — ${task.end}`}
            >
              {task.label}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 8, color: "#888" }}>
        <span>{new Date(min).toLocaleDateString()}</span>
        <span>{new Date(max).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default GanttChart;

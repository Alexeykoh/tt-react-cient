export enum TimerStatus {
  IDLE = "IDLE",
  PROGRESS = "PROGRESS",
  PAUSED = "PAUSED",
}

export interface TimerState {
  // Словарь таймеров по task_id
  timers: {
    [task_id: string]: {
      status: TimerStatus;
      startTime: number | null; // timestamp начала отсчёта
      accumulated: number; // накопленное время в ms
    };
  };
  // Глобальный тик (timestamp последнего обновления)
  tick: number;
}

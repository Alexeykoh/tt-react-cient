import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimerState, TimerStatus } from "./types";

const initialState: TimerState = {
  timers: {},
  tick: Date.now(),
};

interface StartPayload {
  task_id: string;
  startTime?: number; // можно передать серверное время старта
  accumulated?: number; // можно передать накопленное время
}

interface StopPayload {
  task_id: string;
  accumulated?: number;
}

interface PausePayload {
  task_id: string;
  accumulated: number;
}

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    startTimer(state, action: PayloadAction<StartPayload>) {
      const { task_id, startTime, accumulated } = action.payload;
      state.timers[task_id] = {
        status: TimerStatus.PROGRESS,
        startTime: startTime ?? Date.now(),
        accumulated: accumulated ?? 0,
      };
    },
    stopTimer(state, action: PayloadAction<StopPayload>) {
      const { task_id, accumulated } = action.payload;
      if (state.timers[task_id]) {
        state.timers[task_id].status = TimerStatus.IDLE;
        state.timers[task_id].startTime = null;
        state.timers[task_id].accumulated = accumulated ?? 0;
      }
    },
    pauseTimer(state, action: PayloadAction<PausePayload>) {
      const { task_id, accumulated } = action.payload;
      if (state.timers[task_id]) {
        state.timers[task_id].status = TimerStatus.PAUSED;
        state.timers[task_id].startTime = null;
        state.timers[task_id].accumulated = accumulated;
      }
    },
    tick(state) {
      state.tick = Date.now();
    },
    setAccumulated(
      state,
      action: PayloadAction<{ task_id: string; accumulated: number }>
    ) {
      const { task_id, accumulated } = action.payload;
      if (state.timers[task_id]) {
        state.timers[task_id].accumulated = accumulated;
      }
    },
    setStatus(
      state,
      action: PayloadAction<{ task_id: string; status: TimerStatus }>
    ) {
      const { task_id, status } = action.payload;
      if (state.timers[task_id]) {
        state.timers[task_id].status = status;
      }
    },
  },
});

export const {
  startTimer,
  stopTimer,
  pauseTimer,
  tick,
  setAccumulated,
  setStatus,
} = timeSlice.actions;

export default timeSlice.reducer;

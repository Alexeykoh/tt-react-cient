import { Middleware } from "@reduxjs/toolkit";
import { tick } from "./time.slice";

// Интервал обновления таймера (100 мс для плавности)
const TICK_INTERVAL = 100;

let intervalId: NodeJS.Timeout | null = null;

export const timeTickerMiddleware: Middleware = (store) => (next) => (action) => {
  // Запускаем тикер только один раз при инициализации приложения
  if (!intervalId) {
    intervalId = setInterval(() => {
      store.dispatch(tick());
    }, TICK_INTERVAL);
  }
  return next(action);
};

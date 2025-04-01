import { formatMilliseconds } from "@/lib/format-seconds";
import { useState, useEffect, useRef } from "react";

interface Props {
  time: string | number;
  isActive: boolean;
}

function TimerComponent({ time, isActive }: Props) {
  const [milliseconds, setMilliseconds] = useState<number>(Number(time));
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(Number(time));

  // Синхронизация с внешним значением time
  useEffect(() => {
    accumulatedTimeRef.current = Number(time);
    if (!isActive) {
      setMilliseconds(Number(time));
    }
  }, [time]);

  // Управление таймером
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current;

      timerIdRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setMilliseconds(elapsed);
      }, 100); // Обновляем каждые 100мс для плавности
    } else {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      accumulatedTimeRef.current = milliseconds;
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [isActive]);

  return (
    <div>
      <p className="text-xl">{formatMilliseconds(milliseconds)}</p>
    </div>
  );
}

export default TimerComponent;

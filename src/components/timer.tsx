import { formatMilliseconds } from "@/lib/format-seconds";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { TimerStatus } from "@/features/time/model/types";

interface Props {
  task_id: string;
  fallbackTime?: number;
  fallbackStatus?: string;
}

function TimerComponent({ task_id, fallbackTime = 0 }: Props) {
  // Получаем данные таймера и глобальный тик из redux
  const { accumulated, startTime, status } = useSelector(
    (state: RootState) =>
      state.time.timers[task_id] || {
        accumulated: 0,
        startTime: null,
        status: TimerStatus.IDLE,
      }
  );
  // Подписка на глобальный тик для форс-обновления компонента
  useSelector((state: RootState) => state.time.tick);

  // Вычисляем текущее время
  let milliseconds = accumulated;

  if (status === TimerStatus.PROGRESS && startTime) {
    milliseconds = accumulated + (Date.now() - startTime);
  } else if (
    status === TimerStatus.IDLE &&
    accumulated === 0 &&
    fallbackTime > 0
  ) {
    milliseconds = fallbackTime;
  }

  const timerData = formatMilliseconds(milliseconds);

  return (
    <div>
      <p className="text-xl">
        {`${timerData.hours}:${timerData.minutes}:${timerData.seconds}`}
      </p>
    </div>
  );
}

export default TimerComponent;

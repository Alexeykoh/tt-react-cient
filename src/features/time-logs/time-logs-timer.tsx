import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Play, Pause } from "lucide-react";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TimerStatus } from "../time/model/types";
import { formatMilliseconds } from "@/lib/format-seconds";
import { useGetUserQuery } from "@/shared/api/user.service";
import {
  useGetTimeLogLatestTaskQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation,
} from "@/shared/api/time-log.service";
import { TIMELOGSTATUS } from "@/shared/enums/time-logs.enum";
import { startTimer, stopTimer } from "../time/model/time.slice";
import { TimeLog } from "@/shared/interfaces/time-log.interface";

// Определяем тип значения контекста
interface ITimeLogsTimerContext {
  task_id: string;
  isPlay: boolean;
  isActive: boolean;
  isReverse: boolean;
  isLoading: boolean;
  showTime?: boolean;
  latestLog: TimeLog | undefined | null;
  variant: "button" | "icon";
  logToggleHandler: () => void;
}

// Создаём контекст с типом, по умолчанию null
const TimeLogsTimerContext = createContext<ITimeLogsTimerContext | null>(null);

interface ITimeLogsTimerProviderProps {
  task_id: string;
  children: ReactNode;
  isReverse: boolean;
  variant: "button" | "icon";
  showTime?: boolean;
}

function TimeLogsTimerRoot({
  children,
  ...props
}: ITimeLogsTimerProviderProps) {
  const { data: userMe } = useGetUserQuery();
  const { data: latestLog, isLoading: logIsLoading } =
    useGetTimeLogLatestTaskQuery(
      { task_id: props.task_id },
      { skip: !props.task_id }
    );

  const [start, { isLoading: startIsLoading }] = usePostTimeLogStartMutation();
  const [stop, { isLoading: stopIsLoading }] = usePostTimeLogStopMutation();

  function startHandler(task_id: string) {
    start({
      task_id: task_id,
    });
  }

  function stopHandler(task_id: string, client_time: string) {
    stop({ task_id: task_id, client_time: client_time });
  }

  function logToggleHandler() {
    const client_time = new Date().toISOString();
    if (latestLog && latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      stopHandler(props.task_id, client_time);
    } else {
      startHandler(props.task_id);
    }
  }

  const isActive =
    userMe?.user_id !== latestLog?.user_id &&
    latestLog?.status === TIMELOGSTATUS.PROGRESS;

  // TODO: заполнить реальные значения
  const contextProps: ITimeLogsTimerContext = {
    task_id: props.task_id,
    isReverse: props.isReverse,
    variant: props.variant,
    showTime: props.showTime,
    latestLog: latestLog,
    isActive: isActive,
    isPlay: false,
    isLoading: logIsLoading || startIsLoading || stopIsLoading,
    logToggleHandler: logToggleHandler,
  };

  return (
    <TimeLogsTimerContext.Provider value={contextProps}>
      <div
        className={`flex gap-4 items-center ${props.isReverse && "flex-row-reverse"}`}
      >
        <TimerFeature />
        {children}
      </div>
    </TimeLogsTimerContext.Provider>
  );
}

function TimeUI({ fallbackTime = 0 }: { fallbackTime?: number }) {
  const context = useContext(TimeLogsTimerContext);

  // Получаем данные таймера и глобальный тик из redux
  const { accumulated, startTime, status } = useSelector(
    (state: RootState) =>
      state.time.timers[context?.task_id as string] || {
        accumulated: 0,
        startTime: null,
        status: TimerStatus.IDLE,
      }
  );
  // Подписка на глобальный тик для форс-обновления компонента
  useSelector((state: RootState) => state.time.tick);

  // Вычисляем текущее время
  let milliseconds: number = accumulated;

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

function TimerFeature() {
  const context = useContext(TimeLogsTimerContext);
  const dispatch = useDispatch();

  const task_id = context?.task_id || "";

  // Синхронизация состояния таймера в redux при изменении latestLog
  useEffect(() => {
    if (!context?.latestLog) {
      return;
    }
    if (context?.latestLog.status === TIMELOGSTATUS.PROGRESS) {
      dispatch(
        startTimer({
          task_id,
          startTime: context?.latestLog.start_time
            ? new Date(context?.latestLog.start_time).getTime()
            : Date.now(),
          accumulated: Number(context?.latestLog.common_duration),
        })
      );
    } else {
      dispatch(
        stopTimer({
          task_id,
          accumulated: Number(context?.latestLog.common_duration),
        })
      );
    }
  }, [dispatch, task_id, context?.latestLog]);

  return (
    <>
      <ButtonUI isActive={false} />
      {context?.showTime && <TimeUI />}
    </>
  );
}

function ButtonUI(props: { isActive: boolean }) {
  const context = useContext(TimeLogsTimerContext);

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className={`${!context?.isPlay ? "text-emerald-400" : "text-orange-400"} ${context?.variant === "icon" && "size-6"} active:scale-90 duration-150 ${props.isActive ? "pointer-events-none grayscale-100" : ""}`}
      onClick={() => {
        if (!context?.isLoading) {
          context?.logToggleHandler();
        }
      }}
    >
      {context?.isLoading ? (
        <LoaderCircle
          className={`animate-spin ${context?.variant === "icon" && "size-3"}`}
        />
      ) : !context?.isPlay ? (
        <Play className={`${context?.variant === "icon" && "size-3"}`} />
      ) : (
        <Pause
          className={`animate-pulse ${context?.variant === "icon" && "size-3"}`}
        />
      )}
    </Button>
  );
}

const TimeLogsTimer = {
  Root: TimeLogsTimerRoot,
};

export default TimeLogsTimer;

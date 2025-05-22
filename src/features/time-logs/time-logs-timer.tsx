import { RootState } from "@/app/store";
import "@/shared/types/window.types";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TIMELOGSTATUS } from "@/shared/enums/time-logs.enum";
import {
  startTimer,
  stopTimer,
} from "../time/model/time.slice";
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
  children?: ReactNode;
  isReverse?: boolean;
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

  const isActive =
    userMe?.user_id !== latestLog?.user_id &&
    latestLog?.status === TIMELOGSTATUS.PROGRESS;

  function startHandler(task_id: string) {
    start({
      task_id: task_id,
    });
  }

  function stopHandler(task_id: string, client_time: string) {
    stop({ task_id: task_id, client_time: client_time });
  }

  function logToggleHandler() {
    if (isActive) {
      return;
    }

    const client_time = new Date().toISOString();
    if (latestLog && latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      stopHandler(props.task_id, client_time);
    } else {
      startHandler(props.task_id);
    }
  }

  // TODO: заполнить реальные значения
  const contextProps: ITimeLogsTimerContext = {
    task_id: props.task_id,
    isReverse: props?.isReverse || false,
    variant: props.variant,
    showTime: props.showTime,
    latestLog: latestLog,
    isActive: isActive,
    isPlay: latestLog?.status === TIMELOGSTATUS.PROGRESS,
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

const DEFAULT_TIMER = {
  accumulated: 0,
  startTime: null,
  status: TimerStatus.IDLE,
};

function TimeUI({ fallbackTime = 0 }: { fallbackTime?: number }) {
  const context = useContext(TimeLogsTimerContext);

  // Получаем данные таймера и глобальный тик из redux
  const { accumulated, startTime, status } = useSelector(
    (state: RootState) =>
      state.time.timers[context?.task_id as string] || DEFAULT_TIMER
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

  // Получаем данные таймера из redux
  const { accumulated, startTime, status } = useSelector(
    (state: RootState) =>
      state.time.timers[task_id] || { accumulated: 0, startTime: null, status: TimerStatus.IDLE }
  );
  // Подписка на глобальный тик для обновления title
  useSelector((state: RootState) => state.time.tick);

  // Смена favicon при активном таймере
  useEffect(() => {
    const faviconEl = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!faviconEl) return;

    // Сохраняем стандартный favicon при первом рендере
    if (!window.__defaultFavicon) {
      window.__defaultFavicon = faviconEl.href;
    }
    const defaultFavicon = window.__defaultFavicon;

    if (context?.latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      faviconEl.href = "/icon-active.svg";
    } else {
      faviconEl.href = defaultFavicon;
    }
  }, [context?.latestLog?.status]);

  // Обновление document.title с текущим временем задачи (реальное обновление каждую секунду)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    function updateTitle() {
      let milliseconds: number = accumulated;
      if (status === TimerStatus.PROGRESS && startTime) {
        milliseconds = accumulated + (Date.now() - startTime);
      }
      const timerData = formatMilliseconds(milliseconds);
      if (context?.latestLog?.status === TIMELOGSTATUS.PROGRESS) {
        document.title = `${timerData.hours}:${timerData.minutes}:${timerData.seconds} — Таймер задачи`;
      } else {
        document.title = "TimeTracker";
      }
    }

    if (context?.latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      updateTitle();
      intervalId = setInterval(updateTitle, 1000);
    } else {
      document.title = "TimeTracker";
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.title = "TimeTracker";
    };
  }, [accumulated, startTime, status, context?.latestLog?.status]);

  // Синхронизация состояния таймера в redux при изменении latestLog
  useEffect(() => {
    if (!context?.latestLog) {
      // Если latestLog не задан, то отключаем таймер
      return;
    }
    if (context?.latestLog.status === TIMELOGSTATUS.PROGRESS) {
      // Если latestLog есть и статус его задан как выполняется, то запускаем таймер
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
      // Если latestLog есть и статус его задан как не выполняется, то останавливаем таймер
      dispatch(
        stopTimer({
          task_id,
          accumulated: Number(context?.latestLog.common_duration),
        })
      );
    }
  }, [dispatch, task_id, context?.latestLog]);

  // Передаём common_duration с сервера как fallbackTime
  const fallbackTime = Number(context?.latestLog?.common_duration) || 0;

  return (
    <>
      <ButtonUI isActive={false} />
      {context?.showTime && <TimeUI fallbackTime={fallbackTime} />}
    </>
  );
}

function ButtonUI(props: { isActive: boolean }) {
  const context = useContext(TimeLogsTimerContext);

  return (
    <div className={`relative`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
                <Play
                  className={`${context?.variant === "icon" && "size-3"}`}
                />
              ) : (
                <Pause
                  className={`animate-pulse ${context?.variant === "icon" && "size-3"}`}
                />
              )}
            </Button>
          </TooltipTrigger>
          {context?.isActive && (
            <TooltipContent>
              <p>Эта задача уже выполняется другим пользователем</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {context?.isActive && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-rose-400 size-2.5 rounded-full"></div>
      )}
    </div>
  );
}

const TimeLogsTimer = {
  Root: TimeLogsTimerRoot,
};

export default TimeLogsTimer;

import PlayPauseButton from "./play-pause-button";
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
import TimerComponent from "./timer";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { startTimer, stopTimer } from "@/features/time/model/time.slice";
import { TIMELOGSTATUS } from "@/shared/enums/time-logs.enum";
import { useGetUserQuery } from "@/shared/api/user.service";

interface Props {
  task_id: string;
  showTime?: boolean;
  isReverse?: boolean;
  variant?: "button" | "icon";
}

export default function TaskItem({
  task_id,
  showTime = true,
  isReverse = false,
  variant = "button",
}: Props) {
  const dispatch = useDispatch();
  const { data: userMe } = useGetUserQuery();
  const { data: latestLog, isLoading: logIsLoading } =
    useGetTimeLogLatestTaskQuery({ task_id }, { skip: !task_id });

  const [start, { isLoading: startIsLoading }] = usePostTimeLogStartMutation();
  const [stop, { isLoading: stopIsLoading }] = usePostTimeLogStopMutation();

  const isActive =
    userMe?.user_id !== latestLog?.user_id &&
    latestLog?.status === TIMELOGSTATUS.PROGRESS;

  // Синхронизация состояния таймера в redux при изменении latestLog
  useEffect(() => {
    if (!latestLog) return;
    if (latestLog.status === TIMELOGSTATUS.PROGRESS) {
      dispatch(
        startTimer({
          task_id,
          startTime: latestLog.start_time
            ? new Date(latestLog.start_time).getTime()
            : Date.now(),
          accumulated: Number(latestLog.common_duration),
        })
      );
    } else {
      dispatch(
        stopTimer({
          task_id,
          accumulated: Number(latestLog.common_duration),
        })
      );
    }
  }, [latestLog, dispatch, task_id]);

  function logToggleHandler() {
    if (isActive) {
      return;
    }

    const client_time = new Date().toISOString();
    if (latestLog && latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      stop({ task_id, client_time: client_time });
    } else {
      start({ task_id });
    }
  }

  return (
    <div
      className={`flex gap-4 items-center ${isReverse && "flex-row-reverse"}`}
    >
      <div className={`relative  ${isActive && ""}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PlayPauseButton
                onClick={logToggleHandler}
                isPlay={latestLog?.status === TIMELOGSTATUS.PROGRESS}
                isLoading={logIsLoading || startIsLoading || stopIsLoading}
                variant={variant}
                className={isActive ? "pointer-events-none grayscale-100" : ""}
              />
            </TooltipTrigger>
            {isActive && (
              <TooltipContent>
                <p>Эта задача уже выполняется другим пользователем</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {isActive && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-rose-400 size-2.5 rounded-full"></div>
        )}
      </div>
      {logIsLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : showTime && latestLog ? (
        <TimerComponent
          task_id={task_id}
          fallbackTime={Number(latestLog.common_duration) || 0}
          fallbackStatus={latestLog.status}
        />
      ) : null}
    </div>
  );
}

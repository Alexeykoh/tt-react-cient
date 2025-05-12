import PlayPauseButton from "./play-pause-button";
import {
  useGetTimeLogLatestTaskQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation,
} from "@/shared/api/time-log.service";
import TimerComponent from "./timer";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { startTimer, stopTimer } from "@/features/time/model/time.slice";
import { TIMELOGSTATUS } from "@/shared/enums/time-logs.enum";

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
  const { data: latestLog, isLoading: logIsLoading } =
    useGetTimeLogLatestTaskQuery(
      { task_id },
      { skip: !task_id, refetchOnMountOrArgChange: true }
    );
  const [start, { isLoading: startIsLoading }] = usePostTimeLogStartMutation();
  const [stop, { isLoading: stopIsLoading }] = usePostTimeLogStopMutation();

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
          accumulated: Number(latestLog.common_duration) || 0,
        })
      );
    } else {
      dispatch(
        stopTimer({
          task_id,
          accumulated: Number(latestLog.common_duration) || 0,
        })
      );
    }
  }, [latestLog, dispatch, task_id]);

  function logToggleHandler() {
    if (latestLog && latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      stop({ task_id });
      dispatch(
        stopTimer({
          task_id,
          accumulated: Number(latestLog?.common_duration) || 0,
        })
      );
    } else {
      start({ task_id });
      dispatch(
        startTimer({
          task_id,
          startTime: Date.now(),
          accumulated: Number(latestLog?.common_duration) || 0,
        })
      );
    }
  }

  return (
    <div
      className={`flex gap-4 items-center ${isReverse && "flex-row-reverse"}`}
    >
      <PlayPauseButton
        onClick={logToggleHandler}
        isPlay={latestLog?.status === TIMELOGSTATUS.PROGRESS}
        isLoading={logIsLoading || startIsLoading || stopIsLoading}
        variant={variant}
      />
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

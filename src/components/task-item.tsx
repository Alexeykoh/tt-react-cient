import PlayPauseButton from "./play-pause-button";
import {
  useGetTimeLogLatestTaskQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation,
} from "@/shared/api/time-log.service";
import { TIMELOGSTATUS } from "@/shared/interfaces/time-log.interface";
import TimerComponent from "./timer";
import { LoaderCircle } from "lucide-react";

interface Props {
  task_id: string;
  showTime?: boolean;
}

export default function TaskItem({ task_id, showTime = true }: Props) {
  const { data: latestLog, isLoading: logIsLoading } =
    useGetTimeLogLatestTaskQuery(
      { task_id },
      { refetchOnMountOrArgChange: true }
    );
  const [start, { isLoading: startIsLoading }] = usePostTimeLogStartMutation();
  const [stop, { isLoading: stopIsLoading }] = usePostTimeLogStopMutation();

  function logToggleHandler() {
    if (latestLog && latestLog?.status === TIMELOGSTATUS.PROGRESS) {
      stop({ task_id });
    } else {
      start({ task_id });
    }
  }

  return (
    <div className="flex gap-4 items-center">
      <PlayPauseButton
        onClick={logToggleHandler}
        isPlay={latestLog?.status === TIMELOGSTATUS.PROGRESS}
        isLoading={logIsLoading || startIsLoading || stopIsLoading}
      />
      {logIsLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : showTime ? (
        <TimerComponent
          time={latestLog?.common_duration || ""}
          isActive={latestLog?.status === TIMELOGSTATUS.PROGRESS}
        />
      ) : null}
    </div>
  );
}

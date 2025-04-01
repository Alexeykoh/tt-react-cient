import PlayPauseButton from "./play-pause-button";
import {
  useGetTimeLogLatestTaskQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation,
} from "@/shared/api/time-log.service";
import { TIMELOGSTATUS } from "@/shared/interfaces/user.unterface";

interface Props {
  task_id: string;
}

export default function TaskItem({ task_id }: Props) {
  const { data: latestLog, isLoading: logIsLoading } =
    useGetTimeLogLatestTaskQuery({ task_id });
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
    <div>
      <PlayPauseButton
        onClick={logToggleHandler}
        isPlay={latestLog?.status === TIMELOGSTATUS.PROGRESS}
        isLoading={logIsLoading || startIsLoading || stopIsLoading}
      />
    </div>
  );
}
